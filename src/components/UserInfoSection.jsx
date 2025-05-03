import React from 'react';

const StatCard = ({ title, value, color }) => (
  <div className={`flex flex-col items-center justify-center bg-white dark:bg-gray-900 shadow-md rounded-xl px-6 py-4 border-t-4 ${color}`}>
    <h3 className="text-3xl font-bold mb-1 text-gray-800 dark:text-white">{value}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</p>
  </div>
);

const UserInfoSection = ({ currentIssued, totalIssued }) => (
  <section className="flex flex-wrap justify-center gap-6 mb-10">
    <StatCard title="Books Currently Issued" value={currentIssued} color="border-blue-500 dark:border-blue-400" />
    <StatCard title="Total Books Issued" value={totalIssued} color="border-green-500" />
  </section>
);

export default UserInfoSection;
