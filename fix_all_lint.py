import re
import os

def fix_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)

def regex_fix_file(path, pattern, replacement):
    if not os.path.exists(path):
        return
    with open(path, 'r') as f:
        content = f.read()
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open(path, 'w') as f:
        f.write(content)

# Fix src/app/help/page.tsx
fix_file('src/app/help/page.tsx', [
    ('"Commit Breeding"', '&quot;Commit Breeding&quot;'),
    ('"Altered"', '&quot;Altered&quot;'),
    ('Points & Majors', 'Points &amp; Majors')
])

# Fix src/app/kennel/page.tsx
if os.path.exists('src/app/kennel/page.tsx'):
    with open('src/app/kennel/page.tsx', 'r') as f:
        kennel_content = f.read()

    kennel_content = re.sub(r"import React, { useState, useEffect, Suspense, useMemo } from 'react';", "import React, { useState, Suspense, useMemo } from 'react';", kennel_content)
    kennel_content = re.sub(r"const \[activeTab, setActiveTab\] = useState\('dashboard'\);", "", kennel_content)
    kennel_content = re.sub(r"useEffect\(\(\) => \{.*?\}, \[searchParams\]\);",
        """const tabParam = searchParams.get('tab');
    const activeTab = useMemo(() => {
        if (tabParam && ['dashboard', 'adult', 'young', 'retired', 'hof'].includes(tabParam)) {
            return tabParam;
        }
        return 'dashboard';
    }, [tabParam]);""", kennel_content, flags=re.DOTALL)

    kennel_content = re.sub(r"const handleTabChange = \(tab: string\) => \{.*?setActiveTab\(tab\);.*?router\.push\(.*?\);.*?\};",
        """const handleTabChange = (tab: string) => {
        router.push(`/kennel?tab=${tab}`, { scroll: false });
    };""", kennel_content, flags=re.DOTALL)

    with open('src/app/kennel/page.tsx', 'w') as f:
        f.write(kennel_content)

# Fix src/app/shows/page.tsx any types
fix_file('src/app/shows/page.tsx', [
    ('setActiveTab(tab.id as any)', "setActiveTab(tab.id as 'amateur' | 'junior' | 'open' | 'senior' | 'altered' | 'history' | 'manage')"),
    ('setNewShowLevel(e.target.value as any)', 'setNewShowLevel(e.target.value as ShowLevel)'),
    ('setNewShowClass(e.target.value as any)', 'setNewShowClass(e.target.value as ShowClass)')
])

# Fix src/lib/showing.ts prefer-const
regex_fix_file('src/lib/showing.ts', r"let head = stats\.head", "const head = stats.head")
regex_fix_file('src/lib/showing.ts', r"let topline = stats\.topline", "const topline = stats.topline")
regex_fix_file('src/lib/showing.ts', r"let forequarters = stats\.forequarters", "const forequarters = stats.forequarters")
regex_fix_file('src/lib/showing.ts', r"let hindquarters = stats\.hindquarters", "const hindquarters = stats.hindquarters")
regex_fix_file('src/lib/showing.ts', r"let tail = stats\.tail", "const tail = stats.tail")
regex_fix_file('src/lib/showing.ts', r"let coatQuality = stats\.coatQuality", "const coatQuality = stats.coatQuality")
regex_fix_file('src/lib/showing.ts', r"let temperament = stats\.temperament", "const temperament = stats.temperament")
regex_fix_file('src/lib/showing.ts', r"let presence = stats\.presence", "const presence = stats.presence")

# Fix src/components/TutorialTour.tsx unused Store
fix_file('src/components/TutorialTour.tsx', [
    ('ShoppingBag, Home, Diamond, ShieldCheck, Store', 'ShoppingBag, Home, Diamond, ShieldCheck')
])

# Fix src/app/coming-soon/page.tsx missing alt
regex_fix_file('src/app/coming-soon/page.tsx', r"<img (.*?) />", r'<img \1 alt="Coming Soon" />')
