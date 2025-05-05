import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowUp, PlusCircle, ChevronRight, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const USERS_PER_PAGE = 10;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({ open: false, action: null, user: null });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
    }
  }, [token]);

  const handleConfirm = async () => {
    const { action, user } = modal;
    try {
      if (action === "delete") {
        await axios.delete(`${import.meta.env.VITE_API_URL}api/admin/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (action === "promote") {
        await axios.put(
          `${import.meta.env.VITE_API_URL}api/admin/users/promote/${user._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchUsers();
    } catch (err) {
      console.error("❌ Operation failed:", err);
    }
    setModal({ open: false, action: null, user: null });
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar isAdmin />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">👥 User Management</h1>
          <Button onClick={() => navigate("/admin/register")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {paginatedUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                  <CardTitle className="text-lg text-gray-800 dark:text-gray-100">{user.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>ID:</strong> {user.id}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Password:</strong> {user.rawPassword || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Role:</strong>{" "}
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={user.role === "admin" ? "bg-green-600" : "bg-blue-600"}
                      >
                        {user.role}
                      </Badge>
                    </p>
                    <div className="flex gap-2 pt-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setModal({ open: true, action: "delete", user })}
                      >
                        <Trash2 className="mr-1 w-4 h-4" />
                        Delete
                      </Button>
                      {user.role === "student" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setModal({ open: true, action: "promote", user })}
                        >
                          Promote
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
             <ChevronLeft />
            </Button>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm mt-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={modal.open}
        onOpenChange={() => setModal({ open: false, action: null, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.action === "delete"
                ? "Are you sure you want to delete this user?"
                : "Promote this user to admin?"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {modal.user?.name} ({modal.user?.email})
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, action: null, user: null })}
            >
              Cancel
            </Button>
            <Button
              className={modal.action === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              onClick={handleConfirm}
            >
              Yes, {modal.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
