# Story telling app

Story telling app is a Node.js/TypeScript application designed to provide a multimedia storytelling and music platform for children and families. It features user and admin interfaces, authentication, subscription management, media upload/playback, and robust filtering and recommendation systems.

## Features

### User Features
- **Authentication**: Login, forgot password, and change password (with verification code)
- **Home**: Story recommendations (Children Stories, Featured Story, Popular Story)
- **Search & Filtering**: Filter by type (Story or Music), categories, artist length, children age, and language
- **Media Playback**: Play video/audio with speed and quality control, save to playlist
- **Playlist**: Manage and play saved stories or music
- **Profile**: Update personal information
- **Subscription**: Monthly and yearly plans

### Admin Features
- **Overview Dashboard**: View total users, active users, revenue, and subscriptions
- **Upload Content**: Upload stories/music with cover photo, file, country flag, name, singer, time, and description
- **User Management**: List, delete, block/unblock users (filter by status)
- **Subscription Management**: Manage all subscribers and subscription plans (basic, premium, family)
- **Policy Management**: Update privacy policy and terms & conditions
- **Notifications**: Send notifications during story watching

## Tech Stack
- **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose)
- **Authentication**: JWT
- **Media Handling**: Multer, Cloudinary
- **Email**: Nodemailer
- **Logging**: Winston, Morgan
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Yarn or npm
- MongoDB instance (local or cloud)
- [Optional] Docker & Docker Compose

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anonto42/Story-app.git
   cd Story-app
   ```
2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```
3. Copy `.env.sample` to `.env` and configure environment variables.
4. Build the project:
   ```bash
   yarn build
   # or
   npm run build
   ```
5. Start the server:
   ```bash
   yarn start
   # or
   npm start
   ```
   For development with auto-reload:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

### Using Docker
To run with Docker Compose:
```bash
  docker-compose up --build
```

## API Endpoints
- Base URL: `/api/v1`
- User: `/api/v1/user`
- Auth: `/api/v1/auth`
- Admin: `/api/v1/admin`

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

<!-- ## License
This project is licensed under the ISC License. -->

## Contact
For questions or support, please open an issue or contact the maintainer.
