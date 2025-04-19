"use client";
import React from "react";

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  multiline = false,
  rows = 3,
  className = "",
  id,
  name,
  disabled = false,
  error,
}) => {
  const baseClasses = "p-2 border rounded bg-white text-black text-sm w-full";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "";

  const combinedClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={combinedClasses}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={combinedClasses}
          disabled={disabled}
          required={required}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
