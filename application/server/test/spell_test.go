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

func TestCreateSpell_201(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"Name": "Test spell",
		"Description": "It's the best spell",
		"LevelReq": 2,
		"ClassReq": 5
	}`)

	req, _ := http.NewRequest("POST", "/spells/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 201, res.Code)
	assert.Equal(t, "Test spell", results.Name)
	assert.Equal(t, "It's the best spell", results.Description)
	assert.Equal(t, uint(2), results.LevelReq)
	assert.Equal(t, uint(5), results.ClassReq)
}

func TestCreateSpell_500(t *testing.T) {
	res := httptest.NewRecorder()

	// non-existent user token
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImtlcnJ5c3VlaCJ9.Zq0UK61gdfrC7LA8Azuw1Y4w857GavixVhocqCmpGUQ",
		"Name": "Test spell",
		"Description": "It's the best spell",
		"LevelReq": 2,
		"ClassReq": 5
	}`)

	req, _ := http.NewRequest("POST", "/spells/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 500, res.Code)
}

func TestCreateSpell_403(t *testing.T) {
	res := httptest.NewRecorder()

	// non-admin token
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU",
		"Name": "Test spell",
		"Description": "It's the best spell",
		"LevelReq": 2,
		"ClassReq": 5
	}`)

	req, _ := http.NewRequest("POST", "/spells/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 403, res.Code)
}

func TestGetSpells_200(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{}`)

	req, _ := http.NewRequest("POST", "/spells/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "New name", (*results)[0].Name)
	assert.Equal(t, "New description", (*results)[0].Description)
	assert.Equal(t, uint(3), (*results)[0].LevelReq)
	assert.Equal(t, uint(5), (*results)[0].ClassReq)
}

func TestDeleteSpell_202(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"SpellID": 1
	}`)

	req, _ := http.NewRequest("DELETE", "/spells/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 202, res.Code)
}

func TestDeleteSpell_500(t *testing.T) {
	res := httptest.NewRecorder()

	// non-existent user token
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImtlcnJ5c3VlaCJ9.Zq0UK61gdfrC7LA8Azuw1Y4w857GavixVhocqCmpGUQ",
		"SpellID": 1
	}`)

	req, _ := http.NewRequest("DELETE", "/spells/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 500, res.Code)
}

func TestDeleteSpell_403(t *testing.T) {
	res := httptest.NewRecorder()

	// non-admin token
	body := []byte(`{
		"AdminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU",
		"SpellID": 1
	}`)

	req, _ := http.NewRequest("DELETE", "/spells/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 403, res.Code)
}

func TestUpdateSpell_202(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"Name":"New name",
		"Description":"New description",
		"LevelReq":3,
		"SpellID":2,
		"AdminToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("PUT", "/spells/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	json.NewDecoder(res.Body).Decode(res)

	assert.Equal(t, 202, res.Code)
}

func TestGetFilteredSpells_200(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"LevelReq":2
	}`)

	req, _ := http.NewRequest("POST", "/spells/getfiltered", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, uint(2), (*results)[0].LevelReq)
}
