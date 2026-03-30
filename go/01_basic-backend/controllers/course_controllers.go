package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/models"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Helper functions to get collection handles
func coursesCol() *mongo.Collection { return utils.GetCollection(utils.DB, "courses") }
func authorsCol() *mongo.Collection { return utils.GetCollection(utils.DB, "authors") }

// HandleServeHome handles the root route
func HandleServeHome(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTML(w, "<h1>Course & Author API (Smart MongoDB Linking)</h1>")
}

// HandleGetAllCourses fetches all courses from the database
func HandleGetAllCourses(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := coursesCol().Find(ctx, bson.M{})
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Error fetching courses")
		return
	}
	defer cursor.Close(ctx)

	var courses []models.Course
	if err = cursor.All(ctx, &courses); err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Error decoding courses")
		return
	}

	// Return empty slice instead of null if no data exists
	if courses == nil {
		courses = []models.Course{}
	}

	utils.JSONResponse(w, http.StatusOK, courses)
}

// HandleGetCourse fetches a single course by its MongoDB HEX ID
func HandleGetCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	objID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var course models.Course
	err = coursesCol().FindOne(ctx, bson.M{"_id": objID}).Decode(&course)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Course not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, course)
}

// HandleCreateCourse creates an Author (if new) and links it to the Course
func HandleCreateCourse(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		utils.JSONError(w, http.StatusBadRequest, "Request body is empty")
		return
	}

	// We use a temporary struct to decode the nested JSON from the request
	var input struct {
		models.Course `json:",inline"`
		Author        models.Author `json:"author"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON format")
		return
	}

	// --- 1. STRICT VALIDATION ---
	if input.CourseName == "" {
		utils.JSONError(w, http.StatusBadRequest, "Course name cannot be empty")
		return
	}
	if input.Author.Fullname == "" {
		utils.JSONError(w, http.StatusBadRequest, "Author name is required")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// --- 2. SMART AUTHOR LINKING ---
	var authorID primitive.ObjectID
	var existingAuthor models.Author

	// Check if author already exists by name
	err := authorsCol().FindOne(ctx, bson.M{"fullname": input.Author.Fullname}).Decode(&existingAuthor)

	if err == mongo.ErrNoDocuments {
		// Author is new, create them
		authRes, err := authorsCol().InsertOne(ctx, input.Author)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create author")
			return
		}
		authorID = authRes.InsertedID.(primitive.ObjectID)
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error during author lookup")
		return
	} else {
		// Author exists, use their existing ID
		authorID = existingAuthor.ID
	}

	// --- 3. CREATE COURSE ---
	input.Course.AuthorID = authorID
	res, err := coursesCol().InsertOne(ctx, input.Course)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to save course")
		return
	}

	// Map the new Mongo ID back to the course object for the response
	input.Course.ID = res.InsertedID.(primitive.ObjectID)
	utils.JSONResponse(w, http.StatusCreated, input.Course)
}

// HandleUpdateCourse updates basic course details
func HandleUpdateCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	objID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var updateData models.Course
	// FIX: Check the error return value of Decode
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON format")
		return
	}

	if updateData.CourseName == "" {
		utils.JSONError(w, http.StatusBadRequest, "Updated name cannot be empty")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"course_name": updateData.CourseName,
			"price":       updateData.CoursePrice,
		},
	}

	result, err := coursesCol().UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil || result.MatchedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Course not found or update failed")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Course updated"})
}

// HandleDeleteCourse removes a course document
func HandleDeleteCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	objID, _ := primitive.ObjectIDFromHex(params["id"])

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, err := coursesCol().DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil || res.DeletedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Course not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Course deleted successfully"})
}
