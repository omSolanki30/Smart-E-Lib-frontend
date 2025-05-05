import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const MostIssuedBooks = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}api/reports/most-issued-monthly`);
        setMonthlyData(res.data);
        const months = Object.keys(res.data);
        setAvailableMonths(months);
        setSelectedMonth(months[months.length - 1]);
      } catch (err) {
        console.error("❌ Failed to fetch monthly data:", err);
      }
    };
    fetchMonthly();
  }, []);

  const data = monthlyData[selectedMonth] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-xl border border-gray-200 dark:border-zinc-700 dark:bg-zinc-900">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                <div>
                  <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-200">
                    Most Issued Books
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📚 Monthly stats of most borrowed books
                  </p>
                </div>
              </div>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-200">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:text-gray-100">
                  {availableMonths.map((month, i) => (
                    <SelectItem
                      key={i}
                      value={month}
                      className="dark:hover:bg-zinc-700"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent className="pt-6">
              {data.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-300 py-10">
                  No data available for <span className="font-medium">{selectedMonth}</span>.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis type="number" stroke="#8884d8" />
                    <YAxis type="category" dataKey="title" width={160} stroke="#8884d8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e2f",
                        borderColor: "#4f46e5",
                        color: "#f9f9f9",
                      }}
                      wrapperStyle={{
                        fontSize: "0.875rem",
                      }}
                      labelStyle={{
                        color: "#f3f4f6",
                      }}
                    />
                    <Bar dataKey="count" fill="#4f46e5" name="Issues" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MostIssuedBooks;
