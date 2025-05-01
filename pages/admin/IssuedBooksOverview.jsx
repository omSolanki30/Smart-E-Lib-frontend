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
      const res = await axios.get(
        "http://localhost:5000/api/reports/issued-stats"
      );
      setData(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          📊 Issued Books Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow border">
            <p className="text-sm text-gray-500">Total Issued</p>
            <h2 className="text-xl font-bold text-blue-600">
              {data.totalIssued}
            </h2>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border">
            <p className="text-sm text-gray-500">Currently Issued</p>
            <h2 className="text-xl font-bold text-orange-600">
              {data.currentlyIssued}
            </h2>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border">
            <p className="text-sm text-gray-500">Returned</p>
            <h2 className="text-xl font-bold text-green-600">
              {data.returned}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border">
          <h3 className="text-lg font-semibold mb-3">
            📅 Monthly Issued Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IssuedBooksOverview;
