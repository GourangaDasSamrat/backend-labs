package routes

import (
	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/02_basic-db-operations/controllers"
)

func Router() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)

	// Base Routes
	r.HandleFunc("/", controllers.HandleServeHome).Methods("GET")

	api := r.PathPrefix("/api/v1").Subrouter()

	// Call registration functions for different resources

	return r
}
