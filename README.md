# CEN3031 Software Engineering Group Project

# Project Name - Mario World
     

## Project Description
The Mario World application is a Mario inspired website designed to supplement Mario players' games by offering a platform on which to create and keep track of characters and their classes and items. After signing up, a user can create as many characters as they would like, selecting a name, class, level, description, etc. for each new character. These character's attributes can be updated at any time.     

As a game plays out, one might wish to keep track of any items and abilities that a character has obtained. Users can select items to add to a character from a list of items available only to that character's class and level. Complete lists of items are also available for users to view. Search bars and filters for items by class are available to help users more quickly identify what items they want to add to their character.     

To provide customizability and flexibility, the application has special admin users who can add, update, and remove items that users can select from. Administrators can also update or delete users as necessary.        

A technology stack consisting of MySQL for the database, Go (with GORM and gin-gonic) for the backend API, and Angular for the frontend was used to develop the application.

## Getting Started
Frontend is located in application/src.            
Backend is located in application/server.            

### Required Technologies            
Install Node.js and NPM from https://nodejs.org/en/ (Note: NPM is typically included with Node.js).            
Install Go from https://go.dev/dl/.            

### Initial Project Setup            
Run `git clone https://github.com/Charlene999/CEN3031-The-Perfect-Path.git` from a terminal or command line pathed into a designated folder.            
Change directory into the newly created CEN3031-The-Perfect-Path folder/application.             

### Frontend Setup                    
Run `npm install -g @angular/cli`.                
Run `npm install`.                             
Run the frontend using the command `npm start` (Make sure you are within the application directory).            
            
### Backend Setup            
Change directory into server.            
Run `touch .env`.            
Enter the following three lines into the .env file and replace with your chosen SQL database information:            
&emsp;   `DB_USERNAME=replacethiswithdatabaseusername`            
&emsp;   `DB_PASSWORD=replacethiswithdatabasepassword`            
&emsp;   `TOKEN_SECRET=replacethiswithdatabasetokenpassword`            
Copy this .env file into application/server/test in addition to storing it in application/server.          
Run `go mod download`.           
Run the backend using the command `go run main.go` (Make sure you are within the application/server directory).            
Run backend tests using the command `go test backend/test` (Make sure you are within the application/server directory).
