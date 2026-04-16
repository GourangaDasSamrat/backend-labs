// Package config handles loading and managing application configuration
// from environment variables and configuration files.
package config

import (
	"reflect"
	"testing"
)

func TestMustLoad(t *testing.T) {
	tests := []struct {
		name string
		want *Config
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := MustLoad(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("MustLoad() = %v, want %v", got, tt.want)
			}
		})
	}
}
