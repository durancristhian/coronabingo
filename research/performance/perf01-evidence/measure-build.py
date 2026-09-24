"""Usage: python3 measure-build.py /path/to/checkout > result.json"""
import gzip
import json
from pathlib import Path
import sys

root = Path(sys.argv[1]) / ".next"
manifest = json.loads((root / "build-manifest.json").read_text())
out = {"method": "Build manifest, unique modern JS/CSS per route, gzip level 9. Excludes nomodule polyfills and manifest scripts. Same environment before/after.", "routes": {}}
for route in ["/", "/room/[roomId]", "/room/[roomId]/admin", "/room/[roomId]/[playerId]"]:
    files = list(dict.fromkeys(manifest["rootMainFiles"] + manifest["pages"]["/_app"] + manifest["pages"][route]))
    rows = []
    for name in files:
        body = (root / name).read_bytes()
        rows.append({"path": name, "bytes": len(body), "gzip9_bytes": len(gzip.compress(body, compresslevel=9, mtime=0))})
    out["routes"][route] = {"files": rows, "js_gzip9_bytes": sum(r["gzip9_bytes"] for r in rows if r["path"].endswith(".js")), "css_gzip9_bytes": sum(r["gzip9_bytes"] for r in rows if r["path"].endswith(".css"))}
out["news_sources"] = []
for file in (root / "static").rglob("*.js.map"):
    sources = json.loads(file.read_text()).get("sources", [])
    out["news_sources"].extend(source for source in sources if any(name in source for name in ["gray-matter/", "react-markdown/", "components/NewsModal", "micromark/", "remark-parse/", "remark-rehype/"]))
print(json.dumps(out, indent=2))
