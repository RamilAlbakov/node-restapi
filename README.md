# node-restapi

This project presents REST API with Node, Express, PostgreSql.

## Settings

Install Node, Express, PostgreeSql

Create database node_restapi and below tables inside:

    CREATE TABLE users (
        id INT PRIMARY KEY,
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        age INT,
        isfree BOOLEAN,
        createdat DATE DEFAULT CURRENT_DATE,
        updatedat DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE books (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        author VARCHAR(255),
        createdat DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE users_books (
        user_id INT,
        book_id INT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE,
        PRIMARY KEY(user_id, book_id)
    );

Clone the current repository

Install all dependencies by command:

    Make install

Create .env file in the root of project with username, passqord and port for your db.

## Usage

Use the command below to run server:

    Make devstart

Use the Postman to test the application

Urls for application:

    Get all users: localhost:3000/api/users
    Get user by id: localhost:3000/api/users/<userId>
    Add user by POST method: localhost:3000/api/users
    Update user by PUT method: localhost:3000/api/users/<userId>
    Delete user by DELETE method: localhost:3000/api/users/<userId>

Use Json format for adding or updatig user:

    {
        "id": 1,
        "firstname": "Sasha",
        "lastname": "Adams",
        "age": 30,
        "isfree": true,
        "books": [
            {
                "id": 10,
                "title": "Some book",
                "author": "Some author"
            }
        ]
    }
