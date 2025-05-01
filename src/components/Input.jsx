import React from "react";

const Input = ({ label, ...props }) => (
  <div className="mb-5">
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      {...props}
    />
  </div>
);

export default Input;
