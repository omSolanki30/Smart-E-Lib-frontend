import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Input from "../src/components/Input.jsx";
import Button from "../src/components/Button";
import { loginUser } from "../src/services/auth.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "@/components/PasswordInput.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser, user } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await loginUser(form.email, form.password);

      if (!user) throw new Error("User object is undefined");

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success("Login Successful");

      navigate(
        user.role === "admin" ? "/admin-dashboard" : "/student-dashboard"
      );
    } catch (err) {
      console.error("❌Invalid email or password:", err);
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    if (user) {
      navigate(
        user.role === "admin" ? "/admin-dashboard" : "/student-dashboard"
      );
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md border dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
          Login
        </h2>
        <div className="text-left">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <Button>Login</Button>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
