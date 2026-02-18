import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const addPageButton = (pageNumber) => {
      pageNumbers.push(
        <button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          className={`px-3 py-1 border border-gray-300 rounded-md transition ${
            pageNumber === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
          }`}
        >
          {pageNumber}
        </button>
      );
    };

    const addEllipsis = (key) => (
      <span key={key} className="px-3 py-1 text-gray-500">
        ...
      </span>
    );

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    addPageButton(1);

    if (start > 2) {
      pageNumbers.push(addEllipsis('ellipsis-start'));
    }

    for (let i = start; i <= end; i++) {
      if (i >= 2 && i <= totalPages - 1) {
        addPageButton(i);
      }
    }

    if (end < totalPages - 1) {
      pageNumbers.push(addEllipsis('ellipsis-end'));
    }

    if (totalPages > 1) {
      addPageButton(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mt-8 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className={`px-3 py-1 border border-gray-300 rounded-md transition ${
          page === 1
            ? 'opacity-50 cursor-not-allowed text-gray-400'
            : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
        }`}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-3 py-1 border border-gray-300 rounded-md transition ${
          page === totalPages
            ? 'opacity-50 cursor-not-allowed text-gray-400'
            : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
