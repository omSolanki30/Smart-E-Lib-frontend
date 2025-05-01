import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  BookOpen,
  Users,
  CalendarDays,
  BookMarked,
  AlarmClock,
  LineChart,
  BadgeCheck
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const managementCards = [
    {
      title: "User Magagement",
      description: "View all registered users",
      icon: <Users className="text-blue-600" size={28} />,
      link: "/admin/users",
    },
    {
      title: "Book Management",
      description: "View and manage books",
      icon: <BookOpen className="text-green-600" size={28} />,
      link: "/admin/books",
    },
    {
      title: "Verification",
      description: "Verifying issued books",
      icon: <BadgeCheck className="text-green-600" size={24} />,
      link: "/admin/verify",
    },
  ];

  const reportsCards = [
    {
      title: "Most Issued Books",
      description: "Top books issued by students",
      icon: <BookMarked className="text-pink-600" size={28} />,
      link: "/admin/most-issued",
    },
    {
      title: "Issued Book Overview",
      description: "Monthly issued & returned stats",
      icon: <LineChart className="text-orange-500" size={28} />,
      link: "/admin/issued-books-overview",
    },
    {
      title: "Calendar View",
      description: "Visualize issue/return timelines",
      icon: <CalendarDays className="text-purple-500" size={28} />,
      link: "/admin/calendar",
    },
    {
      title: "Overdue Reports",
      description: "Track users with overdue returns",
      icon: <AlarmClock className="text-red-500" size={28} />,
      link: "/admin/overdue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100">
      <Navbar isAdmin />
      <div className="p-6 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-10"
        >
          📊 Admin Dashboard
        </motion.h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🛠️ Management</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {managementCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => navigate(card.link)}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-lg transition border border-blue-100">
                <CardHeader className="flex flex-row gap-4 items-center">
                  {card.icon}
                  <div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📈 Reports & Insights</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reportsCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => navigate(card.link)}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-lg transition border border-indigo-100">
                <CardHeader className="flex flex-row gap-4 items-center">
                  {card.icon}
                  <div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
