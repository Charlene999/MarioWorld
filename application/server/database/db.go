package database

import (
	"fmt"

	"backend/utilities"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDb(test bool) *gorm.DB {
	Db = connectDB(test)
	return Db
}

func connectDB(test bool) *gorm.DB {
	var err error
	dbUser := utilities.GoDotEnvVariable("DB_USERNAME")
	dbPass := utilities.GoDotEnvVariable("DB_PASSWORD")
	dsn := fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/PerfectPath?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass)

	if test {
		fmt.Println("Connection switched to TESTING database")
		//dsn = fmt.Sprintf("%s:%s@tcp(theperfectpath.cot5mnpozher.us-east-2.rds.amazonaws.com)/perfectpathtesting?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass)
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Error connecting to database")
	} else {
		fmt.Println("Connected to database")
	}

	return db
}
