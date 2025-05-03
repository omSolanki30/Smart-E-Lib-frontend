import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const OverdueReports = () => {
  const [overdueData, setOverdueData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOverdues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/reports/overdue", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOverdueData(res.data.overdueDetails);
        setChartData(res.data.monthlyStats);
      } catch (err) {
        console.error("❌ Error fetching overdue data:", err);
      }
    };
    fetchOverdues();
  }, []);

  const handleCalculateOverdues = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await axios.put("/api/users/calculate-overdues", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success(res.data.message || "Overdues recalculated");
  
      const updated = await axios.get("/api/reports/overdue", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setOverdueData(updated.data.overdueDetails);
      setChartData(updated.data.monthlyStats);
  
    } catch (error) {
      console.error("❌ Error calculating overdues:", error);
      toast.error("Failed to calculate overdue penalties");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-indigo-800 dark:text-indigo-200 mb-8"
        >
          Overdue Reports
        </motion.h1>

        <div className="flex justify-end mb-4">
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-700 dark:hover:bg-rose-800"
            onClick={handleCalculateOverdues}
          >
            Calculate Overdues
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-200">
            📋 Overdue Users & Books
          </h2>
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
            <thead className="bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-indigo-200">
              <tr>
                <th className="p-2 border dark:border-gray-700">Student ID</th>
                <th className="p-2 border dark:border-gray-700">Book Title</th>
                <th className="p-2 border dark:border-gray-700">Issue Date</th>
                <th className="p-2 border dark:border-gray-700">Return Date</th>
                <th className="p-2 border dark:border-gray-700">Grace End Date</th>
                <th className="p-2 border dark:border-gray-700">Actual Return</th>
                <th className="p-2 border dark:border-gray-700">Overdue Days</th>
                <th className="p-2 border dark:border-gray-700">Penalty</th>
                <th className="p-2 border dark:border-gray-700">Returned</th>
              </tr>
            </thead>
            <tbody>
              {overdueData.map((entry, idx) => (
                <tr
                  key={idx}
                  className="text-center odd:bg-white even:bg-indigo-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="p-2 border dark:border-gray-700 text-gray-900 dark:text-gray-200">{entry.studentId}</td>
                  <td className="p-2 border dark:border-gray-700 text-gray-900 dark:text-gray-200">{entry.bookTitle}</td>
                  <td className="p-2 border dark:border-gray-700 text-gray-900 dark:text-gray-200">
                    {format(new Date(entry.issueDate), "PPP")}
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-gray-900 dark:text-gray-200">
                    {format(new Date(entry.returnDate), "PPP")}
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-gray-900 dark:text-gray-200">
                    {entry.graceEndDate
                      ? format(new Date(entry.graceEndDate), "PPP")
                      : "—"}
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-gray-900 dark:text-gray-200">
                    {entry.actualReturnDate
                      ? format(new Date(entry.actualReturnDate), "PPP")
                      : "Not Returned"}
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-red-600 font-semibold">
                    {entry.overdueDays}
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-rose-500 font-bold">
                    ₹{entry.penalty}
                  </td>
                  <td className="p-2 border dark:border-gray-700">
                    {entry.returned ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white dark:bg-gray-800 mt-10 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-200">
            📈 Monthly Overdue Insights
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 10, left: 0 }}
            >
              <XAxis dataKey="month" stroke="#4f46e5" />
              <YAxis allowDecimals={false} stroke="#8884d8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#4f46e5",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="totalOverdues"
                fill="#ef4444"
                name="Total Overdues"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="returnedWithinGrace"
                fill="#10b981"
                name="Returned Within Grace"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverdueReports;
