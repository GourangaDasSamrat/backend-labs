// Package config handles loading and managing application configuration
// from environment variables and configuration files.
package config

import (
	"flag"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

// HTTPServer holds configurations related to the HTTP server.
type HTTPServer struct {
	Address string `yaml:"address" env-default:"3000"`
}

// Config contains all configuration settings for the application.
type Config struct {
	Env         string `yaml:"env" env:"Env" env-required:"true" env-default:"production"`
	StoragePath string `yaml:"storage_path" env-required:"true"`
	HTTPServer  `yaml:"http_server"`
}

// MustLoad loads the configuration from a file and returns a Config.
// It looks for a CONFIG_PATH environment variable first, then falls back to a command-line flag.
// The function will exit with a fatal error if the config file is not found or cannot be parsed.
func MustLoad() *Config {
	var configPath string

	// Try to get config path from environment variable
	configPath = os.Getenv("CONFIG_PATH")

	// If not found, check command-line flags
	if configPath == "" {
		flags := flag.String("config", "", "Path to the config file")
		flag.Parse()

		configPath = *flags

		// Ensure config path is provided one way or another
		if configPath == "" {
			log.Fatal("Config path is not set")
		}
	}

	// Verify that the config file exists
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("Config file does not exist: %s", configPath)
	}

	// Load and parse the config file into the Config struct
	var cfg Config

	err := cleanenv.ReadConfig(configPath, &cfg)
	if err != nil {
		log.Fatalf("Cannot read config file: %s", err.Error())
	}

	return &cfg
}
