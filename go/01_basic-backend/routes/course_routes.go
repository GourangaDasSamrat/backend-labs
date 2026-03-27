package routes

import (
	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/controllers"
)

func RegisterCourseRoutes(r *mux.Router) {
	//  Plural nouns for collections
	courseRouter := r.PathPrefix("/courses").Subrouter()

	// GET /api/v1/courses
	courseRouter.HandleFunc("", controllers.HandleGetAllCourses).Methods("GET")

	// GET /api/v1/courses/
	courseRouter.HandleFunc("/", controllers.HandleGetAllCourses).Methods("GET")

	// GET /api/v1/courses/{id}
	courseRouter.HandleFunc("/{id}", controllers.HandleGetCourse).Methods("GET")
}
