import React from 'react';

function DropdownItem({ onClick, children }) {
  return (
    <li onClick={onClick} className=" text-xs md:text-xl dropdown-item py-2 px-4 cursor-pointer hover:bg-orange-200 hover:text-white">
      {children}
    </li>
  );
}

export default DropdownItem;
