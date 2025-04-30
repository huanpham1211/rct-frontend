// src/components/MultiSelectCheckboxGroup.js
import React from 'react';
import './MultiSelectCheckboxGroup.css'; // 👈 styling in separate CSS file

const MultiSelectCheckboxGroup = ({
  options = [],
  selectedValues = [],
  onChange,
  disabled = false,
}) => {
  const handleToggle = (value) => {
    let updated = [...selectedValues];
    if (updated.includes(value)) {
      updated = updated.filter((v) => v !== value);
    } else {
      updated.push(value);
    }
    onChange(updated);
  };

  return (
    <div className="checkbox-group-container">
      {options.map((opt, idx) => {
        const val = opt.trim();
        return (
          <label key={idx} className={`checkbox-option ${disabled ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              value={val}
              checked={selectedValues.includes(val)}
              onChange={() => handleToggle(val)}
              disabled={disabled}
            />
            <span>{val}</span>
          </label>
        );
      })}
    </div>
  );
};

export default MultiSelectCheckboxGroup;
