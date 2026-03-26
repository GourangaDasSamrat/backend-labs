package utils

import (
	"encoding/json"
	"net/http"
)

// handle HTML/Plain text writes safely
func WriteResponse(w http.ResponseWriter, content []byte) {
	_, err := w.Write(content)
	if err != nil {
		// If writing to the connection fails, we usually just log it
		// because we can't send another response to the user anymore.
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func JSONResponse(w http.ResponseWriter, data interface{}, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
