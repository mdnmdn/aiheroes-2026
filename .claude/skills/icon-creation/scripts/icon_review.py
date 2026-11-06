#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["pillow", "pyyaml", "resvg-py", "rich"]
# ///
"""Validate and review a portable monochrome SVG icon set.

The icon directory contains icons.yaml, approved <name>.svg files, optional variants/, and
generated preview/.  See the sibling SKILL.md for the registry format and workflow.
"""

from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

import resvg_py
import yaml
from PIL import Image, ImageColor, ImageDraw, ImageFont
from rich.console import Console

SVG_NS = "{http://www.w3.org/2000/svg}"
BOX = "0 0 24 24"
STROKE = "2"
LIVE = (1.0, 23.0)
SHAPES_MAX = 4
SIZES = (16, 24, 64)
BANNED_TAGS = {
    "text", "image", "use", "defs", "style", "mask", "clipPath", "filter",
    "linearGradient", "radialGradient", "pattern", "script", "animate",
    "animateTransform", "animateMotion", "set", "switch", "foreignObject",
}
BANNED_ATTRS = {"style", "class", "opacity", "fill-opacity", "stroke-opacity"}
THEMES = {
    "dark": {"bg": "#121216", "fg": "#e8e8ed", "accent": "#5b8def", "muted": "#8f8f9a"},
    "light": {"bg": "#f8f8fa", "fg": "#1a1a2e", "accent": "#3b6fd4", "muted": "#6b6b80"},
}
console = Console()


@dataclass(frozen=True)
class Icon:
    name: str
    goal: str
    category: str
    source: str = "custom"
    keywords: tuple[str, ...] = ()

    def path(self, icons_dir: Path) -> Path:
        return icons_dir / f"{self.name}.svg"

    @property
    def external(self) -> bool:
        return self.source == "external"


def load_registry(path: Path) -> tuple[dict[str, Icon], list[str]]:
    if not path.exists():
        raise FileNotFoundError(f"registry not found: {path}")
    document = yaml.safe_load(path.read_text()) or {}
    icons: dict[str, Icon] = {}
    for category, entries in (document.get("categories") or {}).items():
        for name, value in (entries or {}).items():
            body = {"goal": value} if isinstance(value, str) else (value or {})
            icons[name] = Icon(
                name=name,
                goal=body.get("goal", ""),
                category=category,
                source=body.get("source", "custom"),
                keywords=tuple(body.get("keywords", ())),
            )
    return icons, list(document.get("canon") or [])


def svg_mask(svg: str, px: int) -> Image.Image:
    png = resvg_py.svg_to_bytes(svg_string=svg, width=px, height=px)
    return Image.open(BytesIO(bytes(png))).convert("RGBA").getchannel("A")


def tinted(svg: str, px: int, foreground: str, background: str) -> Image.Image:
    image = Image.new("RGB", (px, px), background)
    image.paste(Image.new("RGB", (px, px), foreground), (0, 0), svg_mask(svg, px))
    return image


def final_image(svg: str, px: int, foreground: str, background: str) -> Image.Image:
    """Rasterise at 4× then downsample for clean final PNG or JPEG icon assets."""
    scale = 4
    alpha = svg_mask(svg, px * scale).resize((px, px), Image.Resampling.LANCZOS)
    colour = ImageColor.getrgb(foreground)
    if background == "transparent":
        image = Image.new("RGBA", (px, px), (*colour, 0))
        image.paste((*colour, 255), mask=alpha)
        return image
    image = Image.new("RGB", (px, px), ImageColor.getrgb(background))
    image.paste(colour, mask=alpha)
    return image


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.load_default(size=size)


