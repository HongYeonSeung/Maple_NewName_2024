import React, { useEffect } from "react";

function Checkbox({ options, checkedItems, onChange }) {

  const handleChange = (event) => {
    const { name, checked } = event.target;
    const newCheckedItems = {
      ...checkedItems,
      [name]: checked,
    };

    // 상태가 업데이트 된 후 부모 컴포넌트에 변경 사항을 알림
    onChange(newCheckedItems);
  };

  useEffect(() => {
    onChange(checkedItems);
  }, [checkedItems, onChange]);

  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-1 md:space-x-6">
          <input
            type="checkbox"
            name={option}
            checked={!!checkedItems[option]}
            onChange={handleChange}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-xs md:text-xl">{option}</span>
        </label>
      ))}
    </div>
  );
}

export default Checkbox;
