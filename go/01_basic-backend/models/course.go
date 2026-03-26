package models

// Course represents a course with details like CourseId, CourseName, and CoursePrice.
type Course struct {
	CourseId    string  `json:"course_id"`
	CourseName  string  `json:"course_name"`
	CoursePrice float32 `json:"price"`
	Author      *Author `json:"author"` // Link to the Author model
}

// IsEmpty checks if the CourseId and CourseName are empty.
func (c *Course) IsEmpty() bool {
	return c.CourseId == "" && c.CourseName == ""
}
