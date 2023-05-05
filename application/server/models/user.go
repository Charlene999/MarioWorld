package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Username string
	Email    string
	Password string
	IsAdmin  bool
}

type BuildUser struct {
	Name     string
	Username string
	Email    string
	Password string
}

type UserSignIn struct {
	Username string
	Password string
}

type GetUser struct {
	UserToken string
}

type UpdateUser struct {
	UserToken string
	Name      string
	Email     string
	Password  string
}

type AdminUpdateUser struct {
	AuthToken string
	Username  string
	Name      string
	Email     string
	Password  string
	IsAdmin   bool
}

type AdminDeleteUser struct {
	AuthToken string
	Username  string
}
