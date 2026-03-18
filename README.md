# Creators Platform - MERN Stack Application

A full-stack content management platform built with the MERN (MongoDB, Express, React, Node.js) stack. This application allows users to register, login, and manage their creative posts with full CRUD functionality.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with persistent login state.
- **Protected Routes**: Frontend and backend routes secured from unauthorized access.
- **Content Management**: Complete CRUD operations (Create, Read, Update, Delete) for user posts.
- **Pagination**: Scalable content delivery with server-side pagination.
- **Global State Management**: React Context API for managing authentication and user data.
- **Centralized Error Handling**: Consistent error responses from the backend and toast notifications on the frontend.
- **Professional UI**: Responsive design with a focus on user experience and visual aesthetics.

## Technology Stack

- **Frontend**: React, React Router, Axios, React Toastify.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ORM.
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## Setup Instructions

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory and add the following variable:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/users/register` - Register new user

### Posts (Protected)
- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## License

MIT
