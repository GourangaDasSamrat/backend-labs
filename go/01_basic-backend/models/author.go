package models

// Author represents an author of a course.
type Author struct {
	Fullname string `json:"fullname" bson:"fullname"`
	Website  string `json:"website" bson:"website"`
}
