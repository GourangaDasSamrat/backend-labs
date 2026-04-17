// Package response handles HTTP response formatting and error responses.
package response

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

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
		name          string
		err           error
		expectedStatus string
		expectedError string
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
