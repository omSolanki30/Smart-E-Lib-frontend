import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileSearch, UserRound, ClipboardCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

function Verify() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}api/transactions/verify?query=${query}`);
      setResult(res.data);
      console.log(res.data);
    } catch (err) {
      toast.error("No result found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-zinc-900 dark:to-zinc-800">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Card className="shadow-xl dark:bg-zinc-900 dark:border-zinc-700">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileSearch className="text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-xl sm:text-2xl font-bold text-indigo-800 dark:text-indigo-200">
                Verify User / Transaction
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter Transaction ID / Student ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="space-y-6">
                <Skeleton className="h-6 w-1/3 bg-indigo-100 dark:bg-zinc-700" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-48 rounded-lg bg-indigo-100 dark:bg-zinc-700" />
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && !loading && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p className="dark:text-gray-300"><strong>Type:</strong> {result.type}</p>
                  <p className="dark:text-gray-300"><strong>ID:</strong> {result.id}</p>
                </div>
                <Separator className="my-2" />

                {/* Student Verification View */}
                {result.type?.toLowerCase() === "student" && result.details && (
                  <div className="space-y-8">
                    <Card className="border border-indigo-200 dark:border-zinc-700 shadow-md dark:bg-zinc-900">
                      <CardHeader className="flex items-center gap-2">
                        <UserRound className="text-indigo-600 dark:text-indigo-400" />
                        <CardTitle className="text-lg dark:text-indigo-200">Student Details</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2 dark:text-gray-200">
                        <p><strong>ID:</strong> {result.details.id}</p>
                        <p><strong>Name:</strong> {result.details.name}</p>
                        <p><strong>Email:</strong> {result.details.email}</p>
                        <p><strong>Contact:</strong> {result.details.otherDetails?.contactNumber || "—"}</p>
                        <p><strong>Address:</strong> {result.details.otherDetails?.address || "—"}</p>
                        <p><strong>Total Issued Books:</strong> {result.details.totalIssuedBooks}</p>
                        <p><strong>Currently Issued:</strong> {result.details.currentIssuedBooks?.length || 0}</p>
                      </CardContent>
                    </Card>

                    {/* Currently Issued Books */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                        📚 Currently Issued Books
                      </h3>
                      {result.details.issueHistory?.filter(book => !book.returned).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {result.details.issueHistory
                            ?.filter(book => !book.returned)
                            .map((entry, idx) => (
                              <Card key={idx} className="border border-indigo-200 dark:border-zinc-700 shadow-md dark:bg-zinc-900">
                                <CardHeader>
                                  <CardTitle className="text-base font-semibold text-indigo-800 dark:text-indigo-200">
                                    {entry.bookTitle}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                                  <p><strong>Book Code:</strong> {entry.bookCode}</p>
                                  <p><strong>Author:</strong> {entry.author}</p>
                                  <p><strong>Category:</strong> {entry.category}</p>
                                  <p><strong>Issue Date:</strong> {new Date(entry.issueDate).toLocaleDateString()}</p>
                                  <p><strong>Return Date:</strong> {new Date(entry.returnDate).toLocaleDateString()}</p>
                                  {entry.graceEndDate && (
                                    <p><strong>Grace End:</strong> {new Date(entry.graceEndDate).toLocaleDateString()}</p>
                                  )}
                                  <p><strong>Transaction ID:</strong> {entry.transactionId}</p>
                                  <p><strong>Penalty:</strong> ₹{entry.penalty || 0}</p>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">🚫 No books currently issued.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Transaction Verification View */}
                {result.type?.toLowerCase() === "transaction" && result.details && (
                  <Card className="border border-indigo-200 dark:border-zinc-700 shadow-md dark:bg-zinc-900">
                    <CardHeader className="flex items-center gap-2">
                      <ClipboardCheck className="text-indigo-600 dark:text-indigo-400" />
                      <CardTitle className="text-lg dark:text-indigo-200">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-200">
                      <p><strong>Transaction ID:</strong> {result.details.transactionId}</p>
                      <p><strong>Student ID:</strong> {result.details.studentId}</p>
                      <p><strong>Book Code:</strong> {result.details.bookCode}</p>
                      <p><strong>Book Title:</strong> {result.details.bookTitle}</p>
                      <p><strong>Issue Date:</strong> {new Date(result.details.issueDate).toLocaleDateString()}</p>
                      <p><strong>Return Date:</strong> {new Date(result.details.returnDate).toLocaleDateString()}</p>
                      <p><strong>Returned:</strong> {result.details.returned ? "Yes" : "No"}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Verify;
