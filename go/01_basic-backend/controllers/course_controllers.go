package controllers

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/models"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/utils"
)

// Courses is the in-memory database.
// Initialized with an empty slice to ensure JSON returns [] instead of null.
var Courses = []models.Course{}

// HandleServeHome handles the root route and returns a simple HTML welcome message.
func HandleServeHome(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTML(w, "<h1>This is the API of our course.</h1>")
}

// HandleGetAllCourses returns the entire list of courses currently in memory.
func HandleGetAllCourses(w http.ResponseWriter, r *http.Request) {
	utils.JSONResponse(w, http.StatusOK, Courses)
}

// HandleGetCourse fetches a single course by its unique ID from the URL parameters.
func HandleGetCourse(w http.ResponseWriter, r *http.Request) {
	// 1. Grab parameters from the request URL
	params := mux.Vars(r)
	id := params["id"]

	// 2. Validate that an ID was actually provided
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Course ID is required")
		return
	}

	// 3. Loop through the slice to find the matching ID
	for _, course := range Courses {
		if course.CourseId == id {
			utils.JSONResponse(w, http.StatusOK, course)
			return
		}
	}

	// 4. If the loop finishes without returning, the course doesn't exist
	utils.JSONError(w, http.StatusNotFound, "Course not found with given ID")
}

// HandleCreateCourse decodes the request body, assigns a random ID, and saves the new course.
func HandleCreateCourse(w http.ResponseWriter, r *http.Request) {
	// 1. Verify the request body is not nil
	if r.Body == nil {
		utils.JSONError(w, http.StatusBadRequest, "Please send some data")
		return
	}

	// 2. Decode the JSON body into the Course struct
	var course models.Course
	err := json.NewDecoder(r.Body).Decode(&course)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON format")
		return
	}

	// 3. Validate the data using the model's custom validation method
	if course.IsEmpty() {
		utils.JSONError(w, http.StatusBadRequest, "Course name is required")
		return
	}

	// 4. Seed the random generator and create a unique ID
	rand.Seed(time.Now().UnixNano())
	course.CourseId = strconv.Itoa(rand.Intn(10000))

	// 5. Append the new course to our global data store
	Courses = append(Courses, course)

	// 6. Return the created object with a 201 Created status
	utils.JSONResponse(w, http.StatusCreated, course)
}
