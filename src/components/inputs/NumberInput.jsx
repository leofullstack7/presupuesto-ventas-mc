import { useState, useEffect } from "react";
export function NumberInput({ value, onChange, className, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(value == null ? "" : String(value));

  useEffect(() => {
    if (!focused) setRaw(value == null ? "" : String(value));
  }, [value, focused]);

  const display = focused ? raw : (value == null ? "" : String(value));

  return (
    <input
      type="number"
      min="0"
      className={className}
      placeholder={placeholder}
      value={display}
      onFocus={(e) => { setFocused(true); setRaw(value == null ? "" : String(value)); e.target.select(); }}
      onBlur={() => setFocused(false)}
      onChange={(e) => { setRaw(e.target.value); onChange(e.target.value); }}
    />
  );
}

