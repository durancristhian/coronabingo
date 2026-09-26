"""Usage: python3 measure-build.py /path/to/checkout [dist-directory]."""

import gzip
import json
from pathlib import Path
import sys


root = Path(sys.argv[1])
dist = root / (sys.argv[2] if len(sys.argv) > 2 else ".next-ui-tests")
manifest = json.loads((dist / "build-manifest.json").read_text())
excel_marker = b"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
routes = [
    "/",
    "/room/[roomId]",
    "/room/[roomId]/admin",
    "/room/[roomId]/[playerId]",
]


def describe_script(path):
    body = (dist / path).read_bytes()
    return {
        "path": path,
        "bytes": len(body),
        "gzip9_bytes": len(gzip.compress(body, compresslevel=9, mtime=0)),
        "contains_excel": excel_marker in body,
    }


all_scripts = [
    describe_script(str(path.relative_to(dist)))
    for path in (dist / "static/chunks").rglob("*.js")
]
result = {
    "method": (
        "Unique modern JavaScript from the build manifest per route, compressed "
        "with gzip level 9. Excel presence uses the XLSX MIME type emitted by "
        "zipcelx 1.6.2."
    ),
    "dist": str(dist),
    "routes": {},
    "excel_chunks": [
        script for script in all_scripts if script["contains_excel"]
    ],
}

for route in routes:
    files = list(
        dict.fromkeys(
            manifest["rootMainFiles"]
            + manifest["pages"]["/_app"]
            + manifest["pages"][route]
        )
    )
    scripts = [describe_script(path) for path in files if path.endswith(".js")]
    result["routes"][route] = {
        "js_bytes": sum(script["bytes"] for script in scripts),
        "js_gzip9_bytes": sum(script["gzip9_bytes"] for script in scripts),
        "excel_files": [
            script["path"] for script in scripts if script["contains_excel"]
        ],
    }

print(json.dumps(result, indent=2))
