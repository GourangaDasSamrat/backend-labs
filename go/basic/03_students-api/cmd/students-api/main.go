// Package main initializes and runs the students API HTTP server with graceful shutdown support.
package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gourangadassamrat/students-api/internal/config"
	"github.com/gourangadassamrat/students-api/internal/http/handlers/student"
	"github.com/gourangadassamrat/students-api/internal/storage/sqlite"
)

func main() {
	cfg := config.MustLoad()

	_, err := sqlite.New(cfg)
	if err != nil {
		log.Fatal(err)
	}

	slog.Info("Storage initialized", "env",cfg.Env)

	router := http.NewServeMux()

	router.HandleFunc("POST /api/v1/students", student.New(cfg.StoragePath))

	server := http.Server{
		Addr:    cfg.Address,
		Handler: router,
	}

	slog.Info("Server started", "port", cfg.Address)

	done := make(chan os.Signal, 1)

	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := server.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()

	<-done

	slog.Info("Shutting down the server")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		slog.Error("Failed to shutdown", "error", err)
	}

	slog.Info("Server shutting down successfully")

}
