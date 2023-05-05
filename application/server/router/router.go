package router

import (
	"backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var Router = gin.Default()

func PrepareRouter(test bool) *gin.Engine {
	//Using documentation at github.com/gin-contrib/cors
	var config = cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:4200"}

	Router.Use(cors.New(config))

	repos := controllers.New(test)
	Router.GET("/ping", controllers.Ping)

	Router.POST("/users/create", repos.CreateUser)
	Router.POST("/users/get", repos.GetUser)
	Router.POST("/users/login", repos.LogIn)
	Router.PUT("/users/update", repos.UpdateUser)
	Router.POST("/users/getall", repos.AdminGetAllUsers)
	Router.PUT("/users/admin_update", repos.AdminUpdateUser)
	Router.DELETE("/users/delete", repos.AdminDeleteUser)

	Router.POST("/characters/create", repos.CreateCharacter)
	Router.POST("/characters/get", repos.GetCharacters)
	Router.DELETE("/characters/delete", repos.DeleteCharacter)
	Router.PUT("/characters/update", repos.UpdateCharacter)
	Router.POST("/characters/additem", repos.AddItemToCharacter)
	Router.DELETE("/characters/removeitem", repos.RemoveItemFromCharacter)

	Router.POST("/items/create", repos.CreateItem)
	Router.POST("/items/get", repos.GetItems)
	Router.DELETE("/items/delete", repos.DeleteItem)
	Router.PUT("/items/update", repos.UpdateItem)
	Router.POST("/items/getfiltered", repos.GetFilteredItems)

	return Router
}
