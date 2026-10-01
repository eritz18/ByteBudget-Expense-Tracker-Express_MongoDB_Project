<div align="center">

# 💰 ByteBudget

### *A simple web-based expense tracker built using Node.js, Express.js, MongoDB, EJS, CSS, and JavaScript.*

<img src="https://img.shields.io/badge/Node.js-18%2B-green" />
<img src="https://img.shields.io/badge/Express.js-4.x-blue" />
<img src="https://img.shields.io/badge/MongoDB-Database-brightgreen" />
<img src="https://img.shields.io/badge/EJS-Templating-orange" />
<img src="https://img.shields.io/badge/CSS-Styling-blueviolet" />
<img src="https://img.shields.io/badge/JavaScript-Frontend-yellow" />
<img src="https://img.shields.io/badge/CRUD-Supported-purple" />
<img src="https://img.shields.io/badge/Status-Completed-brightgreen" />

---

</div>

# 📌 About This Repository

**ByteBudget** is a web-based application developed using **Node.js, Express.js, MongoDB, EJS, CSS, and JavaScript**.

The application allows users to register, log in, and manage their personal expense records. It uses MongoDB to store user accounts and expenses, with session-based authentication to manage access.

The system supports:

* 👤 User registration and login
* 💰 Adding expense records
* 📋 Viewing and filtering expenses
* ✏️ Updating expense records
* 🗑️ Deleting expenses
* 📊 Viewing expense summaries on the dashboard
* 🙍 Profile / My Account page (edit name, username, email and change password)
* 🗄️ Storing user and expense data in MongoDB

---

# 🛠 Technologies Used

|     Technology    | Purpose                          |
| :---------------: | :------------------------------- |
| 🟢 **JavaScript** | Main programming language        |
|   🟢 **Node.js**  | Runs the server-side application |
|  ⚡ **Express.js** | Backend web framework            |
|  🗄️ **MongoDB**  | Stores user and expense data     |
|     📄 **EJS**    | Renders dynamic web pages        |
|     🎨 **CSS**    | Styles the user interface        |
---

# 📂 Project Structure

```text
ByteBudget Expense Tracker Express_MongoDB_Project/

│
├── config/
│   └── db.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── Expense.js
│   └── User.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── routes/
│   ├── auth.js
│   ├── expenses.js
│   └── profile.js
│
├── views/
│   ├── dashboard.ejs
│   ├── expense-form.ejs
│   ├── expenses.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── register.ejs
│   └── partials/
│       ├── footer.ejs
│       └── nav.ejs
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

# 🙍 Profile / My Account

| Route | Purpose |
| :--- | :--- |
| `GET /profile` | Show the logged-in user's name, username and email |
| `POST /profile` | Update name, username and email |
| `POST /profile/change-password` | Change password (needs current password) |

All profile routes use the `requireLogin` middleware, and the user is always identified by `req.session.userId`.

---

# 🗄️ Database

The application uses **MongoDB** with the database name:

```text
expense-tracker
```

The database contains two collections:

* `users` — stores registered user information.
* `expenses` — stores expense records associated with each user.

---

# ⚙️ How to Run the Project

## 1. Install Dependencies

Open the project folder in **Visual Studio Code** and open the terminal.

Run:

```bash
npm install
```

## 2. Start MongoDB

Make sure your local **MongoDB server** is running. MongoDB Compass can be used to view the database and its collections.

## 3. Configure the `.env` File

Create a `.env` file in the project root.

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
SESSION_SECRET=your_session_secret_here
```

Use your own session secret. Do not upload the `.env` file to your repository.

## 4. Start the Server

Run:

```bash
npm start
```

Then open the application in your browser:

```text
http://localhost:3000
```

Register an account to start using the Expense Tracker.