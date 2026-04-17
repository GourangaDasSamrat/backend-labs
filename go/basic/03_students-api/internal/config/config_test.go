// Package config handles loading and managing application configuration
// from environment variables and configuration files.
package config

import (
	"os"
	"testing"
)

func TestMustLoad(t *testing.T) {
	// Get the project root and config file path
	configPath := "../../../config/local.yaml"

	tests := []struct {
		name      string
		setup     func()
		cleanup   func()
		wantPanic bool
	}{
		{
			name: "Load config from environment variable",
			setup: func() {
				os.Setenv("CONFIG_PATH", configPath)
			},
			cleanup: func() {
				os.Unsetenv("CONFIG_PATH")
			},
			wantPanic: false,
		},
		{
			name: "Config file not found",
			setup: func() {
				os.Setenv("CONFIG_PATH", "/nonexistent/path/config.yaml")
			},
			cleanup: func() {
				os.Unsetenv("CONFIG_PATH")
			},
			wantPanic: true,
		},
		{
			name: "Config path not provided",
			setup: func() {
				os.Unsetenv("CONFIG_PATH")
				// Clear command-line args to simulate no config flag provided
				os.Args = []string{"test"}
			},
			cleanup: func() {
				os.Unsetenv("CONFIG_PATH")
			},
			wantPanic: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup()
			defer tt.cleanup()

			if tt.wantPanic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("MustLoad() expected to panic but didn't")
					}
				}()
			}

			got := MustLoad()
			if !tt.wantPanic {
				if got == nil {
					t.Errorf("MustLoad() returned nil")
				}
				if got.Env == "" {
					t.Errorf("MustLoad() Env is empty")
				}
				if got.StoragePath == "" {
					t.Errorf("MustLoad() StoragePath is empty")
				}
				if got.HTTPServer.Address == "" {
					t.Errorf("MustLoad() HTTPServer.Address is empty")
				}
			}
		})
	}
}

func TestConfig_ValidateFields(t *testing.T) {
	// Test that Config struct properly loads all fields
	configPath := "../../../config/local.yaml"
	os.Setenv("CONFIG_PATH", configPath)
	defer os.Unsetenv("CONFIG_PATH")

	cfg := MustLoad()

	tests := []struct {
		name      string
		field     string
		value     string
		wantEmpty bool
	}{
		{
			name:      "Env field is loaded",
			field:     "Env",
			value:     cfg.Env,
			wantEmpty: false,
		},
		{
			name:      "StoragePath field is loaded",
			field:     "StoragePath",
			value:     cfg.StoragePath,
			wantEmpty: false,
		},
		{
			name:      "HTTPServer Address is loaded",
			field:     "HTTPServer.Address",
			value:     cfg.HTTPServer.Address,
			wantEmpty: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.wantEmpty && tt.value != "" {
				t.Errorf("Field %s should be empty, got %s", tt.field, tt.value)
			}
			if !tt.wantEmpty && tt.value == "" {
				t.Errorf("Field %s should not be empty", tt.field)
			}
		})
	}
}
