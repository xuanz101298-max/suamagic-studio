import React, { useState, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  isTextArea?: boolean;
  rows?: number;
}

export default function EditableField({ value, onSave, className, isTextArea = false, rows = 2 }: EditableFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextArea) {
      e.currentTarget.blur();
    }
  };

  if (isTextArea) {
    return (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        className={className}
        rows={rows}
      />
    );
  }

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
}
