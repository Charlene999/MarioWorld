package controllers

import (
	"github.com/gin-gonic/gin"
)

// Used to test the availability of the server
// Based on documentation at https://gin-gonic.com/docs/testing/
// Implements functionality for the ping test endpoint. Try it out by visiting http://localhost:8080/ping
func Ping(c *gin.Context) {
	c.String(200, "hello")
}
