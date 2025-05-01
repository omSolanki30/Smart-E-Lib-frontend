import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import BookModal from "@/components/BookModal";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const Library = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks(res.data);
        setFilteredBooks(res.data);

        const uniqueCategories = [
          ...new Set(res.data.map((book) => book.category || "Uncategorized")),
        ];
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };

    fetchBooks();
  }, []);

  const handleBookIssue = () => {
    setSelectedBook(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    const booksToFilter = category === "All" ? books : books.filter((b) => b.category === category);

    const finalFiltered = booksToFilter.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredBooks(finalFiltered);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const booksToFilter = selectedCategory === "All" ? books : books.filter((b) => b.category === selectedCategory);

    const filtered = booksToFilter.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
              <BookOpen className="text-indigo-500" /> Explore Our Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              We have over <strong>{books.length}</strong> books in our collection.
            </p>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Menu size={18} /> Categories
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="max-w-[260px]">
              <SheetHeader>
                <SheetTitle className="mb-4">📚 Categories</SheetTitle>
                <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={category === selectedCategory ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        handleCategorySelect(category);
                        setSheetOpen(false);
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            placeholder="🔍 Search books by title, author, or category..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Book Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {paginatedBooks.map((book) => (
              <motion.div
                key={book._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => book.isAvailable && setSelectedBook(book)}
                className={`cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition duration-300 relative hover:shadow-md ${
                  book.isAvailable
                    ? "hover:scale-[1.02]"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-40 w-full object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-500 mb-2">{book.category}</p>

                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                    book.isAvailable
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }`}
                >
                  {book.isAvailable ? "✅ Available" : "❌ Not Available"}
                </span>

                {book.isAvailable && (
                  <p className="text-xs mt-1 text-blue-500">Click to issue</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        {filteredBooks.length > ITEMS_PER_PAGE && (
          <div className="mt-10 flex justify-center items-center gap-6 text-indigo-800 font-medium">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={18} /> Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </div>

      {/* Book Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onIssued={handleBookIssue}
        />
      )}
    </div>
  );
};

export default Library;
