package routes

import (
	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/controllers"
)

func Router() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)

	// Base Routes
	r.HandleFunc("/", controllers.HandleServeHome).Methods("GET")

	api := r.PathPrefix("/api/v1").Subrouter()

	// Call registration functions for different resources
	RegisterCourseRoutes(api)
	RegisterAuthorRoutes(api)

	return r
}
