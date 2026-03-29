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

// Helpers to reach your two different collections
func coursesCol() *mongo.Collection { return utils.GetCollection(utils.DB, "courses") }
func authorsCol() *mongo.Collection { return utils.GetCollection(utils.DB, "authors") }

func HandleServeHome(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTML(w, "<h1>Course & Author API (Relational MongoDB)</h1>")
}

// HandleGetAllCourses fetches all courses
func HandleGetAllCourses(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := coursesCol().Find(ctx, bson.M{})
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "DB Error")
		return
	}
	var courses []models.Course
	cursor.All(ctx, &courses)
	if courses == nil {
		courses = []models.Course{}
	}
	utils.JSONResponse(w, http.StatusOK, courses)
}

// HandleGetCourse fetches one course by its MongoDB HEX ID
func HandleGetCourse(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	objID, _ := primitive.ObjectIDFromHex(id)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var course models.Course
	err := coursesCol().FindOne(ctx, bson.M{"_id": objID}).Decode(&course)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Course not found")
		return
	}
	utils.JSONResponse(w, http.StatusOK, course)
}

// HandleCreateCourse creates an Author first, then links it to the Course
func HandleCreateCourse(w http.ResponseWriter, r *http.Request) {
	var input struct {
		models.Course `json:",inline"`
		Author        models.Author `json:"author"`
	}
	json.NewDecoder(r.Body).Decode(&input)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Create Author
	authRes, _ := authorsCol().InsertOne(ctx, input.Author)
	input.Course.AuthorID = authRes.InsertedID.(primitive.ObjectID)

	// 2. Create Course
	res, _ := coursesCol().InsertOne(ctx, input.Course)
	input.Course.ID = res.InsertedID.(primitive.ObjectID)

	utils.JSONResponse(w, http.StatusCreated, input.Course)
}

// HandleUpdateCourse updates course details
func HandleUpdateCourse(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	objID, _ := primitive.ObjectIDFromHex(id)

	var updateData models.Course
	json.NewDecoder(r.Body).Decode(&updateData)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{"$set": bson.M{
		"course_name": updateData.CourseName,
		"price":       updateData.CoursePrice,
	}}

	_, err := coursesCol().UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Update failed")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]string{"msg": "Updated successfully"})
}

// HandleDeleteCourse removes the course
func HandleDeleteCourse(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	objID, _ := primitive.ObjectIDFromHex(id)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, _ := coursesCol().DeleteOne(ctx, bson.M{"_id": objID})
	if res.DeletedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Not found")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]string{"msg": "Deleted"})
}
