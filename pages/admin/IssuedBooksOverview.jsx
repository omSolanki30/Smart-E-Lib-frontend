import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import Navbar from "../../src/components/Navbar";

const IssuedBooksOverview = () => {
  const [data, setData] = useState({
    totalIssued: 0,
    currentlyIssued: 0,
    returned: 0,
    monthlyData: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}api/reports/issued-stats`
        );
        setData(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching issued stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          📊 Issued Books Overview
        </h1>

        {/* Universal Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Issued (All Time)</p>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {data.totalIssued}
            </h2>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently Issued</p>
            <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {data.currentlyIssued}
            </h2>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Returned</p>
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
              {data.returned}
            </h2>
          </div>
        </div>

        {/* Monthly Breakdown Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
            📅 Monthly Issued Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e2f",
                  borderColor: "#4f46e5",
                  color: "#f9f9f9",
                }}
                wrapperStyle={{ fontSize: "0.875rem" }}
                labelStyle={{ color: "#f3f4f6" }}
              />
              <Legend />
              <Bar dataKey="issued" fill="#6366F1" name="Total Issued" />
              <Bar dataKey="currentlyIssued" fill="#F97316" name="Currently Issued" />
              <Bar dataKey="returned" fill="#10B981" name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IssuedBooksOverview;
