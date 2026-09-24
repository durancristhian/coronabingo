"""Usage: python3 measure-build.py /path/to/checkout [dist-directory]."""

import gzip
import json
from pathlib import Path
import sys


root = Path(sys.argv[1])
dist = root / (sys.argv[2] if len(sys.argv) > 2 else ".next-ui-tests")
manifest = json.loads((dist / "build-manifest.json").read_text())
catalog = json.dumps(
    json.loads((root / "public/tickets.json").read_text()), separators=(",", ":")
).encode()
routes = [
    "/",
    "/room/[roomId]",
    "/room/[roomId]/admin",
    "/room/[roomId]/[playerId]",
]
result = {
    "method": (
        "Unique modern JavaScript from the build manifest per route, compressed "
        "with gzip level 9. Catalog presence requires the exact minified JSON literal."
    ),
    "dist": str(dist),
    "catalog_minified_bytes": len(catalog),
    "routes": {},
}

for route in routes:
    files = list(
        dict.fromkeys(
            manifest["rootMainFiles"]
            + manifest["pages"]["/_app"]
            + manifest["pages"][route]
        )
    )
    scripts = []
    for name in files:
        if not name.endswith(".js"):
            continue
        body = (dist / name).read_bytes()
        scripts.append(
            {
                "path": name,
                "bytes": len(body),
                "gzip9_bytes": len(gzip.compress(body, compresslevel=9, mtime=0)),
                "contains_catalog": catalog in body,
            }
        )
    result["routes"][route] = {
        "js_bytes": sum(script["bytes"] for script in scripts),
        "js_gzip9_bytes": sum(script["gzip9_bytes"] for script in scripts),
        "catalog_files": [
            script["path"] for script in scripts if script["contains_catalog"]
        ],
    }

print(json.dumps(result, indent=2))
