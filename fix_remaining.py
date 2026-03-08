import sys
import os

# Settings fixes
path_settings = 'src/app/settings/page.tsx'
if os.path.exists(path_settings):
    content = open(path_settings).read()
    content = content.replace('currentMemberId,', 'currentMemberId, setCurrentMemberId,')
    content = content.replace('setFontSize(size )', 'setFontSize(size as any)')
    content = content.replace('setTextSpacing(spacing )', 'setTextSpacing(spacing as any)')
    with open(path_settings, 'w') as f:
        f.write(content)

# Shows fixes
path_shows = 'src/app/shows/page.tsx'
if os.path.exists(path_shows):
    content = open(path_shows).read()
    content = content.replace('setActiveTab(tab.id )', 'setActiveTab(tab.id as any)')
    content = content.replace('setNewShowLevel(e.target.value )', 'setNewShowLevel(e.target.value as any)')
    content = content.replace('setNewShowVariety(e.target.value )', 'setNewShowVariety(e.target.value as any)')
    with open(path_shows, 'w') as f:
        f.write(content)

# Dashboard fixes
path_dash = 'src/components/Dashboard.tsx'
if os.path.exists(path_dash):
    content = open(path_dash).read()
    content = content.replace('variant={award.variant }', 'variant={award.variant as any}')
    with open(path_dash, 'w') as f:
        f.write(content)

# Fox Page Flag fix
path_fox = 'src/app/fox/[id]/page.tsx'
if os.path.exists(path_fox):
    content = open(path_fox).read()
    if 'Flag' in content and 'Flag,' not in content:
        content = content.replace('Diamond,', 'Diamond,\n  Flag,')
    with open(path_fox, 'w') as f:
        f.write(content)
