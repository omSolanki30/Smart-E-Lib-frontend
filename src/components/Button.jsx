import React from 'react';

const Button = ({ children, ...props }) => (
  <button
    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
    {...props}
  >
    {children}
  </button>
);

export default Button;
