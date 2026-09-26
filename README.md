# 📚 Library Management System

A full-stack web application for managing a digital library using the MERN stack.

The system provides separate access for **Librarians** and **Members**. Librarians can manage the library's books, authors, genres, users and borrowals, while members can browse the available library collection and manage their own borrowals.

The application also supports **real image uploads for book covers and author photos using Cloudinary**, with image URLs stored in MongoDB.

---

## ✨ Features

### 👨‍💼 Librarian

Librarians have administrative access to the system and can:

- Add, view, update and delete books
- Upload book cover images
- Add, view, update and delete authors
- Upload author profile images
- Manage genres
- Manage library users
- Manage borrowals
- Check book availability
- View the complete book collection

### 👤 Member

Members can:

- Login securely
- Browse books
- View book details
- View authors
- View genres
- Check book availability
- Create their own borrowal records
- View their borrowal history

---

## 🖼️ Image Upload System

The application uses **Cloudinary** for storing uploaded images.

### Book Cover Upload

When a librarian adds or updates a book:

```text
React Frontend
      ↓
Select Book Cover
      ↓
FormData
      ↓
Express API
      ↓
Multer
      ↓
Cloudinary
      ↓
Image URL
      ↓
MongoDB

---
### System Architecture

                    ┌─────────────────────┐
                    │      React UI       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │      Backend        │
                    └───────┬───────┬─────┘
                            │       │
                  ┌─────────┘       └─────────┐
                  ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │     MongoDB     │         │    Cloudinary   │
        │                 │         │                 │
        │ Books           │         │ Book Covers     │
        │ Authors         │         │ Author Photos   │
        │ Genres          │         │                 │
        │ Users           │         └─────────────────┘
        │ Borrowals       │
        └─────────────────┘


### project stucture

LibraryManagement/
│
├── client/
│   ├── public/
│   │   ├── assets/
│   │   └── index.html
│   │
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── sections/
│       │   ├── @dashboard/
│       │   │   ├── app/
│       │   │   ├── author/
│       │   │   ├── book/
│       │   │   ├── borrowal/
│       │   │   ├── genre/
│       │   │   └── user/
│       │   │
│       │   └── auth/
│       │       └── login/
│       │
│       ├── utils/
│       ├── App.jsx
│       ├── index.js
│       ├── constants.js
│       └── routes.js
│
├── server/
│   ├── config/
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── authorController.js
│   │   ├── bookController.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── upload.js
│   │   └── bookUpload.js
│   │
│   ├── models/
│   │   ├── author.js
│   │   ├── book.js
│   │   ├── genre.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── authorRouter.js
│   │   ├── bookRouter.js
│   │   └── ...
│   │
│   ├── index.js
│   └── passport-config.js
│
├── package.json
├── README.md
└── .gitignore

