# SkillMatch – Skill-Based Matchmaking EdTech Platform

SkillMatch is an interactive matchmaking platform built using the MERN stack that connects users based on the skills they want to learn and the skills they are able to teach. The platform is designed to make knowledge-sharing more personal and engaging by enabling users to form meaningful connections and learn directly from one another. Instead of functioning as a traditional learning portal, SkillMatch creates a community-driven environment where teaching and learning take place through direct interaction.

After creating an account, users set up a personalized skill profile that lists the skills they want to learn and the skills they can mentor. The system compares these profiles and generates a match rating based on overlapping teach-and-learn pairs, helping users discover relevant connections without manual searching. Once a suitable match is identified, users can view the other profile, check compatibility, and choose to initiate a connection.

When a connection is accepted, SkillMatch provides a dedicated real-time chatroom where users can exchange messages, share resources, schedule learning sessions, and collaborate effectively. This transforms the platform into an active learning space rather than only a matching system.

The application is built using React.js for the frontend, while Node.js and Express.js handle backend logic and API routing. MongoDB stores user details, skill profiles, connections, and chat history, and JWT-based authentication ensures secure access across the platform.

SkillMatch offers a more accessible and collaborative approach to learning by allowing users to teach what they know, learn what they aspire to, and build long-term connections based on shared interests and mutual benefit.

---

## Features

• Secure user authentication using JWT  
• Personalized skill profiles for both learning and teaching  
• Automated matchmaking based on overlapping skills  
• Profile browsing with compatibility insights  
• Connection request workflow (send, accept, manage)  
• Real-time chatrooms for active collaboration  
• Persistent data storage in MongoDB  
• Responsive UI built with React.js  

---

## Tech Stack

Frontend:
• React.js  
• React Router  
• Axios  
• Material UI and CSS  

Backend:
• Node.js  
• Express.js  
• Multer (optional file handling)  

Database:
• MongoDB  
• Mongoose ORM  

Security:
• JSON Web Tokens (JWT)  
• bcryptjs (password hashing)  
• dotenv (environment configuration)  

---

## Local Development – How to Run

1. Clone the repository:
   git clone <repo-url>

2. Start the frontend:
   cd client
   npm install
   npm start

3. Start the backend:
   cd server
   npm install
   node index.js

Backend requires a .env file with:
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000

---

## Deployment Instructions

Deploying the backend (Node.js + Express):

1. Push the project to GitHub  
2. Use a hosting platform such as Render or Railway  
3. Select the /server directory  
4. Set the start command:
   node index.js  
5. Add environment variables:
   MONGO_URI
   JWT_SECRET
   PORT  
6. Deploy and copy the backend URL (example):
   https://skillmatch-api.example.com

Deploying the frontend (React):

1. Build the production bundle:
   cd client
   npm install
   npm run build

2. Deploy the build folder using Netlify or Vercel:
   Netlify:
   • Build command: npm run build
   • Publish directory: client/build

   Vercel:
   • Root directory: client
   • Build command: npm run build
   • Output directory: build

3. Set the API base URL:
   REACT_APP_API_BASE_URL=https://skillmatch-api.example.com

Use it in the frontend via:
process.env.REACT_APP_API_BASE_URL

---
