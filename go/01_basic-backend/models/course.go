package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Course represents a course linked to an Author via AuthorID.
type Course struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	CourseName  string             `json:"course_name" bson:"course_name"`
	CoursePrice float32            `json:"price" bson:"price"`
	AuthorID    primitive.ObjectID `json:"author_id" bson:"author_id"` // Reference to Author
}

func (c *Course) IsEmpty() bool {
	return c.CourseName == ""
}
