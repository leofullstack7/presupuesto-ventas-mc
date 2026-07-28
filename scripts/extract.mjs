import fs from "fs";

const src = fs.readFileSync("presupuesto-manizales-comparte.jsx", "utf8");
const rawStart = src.indexOf("const RAW_DATA = ");
const rawEnd = src.indexOf(";\n\nconst MONTHS", rawStart);
if (rawStart < 0 || rawEnd < 0) throw new Error("RAW_DATA not found");
const rawData = src.slice(rawStart + "const RAW_DATA = ".length, rawEnd);

const cssStart = src.indexOf("const CSS = `");
const cssEnd = src.lastIndexOf("`;");
if (cssStart < 0 || cssEnd < 0) throw new Error("CSS not found");
const css = src.slice(cssStart + "const CSS = `".length, cssEnd);

fs.mkdirSync("src/data", { recursive: true });
fs.mkdirSync("src/styles", { recursive: true });
fs.writeFileSync("src/data/rawData.js", `export const RAW_DATA = ${rawData};\n`);
fs.writeFileSync("src/styles/app.css", css);
console.log("Extracted rawData and CSS OK");
