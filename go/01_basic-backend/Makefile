# Run the application
run:
	go run main.go

# Format all files in the project
fmt:
	go fmt ./...

# Lint the project
lint:
	golangci-lint run

# Clean up dependencies and format
tidy:
	go mod tidy
	go fmt ./...

# Do everything: tidy, format, and run
dev: tidy run