// Derived from example code at https://github.com/gin-gonic/gin
package main

import (
	"backend/router"
	"os"
)

func main() {
	//Run go run main.go test_db to connect to the test database even if not running tests. Useful for seeding test data.
	if len(os.Args) > 1 && os.Args[1] == "test_db" {
		router.PrepareRouter(true).Run()
	} else {
		router.PrepareRouter(false).Run()
	}
}