def check_one(name: str, svg: str) -> list[str]:
    problems: list[str] = []
    try:
        root = ET.fromstring(svg)
    except ET.ParseError as error:
        return [f"E04 {name}: SVG is not parseable — {error}"]
    if root.tag.removeprefix(SVG_NS) != "svg":
        problems.append(f"E05 {name}: root element must be <svg>")
    if root.get("viewBox") != BOX:
        problems.append(f"E05 {name}: viewBox must be {BOX!r}")
    if root.get("width") or root.get("height"):
        problems.append(f"E05 {name}: remove root width/height")

    top_level = len(root)
    for element in root.iter():
        tag = element.tag.removeprefix(SVG_NS)
        if tag in BANNED_TAGS:
            problems.append(f"E06 {name}: <{tag}> is not allowed")
        for attribute in BANNED_ATTRS.intersection(element.keys()):
            problems.append(f"E06 {name}: {attribute}= on <{tag}> is not allowed")
        if (stroke := element.get("stroke")) and stroke != "currentColor":
            problems.append(f"E08 {name}: stroke must be currentColor")
        if (fill := element.get("fill")) and fill not in ("none", "currentColor"):
            problems.append(f"E08 {name}: fill must be none or currentColor")
        if (width := element.get("stroke-width")) and width != STROKE:
            problems.append(f"E08 {name}: stroke-width must be {STROKE}")
        if match := re.search(r"-?\d+\.\d{3,}", element.get("d", "")):
            problems.append(f"E09 {name}: {match.group()} has more than two decimal places")
    if top_level > SHAPES_MAX:
        problems.append(f"E07 {name}: {top_level} top-level shapes; maximum is {SHAPES_MAX}")

    try:
        bbox = svg_mask(svg, 96).getbbox()
    except Exception as error:  # resvg's parse error is more useful than a traceback.
        return problems + [f"E10 {name}: renderer rejected SVG — {error}"]
    if not bbox:
        return problems + [f"E10 {name}: renders empty"]
    scale = 24 / 96
    x0, y0, x1, y1 = (value * scale for value in bbox)
    if x0 < LIVE[0] or y0 < LIVE[0] or x1 > LIVE[1] or y1 > LIVE[1]:
        problems.append(
            f"E10 {name}: ink reaches ({x0:.1f},{y0:.1f})–({x1:.1f},{y1:.1f}); "
            f"keep it inside {LIVE[0]:g}–{LIVE[1]:g}"
        )
    if x1 - x0 < 10 and y1 - y0 < 10:
        problems.append(f"E10 {name}: {x1 - x0:.1f}×{y1 - y0:.1f}; too small to read")
    return problems


def check(icons_dir: Path, icons: dict[str, Icon]) -> tuple[list[str], list[str]]:
    problems: list[str] = []
    names_on_disk = {path.stem for path in icons_dir.glob("*.svg")}
    local = {name for name, icon in icons.items() if not icon.external}
    for name in sorted(names_on_disk - local):
        problems.append(f"E02 {name}.svg: file is absent from the registry")
    for name, icon in sorted(icons.items()):
        if not re.fullmatch(r"[a-z][a-z0-9]*(?:-[a-z0-9]+)*", name):
            problems.append(f"E01 {name}: use kebab-case")
        if not icon.goal:
            problems.append(f"E03 {name}: add a one-line goal")
    for path in sorted(icons_dir.glob("*.svg")):
        problems.extend(check_one(path.stem, path.read_text()))
    return problems, sorted(local - names_on_disk)


