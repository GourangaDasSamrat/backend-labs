package controllers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/models"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/utils"
)

// Initialize with an empty slice to avoid 'null' in JSON responses.
var Courses = []models.Course{}

func HandleServeHome(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTML(w, "<h1>This is the API of our course.</h1>")
}

func HandleGetAllCourses(w http.ResponseWriter, r *http.Request) {
	// No need for a nil check if initialized as an empty slice above.
	utils.JSONResponse(w, http.StatusOK, Courses)
}

func HandleGetCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Course ID is required")
		return
	}

	for _, course := range Courses {
		if course.CourseId == id {
			utils.JSONResponse(w, http.StatusOK, course)
			return
		}
	}

	// Return a structured JSON error instead of an empty body.
	utils.JSONError(w, http.StatusNotFound, "Course not found with given ID")
}
