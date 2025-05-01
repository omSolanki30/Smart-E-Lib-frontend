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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-8"
        >
          Overdue Reports
        </motion.h1>

        <div className="flex justify-end mb-4">
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleCalculateOverdues}
          >
            Calculate Overdues
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            📋 Overdue Users & Books
          </h2>
          <table className="min-w-full text-sm border">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Book Title</th>
                <th className="p-2 border">Issue Date</th>
                <th className="p-2 border">Return Date</th>
                <th className="p-2 border">Grace End Date</th>
                <th className="p-2 border">Actual Return</th>
                <th className="p-2 border">Overdue Days</th>
                <th className="p-2 border">Penalty</th>
                <th className="p-2 border">Returned</th>
              </tr>
            </thead>
            <tbody>
              {overdueData.map((entry, idx) => (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{entry.studentId}</td>
                  <td className="p-2 border">{entry.bookTitle}</td>
                  <td className="p-2 border">
                    {format(new Date(entry.issueDate), "PPP")}
                  </td>
                  <td className="p-2 border">
                    {format(new Date(entry.returnDate), "PPP")}
                  </td>
                  <td className="p-2 border">
                    {entry.graceEndDate
                      ? format(new Date(entry.graceEndDate), "PPP")
                      : "—"}
                  </td>
                  <td className="p-2 border">
                    {entry.actualReturnDate
                      ? format(new Date(entry.actualReturnDate), "PPP")
                      : "Not Returned"}
                  </td>
                  <td className="p-2 border text-red-600 font-semibold">
                    {entry.overdueDays}
                  </td>
                  <td className="p-2 border text-rose-500 font-bold">
                    ₹{entry.penalty}
                  </td>
                  <td className="p-2 border">
                    {entry.returned ? (
                      <span className="text-green-600 font-medium"> Yes</span>
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
        <div className="bg-white mt-10 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            📈 Monthly Overdue Insights
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 10, left: 0 }}
            >
              <XAxis dataKey="month" stroke="#4f46e5" />
              <YAxis allowDecimals={false} />
              <Tooltip />
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
