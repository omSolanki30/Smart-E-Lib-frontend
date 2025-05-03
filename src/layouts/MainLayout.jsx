import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-indigo-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 shadow top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-2xl cursor-pointer">
            <BookOpenText className="w-7 h-7" />
            <a href="/dashboard">Smart E-Library</a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Empowering Digital Learning
          </div>
        </div>
        <Separator />
      </header>

      {/* Main content */}
      <main className={cn("flex-1 w-full px-4 sm:px-8 py-6 max-w-7xl mx-auto")}>
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Smart E-Library. All rights reserved.
      </footer>

      <Toaster />
    </div>
  );
};

export default MainLayout;
