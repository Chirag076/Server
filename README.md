# 🚀 Simple Server (Node.js + Express)

A lightweight and scalable backend server built using **Node.js** and **Express.js**.  
This server can handle multiple API routes and is structured in a way that allows you to add more endpoints easily.  
It includes CORS support, 404 handling, deployment setup, and PM2 support for running in production.

---

## 🌐 Live Server URL

👉 **https://server-ogr2.onrender.com/**

---

## 📌 Features

* Add two numbers using query parameters
* CORS enabled
* Clean Express routing
* 404 route handling
* Ready for Render deployment
* PM2 support (local forever-running server)

---

# 🛣️ **Detailed Route Explanation**

## 1️⃣ **GET /** — Health Check

`GET /`

### ✔ Purpose:
To check if the server is running.

### ✔ How it works:
When you open this in browser, the server returns a plain text message.

### ✔ Response:
`Server is running`

---

## 2️⃣ **GET /add** — Add Two Numbers

`GET /add?a=<number>&b=<number>`

### ✔ Purpose:
To calculate and return the sum of two numbers.

### ✔ How it works:
* It reads `a` and `b` from the URL query parameters
* Converts them into numbers (`parseInt`)
* Adds them
* Returns the result as **plain text**

### ✔ Example Request:
`https://server-ogr2.onrender.com/add?a=10&b=20`

### ✔ Example Response:
`30`

### ✔ What if numbers are missing?

> **Request:** `/add?a=&b=`
> **Result:** `0`

---

## 3️⃣ **404 Handler**

If the user visits any unknown route like:

`/xyz`

The server returns:
```json
{
  "message": "Route not found"
}

```
---
# 🧪 **Local Development Setup**
## 1️⃣ Clone The Repository

```bash
git clone https://github.com/Chirag076/Server.git
cd Server
```
## 2️⃣ Install dependencies

```bash
npm install
```
## 3️⃣ Start server locally

```bash
node Server.js
```
### Server runs at:

```md
http://localhost:3000
```

## 👤 Author

**Chirag Chhabra**  
📌 GitHub: [https://github.com/Chirag076](https://github.com/Chirag076)  
📧 Email: **chiragchhabrahmo@gmail.com**

---

## ⭐ Support

If you like this project, please consider giving it a **⭐ star on the repository** — it motivates me to build more open-source projects!

