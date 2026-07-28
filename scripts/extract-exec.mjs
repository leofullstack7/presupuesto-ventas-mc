import fs from "fs";

const src = fs.readFileSync("presupuesto-manizales-comparte.jsx", "utf8");
const a = src.indexOf("function ExecutivePresentation");
const b = src.indexOf("\nconst CSS = `");
const body = src.slice(a, b).replace(/^function ExecutivePresentation/, "export function ExecutivePresentation");
const header = `import React, { useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";

`;
fs.writeFileSync("src/components/dashboard/ExecutivePresentation.jsx", header + body);
console.log("ExecutivePresentation OK");
