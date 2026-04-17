// Package response provides utilities for writing JSON responses and formatting error messages for HTTP endpoints.
package response

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gourangadassamrat/students-api/internal/types"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// WriteJson encodes data as JSON and writes it to the response writer with the specified HTTP status code.
func WriteJson(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(data)
}

// GeneralError creates a Response with an error status and the provided error message.
func GeneralError(err error) types.Response {
	return types.Response{
		Status: types.StatusError,
		Error:  err.Error(),
	}
}

// ValidationError creates a Response with formatted validation error messages based on validation tags.
func ValidationError(errs validator.ValidationErrors) types.Response {
	var errMsg []string

	for _, err := range errs {
		switch err.ActualTag() {
		case "required":
			errMsg = append(errMsg, cases.Title(language.English).String(err.Field())+" is required")
		case "email":
			errMsg = append(errMsg, cases.Title(language.English).String(err.Field())+" must be a valid email")
		case "min":
			errMsg = append(errMsg, cases.Title(language.English).String(err.Field())+" must be at least "+err.Param())
		case "max":
			errMsg = append(errMsg, cases.Title(language.English).String(err.Field())+" must be at most "+err.Param())
		case "len":
			errMsg = append(errMsg, cases.Title(language.English).String(err.Field())+" must be exactly "+err.Param()+" characters long")
		default:
			errMsg = append(errMsg, cases.Title(language.English).String(err.Field())+" is invalid")
		}
	}

	return types.Response{
		Status: types.StatusError,
		Error:  strings.Join(errMsg, ", "),
	}
}
