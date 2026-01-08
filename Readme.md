<p align="center">
  <img src="https://img.shields.io/badge/DevTube-Video%20Platform-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="DevTube Logo"/>
</p>

<h1 align="center">🎬 DevTube</h1>

<p align="center">
  <strong>A robust, production-ready video sharing platform backend API built for developers</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
</p>

---

## 📋 Table of Contents

- [Roadmap](#-roadmap)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
- [Data Models](#-data-models)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Future Vision](#-future-vision)
- [Author](#-author)

---

## 🚧 Roadmap

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Completed-success?style=for-the-badge" alt="Backend Completed"/>
  <img src="https://img.shields.io/badge/Frontend-Coming%20Soon-yellow?style=for-the-badge" alt="Frontend Coming Soon"/>
  <img src="https://img.shields.io/badge/Full%20Stack-In%20Progress-blue?style=for-the-badge" alt="Full Stack In Progress"/>
</p>

> 🎉 **Exciting News!** A modern, responsive frontend is currently in development and will be integrated soon, transforming DevTube into a **production-ready full-stack application**!

### Upcoming Frontend Features
- 🎨 Modern UI with responsive design
- 🌙 Dark/Light theme support
- 📱 Mobile-first approach
- ⚡ Optimized video streaming player
- 🔍 Advanced search and filtering
- 📊 Creator dashboard with analytics
- 🔔 Real-time notifications

---

## 🎯 Overview

**DevTube** is a comprehensive video sharing platform backend that mirrors core functionalities of YouTube. Built with scalability and performance in mind, it provides a complete REST API for managing users, videos, playlists, subscriptions, comments, likes, and community posts (tweets).

Whether you're building a video streaming platform, e-learning portal, or content sharing application, DevTube provides the solid foundation you need.

> 💡 **Note**: This repository currently contains the backend API. The frontend will be added soon to complete the full-stack experience!

---

## ✨ Features

### 👤 User Management
- User registration with avatar and cover image upload
- Secure authentication using JWT (Access & Refresh tokens)
- Password encryption with bcrypt
- Profile management and updates
- Watch history tracking
- Channel profile with subscriber counts

### 🎥 Video Management
- Video upload with thumbnail support
- Large file upload support via Cloudinary
- Video metadata management (title, description)
- Publish/unpublish toggle functionality
- Paginated video listings
- View count tracking

### 📝 Playlist Management
- Create and manage playlists
- Add/remove videos from playlists
- User-specific playlist retrieval

### 💬 Comments System
- Add comments to videos
- Edit and delete comments
- Paginated comment retrieval

### ❤️ Like System
- Like/unlike videos
- Like/unlike comments
- Like/unlike tweets
- Retrieve all liked videos

### 📢 Subscription System
- Subscribe/unsubscribe to channels
- View channel subscribers
- View subscribed channels

### 🐦 Community Posts (Tweets)
- Create community posts
- Update and delete posts
- User-specific post retrieval

### 📊 Dashboard & Analytics
- Channel statistics (total videos, subscribers, likes)
- Channel video management

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB with Mongoose 9.x |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcrypt |
| **File Upload** | Multer |
| **Cloud Storage** | Cloudinary |
| **Pagination** | mongoose-aggregate-paginate-v2 |
| **Environment** | dotenv |
| **Development** | Nodemon, Prettier |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Request                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express Application                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    CORS     │  │   Cookie    │  │     JSON/URL Parser     │  │
│  │ Middleware  │  │   Parser    │  │       Middleware        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Routes Layer                           │
│  /api/v1/users │ /api/v1/videos │ /api/v1/playlists │ ...      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Middleware Layer                          │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │   Auth (JWT)    │  │         Multer (File Upload)        │   │
│  └─────────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Controllers Layer                          │
│  Business logic, request validation, response formatting        │
└─────────────────────────────────────────────────────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
┌─────────────────────────────┐     ┌─────────────────────────────┐
│        MongoDB Atlas        │     │        Cloudinary           │
│    (Database Storage)       │     │    (Media Storage)          │
└─────────────────────────────┘     └─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devtube.git
   cd devtube
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Variables](#environment-variables))

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the API**
   ```
   http://localhost:8000/api/v1
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
CORS_ORIGIN=*

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# JWT Configuration
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

> ⚠️ **Important**: Never commit your `.env` file to version control. Add it to `.gitignore`.

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All protected routes require a valid JWT token. Include the token in:
- **Cookie**: `accessToken`
- **Header**: `Authorization: Bearer <token>`

---

### 👤 User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/users/register` | Register a new user | ❌ |
| `POST` | `/users/login` | Login user | ❌ |
| `POST` | `/users/logout` | Logout user | ✅ |
| `POST` | `/users/refresh-token` | Refresh access token | ❌ |
| `POST` | `/users/change-password` | Change password | ✅ |
| `GET` | `/users/current-user` | Get current user | ✅ |
| `PATCH` | `/users/update-account` | Update account details | ✅ |
| `PATCH` | `/users/avatar` | Update avatar | ✅ |
| `PATCH` | `/users/coverImage` | Update cover image | ✅ |
| `GET` | `/users/c/:username` | Get channel profile | ✅ |
| `GET` | `/users/watchHistory` | Get watch history | ✅ |

#### Register User
```http
POST /api/v1/users/register
Content-Type: multipart/form-data
```
**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullname` | string | ✅ | User's full name |
| `email` | string | ✅ | User's email |
| `username` | string | ✅ | Unique username |
| `password` | string | ✅ | User's password |
| `avatar` | file | ✅ | Profile picture |
| `coverImage` | file | ❌ | Cover image |

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json
```
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

---

### 🎥 Video Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/videos` | Get all videos (paginated) | ✅ |
| `POST` | `/videos` | Upload a new video | ✅ |
| `GET` | `/videos/:videoId` | Get video by ID | ✅ |
| `PATCH` | `/videos/:videoId` | Update video | ✅ |
| `DELETE` | `/videos/:videoId` | Delete video | ✅ |
| `PATCH` | `/videos/toggle/publish/:videoId` | Toggle publish status | ✅ |

#### Upload Video
```http
POST /api/v1/videos
Content-Type: multipart/form-data
```
**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Video title |
| `description` | string | ✅ | Video description |
| `videoFile` | file | ✅ | Video file |
| `thumbnail` | file | ✅ | Thumbnail image |

---

### 📝 Playlist Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/playlists` | Create playlist | ✅ |
| `GET` | `/playlists/:playlistId` | Get playlist by ID | ✅ |
| `PATCH` | `/playlists/:playlistId` | Update playlist | ✅ |
| `DELETE` | `/playlists/:playlistId` | Delete playlist | ✅ |
| `PATCH` | `/playlists/add/:videoId/:playlistId` | Add video to playlist | ✅ |
| `PATCH` | `/playlists/remove/:videoId/:playlistId` | Remove video from playlist | ✅ |
| `GET` | `/playlists/user/:userId` | Get user playlists | ✅ |

---

### 💬 Comment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/comments/:videoId` | Get video comments | ✅ |
| `POST` | `/comments/:videoId` | Add comment | ✅ |
| `PATCH` | `/comments/c/:commentId` | Update comment | ✅ |
| `DELETE` | `/comments/c/:commentId` | Delete comment | ✅ |

---

### ❤️ Like Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/likes/toggle/v/:videoId` | Toggle video like | ✅ |
| `POST` | `/likes/toggle/c/:commentId` | Toggle comment like | ✅ |
| `POST` | `/likes/toggle/t/:tweetId` | Toggle tweet like | ✅ |
| `GET` | `/likes/videos` | Get liked videos | ✅ |

---

### 📢 Subscription Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/subscriptions/c/:channelId` | Toggle subscription | ✅ |
| `GET` | `/subscriptions/c/:channelId` | Get channel subscribers | ✅ |
| `GET` | `/subscriptions/u/:subscriberId` | Get subscribed channels | ✅ |

---

### 🐦 Tweet Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/tweets` | Create tweet | ✅ |
| `GET` | `/tweets/user/:userId` | Get user tweets | ✅ |
| `PATCH` | `/tweets/:tweetId` | Update tweet | ✅ |
| `DELETE` | `/tweets/:tweetId` | Delete tweet | ✅ |

---

### 📊 Dashboard Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/dashboard/stats` | Get channel stats | ✅ |
| `GET` | `/dashboard/videos` | Get channel videos | ✅ |

---

### Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

---

## 📊 Data Models

### User Model
```javascript
{
  username: String,      // unique, lowercase, indexed
  email: String,         // unique, lowercase
  fullname: String,      // indexed
  password: String,      // hashed with bcrypt
  avatar: String,        // Cloudinary URL
  coverImage: String,    // Cloudinary URL
  watchHistory: [ObjectId],  // references Video
  refreshToken: String
}
```

### Video Model
```javascript
{
  videoFile: String,     // Cloudinary URL
  thumbnail: String,     // Cloudinary URL
  title: String,
  description: String,
  duration: Number,      // from Cloudinary
  views: Number,         // default: 0
  isPublished: Boolean,  // default: true
  owner: ObjectId,       // references User
  comments: [ObjectId]   // references Comment
}
```

### Playlist Model
```javascript
{
  name: String,
  description: String,
  videos: [ObjectId],    // references Video
  owner: ObjectId        // references User
}
```

### Comment Model
```javascript
{
  content: String,
  video: ObjectId,       // references Video
  owner: ObjectId        // references User
}
```

### Like Model
```javascript
{
  video: ObjectId,       // references Video (optional)
  comment: ObjectId,     // references Comment (optional)
  tweet: ObjectId,       // references Tweet (optional)
  likedBy: ObjectId      // references User
}
```

### Subscription Model
```javascript
{
  subscriber: ObjectId,  // references User
  channel: ObjectId      // references User
}
```

### Tweet Model
```javascript
{
  content: String,
  owner: ObjectId        // references User
}
```

---

## 📁 Project Structure

```
devtube/
├── public/
│   └── temp/              # Temporary file storage
├── src/
│   ├── controllers/       # Route handlers
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── db/
│   │   └── index.js       # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── multer.middleware.js  # File upload config
│   ├── models/            # Mongoose schemas
│   │   ├── comment.models.js
│   │   ├── like.models.js
│   │   ├── playlist.models.js
│   │   ├── subscriptions.models.js
│   │   ├── tweet.models.js
│   │   ├── user.models.js
│   │   └── video.models.js
│   ├── routes/            # API routes
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── utils/             # Utility functions
│   │   ├── apiError.js    # Custom error class
│   │   ├── ApiResponse.js # Response formatter
│   │   ├── asyncHandler.js # Async error handler
│   │   └── fileUpload.js  # Cloudinary utilities
│   ├── app.js             # Express app setup
│   ├── constants.js       # App constants
│   └── index.js           # Entry point
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Security

DevTube implements several security best practices:

- **Password Hashing**: All passwords are hashed using bcrypt with a cost factor of 10
- **JWT Authentication**: Dual token system (access + refresh tokens) for secure session management
- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **CORS Configuration**: Configurable CORS origin for controlled API access
- **Input Validation**: Request validation to prevent injection attacks
- **File Type Validation**: Multer configuration for secure file uploads
- **Environment Variables**: Sensitive data stored in environment variables

### Recommended Production Enhancements

- [ ] Add rate limiting (express-rate-limit)
- [ ] Implement helmet.js for security headers
- [ ] Add request sanitization (express-mongo-sanitize)
- [ ] Enable HTTPS in production
- [ ] Implement logging (Winston/Morgan)
- [ ] Add API documentation (Swagger/OpenAPI)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Soubhik Halder**

- GitHub: [@aizen2006](https://github.com/aizen2006)
- LinkedIn: [Soubhik Halder ](https://www.linkedin.com/in/soubhik-halder-9382ab363/)

---

---

## 🔮 Future Vision

DevTube is evolving into a complete full-stack video platform. Here's what's planned:

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Complete | Backend API Development |
| **Phase 2** | 🔄 In Progress | Frontend Development |
| **Phase 3** | 📅 Planned | Testing & Optimization |
| **Phase 4** | 📅 Planned | Production Deployment |

### Tech Stack (Full-Stack)

**Current (Backend):**
- Node.js, Express.js, MongoDB, Cloudinary, JWT

**Planned (Frontend):**
- React.js / Next.js
- Tailwind CSS / Styled Components
- Redux / Context API for state management
- Video.js for video player

Stay tuned for updates! ⭐ **Star and watch this repository** to get notified when the frontend drops!

---

<p align="center">
  <strong>⭐ Star this repository if you found it helpful!</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Ready-success?style=flat-square" alt="Backend Ready"/>
  <img src="https://img.shields.io/badge/Frontend-Coming%20Soon-yellow?style=flat-square" alt="Frontend Coming Soon"/>
</p>

<p align="center">
  Made with ❤️ by Soubhik Halder
</p>
