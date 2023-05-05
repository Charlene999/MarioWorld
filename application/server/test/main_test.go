// Derived from example code at https://github.com/gin-gonic/gin
package test

import (
	"backend/router"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/go-playground/assert/v2"
)

// Entry point of the automated testing library
func TestMain(m *testing.M) {
	router.PrepareRouter(true)
	os.Exit(m.Run())
}

// Ping the server until it responds, then execute the rest of the unit tests
// Test based on documentation at https://gin-gonic.com/docs/testing/
func TestAvailability_200(t *testing.T) {
	res := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "hello", res.Body.String())
}
