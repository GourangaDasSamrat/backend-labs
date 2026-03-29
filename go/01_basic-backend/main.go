package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/routes"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/utils"
)

func main() {
	//  Initialize MongoDB Connection
	utils.ConnectDB()

	// Initialize Router
	r := routes.Router()

	// Get our listener and the final port via the utility
	listener, port := utils.GetAvailableListener()

	fmt.Printf("Server is starting on http://localhost:%d\n", port)

	// Start Server
	if err := http.Serve(listener, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
