# Users REST API

A simple RESTful API for managing users, built with **Node.js**, **Express 5**, **Prisma ORM** and **MongoDB**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- Create, list (with optional name filter), update and delete users
- Persistent storage in MongoDB through Prisma ORM
- Unique email constraint enforced at the database level
- Configuration through environment variables

## Tech Stack

| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| Runtime       | Node.js (ES Modules)                    |
| Web framework | Express 5                               |
| ORM           | Prisma 6 (`@prisma/client`)             |
| Database      | MongoDB                                 |
| Config        | dotenv                                  |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm
- A MongoDB database. [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) is the easiest option.
  Prisma requires MongoDB to run as a **replica set**; Atlas clusters already do.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/annestefanie/Users_Rest_API.git
   cd Users_Rest_API
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and set `DATABASE_URL` to your MongoDB connection string
   (see [Environment Variables](#environment-variables)).

4. **Generate the Prisma Client and sync the schema**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   > MongoDB does not support `prisma migrate`. Use `prisma db push` instead.

5. **Start the server**

   ```bash
   npm start
   ```

   The API is now available at `http://localhost:3000`.

## Environment Variables

| Variable       | Required | Description                      | Example                                                           |
| -------------- | -------- | -------------------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | MongoDB connection string        | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>`  |

> Never commit your `.env` file. It is already listed in `.gitignore`; only `.env.example` is versioned.

## Data Model

Defined in [`prisma/schema.prisma`](prisma/schema.prisma).

### User

| Field   | Type     | Constraints                          | Description                       |
| ------- | -------- | ------------------------------------ | --------------------------------- |
| `id`    | `String` | Primary key, MongoDB ObjectId (auto) | Unique identifier (24-char hex)   |
| `email` | `String` | Unique                               | User's email address              |
| `name`  | `String` | Required                             | User's name                       |
| `age`   | `String` | Required                             | User's age (stored as text)       |

Useful Prisma commands:

```bash
npx prisma generate   # Regenerate Prisma Client after changing the schema
npx prisma db push    # Apply schema changes to the database
npx prisma studio     # Browse and edit data in a web UI
```

## API Reference

**Base URL:** `http://localhost:3000`
**Resource:** `/usuarios` (Portuguese for "users")
**Content type:** `application/json`

| Method   | Endpoint         | Description                          | Success status |
| -------- | ---------------- | ------------------------------------ | -------------- |
| `POST`   | `/usuarios`      | Create a new user                    | `201 Created`  |
| `GET`    | `/usuarios`      | List users (optionally filter by name) | `200 OK`     |
| `PUT`    | `/usuarios/:id`  | Update an existing user              | `201 Created`  |
| `DELETE` | `/usuarios/:id`  | Delete a user                        | `200 OK`       |

---

### Create a user

`POST /usuarios`

**Request body**

| Field   | Type   | Required | Notes                |
| ------- | ------ | -------- | -------------------- |
| `email` | string | Yes      | Must be unique       |
| `name`  | string | Yes      |                      |
| `age`   | string | Yes      | Sent as text, e.g. `"25"` |

```json
{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "age": "25"
}
```

**Response** — `201 Created`

The response echoes the request body. It does **not** include the generated `id`;
use `GET /usuarios` to retrieve it.

```json
{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "age": "25"
}
```

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","name":"Jane Doe","age":"25"}'
```

---

### List users

`GET /usuarios`

**Query parameters**

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| `name`    | string | No       | Returns only users whose name matches exactly (case-sensitive) |

**Response** — `200 OK`

```json
[
  {
    "id": "665f1c2e8a1b2c3d4e5f6a7b",
    "email": "jane@example.com",
    "name": "Jane Doe",
    "age": "25"
  }
]
```

```bash
# All users
curl http://localhost:3000/usuarios

# Filter by name
curl "http://localhost:3000/usuarios?name=Jane%20Doe"
```

---

### Update a user

`PUT /usuarios/:id`

**Path parameters**

| Parameter | Description                                 |
| --------- | ------------------------------------------- |
| `id`      | User ID (24-character hexadecimal ObjectId) |

**Request body** — same fields as [Create a user](#create-a-user).

```json
{
  "email": "jane.doe@example.com",
  "name": "Jane Doe",
  "age": "26"
}
```

**Response** — `201 Created` (echoes the request body)

```json
{
  "email": "jane.doe@example.com",
  "name": "Jane Doe",
  "age": "26"
}
```

```bash
curl -X PUT http://localhost:3000/usuarios/665f1c2e8a1b2c3d4e5f6a7b \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.doe@example.com","name":"Jane Doe","age":"26"}'
```

---

### Delete a user

`DELETE /usuarios/:id`

**Response** — `200 OK`

```json
{
  "message": "USUÁRIO DELETADO COM SUCESSO"
}
```

```bash
curl -X DELETE http://localhost:3000/usuarios/665f1c2e8a1b2c3d4e5f6a7b
```

## Project Structure

```
Users_Rest_API/
├── prisma/
│   └── schema.prisma    # Database schema (User model)
├── .env.example         # Template for environment variables
├── .gitignore
├── package.json         # Dependencies and scripts
├── package-lock.json
└── server.js            # Express app, routes and server startup
```

## Error Handling

The API does not yet implement custom error handling. Any failure inside a route
(for example, a database error) is passed to Express's default error handler and
returned as a `500 Internal Server Error`. In practice, you will see `500` in these cases:

| Situation                                           | Current result |
| --------------------------------------------------- | -------------- |
| Creating or updating a user with a duplicate email  | `500`          |
| Missing required fields in the request body         | `500`          |
| Invalid `id` format (not a 24-char hex ObjectId)    | `500`          |
| Updating or deleting a user that does not exist     | `500`          |

## Known Limitations

- The server port is fixed at `3000` and cannot be changed through environment variables.
- `age` is stored as a `String` instead of a number.
- `POST` and `PUT` return the request body rather than the saved record (no `id` in the response).
- `PUT` returns `201 Created`; `200 OK` would be the conventional status for an update.
- No input validation and no differentiated error responses (`400`, `404`, `409`).
- Name filtering on `GET /usuarios` is exact-match and case-sensitive.
- No automated tests (`npm test` is a placeholder).

## Roadmap

- [ ] Read the port from `process.env.PORT`
- [ ] Change `age` to `Int` in the schema
- [ ] Add input validation (e.g., with Zod)
- [ ] Return proper status codes (`400`, `404`, `409`) with clear error messages
- [ ] Return the saved record on `POST` and `PUT`
- [ ] Add a `GET /usuarios/:id` endpoint
- [ ] Add automated tests

## License

ISC
