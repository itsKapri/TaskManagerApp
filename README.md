##Task Manager App

[Download APK](https://expo.dev/accounts/nilesh01/projects/TaskManagerApp/builds/3ccaae93-bbf0-4d56-ae08-27f06b00fd8b)

A full-stack task management application built with React Native (Expo) for the frontend and Node.js with MongoDB for the backend.


## Features

- User authentication (signup, login, logout)
- Task management (create, read, update, delete)
- JWT token-based authentication
- Clean and intuitive UI using React Native Paper

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB (local or cloud instance)

## Installation

### Frontend (React Native)

1. Clone the repository
```bash
git clone https://github.com/itsKapri/TaskManagerApp.git
cd TaskManagerApp
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure the API URL
- Open `src/api/api.js` and update the `API_URL` constant with your backend URL.

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Run on a device or emulator
- Scan the QR code with the Expo Go app on your device
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator

### Backend (Node.js, Express, MongoDB)

1. Setup the backend repository provided separately
2. Update the connection string in your backend to point to your MongoDB instance
3. Start the backend server

## Usage

1. Register a new account or log in with existing credentials
2. Create, view, edit, and delete tasks
3. Logout when finished
