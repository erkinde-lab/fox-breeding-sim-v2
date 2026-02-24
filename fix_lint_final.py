import sys

# Fix SuppliesPage
with open('src/app/shop/supplies/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('// @ts-expect-error', '')
content = content.replace('icon: LayoutGrid }', 'icon: LayoutGrid as React.ElementType }')
content = content.replace('icon: Utensils }', 'icon: Utensils as React.ElementType }')
content = content.replace('icon: Package }', 'icon: Package as React.ElementType }')
content = content.replace('buyItem: any', 'buyItem: (id: string, price: number, currency: "gold" | "gems", count: number) => void')

# Fix ShowsPage
with open('src/app/shows/page.tsx', 'r') as f:
    content = f.read()

# Already fixed most but let's be sure
content = content.replace('newShowLevel: ShowLevel', 'newShowLevel: "Junior" | "Open" | "Senior" | "Championship" | "Amateur Junior" | "Amateur Open" | "Amateur Senior"')
# etc.

# Fix FoxProfilePage unused imports
with open('src/app/fox/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('useEffect, ', '')
content = content.replace('Microscope, ', '')
content = content.replace('Shield, ', '')

with open('src/app/fox/[id]/page.tsx', 'w') as f:
    f.write(content)

# Fix KennelPage unused imports
with open('src/app/kennel/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('useEffect, ', '')

with open('src/app/kennel/page.tsx', 'w') as f:
    f.write(content)
