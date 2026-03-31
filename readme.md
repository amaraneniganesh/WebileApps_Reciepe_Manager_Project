# Recipe Manager API Documentation

A full-stack recipe management system built with Node.js, Express, Sequelize (MySQL), and React. This application features Role-Based Access Control (RBAC), JWT authentication, and cloud image uploads via Cloudinary.

## 🗄️ Database Design (Sequelize / MySQL)

### Table: `Users`
Manages system administrators. The initial SuperAdmin is seeded from the `.env` file.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Full name of the admin |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Used for login |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | ENUM | `'superadmin'`, `'admin'` (Def: `'admin'`) | Access Control Level |
| `isActive` | BOOLEAN | DEFAULT `true` | If false, user cannot log in |
| `image` | VARCHAR(1000)| DEFAULT `''` | Cloudinary URL for profile picture |
| `createdAt` | DATETIME | Automatically managed | Account creation timestamp |
| `updatedAt` | DATETIME | Automatically managed | Last update timestamp |

### Table: `Recipes`
Stores all recipe data.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Title of the recipe |
| `category` | VARCHAR(255) | NOT NULL | E.g., Breakfast, Lunch, Dinner |
| `ingredients` | JSON | NOT NULL | Array of ingredient strings |
| `instructions`| TEXT | NOT NULL | Step-by-step preparation guide |
| `cookingTime` | INTEGER | NOT NULL | Time in minutes |
| `servings` | INTEGER | NOT NULL | Number of people it serves |
| `image` | VARCHAR(1000)| DEFAULT `''` | Cloudinary URL for recipe image |
| `createdAt` | DATETIME | Automatically managed | Creation timestamp |
| `updatedAt` | DATETIME | Automatically managed | Last update timestamp |

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api`
**Authentication:** Protected routes require `Authorization: Bearer <your_jwt_token>` in the request headers.

### 🔐 A. Authentication Routes
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Public | Authenticates user and returns JWT. |
| **GET** | `/auth/me` | Admin/Super | Returns the profile of the currently logged-in user. |

### 🍳 B. Recipe Routes (Protected)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/recipes` | Admin/Super | Fetches all recipes. Accepts optional `?category=Breakfast` query. |
| **GET** | `/recipes/:id` | Admin/Super | Fetches a single recipe by ID. |
| **POST** | `/recipes` | Admin/Super | Creates a recipe. **Requires `multipart/form-data`** |
| **PUT** | `/recipes/:id` | Admin/Super | Updates a recipe. **Requires `multipart/form-data`** |
| **DELETE**| `/recipes/:id` | Admin/Super | Permanently deletes a recipe. |

### 🛡️ C. User/Admin Routes (SuperAdmin ONLY)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/users` | SuperAdmin | Fetches a list of all `admin` users. |
| **POST** | `/users` | SuperAdmin | Creates a new admin. **Requires `multipart/form-data`** |
| **PUT** | `/users/:id` | SuperAdmin | Updates admin details. **Requires `multipart/form-data`** |
| **PATCH** | `/users/:id/toggle`| SuperAdmin | Toggles the `isActive` status of an admin. |
| **DELETE**| `/users/:id` | SuperAdmin | Permanently deletes an admin account. |

---

## 🧪 API Testing Guide (Postman / Insomnia)

### Step 1: Login & Get Token
1. Create a **POST** request to `http://localhost:5000/api/auth/login`.
2. Go to the **Body** tab, select **raw** -> **JSON**.
3. Send your credentials:
```json
{
  "email": "mahesh@gmail.com",
  "password": "1234"
}
