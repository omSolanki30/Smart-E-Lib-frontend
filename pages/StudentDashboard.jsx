import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../src/components/Navbar";
import UserInfoSection from "../src/components/UserInfoSection";
import IssuedBookCard from "../src/components/IssuedBookCard";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    currentIssued: 0,
    totalIssued: 0,
  });
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}api/users/${user._id}`);
        const data = res.data;

        setUserStats({
          currentIssued: data.currentIssuedBooks.length,
          totalIssued: data.totalIssuedBooks,
        });

        const activeBooks = data.issueHistory.filter((entry) => !entry.returned);
        setIssuedBooks(activeBooks);

        const now = new Date();
        const newNotifications = activeBooks
          .map((book) => {
            const returnDate = new Date(book.returnDate);
            const graceEnd = new Date(book.graceEndDate);

            const isInGrace = now > returnDate && now <= graceEnd;
            const isOverdueAfterGrace = now > graceEnd;
            const overdueDays = isOverdueAfterGrace
              ? Math.floor((now - graceEnd) / (1000 * 60 * 60 * 24))
              : 0;
            const penalty = overdueDays * 50;

            if (now <= returnDate) return null;

            return {
              transactionId: book.transactionId,
              title: book.bookTitle,
              dueDate: returnDate.toLocaleDateString(),
              graceDeadline: graceEnd.toLocaleDateString(),
              overdueDays,
              penalty,
              isInGrace,
              isOverdueAfterGrace,
            };
          })
          .filter(Boolean);

        setNotifications(newNotifications);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?._id) fetchSummary();
  }, [user]);

  const handleReturnSuccess = (transactionId) => {
    setIssuedBooks((prev) =>
      prev.filter((book) => book.transactionId !== transactionId)
    );
    setNotifications((prev) =>
      prev.filter((n) => n.transactionId !== transactionId)
    );
    setUserStats((prev) => ({
      ...prev,
      currentIssued: prev.currentIssued - 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto space-y-10">
        <section className="text-center py-8 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700 mb-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Hello, {user?.name} 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome to your smart e-library dashboard 📖
          </p>
        </section>

        <UserInfoSection {...userStats} />

        {notifications.length > 0 && (
          <Card className="p-5 border-l-4 border-red-400 shadow bg-white dark:bg-gray-900">
            <CardHeader className="mb-4">
              <CardTitle className="text-red-600 dark:text-red-400 text-xl">
                🔔 Important Notifications
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                You have overdue or grace period books. Please take action.
              </CardDescription>
            </CardHeader>
            <Separator />
            <div className="mt-4 space-y-4">
              <AnimatePresence>
                {notifications.map((note, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 truncate">
                        📘 {note.title}
                      </h3>
                      {note.isInGrace && (
                        <Badge variant="warning">In Grace</Badge>
                      )}
                      {note.isOverdueAfterGrace && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      Due on <strong>{note.dueDate}</strong>.
                      {note.isInGrace && (
                        <>
                          {" "}
                          Return by <strong>{note.graceDeadline}</strong> to avoid penalty.
                        </>
                      )}
                      {note.isOverdueAfterGrace && (
                        <>
                          {" "}
                          Penalty: <strong>₹{note.penalty}</strong> for{" "}
                          <strong>{note.overdueDays} day(s)</strong> overdue.
                        </>
                      )}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
            📚 Your Issued Books
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {issuedBooks.map((book, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <IssuedBookCard
                    book={book}
                    transactionId={book.transactionId}
                    onReturn={handleReturnSuccess}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
