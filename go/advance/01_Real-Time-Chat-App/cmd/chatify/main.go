package main

import (
	"bufio"
	"crypto/sha1"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"sync"
)

// ---------------------------------------------------------------------------
// Minimal RFC 6455 WebSocket — stdlib only, no external deps
// ---------------------------------------------------------------------------

const wsGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

// accept computes the Sec-WebSocket-Accept header value.
func accept(key string) string {
	h := sha1.New()
	h.Write([]byte(key + wsGUID))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

// upgrade performs the HTTP→WebSocket handshake and returns the raw conn.
func upgrade(w http.ResponseWriter, r *http.Request) (net.Conn, *bufio.ReadWriter, error) {
	if r.Header.Get("Upgrade") != "websocket" {
		return nil, nil, errors.New("not a websocket request")
	}
	key := r.Header.Get("Sec-Websocket-Key")
	if key == "" {
		return nil, nil, errors.New("missing Sec-WebSocket-Key")
	}
	hj, ok := w.(http.Hijacker)
	if !ok {
		return nil, nil, errors.New("hijacking not supported")
	}
	conn, rw, err := hj.Hijack()
	if err != nil {
		return nil, nil, err
	}
	// Send 101 Switching Protocols
	_, err = io.WriteString(rw, "HTTP/1.1 101 Switching Protocols\r\n"+
		"Upgrade: websocket\r\n"+
		"Connection: Upgrade\r\n"+
		"Sec-WebSocket-Accept: "+accept(key)+"\r\n\r\n")
	if err != nil {
		conn.Close()
		return nil, nil, err
	}
	rw.Flush()
	return conn, rw, nil
}

// readFrame reads one WebSocket frame and returns the unmasked payload.
// Only text/binary/close opcodes are handled; ping/pong are ignored.
func readFrame(r io.Reader) ([]byte, byte, error) {
	header := make([]byte, 2)
	if _, err := io.ReadFull(r, header); err != nil {
		return nil, 0, err
	}
	opcode := header[0] & 0x0f
	masked := header[1]&0x80 != 0
	payloadLen := int64(header[1] & 0x7f)

	switch payloadLen {
	case 126:
		var ext [2]byte
		if _, err := io.ReadFull(r, ext[:]); err != nil {
			return nil, 0, err
		}
		payloadLen = int64(binary.BigEndian.Uint16(ext[:]))
	case 127:
		var ext [8]byte
		if _, err := io.ReadFull(r, ext[:]); err != nil {
			return nil, 0, err
		}
		payloadLen = int64(binary.BigEndian.Uint64(ext[:]))
	}

	var maskKey [4]byte
	if masked {
		if _, err := io.ReadFull(r, maskKey[:]); err != nil {
			return nil, 0, err
		}
	}

	payload := make([]byte, payloadLen)
	if _, err := io.ReadFull(r, payload); err != nil {
		return nil, 0, err
	}
	if masked {
		for i := range payload {
			payload[i] ^= maskKey[i%4]
		}
	}
	return payload, opcode, nil
}

// writeFrame sends an unmasked text frame to the client.
func writeFrame(w io.Writer, payload []byte) error {
	length := len(payload)
	var header []byte
	switch {
	case length <= 125:
		header = []byte{0x81, byte(length)}
	case length <= 65535:
		header = []byte{0x81, 126, byte(length >> 8), byte(length)}
	default:
		header = []byte{0x81, 127,
			0, 0, 0, 0,
			byte(length >> 24), byte(length >> 16), byte(length >> 8), byte(length)}
	}
	if _, err := w.Write(header); err != nil {
		return err
	}
	_, err := w.Write(payload)
	return err
}

// ---------------------------------------------------------------------------
// Hub — tracks connected clients and broadcasts messages
// ---------------------------------------------------------------------------

type client struct {
	conn net.Conn
	rw   *bufio.ReadWriter
	mu   sync.Mutex
}

func (c *client) send(msg []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	_ = writeFrame(c.rw, msg)
	_ = c.rw.Flush()
}

type hub struct {
	mu      sync.Mutex
	clients map[*client]struct{}
}

func newHub() *hub {
	return &hub{clients: make(map[*client]struct{})}
}

func (h *hub) add(c *client) {
	h.mu.Lock()
	h.clients[c] = struct{}{}
	h.mu.Unlock()
}

func (h *hub) remove(c *client) {
	h.mu.Lock()
	delete(h.clients, c)
	h.mu.Unlock()
}

func (h *hub) broadcast(sender *client, msg []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for c := range h.clients {
		if c != sender {
			c.send(msg)
		}
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	h := newHub()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, rw, err := upgrade(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		c := &client{conn: conn, rw: rw}
		h.add(c)
		defer func() {
			h.remove(c)
			conn.Close()
		}()

		for {
			payload, opcode, err := readFrame(rw)
			if err != nil || opcode == 8 { // 8 = close
				return
			}
			if opcode == 1 || opcode == 2 { // text or binary
				h.broadcast(c, payload)
			}
		}
	})

	http.Handle("/", http.FileServer(http.Dir("public")))

	log.Printf("Server running on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
