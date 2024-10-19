# Rule Engine with AST (Abstract Syntax Tree)

The Rule Engine with AST (Abstract Syntax Tree) is a powerful tool for managing and evaluating complex rules in a structured and efficient manner. It provides a flexible and extensible framework for creating, combining, and evaluating rules using a tree-like data structure called an Abstract Syntax Tree (AST).

## 🌟 Features


- Rule Creation: Create and save new rules with a unique name and a rule string.
- Rule Combination: Combine multiple rules using logical operators such as AND and OR.
- Rule Evaluation: Evaluate rules against a given data set and obtain the result.
- Rule Management: Retrieve, update, and delete rules from the database.

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git


## 🏗️ Project Structure

```
weather-monitoring/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── node_modules/
|   └── routes/
└── frontend/
    ├── src/
    │   ├── app.jsx
    │   └── components/
    ├── package.json
    └── node_modules/
```

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/SanjayChoodamani/AST
cd weather-monitoring
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm init -y
npm install 

# Start the server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install additional dependencies
npm install 

# Start the development server
npm run dev
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the backend directory:
```env
MONGO_URI=Mongodburl
PORT=5000
```

### Frontend Configuration

1. Configure the API endpoint in the frontend application:
```javascript
const API_URL = 'http://localhost:3000/api';
```


## 🏃‍♂️ Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application at: `http://localhost:5713`


## 💾 Data Storage

The application uses MongoDB atlas for data storage. 

## 📦 Dependencies

### Backend Dependencies
```json
{
  "dependencies": {
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "mongoose": "^8.7.2"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "lucide-react": "^0.453.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

Made with ❤️ by Sanjay B S