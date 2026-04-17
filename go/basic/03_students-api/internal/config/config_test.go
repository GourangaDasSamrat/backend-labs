// Package config handles loading and managing application configuration
// from environment variables and configuration files.
package config

import (
	"os"
	"testing"
)

// TestMustLoad verifies that MustLoad() correctly loads the configuration from the config file.
func TestMustLoad(t *testing.T) {
	tests := []struct {
		name         string
		setupEnv     func()
		cleanupEnv   func()
		shouldPanic  bool
		validateCfg  func(*Config) bool
	}{
		{
			name: "Successfully loaded config from environment variable",
			setupEnv: func() {
				os.Setenv("CONFIG_PATH", "../../config/local.yaml")
			},
			cleanupEnv: func() {
				os.Unsetenv("CONFIG_PATH")
			},
			shouldPanic: false,
			validateCfg: func(cfg *Config) bool {
				return cfg != nil && cfg.Address != "" && cfg.StoragePath != ""
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setupEnv()
			defer tt.cleanupEnv()

			got := MustLoad()
			if got == nil {
				t.Error("MustLoad() returned nil")
				return
			}

			if !tt.validateCfg(got) {
				t.Errorf("MustLoad() returned invalid config: %+v", got)
			}
		})
	}
}
