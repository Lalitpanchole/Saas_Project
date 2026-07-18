const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Regex to find field definitions like:
// field_name Type @attributes
// and change it to:
// fieldName Type @map("field_name") @attributes
const lines = schema.split('\n');
const mappedLines = lines.map(line => {
  // Only process lines inside models that look like fields
  if (/^\s+[a-z_]+\s+[A-Za-z0-9_?\[\]]+(\s+@.*)?$/.test(line)) {
    return line.replace(/^(\s+)([a-z_]+)(\s+)(.*)$/, (match, space, name, space2, rest) => {
      if (!name.includes('_')) return match;
      
      const camel = name.replace(/_([a-z0-9])/g, g => g[1].toUpperCase());
      // Handle relation fields differently (if they are just relation objects without @map)
      // Usually relations like `activity_logs activity_logs[]` or `other_users users[]`
      // Wait, relations in Prisma don't get @map. Only scalar fields get @map.
      // So if it's a relation field, we just camelCase it. Wait, relations to other models
      // like `RolePermission[]` have already been camelCased by my previous edit (e.g. `role_permissions RolePermission[]`).
      
      // Let's just camelCase the field name. If it's a scalar field, add @map.
      // How to know if it's a scalar? Scalars are Int, String, Boolean, DateTime, etc.
      // Or they have @db... or @default...
      // Or we can just add @map("...") for everything and if Prisma complains, we fix it?
      // Actually Prisma doesn't allow @map on relation fields.
      const isScalar = /^(Int|String|Boolean|DateTime|Float|Decimal|Json)/.test(rest.trim());
      
      if (isScalar) {
        return `${space}${camel}${space2}${rest} @map("${name}")`;
      } else {
        // Relation field, just camel case it. Wait, if it already has @relation(fields: [role_id]), 
        // we need to fix the fields: [role_id] to fields: [roleId] later.
        return `${space}${camel}${space2}${rest}`;
      }
    });
  }
  
  // Fix @@index([role_id]...) -> @@index([roleId]...)
  if (line.includes('@@index([') || line.includes('@@unique([')) {
    return line.replace(/\[([^\]]+)\]/g, (match, inner) => {
      const camelInner = inner.split(',').map(s => {
        const t = s.trim();
        return t.replace(/_([a-z0-9])/g, g => g[1].toUpperCase());
      }).join(', ');
      return `[${camelInner}]`;
    });
  }
  
  // Fix @relation(fields: [role_id], references: [id]) -> fields: [roleId]
  if (line.includes('@relation(')) {
    return line.replace(/fields:\s*\[([^\]]+)\]/, (match, inner) => {
      const camelInner = inner.split(',').map(s => {
        const t = s.trim();
        return t.replace(/_([a-z0-9])/g, g => g[1].toUpperCase());
      }).join(', ');
      return `fields: [${camelInner}]`;
    });
  }
  
  return line;
});

fs.writeFileSync('prisma/schema.prisma', mappedLines.join('\n'));
console.log('Done mapping schema.');
