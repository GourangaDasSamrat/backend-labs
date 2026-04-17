// Package response handles HTTP response formatting and error responses.
package response

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/gourangadassamrat/students-api/internal/types"
)

// TestWriteJson verifies that WriteJson() correctly encodes data to JSON
// and writes it to the HTTP response with the correct status code.
func TestWriteJson(t *testing.T) {
	tests := []struct {
		name           string
		status         int
		data           interface{}
		expectedStatus int
		shouldErr      bool
	}{
		{
			name:           "Successfully writes JSON with 200 OK",
			status:         http.StatusOK,
			data:           map[string]string{"key": "value"},
			expectedStatus: http.StatusOK,
			shouldErr:      false,
		},
		{
			name:           "Successfully writes JSON with 201 Created",
			status:         http.StatusCreated,
			data:           types.Response{Status: types.StatusOk, Error: ""},
			expectedStatus: http.StatusCreated,
			shouldErr:      false,
		},
		{
			name:           "Successfully writes JSON with 400 Bad Request",
			status:         http.StatusBadRequest,
			data:           types.Response{Status: types.StatusError, Error: "Invalid input"},
			expectedStatus: http.StatusBadRequest,
			shouldErr:      false,
		},
		{
			name:           "Successfully writes nil data",
			status:         http.StatusOK,
			data:           nil,
			expectedStatus: http.StatusOK,
			shouldErr:      false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()

			err := WriteJson(w, tt.status, tt.data)

			if (err != nil) != tt.shouldErr {
				t.Errorf("WriteJson() error = %v, wanted error = %v", err, tt.shouldErr)
			}

			if w.Code != tt.expectedStatus {
				t.Errorf("WriteJson() status = %d, want %d", w.Code, tt.expectedStatus)
			}

			if contentType := w.Header().Get("Content-Type"); contentType != "application/json" {
				t.Errorf("WriteJson() Content-Type = %s, want application/json", contentType)
			}
		})
	}
}

// TestGeneralError verifies that GeneralError() correctly creates an error response
// with the appropriate status and error message.
func TestGeneralError(t *testing.T) {
	tests := []struct {
		name           string
		err            error
		expectedStatus string
		expectedError  string
	}{
		{
			name:           "Creates error response for simple error",
			err:            errors.New("database connection failed"),
			expectedStatus: types.StatusError,
			expectedError:  "database connection failed",
		},
		{
			name:           "Creates error response for formatted error",
			err:            fmt.Errorf("invalid email format: %s", "not-an-email"),
			expectedStatus: types.StatusError,
			expectedError:  "invalid email format: not-an-email",
		},
		{
			name:           "Creates error response for empty error message",
			err:            errors.New(""),
			expectedStatus: types.StatusError,
			expectedError:  "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GeneralError(tt.err)

			if got.Status != tt.expectedStatus {
				t.Errorf("GeneralError() Status = %s, want %s", got.Status, tt.expectedStatus)
			}

			if got.Error != tt.expectedError {
				t.Errorf("GeneralError() Error = %q, want %q", got.Error, tt.expectedError)
			}
		})
	}
}

// TestValidationError verifies that ValidationError() correctly formats validation errors
// with appropriate messages based on validation tags.
func TestValidationError(t *testing.T) {
	// Helper function to create a mock validation error
	createValidationError := func(field, tag, param string) validator.FieldError {
		return &mockFieldError{
			field:      field,
			actualTag:  tag,
			paramValue: param,
		}
	}

	tests := []struct {
		name      string
		errs      validator.ValidationErrors
		wantError string
	}{
		{
			name: "Formats required validation error",
			errs: validator.ValidationErrors{
				createValidationError("name", "required", ""),
			},
			wantError: "Name is required",
		},
		{
			name: "Formats email validation error",
			errs: validator.ValidationErrors{
				createValidationError("email", "email", ""),
			},
			wantError: "Email must be a valid email",
		},
		{
			name: "Formats min validation error",
			errs: validator.ValidationErrors{
				createValidationError("age", "min", "18"),
			},
			wantError: "Age must be at least 18",
		},
		{
			name: "Formats max validation error",
			errs: validator.ValidationErrors{
				createValidationError("password", "max", "128"),
			},
			wantError: "Password must be at most 128",
		},
		{
			name: "Formats len validation error",
			errs: validator.ValidationErrors{
				createValidationError("code", "len", "6"),
			},
			wantError: "Code must be exactly 6 characters long",
		},
		{
			name: "Formats default validation error",
			errs: validator.ValidationErrors{
				createValidationError("username", "custom", ""),
			},
			wantError: "Username is invalid",
		},
		{
			name: "Formats multiple validation errors",
			errs: validator.ValidationErrors{
				createValidationError("email", "required", ""),
				createValidationError("age", "min", "18"),
				createValidationError("password", "max", "128"),
			},
			wantError: "Email is required, Age must be at least 18, Password must be at most 128",
		},
		{
			name:      "Handles empty validation errors",
			errs:      validator.ValidationErrors{},
			wantError: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ValidationError(tt.errs)

			if got.Status != types.StatusError {
				t.Errorf("ValidationError() Status = %s, want %s", got.Status, types.StatusError)
			}

			if got.Error != tt.wantError {
				t.Errorf("ValidationError() Error = %q, want %q", got.Error, tt.wantError)
			}
		})
	}
}

// mockFieldError implements validator.FieldError for testing purposes
type mockFieldError struct {
	field      string
	actualTag  string
	paramValue string
}

// Translate implements [validator.FieldError].
func (e *mockFieldError) Translate(ut ut.Translator) string {
	panic("unimplemented")
}

func (e *mockFieldError) Tag() string {
	return e.actualTag
}

func (e *mockFieldError) ActualTag() string {
	return e.actualTag
}

func (e *mockFieldError) Kind() reflect.Kind {
	return reflect.String
}

func (e *mockFieldError) Type() reflect.Type {
	return reflect.TypeOf("")
}

func (e *mockFieldError) Param() string {
	return e.paramValue
}

func (e *mockFieldError) Value() interface{} {
	return nil
}

func (e *mockFieldError) Field() string {
	return e.field
}

func (e *mockFieldError) StructField() string {
	return e.field
}

func (e *mockFieldError) StructNamespace() string {
	return e.field
}

func (e *mockFieldError) Namespace() string {
	return e.field
}

func (e *mockFieldError) Error() string {
	return e.field + " validation failed"
}
