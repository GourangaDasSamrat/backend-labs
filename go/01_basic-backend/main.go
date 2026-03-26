package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"strconv"

	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/routes"
)

func main() {
	r := routes.Router()

	port := 8080
	var listener net.Listener
	var err error

	// Loop until we find an available port
	for {
		address := ":" + strconv.Itoa(port)
		listener, err = net.Listen("tcp", address)
		if err == nil {
			break // Successfully bound to the port
		}
		port++

		// Safety check: stop after 100 tries so you don't loop forever
		if port > 8180 {
			log.Fatal("Could not find an open port in range 8080-8180")
		}
	}

	fmt.Printf("Server is starting on http://localhost:%d\n", port)

	// Use Serve
	log.Fatal(http.Serve(listener, r))
}
