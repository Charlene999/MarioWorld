package controllers

import (
	"backend/models"
	"backend/utilities"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"
)

func (repository *Repos) CreateItem(c *gin.Context) {
	var buildItem models.BuildItem
	err := c.ShouldBindJSON(&buildItem)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(buildItem.AdminToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Get the user's information
	var user models.User
	err = repository.UserDb.First(&user, "username = ?", claims["Username"]).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !user.IsAdmin {
		c.AbortWithStatusJSON(http.StatusForbidden, "User is not an admin")
		return
	}

	item := models.Item{Name: buildItem.Name, Description: buildItem.Description, LevelReq: buildItem.LevelReq, ClassReq: buildItem.ClassReq}

	err = repository.ItemDb.Create(&item).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (repository *Repos) GetItems(c *gin.Context) {
	// just get all of them for listing, later we'll add an endpoint to get individual ones
	var items []models.Item
	err := repository.ItemDb.Find(&items).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "No items were found in the database"})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, items)
}

func (repository *Repos) DeleteItem(c *gin.Context) {
	var deleteItem models.DeleteItem
	err := c.ShouldBindJSON(&deleteItem)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(deleteItem.AdminToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	err = repository.UserDb.First(&user, "username = ?", claims["Username"]).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !user.IsAdmin {
		c.AbortWithStatusJSON(http.StatusForbidden, "User is not an admin")
		return
	}

	//Delete the item (hard delete)
	err = repository.ItemDb.Unscoped().Delete(&models.Item{}, deleteItem.ItemID).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"Successfully deleted item": deleteItem.ItemID})
}

func (repository *Repos) UpdateItem(c *gin.Context) {
	var updateItem models.UpdateItem
	err := c.ShouldBindJSON(&updateItem)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(updateItem.AdminToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	err = repository.UserDb.First(&user, "username = ?", claims["Username"]).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !user.IsAdmin {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": user.ID})
		return
	}

	var item models.Item

	err = repository.ItemDb.First(&item, "id = ?", updateItem.ItemID).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": updateItem.ItemID})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updateItem.Name != "" {
		item.Name = updateItem.Name
	}
	if updateItem.Description != "" {
		item.Description = updateItem.Description
	}
	// these have to be > 0, otherwise they will be updated to 0 if left blank
	if updateItem.LevelReq > 0 {
		item.LevelReq = uint(updateItem.LevelReq)
	}
	if updateItem.ClassReq > 0 {
		item.ClassReq = uint(updateItem.ClassReq)
	}

	repository.ItemDb.Save(&item)

	c.JSON(http.StatusAccepted, &item)
}

func (repository *Repos) GetFilteredItems(c *gin.Context) {
	var itemFilters models.FilterItems
	err := c.ShouldBindJSON(&itemFilters)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var items []models.Item
	if itemFilters.ClassReq != 0 && itemFilters.LevelReq != 0 {
		err = repository.ItemDb.Where("level_req <= ? AND class_req = ?", itemFilters.LevelReq, itemFilters.ClassReq).Find(&items).Error
	} else if itemFilters.LevelReq != 0 {
		err = repository.ItemDb.Where("level_req <= ?", itemFilters.LevelReq).Find(&items).Error
	} else if itemFilters.ClassReq != 0 {
		err = repository.ItemDb.Where("class_req = ?", itemFilters.ClassReq).Find(&items).Error
	} else {
		c.AbortWithStatusJSON(422, gin.H{"error": "ClassReq or LevelReq required"})
		return
	}

	if errors.Is(err, gorm.ErrRecordNotFound) || len(items) == 0 {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "No items matching these filters were found in the database"})
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, items)
}