def render_rows(icons_dir: Path, icons: list[Icon], accent: bool) -> Image.Image:
    label_w, pad, gap, cell = 210, 12, 18, max(SIZES)
    block = sum(size + gap for size in SIZES) + gap
    row_h = cell + gap
    width = label_w + block * len(THEMES) + pad * 2
    height = pad * 2 + 26 + row_h * len(icons)
    image = Image.new("RGB", (width, height), "#2a2a33")
    draw = ImageDraw.Draw(image)
    tint = "accent" if accent else "fg"
    for index, (theme, palette) in enumerate(THEMES.items()):
        x = label_w + pad + block * index
        draw.rectangle([x - gap // 2, pad + 22, x + block - gap, height - pad], fill=palette["bg"])
        draw.text((x, pad), f"{theme} / {tint}", font=font(12), fill="#a0a0aa")
    for row, icon in enumerate(icons):
        y = pad + 26 + row * row_h
        draw.text((pad, y + cell // 2 - 12), icon.name, font=font(13), fill="#f0f0f4")
        draw.text((pad, y + cell // 2 + 4), icon.goal[:38], font=font(10), fill="#a0a0aa")
        svg = icon.path(icons_dir).read_text()
        for index, palette in enumerate(THEMES.values()):
            x = label_w + pad + block * index
            for size in SIZES:
                image.paste(tinted(svg, size, palette[tint], palette["bg"]), (x, y + (cell - size) // 2))
                x += size + gap
    return image


def render_grid(icons_dir: Path, icons: list[Icon], theme: str) -> Image.Image:
    palette, size, columns = THEMES[theme], 48, 6
    cell_w, cell_h = size + 46, size + 34
    rows = max(1, -(-len(icons) // columns))
    image = Image.new("RGB", (columns * cell_w, rows * cell_h), palette["bg"])
    draw = ImageDraw.Draw(image)
    for index, icon in enumerate(icons):
        x, y = (index % columns) * cell_w, (index // columns) * cell_h
        image.paste(tinted(icon.path(icons_dir).read_text(), size, palette["fg"], palette["bg"]), (x + 23, y + 8))
        draw.text((x + cell_w // 2, y + size + 16), icon.name, font=font(10), fill=palette["muted"], anchor="ma")
    return image


def variant_sheets(icons_dir: Path, category: str | None) -> tuple[Image.Image, dict[str, list[Path]], list[str]]:
    variants = icons_dir / "variants"
    groups: dict[str, list[Path]] = {}
    for path in sorted(variants.glob("*.svg")):
        match = re.fullmatch(r"(.+)-(\d+)", path.stem)
        if not match:
            continue
        groups.setdefault(match.group(1), []).append(path)
    if not groups:
        raise ValueError(f"no numbered SVG variants in {variants}")
    palette, label_w, pad, cell_w, cell_h = THEMES["dark"], 160, 14, 100, 84
    columns = max(len(files) for files in groups.values())
    image = Image.new("RGB", (label_w + columns * cell_w + pad * 2, pad * 2 + len(groups) * cell_h), palette["bg"])
    draw = ImageDraw.Draw(image)
    problems: list[str] = []
    for row, (name, files) in enumerate(groups.items()):
        y = pad + row * cell_h
        draw.text((pad, y + 26), name, font=font(13), fill=palette["fg"])
        for column, path in enumerate(files):
            svg = path.read_text()
            problems.extend(check_one(path.stem, svg))
            x = label_w + column * cell_w
            image.paste(tinted(svg, 48, palette["fg"], palette["bg"]), (x, y))
            image.paste(tinted(svg, 16, palette["fg"], palette["bg"]), (x + 54, y + 16))
            draw.text((x, y + 56), path.stem.rsplit("-", 1)[-1], font=font(11), fill=palette["accent"])
    return image, groups, problems


def perceptual_hash(svg: str) -> int:
    mask = svg_mask(svg, 32).resize((9, 8))
    pixels, bits = mask.load(), 0
    for y in range(8):
        for x in range(8):
            bits = bits << 1 | (pixels[x, y] > pixels[x + 1, y])
    return bits


def save(output: Path, image: Image.Image, name: str) -> None:
    output.mkdir(parents=True, exist_ok=True)
    path = output / name
    image.save(path)
    console.print(f"[green]{path}[/] {image.width}×{image.height}")


def export_icons(
    icons_dir: Path,
    icons: list[Icon],
    output: Path,
    formats: list[str],
    sizes: list[int],
    foreground: str,
    background: str,
) -> int:
    """Write final raster assets, preserving alpha only where the selected format permits it."""
    if "jpg" in formats and background == "transparent":
        console.print("[red]JPEG has no alpha; pass --background with an opaque CSS colour[/]")
        return 1
    try:
        ImageColor.getrgb(foreground)
        if background != "transparent":
            ImageColor.getrgb(background)
    except ValueError as error:
        console.print(f"[red]invalid colour: {error}[/]")
        return 1
    output.mkdir(parents=True, exist_ok=True)
    count = 0
    for icon in icons:
        svg = icon.path(icons_dir).read_text()
        for size in sizes:
            image = final_image(svg, size, foreground, background)
            for format_name in formats:
                path = output / f"{icon.name}-{size}.{format_name}"
                if format_name == "png":
                    image.save(path, format="PNG", optimize=True)
                elif format_name == "jpg":
                    image.convert("RGB").save(path, format="JPEG", quality=95, optimize=True)
                else:
                    image.save(path, format="WEBP", quality=95, method=6)
                count += 1
                console.print(f"[green]{path}[/] {size}×{size} {format_name.upper()}")
    console.print(f"exported {count} final asset(s)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--icons-dir", type=Path, default=Path.cwd(), help="directory containing icons.yaml (default: current directory)")
    parser.add_argument("--registry", default="icons.yaml", help="registry filename relative to --icons-dir")
    parser.add_argument("--output", type=Path, help="preview directory (default: <icons-dir>/preview)")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("check", help="validate registry and local SVGs")
    sheet = commands.add_parser("sheet", help="render selected icons across sizes and themes")
    sheet.add_argument("names", nargs="*", help="icon names; defaults to canon or all local icons")
    sheet.add_argument("--category", help="render a category")
    sheet.add_argument("--accent", action="store_true", help="use accent rather than foreground tint")
    variants = commands.add_parser("variants", help="render numbered takes in variants/")
    variants.add_argument("--category", help="reserved for invocation symmetry and reviewer context")
    audit = commands.add_parser("audit", help="render one contact sheet per category")
    audit.add_argument("--theme", choices=tuple(THEMES), default="dark")
    commands.add_parser("dupes", help="report visually similar local icons")
    export = commands.add_parser("export", help="write final PNG, JPEG, and/or WebP icon assets")
    export.add_argument("names", nargs="*", help="icon names; default is every approved local icon")
    export.add_argument("--format", dest="formats", nargs="+", choices=("png", "jpg", "webp"), default=["png"], help="output format(s), default: png")
    export.add_argument("--sizes", nargs="+", type=int, default=[24], help="square pixel sizes, default: 24")
    export.add_argument("--color", default="#000000", help="icon CSS colour, default: #000000")
    export_background = export.add_mutually_exclusive_group()
    export_background.add_argument("--background", default="transparent", help="opaque CSS background colour (required for JPG)")
    export_background.add_argument("--transparent", action="store_true", help="write transparent PNGs (the default)")
    export.add_argument("--export-dir", type=Path, help="final asset directory (default: <icons-dir>/export)")
    args = parser.parse_args()

    icons_dir = args.icons_dir.resolve()
    output = (args.output or icons_dir / "preview").resolve()
    try:
        icons, canon = load_registry(icons_dir / args.registry)
    except (FileNotFoundError, yaml.YAMLError) as error:
        console.print(f"[red]{error}[/]")
        return 1
    local = {name: icon for name, icon in icons.items() if icon.path(icons_dir).exists()}

    if args.command == "check":
        problems, pending = check(icons_dir, icons)
        for problem in problems:
            console.print(f"[red]{problem}[/]")
        if pending:
            console.print(f"[yellow]to draw ({len(pending)}): {', '.join(pending)}[/]")
        console.print(f"{len(icons)} registered, {len(pending)} to draw, {len(problems)} problem(s)")
        return int(bool(problems))

    if args.command == "sheet":
        names = args.names or [name for name, icon in local.items() if icon.category == args.category] or canon or list(local)
        chosen = [local[name] for name in names if name in local]
        if not chosen:
            console.print("[red]no local icons selected[/]")
            return 1
        reference = [local[name] for name in canon if name in local and name not in names]
        save(output, render_rows(icons_dir, reference + chosen, args.accent), "sheet.png")
        return 0

    if args.command == "variants":
        try:
            image, _groups, problems = variant_sheets(icons_dir, args.category)
        except ValueError as error:
            console.print(f"[red]{error}[/]")
            return 1
        save(output, image, "variants.png")
        for problem in problems:
            console.print(f"[red]{problem}[/]")
        return int(bool(problems))

    if args.command == "audit":
        for category in sorted({icon.category for icon in local.values()}):
            members = sorted((icon for icon in local.values() if icon.category == category), key=lambda icon: icon.name)
            save(output, render_grid(icons_dir, members, args.theme), f"audit-{category}.png")
        return 0

    if args.command == "export":
        if any(size <= 0 for size in args.sizes):
            console.print("[red]--sizes values must be positive[/]")
            return 1
        names = args.names or sorted(local)
        chosen = [local[name] for name in names if name in local]
        missing = sorted(set(names) - set(local))
        if missing:
            console.print(f"[red]no local SVG for: {', '.join(missing)}[/]")
            return 1
        if not chosen:
            console.print("[red]no local icons selected[/]")
            return 1
        export_dir = (args.export_dir or icons_dir / "export").resolve()
        background = "transparent" if args.transparent else args.background
        return export_icons(icons_dir, chosen, export_dir, args.formats, args.sizes, args.color, background)

    hashes = {name: perceptual_hash(icon.path(icons_dir).read_text()) for name, icon in local.items()}
    names, found = sorted(hashes), False
    for first_index, first in enumerate(names):
        for second in names[first_index + 1:]:
            distance = (hashes[first] ^ hashes[second]).bit_count()
            if distance <= 6:
                found = True
                console.print(f"[yellow]{first} ~ {second}[/] (distance {distance})")
    if not found:
        console.print("[green]no near-duplicates[/]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
