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

func TestCreateUser_201(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Tester9999",
		"Username": "tester9999",
		"Email": "tester9999@gmail.com",
		"Password": "password"
	}`)

	req, _ := http.NewRequest("POST", "/users/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 201, res.Code)
	assert.Equal(t, "Tester9999", results.Name)
	assert.Equal(t, "tester9999", results.Username)
	assert.Equal(t, "tester9999@gmail.com", results.Email)
	assert.Equal(t, false, results.IsAdmin)
}

func TestCreateUser_409(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "A copy of Testing Admin",
		"Username": "testingadmin",
		"Email": "fail@gmail.com",
		"Password": "abc"
	}`)

	req, _ := http.NewRequest("POST", "/users/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 409, res.Code)
}

func TestCreateUser_400(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"FakeEntry": "this request is malformed"
	}`)

	req, _ := http.NewRequest("POST", "/users/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 400, res.Code)
}

func TestGetUser_200(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"UserToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("POST", "/users/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "Testing Admin", results.Name)
	assert.Equal(t, "testingadmin", results.Username)
	assert.Equal(t, "testing.admin@gmail.com", results.Email)
	assert.Equal(t, "$2a$10$OBbdUQsZQiVohVwG8AzyZeyvlZfNuyRH/NaSrgKFNAtv6v8B/K2JO", results.Password)
	assert.Equal(t, true, results.IsAdmin)
}

func TestGetUser_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"UserToken": "this is a totally legit token"
	}`)

	req, _ := http.NewRequest("POST", "/users/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestLogin_200(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Username": "testingadmin",
		"Password": "password"
	}`)

	req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	type GrabToken struct {
		Token string `json:"token"`
	}
	results := &GrabToken{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo", results.Token)
}

func TestLogin_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Username": "this user doesn't exist in our database",
		"Password": "passw0rd"
	}`)

	req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 404, res.Code)
}

func TestLogin_502(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Username": "testingadmin",
		"Password": "a very, very incorrect password"
	}`)

	req, _ := http.NewRequest("POST", "/users/login", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 502, res.Code)
}

func TestUpdateUser_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Billybob",
		"Email": "bob.billy@gmail.com",
		"Password": "a very secure password",
		"UserToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI"
	}`)

	req, _ := http.NewRequest("PUT", "/users/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, "Billybob", results.Name)
	assert.Equal(t, "bob.billy@gmail.com", results.Email)
	assert.Equal(t, "tester", results.Username)
	assert.Equal(t, false, results.IsAdmin)
}

func TestUpdateUser_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Billybob",
		"Email": "bob.billy@gmail.com",
		"Password": "a very secure password",
		"UserToken": "bad token"
	}`)

	req, _ := http.NewRequest("PUT", "/users/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 500, res.Code)
}

func TestUpdateUser_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Billybob",
		"Email": "bob.billy@gmail.com",
		"Password": "a very secure password",
		"UserToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vIn0.EVqDKOE9VVmhO0V6RG26Tj5SpzSTf8WJXcBwodbQDAA"
	}`)

	req, _ := http.NewRequest("PUT", "/users/update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 404, res.Code)
}

func TestAdminDeleteUser_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"Username": "tester9999"
	}`)

	req, _ := http.NewRequest("DELETE", "/users/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, "tester9999", results.Username)
}

func TestAdminDeleteUser_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "bad token",
		"Username": "Tester9999"
	}`)

	req, _ := http.NewRequest("DELETE", "/users/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 500, res.Code)
}

func TestAdminDeleteUser_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU",
		"Username": "Tester9999"
	}`)

	req, _ := http.NewRequest("DELETE", "/users/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 403, res.Code)
}

func TestAdminDeleteUser_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"Username": "Nonexistent user"
	}`)

	req, _ := http.NewRequest("DELETE", "/users/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 404, res.Code)
}

func TestAdminUpdateUser_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
    	"Username": "AdminUpdateUserTester",
    	"Email": "dontyoudaredeletemeorelse@smileyface.com",
    	"IsAdmin": true,
		"Name": "AdminUpdateUserTesterSupreme",
		"Password": "a very secure password"
	}`)

	req, _ := http.NewRequest("PUT", "/users/admin_update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, "AdminUpdateUserTesterSupreme", results.Name)
	assert.Equal(t, "dontyoudaredeletemeorelse@smileyface.com", results.Email)
	assert.Equal(t, "AdminUpdateUserTester", results.Username)
	assert.Equal(t, true, results.IsAdmin)
}

func TestAdminUpdateUser_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "bad token",
    	"Username": "AdminUpdateUserTester",
    	"Email": "dontyoudaredeletemeorelse@smileyface.com",
    	"IsAdmin": true,
		"Name": "AdminUpdateUserTesterSupreme",
		"Password": "a very secure password"
	}`)

	req, _ := http.NewRequest("PUT", "/users/admin_update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 500, res.Code)
}

func TestAdminUpdateUser_404(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
    	"Username": "A user that doesn't exist in the database",
    	"Email": "dontyoudaredeletemeorelse@smileyface.com",
    	"IsAdmin": true,
		"Name": "AdminUpdateUserTesterSupreme",
		"Password": "a very secure password"
	}`)

	req, _ := http.NewRequest("PUT", "/users/admin_update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 404, res.Code)
}

func TestAdminUpdateUser_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"AuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU",
    	"Username": "AdminUpdateUserTester",
    	"Email": "dontyoudaredeletemeorelse@smileyface.com",
    	"IsAdmin": true,
		"Name": "AdminUpdateUserTesterSupreme",
		"Password": "a very secure password"
	}`)

	req, _ := http.NewRequest("PUT", "/users/admin_update", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 403, res.Code)
}


func TestAdminGetAllUsers_200(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"UserToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("POST", "/users/getall", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "Testing Admin", (*results)[0].Name)
	assert.Equal(t, "testingadmin", (*results)[0].Username)
	assert.Equal(t, "testing.admin@gmail.com", (*results)[0].Email)
}

func TestAdminGetAllUsers_403(t *testing.T) {
	res := httptest.NewRecorder()

	// Non-admin token
	body := []byte(`{
		"UserToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5vbmFkbWludXNlciJ9.OK2EEMmBhkmZ65-aSeZiAMx40BYfGTH7h4lO4HBmkxU"
	}`)

	req, _ := http.NewRequest("POST", "/users/getall", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 403, res.Code)
}

func TestAdminGetAllUsers_500(t *testing.T) {
	res := httptest.NewRecorder()

	body := []byte(`{
		"UserToken":"bad token"
	}`)

	req, _ := http.NewRequest("POST", "/users/getall", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.User{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 500, res.Code)
}