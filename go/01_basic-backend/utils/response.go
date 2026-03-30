package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

// JSONResponse handles setting headers, status codes, and encoding data.
func JSONResponse(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	// If there is no data to send (like a 404 or 204), don't try to encode.
	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			// If encoding fails, we log it.
			// We can't use http.Error here because WriteHeader was already called.
			log.Printf("Error encoding JSON response: %v", err)
		}
	}
}

// JSONError is a helper for sending consistent error messages.
func JSONError(w http.ResponseWriter, code int, message string) {
	JSONResponse(w, code, map[string]string{"error": message})
}

// WriteHTML is a clean way to send non-JSON responses.
func WriteHTML(w http.ResponseWriter, html string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// FIX: Check the error return value of w.Write to satisfy the linter.
	// We use the blank identifier (_) for the byte count and check the error.
	if _, err := w.Write([]byte(html)); err != nil {
		log.Printf("Error writing HTML response: %v", err)
	}
}
