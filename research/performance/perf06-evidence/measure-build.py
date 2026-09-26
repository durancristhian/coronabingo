"""Usage: python3 measure-build.py /path/to/checkout [dist-directory]."""

import gzip
import json
from pathlib import Path
import sys


root = Path(sys.argv[1])
dist = root / (sys.argv[2] if len(sys.argv) > 2 else ".next-ui-tests")
manifest = json.loads((dist / "build-manifest.json").read_text())
marker = b"youtube.com/iframe_api"

initial_files = list(
    dict.fromkeys(
        manifest["rootMainFiles"]
        + manifest["pages"]["/_app"]
        + manifest["pages"]["/"]
    )
)


def describe(name):
    body = (dist / name).read_bytes()
    return {
        "path": name,
        "bytes": len(body),
        "gzip9_bytes": len(gzip.compress(body, compresslevel=9, mtime=0)),
        "contains_youtube_player": marker in body,
    }


initial_scripts = [describe(name) for name in initial_files if name.endswith(".js")]
all_scripts = [
    describe(path.relative_to(dist).as_posix())
    for path in (dist / "static" / "chunks").rglob("*.js")
]

print(
    json.dumps(
        {
            "method": (
                "Unique modern JavaScript assigned to the homepage by the build "
                "manifest, compressed with gzip level 9. Player chunks contain "
                "the youtube.com/iframe_api marker used by youtube-player."
            ),
            "dist": str(dist),
            "homepage": {
                "js_bytes": sum(script["bytes"] for script in initial_scripts),
                "js_gzip9_bytes": sum(
                    script["gzip9_bytes"] for script in initial_scripts
                ),
                "player_files": [
                    script["path"]
                    for script in initial_scripts
                    if script["contains_youtube_player"]
                ],
            },
            "all_player_chunks": [
                script for script in all_scripts if script["contains_youtube_player"]
            ],
        },
        indent=2,
    )
)
