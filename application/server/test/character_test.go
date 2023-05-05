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

func TestCreateCharacter_201(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero",
		"Description": "The most heroic hero in all of testing land",
		"Level": 50,
		"ClassType": 0,
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("POST", "/characters/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 201, res.Code)
	assert.Equal(t, "Test Hero", results.Name)
	assert.Equal(t, "The most heroic hero in all of testing land", results.Description)
	assert.Equal(t, uint(50), results.Level)
	assert.Equal(t, uint(0), results.ClassType)
	var spells []models.Spell
	assert.Equal(t, spells, results.Spells)
	var items []models.Item
	assert.Equal(t, items, results.Items)
}

func TestCreateCharacter_400(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "hi"
	}`)

	req, _ := http.NewRequest("POST", "/characters/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 400, res.Code)
}

func TestCreateCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero",
		"Description": "The most heroic hero in all of testing land",
		"Level": 50,
		"ClassType": 0,
		"OwnerToken": "definitely a legit token"
	}`)

	req, _ := http.NewRequest("POST", "/characters/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestGetCharacters_200(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("POST", "/characters/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	testHero := -1
	for i := 0; i < len(*results); i++ {
		if (*results)[i].Name == "Test Hero" {
			testHero = i
			break
		}
	}

	assert.NotEqual(t, testHero, -1)
	if testHero == -1 {
		return
	}

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "Test Hero", (*results)[testHero].Name)
	assert.Equal(t, "The most heroic hero in all of testing land", (*results)[testHero].Description)
	assert.Equal(t, uint(50), (*results)[testHero].Level)
	assert.Equal(t, uint(0), (*results)[testHero].ClassType)
}

func TestGetCharacters_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "A totally legit token"
	}`)

	req, _ := http.NewRequest("POST", "/characters/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestDeleteCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterID": 15
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, "Test Hero", results.Name)
	assert.Equal(t, "The most heroic hero in all of testing land", results.Description)
	assert.Equal(t, uint(50), results.Level)
	assert.Equal(t, uint(0), results.ClassType)
	var spells []models.Spell
	assert.Equal(t, spells, results.Spells)
	var items []models.Item
	assert.Equal(t, items, results.Items)
}

func TestDeleteCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "real token",
		"CharacterID": 2
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestDeleteCharacter_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterID": 4
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
}

func TestDeleteCharacter_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterID": 423545674735683568
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
}

func TestUpdateCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero - Updated Version",
		"Description": "The most heroic hero of all the heroic heroes in all of testing land!!!",
		"Level": 999,
		"ClassType": 10,
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterId": 4
	}`)

	req, _ := http.NewRequest("PUT", "/characters/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, "Test Hero - Updated Version", results.Name)
	assert.Equal(t, "The most heroic hero of all the heroic heroes in all of testing land!!!", results.Description)
	assert.Equal(t, uint(999), results.Level)
	assert.Equal(t, uint(10), results.ClassType)
}

