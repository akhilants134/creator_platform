# Server

Express API for the creator platform.

## Scripts

From the `server/` directory:

```bash
npm run dev
```

## Required Environment Variables

Create a `.env` file in `server/` with at least:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Endpoints

- `GET /` - welcome message
- `GET /api/health` - health check
- `POST /api/users/register` - register a user
- `POST /api/users/login` - login a user
- `POST /api/users/change-password` - change the authenticated user's password
- `GET /api/posts` - list posts
- `GET /api/posts/:id` - get a post by id
- `POST /api/posts` - create a post with image upload
- `PUT /api/posts/:id` - update a post
- `DELETE /api/posts/:id` - delete a post

## Notes

- Authentication uses JWT bearer tokens.
- Image uploads are handled through Cloudinary middleware.
