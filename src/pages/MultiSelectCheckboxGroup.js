// src/components/MultiSelectCheckboxGroup.js
import React from 'react';
import './MultiSelectCheckboxGroup.css'; // 👈 styling in separate CSS file

const MultiSelectCheckboxGroup = ({
  options = [],
  selectedValues = [],
  onChange,
  disabled = false,
  required = false,
  fieldName = '',
}) => {
  const showError = required && selectedValues.length === 0;

  return (
    <div className="checkbox-group-container">
      {options.map((opt, idx) => {
        const val = opt.trim();
        return (
          <label key={idx} className={`checkbox-option ${disabled ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              name={fieldName}
              value={val}
              checked={selectedValues.includes(val)}
              onChange={() => {
                let updated = [...selectedValues];
                if (updated.includes(val)) {
                  updated = updated.filter((v) => v !== val);
                } else {
                  updated.push(val);
                }
                onChange(updated);
              }}
              disabled={disabled}
            />
            <span>{val}</span>
          </label>
        );
      })}
      {showError && (
        <p className="error-text">Bạn cần chọn ít nhất một lựa chọn.</p>
      )}
    </div>
  );
};


export default MultiSelectCheckboxGroup;