func TestUpdateCharacter_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero - Updated Version",
		"Description": "The most heroic hero of all the heroic heroes in all of testing land!!!",
		"Level": 999,
		"ClassType": 10,
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterId": 4
	}`)

	req, _ := http.NewRequest("PUT", "/characters/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
}

func TestUpdateCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero - Updated Version",
		"Description": "The most heroic hero of all the heroic heroes in all of testing land!!!",
		"Level": 999,
		"ClassType": 10,
		"OwnerToken": "abc123 - a legit token",
		"CharacterId": 4
	}`)

	req, _ := http.NewRequest("PUT", "/characters/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestUpdateCharacter_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero - Updated Version",
		"Description": "The most heroic hero of all the heroic heroes in all of testing land!!!",
		"Level": 999,
		"ClassType": 10,
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterId": 4346346346346346
	}`)

	req, _ := http.NewRequest("PUT", "/characters/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
}

func TestRemoveItemFromCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterId": 4,
		"ItemId": 17
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removeitem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Item{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, uint(17), results.ID)
	assert.Equal(t, "Rock", results.Name)
	assert.Equal(t, "Completely useless.", results.Description)
	assert.Equal(t, uint(99), results.LevelReq)
	assert.Equal(t, uint(0), results.ClassReq)
}

func TestRemoveItemFromCharacter_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterId": 4,
		"ItemId": 17
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removeitem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
}

func TestRemoveItemFromCharacter_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterId": 44,
		"ItemId": 503245345
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removeitem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
}

func TestRemoveItemFromCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "invalid token",
		"CharacterId": 4,
		"ItemId": 17
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removeitem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestRemoveSpellFromCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterId": 4,
		"SpellId": 14
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removespell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Spell{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, uint(14), results.ID)
	assert.Equal(t, "Magic Missile", results.Name)
	assert.Equal(t, "Shoot a missile that has a 100% chance of killing the target upon a successful hit but has a 0% chance of hitting.", results.Description)
	assert.Equal(t, uint(1), results.LevelReq)
	assert.Equal(t, uint(5), results.ClassReq)
}

func TestRemoveSpellFromCharacter_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterId": 4,
		"SpellId": 14
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removespell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
}

func TestRemoveSpellFromCharacter_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterId": 44,
		"SpellId": 503563456346346
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removespell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
}

func TestRemoveSpellFromCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "invalid token",
		"CharacterId": 4,
		"SpellId": 14
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/removespell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestAddSpellToCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"SpellID": 4
	}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Item{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, uint(4), results.ID)
	assert.Equal(t, "Test spell", results.Name)
	assert.Equal(t, "It's the best spell", results.Description)
	assert.Equal(t, uint(2), results.LevelReq)
	assert.Equal(t, uint(5), results.ClassReq)
}

func TestAddSpellToCharacter_404_SpellNotFound(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"SpellID": 4000
	}`)

	res_err := []byte(`{"error":4000}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddSpellToCharacter_404_CharacterNotFound(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 1000,
		"SpellID": 4
	}`)

	res_err := []byte(`{"error":1000}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddSpellToCharacter_403_NotAdminOrOwner(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterID": 13,
		"SpellID": 4
	}`)

	res_err := []byte(`{"error":5}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddSpellToCharacter_403_ClassTypeRequirementNotMet(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"SpellID": 15
	}`)

	res_err := []byte(`{"error":"This spell is not available to this character's ClassType"}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddSpellToCharacter_403_LevelRequirementNotMet(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"SpellID": 16
	}`)

	res_err := []byte(`{"error":"This spell is not available to this character's Level"}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddSpellToCharacter_403_NeitherRequirementMet(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"SpellID": 17
	}`)

	res_err := []byte(`{"error":"This spell is not available to this character's ClassType and Level"}`)

	req, _ := http.NewRequest("POST", "/characters/addspell", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddItemToCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"ItemID": 4
	}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Item{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, uint(4), results.ID)
	assert.Equal(t, "Test item", results.Name)
	assert.Equal(t, "It's the best item", results.Description)
	assert.Equal(t, uint(2), results.LevelReq)
	assert.Equal(t, uint(5), results.ClassReq)
}

func TestAddItemToCharacter_404_ItemNotFound(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"ItemID": 4000
	}`)

	res_err := []byte(`{"error":4000}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddItemToCharacter_404_CharacterNotFound(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 1000,
		"ItemID": 4
	}`)

	res_err := []byte(`{"error":1000}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddItemToCharacter_403_NotAdminOrOwner(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterID": 13,
		"ItemID": 4
	}`)

	res_err := []byte(`{"error":5}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddItemToCharacter_403_ClassTypeRequirementNotMet(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"ItemID": 22
	}`)

	res_err := []byte(`{"error":"This item is not available to this character's ClassType"}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddItemToCharacter_403_LevelRequirementNotMet(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"ItemID": 21
	}`)

	res_err := []byte(`{"error":"This item is not available to this character's Level"}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}

func TestAddItemToCharacter_403_NeitherRequirementMet(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6IktlcnJ5VGVzdCJ9.J6SSAcIPtCO4wBdw8FSzKvusYrF34fF-WEsAvXM4MKc",
		"CharacterID": 13,
		"ItemID": 23
	}`)

	res_err := []byte(`{"error":"This item is not available to this character's ClassType and Level"}`)

	req, _ := http.NewRequest("POST", "/characters/additem", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
	assert.Equal(t, bytes.NewBuffer(res_err), res.Body)
}
