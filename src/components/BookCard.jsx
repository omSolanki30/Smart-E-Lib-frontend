import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white p-4">
      <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>
      <p className="text-sm text-gray-600">{book.category}</p>
      <a
        href={book.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View PDF
      </a>
    </div>
  );
};

export default BookCard;
