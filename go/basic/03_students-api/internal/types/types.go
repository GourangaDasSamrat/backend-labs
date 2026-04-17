// Package types defines the core data structures and constants used throughout the application.
package types

type Student struct {
	Id    int    `validate:"required,min=1"`
	Name  string `validate:"required,min=2,max=100"`
	Email string `validate:"required,email"`
	Age   int    `validate:"required,min=1,max=120"`
}

type Response struct {
	Status string `json:"status"`
	Error  string `json:"error"`
}

type HTTPServer struct {
	Address string `yaml:"address" env-default:"3000"`
}

type Config struct {
	Env         string `yaml:"env" env:"Env" env-required:"true" env-default:"production"`
	StoragePath string `yaml:"storage_path" env-required:"true"`
	HTTPServer  `yaml:"http_server"`
}

const (
	StatusOk    = "OK"
	StatusError = "Error"
)
