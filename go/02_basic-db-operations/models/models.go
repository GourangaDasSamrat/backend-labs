package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Netflix struct {
	ID      primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Movie   string             `json:"movie,omitempty" bson:"movie,omitempty"`
	Watched bool               `json:"is_watched,omitempty" bson:"is_watched,omitempty"`
}