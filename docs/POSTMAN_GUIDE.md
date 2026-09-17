# Postman Guide for Creator Platform API
## Setup

Install Postman from postman.com

Import the collection: docs/Creator-Platform-API.postman_collection.json

Import the environment: docs/Local-Development.postman_environment.json

Select "Local Development" environment in the top right

## Usage

Start your server: npm run server or docker-compose up

Run the Health Check request to verify the server is running

Run Register User to create a test account (token is auto-saved)

Run Login User to get a fresh token

Run any authenticated endpoint (token is automatically included)

## Request Organization

Health - Server health check

Auth - Registration and login

Posts - CRUD operations for posts

## Testing

Each request includes automated tests in the Tests tab. After sending a request, check the "Test Results" section.

## Variables

{{baseURL}} - Server URL (default: http://localhost:5000)

{{authToken}} - JWT token (auto-saved on login)
