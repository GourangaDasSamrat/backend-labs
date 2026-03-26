package controllers

import (
	"net/http"

	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/models"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/utils"
)

var Courses []models.Course

func HandleServeHome(w http.ResponseWriter, r *http.Request) {
	utils.WriteResponse(w, []byte("<h1>This is the API of our course.</h1>"))
}

func HandleGetAllCourses(w http.ResponseWriter, r *http.Request) {
	// Ensure we return an empty slice [] instead of null if DB is empty
	if Courses == nil {
		Courses = []models.Course{}
	}
	utils.JSONResponse(w, Courses, http.StatusOK)
}
