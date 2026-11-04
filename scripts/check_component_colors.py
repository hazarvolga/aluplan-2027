#!/usr/bin/env python3
"""Detect literal component colors that bypass the centralized theme palette.

The guard covers CSS module color declarations and static JSX/inline-style color
values in src/components and src/app. Dynamic expressions and asset pixels are outside its
scope. Exceptions are exact file/property/value triples, not whole files.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ROOT / 'src/components'

# Debug overlay identifies component boundaries independently of the site theme.
# Black masks and the photo scrim describe image transparency, not brand colors;
# the white label is deliberately placed over a dark photo scrim.
EXCEPTIONS = {
    ('sections/DebugComponentLabel.module.css', 'outline', '1px solid #f9731640'),
    ('sections/DebugComponentLabel.module.css', 'background', '#f97316'),
    ('sections/DebugComponentLabel.module.css', 'color', '#fff'),
    ('sections/ProductTabs.module.css', '-webkit-mask-image', 'linear-gradient(90deg,transparent 0%,#000 65%)'),
    ('sections/ProductTabs.module.css', 'mask-image', 'linear-gradient(90deg,transparent 0%,#000 65%)'),
    ('sections/ProductTabs.module.css', '-webkit-mask-image', 'linear-gradient(180deg,#000 25%,transparent 100%)'),
    ('sections/ProductTabs.module.css', 'mask-image', 'linear-gradient(180deg,#000 25%,transparent 100%)'),
    ('sections/ProductHero.module.css', 'mask-image', 'linear-gradient(90deg,transparent 46%,rgba(0,0,0,.5) 70%,#000 90%)'),
    ('sections/ProductHero.module.css', '-webkit-mask-image', 'linear-gradient(90deg,transparent 46%,rgba(0,0,0,.5) 70%,#000 90%)'),
    ('sections/ScalypsoPageContent.module.css', 'background', 'linear-gradient(to top,rgba(0,0,0,0.7),transparent)'),
    ('sections/ScalypsoPageContent.module.css', 'color', 'white'),
}

NAMED_COLORS = '''aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet
brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan
darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred
darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue
dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green
greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon
lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen
lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon
mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen
mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab
orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum
powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna
silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet
wheat white whitesmoke yellow yellowgreen'''.split()
COLOR = re.compile(
    r'(?<![\w-])(?:#[0-9a-f]{3,8}\b|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(|(?:'
    + '|'.join(NAMED_COLORS) + r')\b)', re.I)
DECLARATION = re.compile(r'(?:^|[;{}])\s*([\w-]+)\s*:\s*([^;{}]+)', re.M)
COLOR_PROPERTY = re.compile(r'(?:color|background|border|outline|shadow|fill|stroke|mask)', re.I)
JSX_COLOR = re.compile(
    r'\b(color|background(?:Color)?|borderColor|outlineColor|fill|stroke|stopColor)'
    r'\s*(?::|=)\s*(?:\{\s*)?["\']([^"\']+)["\']', re.I)


def violations(relative_path: str, source: str) -> list[str]:
    """Return diagnostics for a source file; relative_path is relative to components."""
    if relative_path.endswith('.module.css'):
        source = re.sub(r'/\*[\s\S]*?\*/', '', source)
        candidates = ((m.group(1), m.group(2).strip()) for m in DECLARATION.finditer(source))
        candidates = ((prop, value) for prop, value in candidates if prop.startswith('--') or COLOR_PROPERTY.search(prop))
    elif relative_path.endswith('.tsx'):
        candidates = ((m.group(1), m.group(2).strip()) for m in JSX_COLOR.finditer(source))
    else:
        return []
    return [f'{relative_path}: {prop}: {value}' for prop, value in candidates
            if COLOR.search(value) and (relative_path, prop, value) not in EXCEPTIONS]


def main() -> int:
    app = ROOT / 'src/app'
    files = [(file, COMPONENTS) for pattern in ('*.module.css', '*.tsx') for file in sorted(COMPONENTS.rglob(pattern))]
    files += [(file, app) for pattern in ('*.module.css', '*.tsx') for file in sorted(app.rglob(pattern))]
    errors = [error for file, base in files for error in violations(file.relative_to(base).as_posix(), file.read_text(encoding='utf-8'))]
    if errors:
        print('Component colors must use theme tokens:\n' + '\n'.join(errors), file=sys.stderr)
        return 1
    print(f'Component colors: OK ({len(files)} files)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
