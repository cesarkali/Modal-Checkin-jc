const fs = require('fs');
const path = 'c:\\Users\\julio\\OneDrive\\Documentos\\checkin\\pixel-perfect-replication\\src\\components\\hotel-pms\\CheckInModal.tsx';
let txt = fs.readFileSync(path, 'utf8');

txt = txt.replace(/<div className="flex flex-col md:flex-row">/g, '<div className="flex">');

fs.writeFileSync(path, txt, 'utf8');
console.log("Reverted flex-col issue");
