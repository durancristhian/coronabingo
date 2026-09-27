#!/usr/bin/env bash

set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(git -C "$script_dir" rev-parse --show-toplevel)
sounds_dir="$repo_root/public/sounds"
generated_dir="$script_dir/generated"
lossy_dir="$generated_dir/lossy"
lossless_dir="$generated_dir/lossless"
rejected_dir="$generated_dir/rejected"
tools_dir="$generated_dir/.tools"

for command_name in curl ffmpeg ffprobe shasum unzip; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'Falta el comando requerido: %s\n' "$command_name" >&2
    exit 1
  fi
done

if [ "$(uname -s)" != "Darwin" ]; then
  printf 'Esta demo descarga el binario de mp3packercpp para macOS.\n' >&2
  exit 1
fi

case "$(uname -m)" in
  arm64)
    tool_archive=mp3packercpp-darwin-arm64.zip
    tool_checksum=ad2e4c2b49ddfe19066dc582244fd42c89e9fa599639652ce46a3083d070a8ad
    ;;
  x86_64)
    tool_archive=mp3packercpp-darwin-x64.zip
    tool_checksum=f0a570a362725e614ce97345f1f2fb8c466e45f74cb1f5f9f956535226ee84c0
    ;;
  *)
    printf 'Arquitectura no soportada por esta demo: %s\n' "$(uname -m)" >&2
    exit 1
    ;;
esac

mkdir -p "$lossy_dir" "$lossless_dir" "$rejected_dir" "$tools_dir"

tool_zip="$tools_dir/$tool_archive"
tool_binary="$tools_dir/mp3packercpp"
tool_url="https://github.com/Snesnopic/mp3packercpp/releases/download/v1.2.1/$tool_archive"

if [ ! -f "$tool_zip" ]; then
  printf 'Descargando mp3packercpp 1.2.1...\n'
  curl -fsSL "$tool_url" -o "$tool_zip"
fi

actual_checksum=$(shasum -a 256 "$tool_zip" | awk '{print $1}')
if [ "$actual_checksum" != "$tool_checksum" ]; then
  printf 'El checksum de mp3packercpp no coincide.\n' >&2
  exit 1
fi

if [ ! -x "$tool_binary" ]; then
  unzip -oq "$tool_zip" -d "$tools_dir"
  chmod +x "$tool_binary"
fi

manifest_tmp="$generated_dir/manifest.js.next"
printf '/* eslint-disable prettier/prettier */\n' > "$manifest_tmp"
printf 'window.PERF08_AUDIO_MANIFEST = {\n' >> "$manifest_tmp"
printf '  generatedAt: %s,\n' "$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")" >> "$manifest_tmp"
printf '  lossyMethod: "MP3 LAME VBR V4; V5 sólo cuando V4 no reduce",\n' >> "$manifest_tmp"
printf '  losslessMethod: "mp3packercpp 1.2.1 con PCM validado por FFmpeg",\n' >> "$manifest_tmp"
printf '  items: [\n' >> "$manifest_tmp"

first_item=1

while IFS= read -r source_file; do
  relative_path=${source_file#"$sounds_dir/"}
  original_bytes=$(stat -f %z "$source_file")
  original_bitrate=$(ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of default=nk=1:nw=1 "$source_file")

  lossy_file="$lossy_dir/$relative_path"
  mkdir -p "$(dirname -- "$lossy_file")"
  lossy_quality=4
  ffmpeg -y -v error -i "$source_file" -map 0:a:0 -c:a libmp3lame -q:a "$lossy_quality" -map_metadata -1 "$lossy_file"
  lossy_bytes=$(stat -f %z "$lossy_file")

  if [ "$lossy_bytes" -ge "$original_bytes" ]; then
    lossy_quality=5
    ffmpeg -y -v error -i "$source_file" -map 0:a:0 -c:a libmp3lame -q:a "$lossy_quality" -map_metadata -1 "$lossy_file"
    lossy_bytes=$(stat -f %z "$lossy_file")
  fi

  if [ "$lossy_bytes" -ge "$original_bytes" ]; then
    lossy_quality=6
    ffmpeg -y -v error -i "$source_file" -map 0:a:0 -c:a libmp3lame -q:a "$lossy_quality" -map_metadata -1 "$lossy_file"
    lossy_bytes=$(stat -f %z "$lossy_file")
  fi

  lossy_bitrate=$(ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of default=nk=1:nw=1 "$lossy_file")

  lossless_file="$lossless_dir/$relative_path"
  rejected_file="$rejected_dir/$relative_path"
  candidate_file="$lossless_file.next.mp3"
  mkdir -p "$(dirname -- "$lossless_file")" "$(dirname -- "$rejected_file")"
  "$tool_binary" -z "$source_file" "$candidate_file"
  lossless_bytes=$(stat -f %z "$candidate_file")

  original_pcm=$(ffmpeg -v error -i "$source_file" -map 0:a:0 -f hash -hash md5 - | cut -d= -f2)
  candidate_pcm=$(ffmpeg -v error -i "$candidate_file" -map 0:a:0 -f hash -hash md5 - | cut -d= -f2)

  if [ "$lossless_bytes" -lt "$original_bytes" ] && [ "$original_pcm" = "$candidate_pcm" ]; then
    mv -f "$candidate_file" "$lossless_file"
    lossless_available=true
    lossless_source="./generated/lossless/$relative_path"
    lossless_note="PCM idéntico"
  else
    mv -f "$candidate_file" "$rejected_file"
    lossless_available=false
    lossless_bytes=$original_bytes
    lossless_source="../../../public/sounds/$relative_path"
    if [ "$original_pcm" != "$candidate_pcm" ]; then
      lossless_note="Descartado: el PCM no coincidió"
    else
      lossless_note="Sin ganancia segura de peso"
    fi
  fi

  if [ "$first_item" -eq 0 ]; then
    printf ',\n' >> "$manifest_tmp"
  fi
  first_item=0

  printf '    { path: "%s", original: { src: "%s", bytes: %s, bitrate: %s }, lossy: { src: "%s", bytes: %s, bitrate: %s, quality: %s }, lossless: { src: "%s", bytes: %s, available: %s, note: "%s" } }' \
    "$relative_path" \
    "../../../public/sounds/$relative_path" \
    "$original_bytes" \
    "${original_bitrate:-0}" \
    "./generated/lossy/$relative_path" \
    "$lossy_bytes" \
    "${lossy_bitrate:-0}" \
    "$lossy_quality" \
    "$lossless_source" \
    "$lossless_bytes" \
    "$lossless_available" \
    "$lossless_note" >> "$manifest_tmp"
done < <(find "$sounds_dir" -type f -name '*.mp3' | sort)

printf '\n  ]\n};\n' >> "$manifest_tmp"
mv -f "$manifest_tmp" "$generated_dir/manifest.js"

printf 'Demo generada. Abrí:\n%s/index.html\n' "$script_dir"
