package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Course represents a course with details like CourseId, CourseName, and CoursePrice.
type Course struct {
	// ID is the internal MongoDB hex ID
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	// CourseId is your custom string ID (from your previous logic)
	CourseId    string  `json:"course_id" bson:"course_id"`
	CourseName  string  `json:"course_name" bson:"course_name"`
	CoursePrice float32 `json:"price" bson:"price"`
	Author      *Author `json:"author" bson:"author"`
}

// IsEmpty checks if the CourseName is empty.
func (c *Course) IsEmpty() bool {
	return c.CourseName == ""
}
