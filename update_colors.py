import os
import re

files_to_update = [
    "src/index.css",
    "src/components/layout/Navbar.tsx",
    "src/components/layout/Sidebar.tsx",
    "src/components/trailhead/TrailheadDashboard.tsx",
    "src/components/common/TrackSelector.tsx",
    "src/components/common/SkillGraphModal.tsx"
]

replacements = {
    "#0F172A": "#14231E",
    "#2563EB": "#1F5E4D",
    "#38BDF8": "#B8872F",
    "#F97316": "#B8872F",
    "#090D16": "#14231E",
    "#111827": "#FFFFFF",
    "#1E293B": "#DDE4DE",
    "#F59E0B": "#B8872F",
    "#F8FAFC": "#F7F8F5",
    "shadow-md": "shadow-sm",
    "shadow-lg": "shadow-sm",
    "shadow-xl": "shadow-sm",
    "shadow-2xl": "shadow-sm",
    "shadow-inner": "shadow-sm"
}

for filepath in files_to_update:
    path = os.path.join("c:/Projects/careeros", filepath)
    if not os.path.exists(path):
        print(f"Not found: {path}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = re.sub(re.escape(old), new, content, flags=re.IGNORECASE)
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated: {path}")
