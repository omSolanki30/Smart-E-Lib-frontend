import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "var(--toast-bg)",
              color: "var(--toast-color)",
              fontSize: "0.9rem",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#d1fae5",
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
