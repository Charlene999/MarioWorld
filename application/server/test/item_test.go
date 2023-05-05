// Derived from example code at https://github.com/gin-gonic/gin
package test

import (
	"backend/models"
	"backend/router"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-playground/assert/v2"
)

func TestCreateItem_201(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"Name": "Test item",
		"Description": "It's the best item",
		"LevelReq": 2,
		"ClassReq": 5
	}`)

	req, _ := http.NewRequest("POST", "/items/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Item{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 201, res.Code)
	assert.Equal(t, "Test item", results.Name)
	assert.Equal(t, "It's the best item", results.Description)
	assert.Equal(t, uint(2), results.LevelReq)
	assert.Equal(t, uint(5), results.ClassReq)
}

func TestCreateItem_500(t *testing.T) {
	res := httptest.NewRecorder()

	// The token is for a non-existent user, will cause a 500 failure
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImtlcnJ5c3VlaCJ9.Zq0UK61gdfrC7LA8Azuw1Y4w857GavixVhocqCmpGUQ",
		"Name": "Test item",
		"Description": "It's the best item",
		"LevelReq": 2,
		"ClassReq": 5
	}`)

	req, _ := http.NewRequest("POST", "/items/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 500, res.Code)
}

func TestCreateItem_403(t *testing.T) {
	res := httptest.NewRecorder()

	// The token is for an existing non-admin user, will cause a 403 forbidden status
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU",
		"Name": "Test item",
		"Description": "It's the best item",
		"LevelReq": 2,
		"ClassReq": 5
	}`)

	req, _ := http.NewRequest("POST", "/items/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 403, res.Code)
}

func TestGetItems_200(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{}`)

	req, _ := http.NewRequest("POST", "/items/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.Item{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "New name", (*results)[0].Name)
	assert.Equal(t, "New description", (*results)[0].Description)
	assert.Equal(t, uint(3), (*results)[0].LevelReq)
	assert.Equal(t, uint(5), (*results)[0].ClassReq)
}

func TestDeleteItem_202(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"ItemID": 1
	}`)

	req, _ := http.NewRequest("DELETE", "/items/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 202, res.Code)
}

func TestDeleteItem_500(t *testing.T) {
	res := httptest.NewRecorder()

	// non-existent user token
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImtlcnJ5c3VlaCJ9.Zq0UK61gdfrC7LA8Azuw1Y4w857GavixVhocqCmpGUQ",
		"ItemID": 1
	}`)

	req, _ := http.NewRequest("DELETE", "/items/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 500, res.Code)
}

func TestDeleteItem_403(t *testing.T) {
	res := httptest.NewRecorder()

	// non-admin token
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU",
		"ItemID": 1
	}`)

	req, _ := http.NewRequest("DELETE", "/items/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 403, res.Code)
}

func TestUpdateItem_202(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"Name":"New name",
		"Description":"New description",
		"LevelReq":3,
		"ItemID":2,
		"AdminToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("PUT", "/items/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 202, res.Code)
}

func TestGetFilteredItems_200(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"ClassReq":5
	}`)

	req, _ := http.NewRequest("POST", "/items/getfiltered", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, uint(5), (*results)[0].ClassReq)
}
