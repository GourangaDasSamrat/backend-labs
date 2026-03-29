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
)

// HandleGetAllAuthors returns all authors from the authors collection
func HandleGetAllAuthors(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := authorsCol().Find(ctx, bson.M{})
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch authors")
		return
	}
	defer cursor.Close(ctx)

	var authors []models.Author
	if err = cursor.All(ctx, &authors); err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Error decoding authors")
		return
	}

	if authors == nil {
		authors = []models.Author{}
	}

	utils.JSONResponse(w, http.StatusOK, authors)
}

// HandleGetAuthor fetches a single author by their MongoDB _id
func HandleGetAuthor(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	objID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid Author ID format")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var author models.Author
	err = authorsCol().FindOne(ctx, bson.M{"_id": objID}).Decode(&author)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Author not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, author)
}

// HandleUpdateAuthor updates author details (like name or website)
func HandleUpdateAuthor(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	objID, _ := primitive.ObjectIDFromHex(params["id"])

	var author models.Author
	json.NewDecoder(r.Body).Decode(&author)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"fullname": author.Fullname,
			"website":  author.Website,
		},
	}

	result, err := authorsCol().UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil || result.MatchedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Update failed: Author not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Author updated successfully"})
}

// HandleDeleteAuthor removes an author
func HandleDeleteAuthor(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	objID, _ := primitive.ObjectIDFromHex(params["id"])

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Note: In a real app, you might want to check if they have courses
	// before deleting to avoid "orphaned" courses.
	res, err := authorsCol().DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil || res.DeletedCount == 0 {
		utils.JSONError(w, http.StatusNotFound, "Author not found")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Author deleted"})
}
