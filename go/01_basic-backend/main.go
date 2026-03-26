package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/routes"
)

func main() {
    // Get the router from the routes package
    r := routes.Router()

    fmt.Println("Server is starting on port 8080...")

    // ListenAndServe returns an error, so we check it
    log.Fatal(http.ListenAndServe(":8080", r))
}