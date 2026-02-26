# Real Estate Project

A full-stack real estate web application for listing, searching, and managing property listings. Built with a modern tech stack, this project demonstrates a robust implementation of authentication, listing management, image uploads, and user interaction.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

## Features
- User authentication (sign up, sign in, OAuth)
- Create, update, and delete property listings
- Image upload with Cloudinary integration
- Search and filter listings
- Contact property agents
- Responsive UI with Swiper image carousel
- Redux for state management

## Tech Stack
### Frontend
- **React** (Vite)
- **Redux Toolkit**
- **React Router**
- **Swiper.js** (image carousel)
- **Tailwind CSS** (utility-first styling)
- **Firebase** (for authentication)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose ODM)
- **Cloudinary** (image storage)
- **Multer** (file uploads)

## Project Structure
```
api/
  controllers/         # Express route controllers
  models/              # Mongoose models
  routes/              # Express routes
  utils/               # Utility modules (Cloudinary, Multer, error handling)
  server.js            # Express app entry point
  package.json         # Backend dependencies
  vercel.json          # Deployment config

client/
  public/              # Static assets
  src/
    assets/            # Images and static files
    components/        # Reusable React components
    pages/             # Main app pages (Home, Listing, Profile, etc.)
    redux/             # Redux store and slices
    firebase.js        # Firebase config
    main.jsx           # App entry point
    index.css          # Global styles
  package.json         # Frontend dependencies
  vite.config.js       # Vite config
  index.html           # HTML template
```

## Getting Started
### Prerequisites
- Node.js & npm
- MongoDB instance
- Cloudinary account
- Firebase project (for authentication)

### Backend Setup
1. Navigate to the `api` folder:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables (MongoDB URI, Cloudinary keys, etc.).
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file for Vite with your API URL and Firebase config.
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/signin` — User login
- `GET /api/listing/get/:id` — Get listing by ID
- `POST /api/listing/create` — Create a new listing
- `PUT /api/listing/update/:id` — Update a listing
- `DELETE /api/listing/delete/:id` — Delete a listing
- `POST /api/upload` — Upload images

## Screenshots
_Add screenshots of the UI here_

## License
This project is licensed under the MIT License.
