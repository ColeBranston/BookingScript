# Node.js + Express.js Backend

This is an Express.js Backend for my dashboard that provides basic routes for login validation and entry storage with CRUD endpoints.

Utilizes a mongoDB database deployed on MongoAtlas for easy entry storage

### Env Keys (Port Key is unnecessary)

Looks as follows:

---

    MONGO_URI=""
    password=""
    PORT=""

---

where:

**MONGO_URI** is the mongo connection string
**password** is the single password used to validate users

and **PORT** is the port although its not neccessary cause vercel handles the port forwarding

# Run

---

npm install
node server.js

---
