import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from 'react-hot-toast';
import "./index.css"; // TailwindCSS styles
import App from "./App";
import { AuthProvider } from "../context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#333',
          fontSize: '0.9rem',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#d1fae5',
          },
        },
      }}
    />
    </AuthProvider>
  </React.StrictMode>
);
