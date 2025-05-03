import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { register } from "../src/services/auth";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "@/components/PasswordInput";

const Register = () => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "student", // fixed
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect admin if somehow accessed
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("🎉 Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error("❌ Failed to register. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-xl p-8 space-y-6 text-gray-800 dark:text-gray-100"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
          Sign up as a student to access the library.
        </p>

        <div className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              User ID
            </label>
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="e.g. STU2024"
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <input type="hidden" name="role" value="student" />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Register
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-500 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );

};

export default Register;
