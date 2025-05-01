import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  PencilLine,
  PlusCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState({ visible: false, book: null });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }, []);

  const deleteBook = async (id) => {
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    fetchBooks();
  };

  const confirmDelete = (book) => {
    setModal({ visible: true, book });
  };

  const handleDelete = async () => {
    await deleteBook(modal.book._id);
    setModal({ visible: false, book: null });
  };

  const handleBookSync = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/users/book-sync");
      toast.success(res.data.message || "Book sync completed");

      fetchBooks();
    } catch (err) {
      console.error("❌ Book sync failed:", err);
      toast.error("Book sync failed");
    }
  };

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const paginatedBooks = books.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      <Navbar isAdmin />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
            <BookOpen /> Book Management
          </h1>

          {/* Buttons container */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/admin/addbook")}>
              <PlusCircle className="mr-2" /> Add Book
            </Button>
            <Button
              onClick={handleBookSync}
              variant="outline"
              className="text-indigo-700 border-indigo-300 hover:bg-indigo-50"
            >
              Sync Books
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedBooks.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, scale: 0.95, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: 20 }}
                whileHover={{ scale: 1.02 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p>
                      <strong>Category:</strong> {book.category}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          book.isAvailable
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {book.isAvailable ? "Available" : "Issued"}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => navigate(`/admin/editbook/${book._id}`)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        <PencilLine className="mr-1 w-4 h-4" /> Edit
                      </Button>
                      <Button
                        onClick={() => confirmDelete(book)}
                        variant="destructive"
                      >
                        <Trash2 className="mr-1 w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
            <p className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={modal.visible}
        onOpenChange={() => setModal({ visible: false, book: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this book?
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              {modal.book?.title} by {modal.book?.author}
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModal({ visible: false, book: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookManagement;
