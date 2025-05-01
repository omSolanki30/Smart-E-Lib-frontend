import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, bookTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-3 text-indigo-700">Return Book</h3>
            <p className="mb-5 text-gray-600">
              Are you sure you want to return <strong>{bookTitle}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const IssuedBookCard = ({ book, transactionId, onReturn }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const returnBook = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/transactions/return/${transactionId}`
      );
      toast.success("Book returned successfully");
      if (onReturn) onReturn(transactionId);
    } catch (err) {
      toast.error("Failed to return book");
      console.error(err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleReturnClick = () => {
    if (book.isOverdue) {
      setLoading(true);
      returnBook(); // No confirmation for overdue
    } else {
      setShowConfirm(true); // Show confirmation modal
    }
  };

  const today = new Date();
  const graceEnd = new Date(book.graceEndDate);
  const isPastGrace = !book.returned && today > graceEnd;

  const penaltyPerDay = 50;
  const overdueDays =
    isPastGrace &&
    Math.floor((today - graceEnd) / (1000 * 60 * 60 * 24));

  const penaltyAmount = isPastGrace ? overdueDays * penaltyPerDay : 0;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
      >
        <img
          src={book.coverImage}
          alt={book.bookTitle}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2 truncate">
              {book.bookTitle}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">📘 Code:</span> {book.bookCode}</p>
              <p><span className="font-medium">📅 Issued:</span> {new Date(book.issueDate).toLocaleDateString()}</p>
              <p><span className="font-medium">⏳ Return Date:</span> {new Date(book.returnDate).toLocaleDateString()}</p>
              <p><span className="font-medium">🕒 Grace Ends:</span> {graceEnd.toLocaleDateString()}</p>

              {!book.returned && (
                isPastGrace ? (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Grace period expired — ₹{penaltyAmount} penalty (
                    {overdueDays} day{overdueDays > 1 ? "s" : ""})
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-1">
                    Return within grace period to avoid penalty
                  </p>
                )
              )}

              <p>
                <span className="font-medium">Returned:</span>
                <span className={book.returned ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                  {book.returned ? "Yes" : "No"}
                </span>
              </p>

              {book.isOverdue && (
                <p className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded inline-block mt-1">
                  🚨 Overdue
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                Transaction ID: {book.transactionId}
              </p>
            </div>
          </div>

          {!book.returned && (
            <button
              onClick={handleReturnClick}
              disabled={loading}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              {loading ? "Processing..." : "Return Book"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        bookTitle={book.bookTitle}
        onConfirm={returnBook}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default IssuedBookCard;
