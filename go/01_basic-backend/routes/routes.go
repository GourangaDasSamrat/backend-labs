package routes

import (
	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/controllers"
)

func Router() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/", controllers.HandleServeHome).Methods("GET")
	r.HandleFunc("/courses", controllers.HandleGetAllCourses).Methods("GET")

	return r
}
