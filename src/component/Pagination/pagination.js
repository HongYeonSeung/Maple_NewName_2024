import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, onPageChange, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isMobile = window.matchMedia("(max-width: 768px)").matches; // 모바일로 접속 감지

  const pagesToShow = isMobile ? 5 : 10;
  const halfPagesToShow = Math.floor(pagesToShow / 2);

  // 페이지 범위 계산
  const startPage = Math.max(1, currentPage - halfPagesToShow);
  const endPage = Math.min(totalPages, currentPage + halfPagesToShow);

  // 필요한 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4 text-xs md:text-lg">
      <ul className="flex space-x-2">
        {/* 이전 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-2 md:px-4 md:py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 hover:bg-red-500 hover:text-white"
          >
            &laquo;
          </button>
        </li>

        {/* 첫 페이지와 ... 표시 */}
        {startPage > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="px-2 py-2  md:block md:px-4 md:py-2 rounded bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white"
              >
                1
              </button>
            </li>
            {startPage > 2 && <li className="px-2 py-2 md:block md:px-4 md:py-2">...</li>}
          </>
        )}

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              onClick={() => onPageChange(pageNumber)}
              className={`px-2 py-2 md:px-4 md:py-2 rounded ${currentPage === pageNumber ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white'}`}
            >
              {pageNumber}
            </button>
          </li>
        ))}

        {/* 마지막 페이지와 ... 표시 */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li className="px-2 py-2  md:block md:px-4 md:py-2">...</li>}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-2 py-2 md:block md:px-4 md::py-2 rounded bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* 다음 버튼 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-2 md:px-4 md:py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 hover:bg-red-500 hover:text-white"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
