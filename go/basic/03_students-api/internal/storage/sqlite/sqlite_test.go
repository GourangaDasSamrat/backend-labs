package sqlite

import (
	"testing"

	"github.com/gourangadassamrat/students-api/internal/config"
	_ "modernc.org/sqlite"
)

func TestNew(t *testing.T) {
	type args struct {
		cfg *config.Config
	}
	tests := []struct {
		name    string
		args    args
		want    *Sqlite
		wantErr bool
	}{
		{
			name: "successful database initialization",
			args: args{
				cfg: &config.Config{
					StoragePath: ":memory:",
				},
			},
			wantErr: false,
		},
		{
			name: "invalid storage path",
			args: args{
				cfg: &config.Config{
					StoragePath: "/invalid/nonexistent/path/database.db",
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := New(tt.args.cfg)
			if (err != nil) != tt.wantErr {
				t.Fatalf("New() error = %v, wantErr %v", err, tt.wantErr)
			}
			if tt.wantErr {
				return
			}
			if got == nil || got.Db == nil {
				t.Errorf("New() returned nil database")
			}
		})
	}
}

func TestCreateStudent(t *testing.T) {
	cfg := &config.Config{
		StoragePath: ":memory:",
	}
	db, err := New(cfg)
	if err != nil {
		t.Fatalf("Failed to initialize database: %v", err)
	}

	type args struct {
		name  string
		email string
		age   int
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "create valid student",
			args: args{
				name:  "John Doe",
				email: "john@example.com",
				age:   20,
			},
			wantErr: false,
		},
		{
			name: "duplicate email",
			args: args{
				name:  "Jane Doe",
				email: "john@example.com",
				age:   21,
			},
			wantErr: true,
		},
		{
			name: "create another valid student",
			args: args{
				name:  "Alice Smith",
				email: "alice@example.com",
				age:   22,
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := db.CreateStudent(tt.args.name, tt.args.email, tt.args.age)
			if (err != nil) != tt.wantErr {
				t.Errorf("CreateStudent() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got <= 0 {
				t.Errorf("CreateStudent() returned invalid ID: %d", got)
			}
		})
	}
}
