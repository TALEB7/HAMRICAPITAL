#!/usr/bin/env bash
#
# Monte la vidéo du hero de la page d'accueil à partir des rushes de logo/.
#
# Les rushes bruts pèsent ~390 Mo en 4K : inutilisables sur le web. Ce script
# en extrait six séquences, les alterne (skyline → données de marché → skyline)
# avec des fondus enchaînés, applique un étalonnage sombre et désaturé pour que
# le texte blanc du hero reste lisible par-dessus, puis encode en MP4 (H.264)
# et WebM (VP9) sous les 6 Mo.
#
# Relancer après toute modification des rushes :
#   bash scripts/build-hero-video.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

FF="node_modules/ffmpeg-static/ffmpeg.exe"
[ -x "$FF" ] || FF="ffmpeg"

SRC="logo"
OUT="public/video"
mkdir -p "$OUT"

# Chaque séquence : fichier | seconde de départ | durée retenue.
# L'alternance skyline / marchés donne son rythme au montage.
CLIPS=(
  "$SRC/12731885-uhd_3840_2160_30fps.mp4|4|5"   # skyline aérienne, Minneapolis
  "$SRC/16438780_3840_2160_50fps.mp4|6|4"       # écran de trading, chandeliers
  "$SRC/12819878-hd_1920_1080_60fps.mp4|10|5"   # façade de gratte-ciel en drone
  "$SRC/12647214_1920_1080_30fps.mp4|3|4"       # graphique animé, tons rouges
  "$SRC/7317055-uhd_3840_2160_25fps.mp4|5|5"    # skyline dans les nuages
  "$SRC/11957924_3840_2160_60fps.mp4|2|5"       # skyline depuis le sol
)

XFADE=1 # durée du fondu enchaîné, en secondes

# --- Construction du graphe de filtres --------------------------------------
inputs=()
prep=""
i=0
for clip in "${CLIPS[@]}"; do
  IFS='|' read -r file start dur <<<"$clip"
  # Le découpage se fait à l'entrée (-ss/-t) : ffmpeg ne décode que la portion
  # utile, ce qui évite de traiter 4K sur toute la longueur des rushes.
  inputs+=(-ss "$start" -t "$dur" -i "$file")
  # Mise à l'échelle avant le fondu : enchaîner des 4K coûterait des minutes.
  prep+="[$i:v]scale=1920:1080:force_original_aspect_ratio=increase,"
  prep+="crop=1920:1080,fps=30,setsar=1,format=yuv420p[v$i];"
  i=$((i + 1))
done

# Chaîne de fondus : chaque transition démarre XFADE secondes avant la fin du
# segment déjà assemblé, d'où l'offset cumulé.
chain=""
offset=0
prev="[v0]"
IFS='|' read -r _ _ d0 <<<"${CLIPS[0]}"
offset=$((d0 - XFADE))

for ((n = 1; n < ${#CLIPS[@]}; n++)); do
  IFS='|' read -r _ _ dur <<<"${CLIPS[$n]}"
  label="[x$n]"
  chain+="${prev}[v$n]xfade=transition=fade:duration=$XFADE:offset=$offset$label;"
  prev="$label"
  offset=$((offset + dur - XFADE))
done

# Étalonnage : assombri et désaturé pour rester en retrait du texte du hero,
# avec un léger gain de contraste pour ne pas écraser les gratte-ciels.
GRADE="eq=brightness=-0.07:saturation=0.62:contrast=1.10,unsharp=3:3:0.4"

FILTER="${prep}${chain}${prev}${GRADE}[out]"

# Les CRF sont volontairement élevés : la vidéo passe sous un voile sombre
# semi-transparent et derrière le texte du hero, où une légère perte de détail
# est invisible — alors que chaque mégaoctet compte au premier chargement.
echo "→ Encodage MP4 (H.264)…"
"$FF" -y -v error -stats "${inputs[@]}" \
  -filter_complex "$FILTER" -map "[out]" -an \
  -c:v libx264 -profile:v high -preset slower -crf 34 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/hero.mp4"

# Pas de WebM : sur ces images très détaillées VP9 produisait un fichier
# presque deux fois plus lourd que le H.264 à qualité équivalente. Le MP4
# ci-dessus est lu par tous les navigateurs visés.

echo "→ Image poster (affichée avant lecture et sur mobile)…"
"$FF" -y -v error -ss 2 -i "$OUT/hero.mp4" -frames:v 1 \
  -vf "scale=1600:-1" -q:v 6 "$OUT/hero-poster.jpg"

echo
ls -lh "$OUT"
