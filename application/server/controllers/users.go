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

func DoesUserExist(username string, repository *Repos, user *models.User) (bool, error) {
	err := repository.UserDb.First(&user, "username = ?", username).Error

	// returns t/f and always returns the err
	return !errors.Is(err, gorm.ErrRecordNotFound), err
}

// Create user
func (repository *Repos) CreateUser(c *gin.Context) {
	var buildUser models.BuildUser
	err := c.ShouldBindJSON(&buildUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if buildUser.Email == "" || buildUser.Name == "" || buildUser.Password == "" || buildUser.Username == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Missing an email, name, password, or username"})
		return
	}

	hashedPassword, err := utilities.HashPassword(buildUser.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Could not hash password": buildUser.Password})
		return
	}

	user := models.User{Name: buildUser.Name, Username: buildUser.Username, Email: buildUser.Email, Password: string(hashedPassword), IsAdmin: false}

	// _ means discard this err - if the user exists there will be an err, which is fine for this purpose
	userExists, _ := DoesUserExist(buildUser.Username, repository, &user)
	//Check to make sure there is no other user with the same username
	if userExists {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{"User already exists with this username": buildUser.Username})
		return
	}

	err = repository.UserDb.Create(&user).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// Get user by token
func (repository *Repos) GetUser(c *gin.Context) {
	var getUser models.GetUser
	err := c.ShouldBindJSON(&getUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(getUser.UserToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Find the user
	var user models.User
	err = repository.UserDb.First(&user, "username = ?", claims["Username"]).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (repository *Repos) LogIn(c *gin.Context) {
	var signInInput models.UserSignIn
	err := c.ShouldBindJSON(&signInInput)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	userExists, err := DoesUserExist(signInInput.Username, repository, &user)
	if !userExists {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"User not found": signInInput.Username})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = utilities.CheckPassword(user.Password, signInInput.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": signInInput.Password})
		return
	}

	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"Username": signInInput.Username,
	})
	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func (repository *Repos) UpdateUser(c *gin.Context) {
	var updateUser models.UpdateUser
	err := c.ShouldBindJSON(&updateUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user being changed
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(updateUser.UserToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Grab the existing user
	var user models.User
	err = repository.UserDb.First(&user, "username = ?", claims["Username"]).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": claims["Username"]})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updateUser.Name != "" {
		user.Name = updateUser.Name
	}
	if updateUser.Password != "" {
		newHashedPassword, err := utilities.HashPassword(updateUser.Password)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Could not hash password": updateUser.Password})
			return
		}

		user.Password = newHashedPassword
	}
	if updateUser.Email != "" {
		user.Email = updateUser.Email
	}

	repository.UserDb.Save(&user)

	c.JSON(http.StatusAccepted, user)
}

func (repository *Repos) AdminUpdateUser(c *gin.Context) {
	var updateUser models.AdminUpdateUser
	err := c.ShouldBindJSON(&updateUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(updateUser.AuthToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Ensure user is an admin
	var admin models.User
	err = repository.UserDb.First(&admin, "username = ?", claims["Username"]).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !admin.IsAdmin {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": admin.ID})
		return
	}

	//Grab the existing user to change
	var user models.User
	err = repository.UserDb.First(&user, "username = ?", updateUser.Username).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": updateUser.Username})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updateUser.Name != "" {
		user.Name = updateUser.Name
	}
	if updateUser.Password != "" {
		newHashedPassword, err := utilities.HashPassword(updateUser.Password)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Could not hash password": updateUser.Password})
			return
		}

		user.Password = newHashedPassword
	}
	if updateUser.Email != "" {
		user.Email = updateUser.Email
	}
	//Can only give users admin permissions; cannot take away admin permissions.
	//Can't think of a way to allow permission removal, but I think it sort of makes sense to allow just permission granting and not permission removal.
	if updateUser.IsAdmin == true {
		user.IsAdmin = true
	}

	repository.UserDb.Save(&user)

	c.JSON(http.StatusAccepted, user)
}

func (repository *Repos) AdminGetAllUsers(c *gin.Context) {
	var getUsers models.GetUser
	err := c.ShouldBindJSON(&getUsers)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(getUsers.UserToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Ensure user is an admin
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

	var users []models.User
	err = repository.UserDb.Find(&users).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "No users were found in the database"})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (repository *Repos) AdminDeleteUser(c *gin.Context) {
	var deleteUser models.AdminDeleteUser
	err := c.ShouldBindJSON(&deleteUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Identify the user from the provided token
	secret := utilities.GoDotEnvVariable("TOKEN_SECRET")
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(deleteUser.AuthToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//Ensure user is an admin
	var admin models.User
	err = repository.UserDb.First(&admin, "username = ?", claims["Username"]).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !admin.IsAdmin {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": admin.ID})
		return
	}

	var users []models.User
	err = repository.UserDb.Find(&users, "username = ?", deleteUser.Username).Error

	if errors.Is(err, gorm.ErrRecordNotFound) || len(users) == 0 {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": deleteUser.Username})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var characters []models.Character
	err = repository.CharacterDb.Preload("Items").Find(&characters, "owner_id = ?", users[0].ID).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for j := 0; j < len(characters); j++ {
		repository.CharacterDb.Debug().Model(&characters[j]).Association("Items").Delete(&characters[j].Items)
	}

	err = repository.CharacterDb.Unscoped().Delete(&characters, "owner_id = ?", users[0].ID).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var user []models.User
	err = repository.UserDb.Unscoped().Delete(&user, "username = ?", deleteUser.Username).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, users[0])
}
