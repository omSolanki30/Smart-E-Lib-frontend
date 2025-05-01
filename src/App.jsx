import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Library from "../pages/Library";
import Info from "../pages/Info";
import AdminDashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import BookManagement from "../pages/admin/BookManagement";
import AddBookForm from "../pages/admin/AddBookForm";
import IssuedBooksOverview from "../pages/admin/IssuedBooksOverview";
import MostIssuedBooks from "../pages/admin/MostIssuedBooks";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRegister from "../pages/admin/AdminRegister";
import EditBookForm from "../pages/admin/EditBookForm";
import EditInfo from "../pages/EditInfo";
import CalendarView from "../pages/admin/CalendarView";
import OverdueReports from "../pages/admin/OverdueReports";
import BulkUpload from "../pages/admin/BulkUpload";
import Verify from "../pages/admin/Verify";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <MainLayout>
                  <StudentDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute role="student">
                <MainLayout>
                  <Library />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute role="student">
                <MainLayout>
                  <Info />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-info"
            element={
              <ProtectedRoute role="student">
                <MainLayout>
                  <EditInfo />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ADMIN PAGES */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/register"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <AdminRegister />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <BookManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/addbook"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <AddBookForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editbook/:id"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <EditBookForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/issued-books-overview"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <IssuedBooksOverview />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/most-issued"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <MostIssuedBooks />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <CalendarView />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/overdue"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <OverdueReports />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bulk-upload"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <BulkUpload />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verify"
            element={
              <ProtectedRoute role="admin">
                <MainLayout>
                  <Verify />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route
            path="*"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
