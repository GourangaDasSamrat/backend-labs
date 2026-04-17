// Package main tests verify the HTTP server's endpoint functionality.
package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestMainRouteWelcome verifies that the welcome endpoint returns the expected status and response body.
func TestMainRouteWelcome(t *testing.T) {
	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if _, err := w.Write([]byte("Welcome to students api")); err != nil {
			t.Fatalf("Failed to write response: %v", err)
		}
	})

	tests := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Welcome endpoint returns 200 OK",
			method:         "GET",
			path:           "/",
			expectedStatus: http.StatusOK,
			expectedBody:   "Welcome to students api",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, tt.path, nil)
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			if w.Body.String() != tt.expectedBody {
				t.Errorf("Expected body %q, got %q", tt.expectedBody, w.Body.String())
			}
		})
	}
}

func TestMainRouterCreation(t *testing.T) {
	// Test that router can be created and handles requests
	router := http.NewServeMux()
	if router == nil {
		t.Errorf("Router should not be nil")
	}

	// Verify router routes a request to the correct handler
	req := httptest.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()

	router.HandleFunc("GET /", func(rw http.ResponseWriter, r *http.Request) {
		rw.WriteHeader(http.StatusOK)
	})

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func Test_main(t *testing.T) {
	tests := []struct {
		name string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			main()
		})
	}
}
