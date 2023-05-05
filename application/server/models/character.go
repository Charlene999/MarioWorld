package models

import (
	"gorm.io/gorm"
)

type Character struct {
	gorm.Model
	Name        string
	Description string
	Level       uint
	ClassType   uint
	OwnerID     uint
	Owner       User    `gorm:"foreignkey:OwnerID"`
	Items       []Item  `gorm:"many2many:character_items;"`
}

type BuildCharacter struct {
	Name        string
	Description string
	ClassType   uint
	Level       uint
	OwnerToken  string
}

type GetCharacters struct {
	OwnerToken string
}

type DeleteCharacter struct {
	OwnerToken  string
	CharacterID uint
}

type UpdateCharacter struct {
	Name        string
	Description string
	ClassType   int
	Level       int
	OwnerToken  string
	CharacterID uint
}

type AddRemoveCharacterItem struct {
	ItemID      uint
	OwnerToken  string
	CharacterID uint
}
