import React, { useState } from "react";

function Dropdown({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 열기
  const openDropdown = () => {
    setIsOpen(true);
  };

  // 드롭다운 닫기
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // 드롭다운 항목 클릭 시 닫기
  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="dropdown relative"
      onMouseEnter={openDropdown} // 마우스 오버 시 열기
      onMouseLeave={closeDropdown} // 마우스 벗어날 때 닫기
    >
      <button
        className="dropdown-toggle w-full bg-orange-400 text-white text-xs md:text-sm py-2 px-2 rounded hover:bg-orange-600"
        onClick={openDropdown} // 버튼 클릭 시 열기
      >
        {label}
      </button>

      {isOpen && (
        <ul className="dropdown-menu absolute center bg-white border rounded shadow-lg w-full"
        onClick={handleItemClick}>
          {children}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
