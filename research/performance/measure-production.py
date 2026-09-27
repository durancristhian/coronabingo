"""Read public assets without executing ads, Analytics, or Firestore requests.

Run from any directory. JSON goes to stdout; redirect to a new evidence file.
Sizes use gzip level 9 consistently, separately from actual HTTP body bytes.
"""

import concurrent.futures
import datetime
import gzip
import hashlib
import json
from pathlib import Path
import re
import subprocess
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
BASE = "https://coronabingo.com.ar"
CATALOG = json.dumps(json.loads((ROOT / "public/tickets.json").read_text()), separators=(",", ":")).encode()


def fetch(path):
    request = urllib.request.Request(BASE + path, headers={"Accept-Encoding": "gzip"})
    with urllib.request.urlopen(request, timeout=30) as response:
        wire = response.read()
        body = gzip.decompress(wire) if response.headers.get("Content-Encoding") == "gzip" else wire
        return body, {
            "path": path,
            "status": response.status,
            "wire_body_bytes": len(wire),
            "decoded_bytes": len(body),
            "gzip9_bytes": len(gzip.compress(body, compresslevel=9, mtime=0)),
            "sha256": hashlib.sha256(body).hexdigest(),
            "headers": {k.lower(): v for k, v in response.headers.items() if k.lower() in {
                "cache-control", "age", "x-vercel-cache", "content-type", "content-encoding", "etag"
            }},
        }


home, home_info = fetch("/")
html = home.decode()
build_id = json.loads(re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html).group(1))["buildId"]
initial = list(dict.fromkeys(
    path for before, path, after in re.findall(r'<script\b([^>]*?)src="([^"]+)"([^>]*)>', html)
    if path.startswith("/_next/") and "nomodule" not in (before + after).lower()
))
manifest, _ = fetch(f"/_next/static/{build_id}/_buildManifest.js")
route_chunks = ["/_next/" + path for path in re.findall(r'"(static/[^" ]+\.js)"', manifest.decode())]
css = re.findall(r'href="([^" ]+\.css)"', html)
samples = ["/background-cells/coronavirus.gif", "/sounds/cardi-b/coronavirus.mp3", "/tickets.json"]
paths = list(dict.fromkeys(initial + route_chunks + css + samples))


def inspect(path):
    body, info = fetch(path)
    info["initial_modern_js"] = path in initial
    if path.endswith(".js"):
        info["contains_full_catalog_literal"] = CATALOG in body
        if CATALOG in body:
            info["catalog_removal_gzip9_proxy_bytes"] = info["gzip9_bytes"] - len(gzip.compress(body.replace(CATALOG, b"[]"), compresslevel=9, mtime=0))
        if not path.endswith(("_buildManifest.js", "_ssgManifest.js")):
            try:
                source_map, _ = fetch(path + ".map")
                sources = json.loads(source_map)["sources"]
                wanted = ["@firebase/auth/", "@firebase/storage/", "@firebase/firestore/", "gray-matter/", "react-markdown/", "esprima/", "js-yaml/", "zipcelx/", "jszip/", "react-youtube/", "youtube-player/"]
                info["module_source_counts"] = {name: sum(name in source for source in sources) for name in wanted}
            except Exception as error:
                info["source_map_error"] = type(error).__name__
    return info


with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    resources = list(pool.map(inspect, paths))
cache_rechecks = [fetch(path)[1] for path in samples[:2]]
home_after, _ = fetch("/")
build_after = json.loads(re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', home_after.decode()).group(1))["buildId"]
assert build_id == build_after, "Deployment changed during collection; rerun."
report = {
    "observed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "local_git_head": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
    "production_build_id": build_id,
    "method": "Public HTTP GET, gzip9 normalized; initial HTML scripts excluding nomodule. No browser execution, no third-party requests. Source maps used only to identify modules, not counted as page payload. Build ID is not a verified Git SHA.",
    "home": home_info,
    "initial_modern_js_gzip9_bytes": sum(r["gzip9_bytes"] for r in resources if r["initial_modern_js"]),
    "initial_modern_js_decoded_bytes": sum(r["decoded_bytes"] for r in resources if r["initial_modern_js"]),
    "catalog": {"tickets": len(json.loads(CATALOG)), "minified_bytes": len(CATALOG), "gzip9_bytes": len(gzip.compress(CATALOG, compresslevel=9, mtime=0))},
    "resources": resources,
    "cache_rechecks": cache_rechecks,
}
print(json.dumps(report, indent=2))
