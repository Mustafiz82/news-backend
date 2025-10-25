
# 📰 News API – REST Usage Guide

This API provides endpoints to manage and fetch news articles and categories with pagination, filtering, and auto view tracking.

---

## 🧠 Base URL

```
https://news-backend-chi-livid.vercel.app/
```

---

## 📰 NEWS ROUTES

### ➕ Create News
**POST** `/news`

**Request Body:**
```json
{
  "title": "AI Revolution Reshapes Global Workforce",
  "category": "Technology",
  "author": "Mustafiz Rahman",
  "content": "Artificial intelligence continues to redefine jobs...",
  "isFeatured": true
}
```

**Response:**
```json
{
  "acknowledged": true,
  "insertedId": "652f1c91a70a77c51c2c10b4"
}
```

---

### 📜 Get All News (with pagination and filters)
**GET** `/news?page=1&limit=10&category=Technology`

**Response:**
```json
{
  "total": 42,
  "totalPages": 5,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "_id": "652f1c91a70a77c51c2c10b4",
      "title": "AI Revolution Reshapes Global Workforce",
      "category": "Technology",
      "author": "Mustafiz Rahman",
      "views": 120,
      "isFeatured": true,
      "createdAt": "2025-10-10T09:30:00Z"
    }
  ]
}
```

✅ **Optional Query Parameters:**
| Param | Example | Description |
|--------|----------|-------------|
| `page` | `?page=2` | Page number |
| `limit` | `?limit=20` | Number of items per page |
| `category` | `?category=Sports` | Filter by category name |

---

### 🔍 Get Single News
**GET** `/news/:id`

Example:
```
GET /news/652f1c91a70a77c51c2c10b4
```

📈 Automatically increments the `views` count by +1.

**Response:**
```json
{
  "_id": "652f1c91a70a77c51c2c10b4",
  "title": "AI Revolution Reshapes Global Workforce",
  "category": "Technology",
  "author": "Mustafiz Rahman",
  "views": 121,
  "isFeatured": true,
  "createdAt": "2025-10-10T09:30:00Z"
}
```

---

### ✏️ Update News
**PUT** `/news/:id`

**Request Body:**
```json
{
  "title": "Updated Headline",
  "content": "New content for the updated article."
}
```

---

### ❌ Delete News
**DELETE** `/news/:id`

Example:
```
DELETE /news/652f1c91a70a77c51c2c10b4
```

---

### 🌟 Featured News
**GET** `/news/category/featured/`

Returns up to 10 manually featured news (`isFeatured: true`).

---

### 🕒 Latest News
**GET** `/news/category/latest`

Returns the 10 most recently created news articles.

---

### 🔥 Trending News
**GET** `/news/category/trending`

Returns top 10 news sorted by `views` (most viewed first).

---

## 🗂️ CATEGORY ROUTES

### ➕ Create Category
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Technology",
  "description": "All about AI and tech updates."
}
```

---

### 📜 Get All Categories
**GET** `/categories`

**Response:**
```json
[
  {
    "_id": "652f1c91a70a77c51c2c10b4",
    "name": "Technology",
    "description": "All about AI and tech updates.",
    "createdAt": "2025-10-10T10:00:00Z"
  }
]
```



