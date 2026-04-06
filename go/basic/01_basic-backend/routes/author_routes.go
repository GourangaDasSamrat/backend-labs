package routes

import (
	"github.com/gorilla/mux"
	"github.com/gourangadassamrat/backend-labs/go/01_basic-backend/controllers"
)

// RegisterAuthorRoutes defines all the endpoints related to the Author resource.
func RegisterAuthorRoutes(r *mux.Router) {
	// 1. Create a subrouter for authors to group related endpoints
	authorRouter := r.PathPrefix("/authors").Subrouter()

	// 2. Define GET route to fetch all authors
	// Matches: GET /api/v1/authors or /api/v1/authors/
	authorRouter.HandleFunc("", controllers.HandleGetAllAuthors).Methods("GET")
	authorRouter.HandleFunc("/", controllers.HandleGetAllAuthors).Methods("GET")

	// 3. Define GET route to fetch a single author by ID
	// Matches: GET /api/v1/authors/{id}
	authorRouter.HandleFunc("/{id}", controllers.HandleGetAuthor).Methods("GET")

	// 4. Define PUT route to update an existing author by ID
	// Matches: PUT /api/v1/authors/{id}
	authorRouter.HandleFunc("/{id}", controllers.HandleUpdateAuthor).Methods("PUT")

	// 5. Define DELETE route to remove an author
	// Matches: DELETE /api/v1/authors/{id}
	authorRouter.HandleFunc("/{id}", controllers.HandleDeleteAuthor).Methods("DELETE")
}
