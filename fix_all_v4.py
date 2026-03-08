import os
import re

def fix_entities(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    # Replace quotes in text nodes but avoid attributes
    # A simple but effective way is to look for > text " text <
    # but that's hard.
    # We'll just replace the specific ones from logs.

    if "admin" in path:
        content = content.replace("includes('Spawn')", 'includes(&quot;Spawn&quot;)')
        content = content.replace("includes('Ban')", 'includes(&quot;Ban&quot;)')
        content = content.replace("includes('Warn')", 'includes(&quot;Warn&quot;)')

    if "privacy" in path:
        content = content.replace('"local storage"', '&quot;local storage&quot;')
        content = content.replace("don't", "don&apos;t")
        content = content.replace('"rehomed"', '&quot;rehomed&quot;')

    if "tos" in path:
        content = content.replace('("multi-accounting")', '(&quot;multi-accounting&quot;)')
        content = content.replace('("Real Money Trading")', '(&quot;Real Money Trading&quot;)')
        content = content.replace('("scrapers")', '(&quot;scrapers&quot;)')
        content = content.replace('("rehomed")', '(&quot;rehomed&quot;)')

    with open(path, 'w') as f:
        f.write(content)

def fix_cascading_render():
    path = 'src/app/foundation-fox-store/page.tsx'
    if not os.path.exists(path): return
    content = open(path).read()

    # Replace the useEffect logic
    old_effect = """  // Clear soldSlots when foundation foxes are repopulated (count INCREASES)
  useEffect(() => {
    const currentCount = foundationFoxes.length;
    if (prevFoundationCount > 0 && currentCount > prevFoundationCount) {
      // Foundation foxes were repopulated (count increased), clear sold slots
      setSoldSlots(new Set());
    }
    setPrevFoundationCount(currentCount);
  }, [foundationFoxes.length, prevFoundationCount]);"""

    new_effect = """  // Track previous foundation fox count to detect repopulation
  const prevCountRef = React.useRef(foundationFoxes.length);

  // Clear soldSlots when foundation foxes are repopulated (count INCREASES)
  useEffect(() => {
    const currentCount = foundationFoxes.length;
    if (prevCountRef.current > 0 && currentCount > prevCountRef.current) {
      // Foundation foxes were repopulated (count increased), clear sold slots
      setSoldSlots(new Set());
    }
    prevCountRef.current = currentCount;
  }, [foundationFoxes.length]);"""

    content = content.replace(old_effect, new_effect)
    # Remove unused state
    content = content.replace('const [prevFoundationCount, setPrevFoundationCount] = useState(0);', '')

    with open(path, 'w') as f:
        f.write(content)

def fix_unused_vars():
    # We'll just run a broad replacement for the common ones in store.ts
    path = 'src/lib/store.ts'
    if not os.path.exists(path): return
    content = open(path).read()

    # Prefix unused params in empty actions
    params = [
        'dogId', 'vixenId', 'itemId', 'price', 'currency', 'quantity', 'foxId',
        'genotype', 'gender', 'name', 'eyeColor', 'id', 'newName', 'showId',
        'show', 'updates', 'gold', 'gems', 'memberId', 'role', 'report',
        'reportId', 'action', 'postId', 'itemId', 'count', 'stats', 'reason',
        'fee', 'feedId', 'description', 'icon', 'categoryId', 'author',
        'title', 'content', 'replyId', 'category', 'listingId', 'type', 'targetId', 'config'
    ]

    for p in params:
        # Match only when it's a parameter in an arrow function that returns empty block
        # e.g. (foxId) => {}  -> (_foxId) => {}
        content = re.sub(r'\((' + p + r')\)\s*=>\s*\{', r'(_\1) => {', content)
        content = re.sub(r', (' + p + r')\)\s*=>\s*\{', r', _\1) => {', content)
        content = re.sub(r'\((' + p + r'),', r'(_\1,', content)
        content = re.sub(r', (' + p + r'),', r', _\1,', content)

    with open(path, 'w') as f:
        f.write(content)

fix_entities('src/app/admin/page.tsx')
fix_entities('src/app/privacy/page.tsx')
fix_entities('src/app/tos/page.tsx')
fix_cascading_render()
fix_unused_vars()
print("Applied v4 fixes")
