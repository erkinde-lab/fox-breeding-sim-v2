import re

with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()

# Add IP address column header if not present
content = content.replace(
    '<th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>',
    '<th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>\n                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">IP History</th>'
)

# Add IP address cell
content = content.replace(
    '</td>\n\n                        <td className="p-6 text-right space-x-2">',
    '</td>\n                        <td className="p-6">\n                          <span className="text-xs font-mono text-muted-foreground">\n                            {isSuperAdmin ? (member.ipHistory?.[0] || "N/A") : "[HIDDEN]"}\n                          </span>\n                        </td>\n                        <td className="p-6 text-right space-x-2">'
)

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(content)
