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
        const res = await axios.get("http://localhost:5000/api/reports/most-issued-monthly");
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-xl border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-indigo-600 w-6 h-6" />
                <div>
                  <CardTitle className="text-2xl text-indigo-700">Most Issued Books</CardTitle>
                  <p className="text-sm text-gray-500">📚 Monthly stats of most borrowed books</p>
                </div>
              </div>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month, i) => (
                    <SelectItem key={i} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent className="pt-6">
              {data.length === 0 ? (
                <p className="text-center text-gray-600 py-10">
                  No data available for <span className="font-medium">{selectedMonth}</span>.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="title" width={160} />
                    <Tooltip />
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
