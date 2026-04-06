package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Author represents an author of a course.
type Author struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Fullname string             `json:"fullname" bson:"fullname"`
	Website  string             `json:"website" bson:"website"`
}
