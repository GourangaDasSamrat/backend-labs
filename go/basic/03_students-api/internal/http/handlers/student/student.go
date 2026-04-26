// Package student handles HTTP requests for student-related operations including validation and persistence.
package student

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gourangadassamrat/students-api/internal/storage"
	"github.com/gourangadassamrat/students-api/internal/types"
	"github.com/gourangadassamrat/students-api/internal/utils/response"
)

// New returns an HTTP handler function that processes POST requests to create a new student.
// It decodes the JSON request body, validates the student data, and returns appropriate responses.
func New(storage storage.Storage) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student types.Student

		if err := json.NewDecoder(r.Body).Decode(&student); errors.Is(err, io.EOF) {
			_ = response.WriteJson(w, http.StatusBadRequest, response.GeneralError(fmt.Errorf("empty body")))
			return
		} else if err != nil {
			_ = response.WriteJson(w, http.StatusBadRequest, response.GeneralError(err))
			return
		}

		if err := validator.New().Struct(student); err != nil {
			validationErrs := err.(validator.ValidationErrors)

			_ = response.WriteJson(w, http.StatusBadRequest, response.ValidationError(validationErrs))
			return
		}

		_ = response.WriteJson(w, http.StatusCreated, map[string]string{"success": "OK"})
	}
}
