package controllers

import (
	"context"
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/models"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Helper to get the collection handle
func getCollection() *mongo.Collection {
	return utils.GetCollection(utils.DB, "courses")
}

// HandleServeHome handles the root route
func HandleServeHome(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTML(w, "<h1>This is the MongoDB-powered Course API.</h1>")
}

// HandleGetAllCourses fetches all documents from the collection
func HandleGetAllCourses(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var courses []models.Course
	cursor, err := getCollection().Find(ctx, bson.M{})
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Error fetching from database")
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &courses); err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Error decoding database results")
		return
	}

	// Logic to ensure an empty slice is returned instead of null
	if courses == nil {
		courses = []models.Course{}
	}

	utils.JSONResponse(w, http.StatusOK, courses)
}

// HandleGetCourse fetches one course using the custom course_id
func HandleGetCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var course models.Course
	// We search by the "course_id" field defined in our BSON tags
	err := getCollection().FindOne(ctx, bson.M{"course_id": id}).Decode(&course)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Course not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, course)
}

// HandleCreateCourse generates a random ID and saves to MongoDB
func HandleCreateCourse(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		utils.JSONError(w, http.StatusBadRequest, "Request body is empty")
		return
	}

	var course models.Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	if course.IsEmpty() {
		utils.JSONError(w, http.StatusBadRequest, "Course name is required")
		return
	}

	// Generating the custom ID like before
	rand.Seed(time.Now().UnixNano())
	course.CourseId = strconv.Itoa(rand.Intn(10000))

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert into Mongo. Mongo will automatically create the _id (ObjectID)
	result, err := getCollection().InsertOne(ctx, course)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to insert course")
		return
	}

	// Optional: Assign the newly created Mongo ID back to the object for the response
	if oid, ok := result.InsertedID.(interface{}); ok {
		_ = oid // You can log this if needed
	}

	utils.JSONResponse(w, http.StatusCreated, course)
}

// HandleUpdateCourse performs an $set update in MongoDB
func HandleUpdateCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	var updateData models.Course
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Construct the update document
	update := bson.M{
		"$set": bson.M{
			"course_name": updateData.CourseName,
			"price":       updateData.CoursePrice,
			"author":      updateData.Author,
		},
	}

	result, err := getCollection().UpdateOne(ctx, bson.M{"course_id": id}, update)
	if err != nil || result.MatchedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Course not found or update failed")
		return
	}

	updateData.CourseId = id
	utils.JSONResponse(w, http.StatusOK, updateData)
}

// HandleDeleteCourse removes a document based on the custom course_id
func HandleDeleteCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := getCollection().DeleteOne(ctx, bson.M{"course_id": id})
	if err != nil || result.DeletedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Course not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Success! Course removed."})
}
