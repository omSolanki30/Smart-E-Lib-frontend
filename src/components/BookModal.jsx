import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const BookModal = ({ book, onClose, onIssued }) => {
  const { user } = useAuth();
  const [userId, setUserId] = useState("");
  const [studentId, setstudentId] = useState("");
  const [customDays, setCustomDays] = useState("");

  useEffect(() => {
    if (user?.id) setstudentId(user.id);
    if (user?._id) setUserId(user._id);
  }, [user]);

  const handleIssue = async () => {
    const days = customDays ? parseInt(customDays) : 7;

    if (days > 20) {
      toast.error("You can only issue a book for a maximum of 20 days");
      return;
    }

    const issueDate = new Date();
    let returnDate = new Date(issueDate.getTime() + days * 86400000);

    const dayOfWeek = returnDate.getDay();
    if (dayOfWeek === 6) returnDate.setDate(returnDate.getDate() + 2);
    else if (dayOfWeek === 0) returnDate.setDate(returnDate.getDate() + 1);

    const graceEndDate = new Date(returnDate.getTime() + 4 * 86400000);

    try {
      await axios.post("http://localhost:5000/api/transactions", {
        userId,
        studentID: studentId,
        bookId: book._id,
        bookCode: book.bookCode,
        bookTitle: book.title,
        issueDate,
        returnDate,
        graceEndDate,
      });

      await axios.put(`http://localhost:5000/api/books/issue/${book._id}`, {
        isAvailable: false,
      });

      toast.success("Book Issued Successfully");
      onIssued(book._id);
    } catch (err) {
      toast.error("Error issuing book");
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 w-full max-w-xl p-6 rounded-xl shadow-2xl relative transition-colors"
          initial={{ scale: 0.8, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-2xl font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition"
          >
            &times;
          </button>

          {/* Book Image */}
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />

          {/* Book Info */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              {book.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Author: {book.author}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Category: {book.category}</p>
          </div>

          {/* Custom Days Input */}
          <input
            type="number"
            placeholder="Days (default 7, max 20)"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            min={1}
            max={20}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          {/* CTA Button */}
          <button
            onClick={handleIssue}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Confirm & Issue Book
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookModal;
