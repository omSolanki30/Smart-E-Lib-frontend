
# 📚 Smart E-Library – Frontend

Welcome to the frontend of the **Smart E-Library System**, a modern and responsive web-based platform for managing book transactions, student verification, and digital book browsing.

This project is part of the Smart E-Library full-stack system, developed using **React**, **Tailwind CSS**, **Shadcn UI**, and **Lucide Icons**.

---

## 🚀 Features

- 🔐 Student and Admin Authentication
- 📖 Book browsing by category, title, author
- 🧠 Intelligent search bar with filtering
- 💻 Responsive layout for all screen sizes
- 🗂️ Student Dashboard: View issued books, return history
- 🛠️ Admin Dashboard: Verify student transactions, manage inventory
- 📦 Animated Modals and Interactive UI using **Framer Motion**
- 🧪 Grace period and penalty tracking

---

## 🛠️ Tech Stack

| Category       | Tools / Libraries                          |
|----------------|---------------------------------------------|
| Frontend       | React, Vite                                 |
| Styling        | Tailwind CSS, Shadcn UI                     |
| Icons          | Lucide React                                |
| Animations     | Framer Motion                               |
| HTTP Requests  | Axios                                       |
| Notifications  | React Hot Toast                             |
| State Handling | React Hooks (useState, useEffect)           |

---

## 📂 Project Structure

```
frontend/
│
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (Navbar, Modals, Cards)
│   ├── pages/               # Route-based pages (Library, Dashboard, Verify)
│   ├── utils/               # Helper functions and constants
│   ├── App.jsx              # Main application wrapper
│   └── main.jsx             # Entry point
│
├── package.json
└── tailwind.config.js
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-e-library-frontend.git
cd smart-e-library-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```bash
VITE_API_BASE_URL=http://localhost:5000
```

> Replace with your backend URL if hosted elsewhere.

### 4. Run the App

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔗 Backend Link

If you're looking for the backend repo:
[Smart E-Library Backend Repository](https://github.com/omSolanki30/Smart-E-Lib-backend)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
