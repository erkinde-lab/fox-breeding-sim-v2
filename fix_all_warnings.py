import sys
import re

path = 'src/lib/store.ts'
content = open(path).read()

# Replace unused parameters in actions with prefixed ones
replacements = [
    ('(dogId, vixenId) => {}', '(_dogId, _vixenId) => {}'),
    ('(itemId, price, currency, quantity = 1) => {}', '(_itemId, _price, _currency, _quantity = 1) => {}'),
    ('(foxId) => {}', '(_foxId) => {}'),
    ('(genotype, gender, name, eyeColor) => {}', '(_genotype, _gender, _name, _eyeColor) => {}'),
    ('(itemId, foxId) => {}', '(_itemId, _foxId) => {}'),
    ('(id, newName) => {}', '(_id, _newName) => {}'),
    ('(id) => {}', '(_id) => {}'),
    ('() => {}', '() => {}'), # no change
    ('(foxId, showId) => {}', '(_foxId, _showId) => {}'),
    ('(show) => {}', '(_show) => {}'),
    ('(showId) => {}', '(_showId) => {}'),
    ('(showId, updates) => {}', '(_showId, _updates) => {}'),
    ('(gold, gems) => set', '(_gold, _gems) => set'),
    ('(memberId, role) => {}', '(_memberId, _role) => {}'),
    ('(report) => {}', '(_report) => {}'),
    ('(reportId, action) => {}', '(_reportId, _action) => {}'),
    ('(postId) => {}', '(_postId) => {}'),
    ('(itemId, count) => {}', '(_itemId, _count) => {}'),
    ('(name, gender, genotype) => {}', '(_name, _gender, _genotype) => {}'),
    ('(foxId, stats) => {}', '(_foxId, _stats) => {}'),
    ('(action, details) => {}', '(_action, _details) => {}'),
    ('(memberId, reason) => {}', '(_memberId, _reason) => {}'),
    ('(memberId) => {}', '(_memberId) => {}'),
    ('(foxId, fee) => {}', '(_foxId, _fee) => {}'),
    ('(name, description, icon) => {}', '(_name, _description, _icon) => {}'),
    ('(categoryId, author, title, content) => {}', '(_categoryId, _author, _title, _content) => {}'),
    ('(postId, author, content) => {}', '(_postId, _author, _content) => {}'),
    ('(postId, replyId) => {}', '(_postId, _replyId) => {}'),
    ('(title, content, category) => {}', '(_title, _content, _category) => {}'),
    ('(id) => {}', '(_id) => {}'),
    ('(memberId, itemId, count) => {}', '(_memberId, _itemId, _count) => {}'),
    ('(memberId, itemId) => {}', '(_memberId, _itemId) => {}'),
    ('(listingId) => {}', '(_listingId) => {}'),
    ('(listingId, updates) => {}', '(_listingId, _updates) => {}'),
    ('(type, targetId, price, currency) => {}', '(_type, _targetId, _price, _currency) => {}'),
    ('(foxId, price, currency) => {}', '(_foxId, _price, _currency) => {}'),
    ('(config) => set', '(_config) => set'),
    ('() => {}', '() => {}'),
]

for old, new in replacements:
    content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

# Fix remaining any error in advanceTime
content = open(path).read()
content = content.replace('as any', 'as \"Spring\" | \"Summer\" | \"Autumn\" | \"Winter\"')
with open(path, 'w') as f:
    f.write(content)

print("Applied warning fixes to store.ts")
