# SafeChat - MERN Deep Learning

SafeChat is a secure, AI-driven chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) integrated with deep learning models to enhance user experience and security. The app includes features such as real-time messaging, and AI-based content moderation using deep learning models.

# 🛡️𝐒𝐨𝐥𝐯𝐢𝐧𝐠 𝐚 𝐌𝐚𝐣𝐨𝐫 𝐈𝐬𝐬𝐮𝐞: 𝐀𝐈 𝐈𝐦𝐚𝐠𝐞 𝐅𝐢𝐥𝐭𝐞𝐫𝐢𝐧𝐠 🛡️

One of the significant gaps in popular chat apps like WhatsApp, Instagram, and Meta's messenger is the absence of checks for inappropriate images sent as messages. SafeChat tackles this issue using deep learning.

**EfficientNet B0**: I utilized this advanced model for its efficiency and performance. Fine-tuned on 10,000 images across 5 classes (4 for inappropriate content and 1 for safe), I employed best practices like data augmentation, early stopping, and hyperparameter tuning to achieve around 90% accuracy. This ensures a safer chat environment.

**AI Model Integration**: Deployed as a Flask microservice, the model processes images in SafeChat. Unsafe images are filtered, but users can view them by clicking if needed.

# 🔥 𝐊𝐞𝐲 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬 𝐨𝐟 𝐒𝐚𝐟𝐞𝐂𝐡𝐚𝐭:

- **Real-Time Communication**: With WebSockets, SafeChat lets users see each other's online status, send messages, and manage friend lists in real-time. Add or remove friends, send or cancel friend requests.

- **Dynamic Group Chats**: Create and manage groups with real-time updates. Admins can add or remove members, and all actions reflect instantly. Admins are distinguished by an icon.

- **Enhanced Messaging**: Edit messages with an "edited" label and mark deleted messages as "deleted." Upload various file types (audio, video, images) for a richer chat experience.

- **Cloudinary Integration**: Used with Multer for efficient media management, with a file size limit of 5MB to maintain performance.

- **Optimized State Management**: Zustand in React ensures smooth performance with memoization and re-render prevention.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deep Learning**: Flask API with TensorFlow/PyTorch models for moderation
- **Real-time Communication**: Socket.io
- **Authentication**: JWT-based authentication

# Installation

## Prerequisites

- **Node.js** (v14.x or higher)
- **Python 3.x**
- **MongoDB** (local or cloud instance)
- **TensorFlow** (or any deep learning framework you are using)

## Backend Setup (Node.js)

1. Navigate to the `server` directory:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `server` directory with the following variables:

    ```env
    PORT=5000
    DB_URI=mongodb+srv://<username>:<password>@chatapp.oxchwhs.mongodb.net/db-chatapp?retryWrites=true&w=majority&appName=ChatApp
    JWT_SECRET=<JWT_SECRET_KEY>
    CLOUDINARY_URL=cloudinary://<cloudinary_key>
    cloud_name=<cloud_name>
    api_key=<cloud_api_key>
    api_secret=<cloud_api_secret>
    ```

4. Run the server:

    ```bash
    npm run dev
    ```

## Frontend Setup (React.js)

1. Navigate to the `client` directory:

    ```bash
    cd client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

## Deep Learning Models (Flask API)

1. Navigate to the `flask` directory:

    ```bash
    cd flask
    ```

2. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Run the Flask server:

    ```bash
    python app.py
    ```


## Folder Structure

```bash
SafeChat/
├── client/                # React frontend
│   ├── src/               # Source files for frontend
│   ├── public/            # Public assets for the React app
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend-specific documentation
├── server/                # Node.js backend
│   ├── controllers/       # API Controllers (handles logic for routes)
│   ├── models/            # Mongoose models (User, Chat, Messages)
│   ├── routes/            # Backend API routes (chat, user auth)
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files (DB, environment)
│   ├── middleware/        # Middleware for authentication, error handling
│   ├── server.js          # Entry point for the backend server
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend-specific documentation
├── flask/                 # Python Flask API for deep learning models
│   ├── models/            # Deep learning models (sentiment analysis, moderation)
│   ├── app.py             # Flask application entry point
│   ├── requirements.txt   # Python dependencies for Flask API
│   └── README.md          # Documentation for Flask API
├── package.json           # Root-level dependencies
└── README.md              # Project documentation

