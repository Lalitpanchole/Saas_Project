const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const lines = schema.split('\n');
const mappedLines = lines.map(line => {
  let mappedLine = line;

  // Fix @@index([role_id]...) -> @@index([roleId]...)
  if (mappedLine.includes('@@index([') || mappedLine.includes('@@unique([')) {
    mappedLine = mappedLine.replace(/\[([^\]]+)\]/g, (match, inner) => {
      const camelInner = inner.split(',').map(s => {
        const t = s.trim();
        return t.replace(/_([a-z0-9])/g, g => g[1].toUpperCase());
      }).join(', ');
      return `[${camelInner}]`;
    });
  }
  
  // Fix @relation(fields: [role_id], references: [id]) -> fields: [roleId]
  if (mappedLine.includes('@relation(')) {
    mappedLine = mappedLine.replace(/fields:\s*\[([^\]]+)\]/, (match, inner) => {
      const camelInner = inner.split(',').map(s => {
        const t = s.trim();
        return t.replace(/_([a-z0-9])/g, g => g[1].toUpperCase());
      }).join(', ');
      return `fields: [${camelInner}]`;
    });
  }
  
  return mappedLine;
});

fs.writeFileSync('prisma/schema.prisma', mappedLines.join('\n'));
console.log('Done fixing relations.');
