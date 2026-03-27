package utils

import (
	"encoding/json"
	"net/http"
)

// JSONResponse handles setting headers, status codes, and encoding data.
func JSONResponse(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	// If there is no data to send (like a 404 or 204), don't try to encode.
	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			// If encoding fails, we've already sent a header, so we just log.
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
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
	w.Write([]byte(html))
}
