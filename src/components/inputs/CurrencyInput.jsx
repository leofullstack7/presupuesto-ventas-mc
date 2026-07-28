import { useState, useEffect } from "react";
import { fmtCOP } from "../../utils/format.js";
export function CurrencyInput({ value, onChange, className, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(value == null ? "" : String(value));

  useEffect(() => {
    if (!focused) setRaw(value == null ? "" : String(value));
  }, [value, focused]);

  const display = focused ? raw : (value == null ? "" : fmtCOP(value));

  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      placeholder={placeholder}
      value={display}
      onFocus={(e) => { setFocused(true); setRaw(value == null ? "" : String(value)); e.target.select(); }}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^\d]/g, "");
        setRaw(digits);
        onChange(digits);
      }}
    />
  );
}

