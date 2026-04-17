// Package student handles HTTP requests related to student operations.
package student

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gourangadassamrat/students-api/internal/types"
)

// TestNew verifies that the New() handler correctly processes student data
// and returns appropriate HTTP responses for valid and invalid inputs.
func TestNew(t *testing.T) {
	tests := []struct {
		name           string
		body           interface{}
		expectedStatus int
		expectedError  bool
	}{
		{
			name: "Valid student data returns 201 Created",
			body: types.Student{
				Id:    1,
				Name:  "John Doe",
				Email: "john@example.com",
				Age:   20,
			},
			expectedStatus: http.StatusCreated,
			expectedError:  false,
		},
		{
			name:           "Empty body returns 400 Bad Request",
			body:           "",
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "Missing required field (Name) returns 400 Bad Request",
			body: types.Student{
				Id:    1,
				Email: "john@example.com",
				Age:   20,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "Invalid email format returns 400 Bad Request",
			body: types.Student{
				Id:    1,
				Name:  "John Doe",
				Email: "invalid-email",
				Age:   20,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "Age out of valid range returns 400 Bad Request",
			body: types.Student{
				Id:    1,
				Name:  "John Doe",
				Email: "john@example.com",
				Age:   150,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body bytes.Buffer
			if str, ok := tt.body.(string); ok && str == "" {
				// Empty body case
				body = bytes.Buffer{}
			} else {
				json.NewEncoder(&body).Encode(tt.body)
			}

			req := httptest.NewRequest(http.MethodPost, "/api/v1/students", &body)
			w := httptest.NewRecorder()

			handler := New()
			handler(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			// Verify response is JSON
			if contentType := w.Header().Get("Content-Type"); contentType != "application/json" {
				t.Errorf("Expected Content-Type application/json, got %s", contentType)
			}
		})
	}
}
