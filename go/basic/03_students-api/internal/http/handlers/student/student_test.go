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

// mockStorage implements the Storage interface for testing purposes.
type mockStorage struct {
	createStudentFunc func(name string, email string, age int) (int64, error)
}

func (m *mockStorage) CreateStudent(name string, email string, age int) (int64, error) {
	if m.createStudentFunc != nil {
		return m.createStudentFunc(name, email, age)
	}
	return 0, nil
}

// TestNew verifies that the New() handler correctly processes student data
// and returns appropriate HTTP responses for valid and invalid inputs.
func TestNew(t *testing.T) {
	tests := []struct {
		name           string
		body           interface{}
		expectedStatus int
		expectedError  bool
		mockStorage    *mockStorage
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
			mockStorage: &mockStorage{
				createStudentFunc: func(name, email string, age int) (int64, error) {
					return 1, nil
				},
			},
		},
		{
			name:           "Empty body returns 400 Bad Request",
			body:           "",
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
			mockStorage:    &mockStorage{},
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
			mockStorage:    &mockStorage{},
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
			mockStorage:    &mockStorage{},
		},
		{
			name: "Age below minimum valid range returns 400 Bad Request",
			body: types.Student{
				Id:    1,
				Name:  "John Doe",
				Email: "john@example.com",
				Age:   0,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
			mockStorage:    &mockStorage{},
		},
		{
			name: "Age above maximum valid range returns 400 Bad Request",
			body: types.Student{
				Id:    1,
				Name:  "John Doe",
				Email: "john@example.com",
				Age:   150,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
			mockStorage:    &mockStorage{},
		},
		{
			name: "Negative student ID returns 400 Bad Request",
			body: types.Student{
				Id:    -1,
				Name:  "John Doe",
				Email: "john@example.com",
				Age:   20,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
			mockStorage:    &mockStorage{},
		},
		{
			name: "Name too short returns 400 Bad Request",
			body: types.Student{
				Id:    1,
				Name:  "J",
				Email: "john@example.com",
				Age:   20,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
			mockStorage:    &mockStorage{},
		},
		{
			name: "Valid student with all constraints met returns 201 Created",
			body: types.Student{
				Id:    100,
				Name:  "Jane Smith",
				Email: "jane.smith@example.com",
				Age:   25,
			},
			expectedStatus: http.StatusCreated,
			expectedError:  false,
			mockStorage: &mockStorage{
				createStudentFunc: func(name, email string, age int) (int64, error) {
					return 100, nil
				},
			},
		},
		{
			name: "Student with maximum age valid returns 201 Created",
			body: types.Student{
				Id:    2,
				Name:  "Old Student",
				Email: "old@example.com",
				Age:   120,
			},
			expectedStatus: http.StatusCreated,
			expectedError:  false,
			mockStorage: &mockStorage{
				createStudentFunc: func(name, email string, age int) (int64, error) {
					return 2, nil
				},
			},
		},
		{
			name: "Student with minimum age valid returns 201 Created",
			body: types.Student{
				Id:    3,
				Name:  "Young Student",
				Email: "young@example.com",
				Age:   1,
			},
			expectedStatus: http.StatusCreated,
			expectedError:  false,
			mockStorage: &mockStorage{
				createStudentFunc: func(name, email string, age int) (int64, error) {
					return 3, nil
				},
			},
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

			handler := New(tt.mockStorage)
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

// TestNewHandlerType verifies that New() returns an http.HandlerFunc
func TestNewHandlerType(t *testing.T) {
	mockStor := &mockStorage{}
	handler := New(mockStor)

	if handler == nil {
		t.Error("New() returned nil handler")
	}

	// Verify handler is callable
	req := httptest.NewRequest(http.MethodPost, "/api/v1/students", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()

	// Should not panic
	handler(w, req)
}
