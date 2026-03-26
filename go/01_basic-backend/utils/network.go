package utils

import (
	"fmt"
	"log"
	"net"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// GetAvailableListener loads env and finds an open TCP port.
// It returns the listener and the actual port number used.
func GetAvailableListener() (net.Listener, int) {
	// 1. Load Environment
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// 2. Parse Port
	portStr := os.Getenv("PORT")
	startPort, err := strconv.Atoi(portStr)
	if err != nil || startPort <= 0 {
		startPort = 8080
	}

	// 3. Find Open Port
	for port := startPort; port < startPort+100; port++ {
		address := fmt.Sprintf(":%d", port)
		listener, err := net.Listen("tcp", address)
		if err == nil {
			return listener, port
		}
	}

	log.Fatalf("Could not find an open port in range %d-%d", startPort, startPort+100)
	return nil, 0
}
