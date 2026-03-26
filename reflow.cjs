const fs = require('fs');

const path = 'c:\\Users\\julio\\OneDrive\\Documentos\\checkin\\pixel-perfect-replication\\src\\components\\hotel-pms\\CheckInModal.tsx';
let txt = fs.readFileSync(path, 'utf8');

// 1. Make all 12-col grids responsive (col-cols-1 on sm, 12 on md/lg)
txt = txt.replace(/\bgrid-cols-12\b/g, "grid-cols-1 md:grid-cols-12");

// 2. Make all column spans responsive (fallback to 12 rows on mobile)
// Match `col-span-[0-9]+` unless preceded by `md:` or `sm:`
txt = txt.replace(/(?<![a-z]{2}:)(col-span-\d+)/g, (match, p1) => {
    if (p1 === 'col-span-12') return match; // already full width
    return `col-span-12 md:${match}`;
});

// 3. Modals and fixed width classes
// We want max-[1300px]:w-[1200px] xl:w-[1200px] 2xl:w-[1300px] to be responsive
txt = txt.replace(/w-full max-\[1300px\]:w-\[1200px\] xl:w-\[1200px\] 2xl:w-\[1300px\]/g, 
  "w-[95vw] md:w-full md:max-[1300px]:max-w-[1200px] xl:max-w-[1200px] 2xl:max-w-[1300px]");
// Replace manual fixed max-widths for other modals
txt = txt.replace(/\bw-full max-w-2xl\b/g, 'w-[95vw] md:w-full md:max-w-2xl');
txt = txt.replace(/\bw-full max-w-3xl\b/g, 'w-[95vw] md:w-full md:max-w-3xl');

// 4. Transform scale breaking mobile views
txt = txt.replace(/style=\{\{\s*transform:\s*'scale\(0\.85\)',\s*transformOrigin:\s*'center'\s*\}\}/g, "");
// also there was a `style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}`
txt = txt.replace(/style=\{\{\s*transform:\s*"scale\(0\.85\)",\s*transformOrigin:\s*"center"\s*\}\}/g, "");

// 5. Flex container rows that don't wrap and have multiple inputs
txt = txt.replace(/\bflex gap-4\b/g, "flex flex-col md:flex-row gap-4");
txt = txt.replace(/\bflex gap-3\b/g, "flex flex-col md:flex-row gap-3");
txt = txt.replace(/<div className="flex">/g, '<div className="flex flex-col md:flex-row">'); 
// wait, if "flex" has items-center, it is probably safe to leave "flex flex-row" but with wrap.
// the problem with `<div className="flex">` is if it has inputs attached to ActionBtn.
// inputs attached to ActionBtns should NOT be flex-col, they form a single input group.

// 6. Fix widths in generic forms (`w-24`, `w-32`) which break if inside flex-row, but if we do flex-col on mobile, they need to be w-full.
// We change: className="w-24" -> className="w-full md:w-24"
txt = txt.replace(/\bclassName="w-(\d{2})"\b/g, 'className="w-full md:w-$1"');

// 7. Fix footer section (h-14 flex items-center ...)
txt = txt.replace(/className="h-14 flex items-center justify-end gap-5 px-5 border-t border-border bg-card rounded-b-lg flex-shrink-0"/g,
  'className="flex flex-col md:flex-row md:h-14 p-4 md:p-0 md:px-5 items-center justify-center md:justify-end gap-4 border-t border-border bg-card rounded-b-lg flex-shrink-0"');

fs.writeFileSync(path, txt, 'utf8');
console.log("Updated checkin modal successfully.");
