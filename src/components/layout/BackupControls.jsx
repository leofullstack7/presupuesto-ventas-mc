import { useRef } from "react";

export function BackupControls({ onExport, onImport, className = "" }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = "";
  };

  return (
    <div className={"backup-controls" + (className ? ` ${className}` : "")}>
      <button type="button" className="reset-btn backup-btn" onClick={onExport}>
        ⬇️ Exportar datos
      </button>
      <button type="button" className="reset-btn backup-btn" onClick={() => inputRef.current?.click()}>
        ⬆️ Importar datos
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
