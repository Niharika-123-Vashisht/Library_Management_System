# Library Management System

## About the Project
The Library Management System is a console-based application developed using Node.js. It helps manage books, user accounts, and book issuing and returning operations. The system stores data in JSON files and automatically creates these files when the application runs.

## Features

### Admin Features
- Create new books.
- View all available books.
- Search for a book by ID or name.
- Update book details.
- Delete books.

### User Features
- Create a user account using an email address and password.
- Log in to an existing account.
- View all books.
- Search for books by ID or name.
- Issue available books.
- Return issued books.
- View book issue and due dates.

## Technologies Used
- **Node.js** — JavaScript runtime environment.
- **File System (fs) Module** — To create, read, and update files.
- **Readline Module** — To accept user input through the terminal.
- **JSON** — To store book details, user accounts, and issue records.

## Project Structure

```text
Library_Management/
│
├── main.js
├── book.json       (Automatically created)
└── user.json       (Automatically created)
```

- `main.js`: Contains the complete application logic.
- `book.json`: Stores book information.
- `user.json`: Stores user accounts and book issue records.

The JSON files are automatically created when the application runs for the first time.

## Prerequisites

- Node.js installed on your computer.
- A code editor such as Visual Studio Code.

## How to Run the Project

**Step 1:** Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/Library_Management.git
```

**Step 2:** Navigate to the project directory.

```bash
cd Library_Management
```

**Step 3:** Run the application.

```bash
node main.js
```

**Step 4:** Select your role from the terminal menu and follow the instructions.

## Data Storage

The application uses JSON files for data storage. Book information, user accounts, and issue records are saved locally on your computer.

## Security Note

This project is developed for learning and educational purposes. The current login system is a local demonstration and does not use actual Google authentication. Passwords are stored as plain text in the local JSON file, so use only dummy credentials. The JSON data files should not be uploaded to a public repository.

## Future Improvements

- Implement secure password hashing.
- Add role-based
