import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  ShieldCheck,
  UserCheck,
  CalendarDays,
  BookOpen,
  Users,
  BookCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminInfo = () => {
  const { user } = useAuth();
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    booksIssued: 0,
    overdue: 0,
  });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const [adminRes, usersRes, booksRes, issuedStatsRes] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}api/admin/me`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            axios.get("/api/users", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            axios.get(`${import.meta.env.VITE_API_URL}api/books`),
            axios.get(`${import.meta.env.VITE_API_URL}api/reports/issued-stats`),
          ]);

        setAdminInfo(adminRes.data);

        const totalStudents = usersRes.data.filter(
          (u) => u.role === "student"
        ).length;
        const totalBooks = booksRes.data.length;
        const booksIssued = issuedStatsRes.data.totalIssued;

        let overdue = 0;
        usersRes.data.forEach((user) => {
          user.issueHistory?.forEach((entry) => {
            if (entry.isOverdue && !entry.returned) {
              overdue++;
            }
          });
        });

        setStats({
          totalBooks,
          totalStudents,
          booksIssued,
          overdue,
        });
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    if (user && user.role === "admin") {
      fetchAdminInfo();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!adminInfo) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center"
        >
          👤 Admin Profile
        </motion.h1>

        {/* Basic Info Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="text-primary" /> {adminInfo.name}
            </CardTitle>
            <CardDescription>System Administrator</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="text-blue-500" />
              <span>{adminInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" />
              <span>{adminInfo.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="text-purple-500" />
              <span>Joined: {formatDate(adminInfo.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center shadow-md">
            <CardContent className="py-6">
              <BookOpen className="mx-auto mb-2 text-indigo-500" />
              <div className="text-lg font-semibold">{stats.totalBooks}</div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md">
            <CardContent className="py-6">
              <Users className="mx-auto mb-2 text-emerald-500" />
              <div className="text-lg font-semibold">{stats.totalStudents}</div>
              <div className="text-sm text-muted-foreground">
                Total Students
              </div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md">
            <CardContent className="py-6">
              <BookCheck className="mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-semibold">{stats.booksIssued}</div>
              <div className="text-sm text-muted-foreground">Books Issued</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md">
            <CardContent className="py-6">
              <Clock className="mx-auto mb-2 text-red-500" />
              <div className="text-lg font-semibold">{stats.overdue}</div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
