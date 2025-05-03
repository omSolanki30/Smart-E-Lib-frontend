// BulkUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, FileCheck, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BulkUpload = () => {
  const [bookFile, setBookFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [bookUploaded, setBookUploaded] = useState(false);
  const [userUploaded, setUserUploaded] = useState(false);

  const handleUpload = async (type) => {
    const file = type === "books" ? bookFile : userFile;
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint =
        type === "books"
          ? "http://localhost:5000/api/books/bulk-upload"
          : "http://localhost:5000/api/users/bulk-upload";

      await axios.post(endpoint, formData);
      toast.success(`✅ ${type === "books" ? "Books" : "Users"} uploaded successfully`);
      if (type === "books") setBookUploaded(true);
      else setUserUploaded(true);
    } catch (err) {
      toast.error(`❌ Failed to upload ${type}`);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto grid gap-10 md:grid-cols-2"
      >
        {/* Book Upload */}
        <Card className="shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <CardHeader>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="text-indigo-600 dark:text-indigo-400" size={28} />
              <div>
                <CardTitle className="text-lg font-bold">Books Bulk Upload</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Upload a CSV or JSON file to register multiple books.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-6 flex flex-col gap-4">
            <Input
              type="file"
              accept=".csv,.json"
              onChange={(e) => setBookFile(e.target.files[0])}
              className="file:bg-indigo-600 file:text-white dark:file:bg-indigo-500 dark:file:text-white"
            />
            <Button
              onClick={() => handleUpload("books")}
              disabled={!bookFile}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Books File
            </Button>
            {bookUploaded && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                <FileCheck size={20} /> Books uploaded and saved successfully!
              </div>
            )}
          </div>
        </Card>

        {/* User Upload */}
        <Card className="shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <CardHeader>
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-indigo-600 dark:text-indigo-400" size={28} />
              <div>
                <CardTitle className="text-lg font-bold">Users Bulk Upload</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Upload a CSV or JSON file to register multiple users.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-6 flex flex-col gap-4">
            <Input
              type="file"
              accept=".csv,.json"
              onChange={(e) => setUserFile(e.target.files[0])}
              className="file:bg-indigo-600 file:text-white dark:file:bg-indigo-500 dark:file:text-white"
            />
            <Button
              onClick={() => handleUpload("users")}
              disabled={!userFile}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Users File
            </Button>
            {userUploaded && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                <FileCheck size={20} /> Users uploaded and saved successfully!
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BulkUpload;
