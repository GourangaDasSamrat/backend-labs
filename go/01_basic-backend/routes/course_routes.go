package routes

import (
	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/controllers"
)

// RegisterCourseRoutes defines all the endpoints related to the Course resource.
func RegisterCourseRoutes(r *mux.Router) {
	// 1. Create a subrouter for courses to group related endpoints
	courseRouter := r.PathPrefix("/courses").Subrouter()

	// 2. Define GET route to fetch all courses
	// Matches: GET /courses or /courses/
	courseRouter.HandleFunc("", controllers.HandleGetAllCourses).Methods("GET")
	courseRouter.HandleFunc("/", controllers.HandleGetAllCourses).Methods("GET")

	// 3. Define GET route to fetch a single course by ID
	// Matches: GET /courses/{id}
	courseRouter.HandleFunc("/{id}", controllers.HandleGetCourse).Methods("GET")

	// 4. Define POST route to create a new course
	// Matches: POST /courses
	courseRouter.HandleFunc("", controllers.HandleCreateCourse).Methods("POST")
}
