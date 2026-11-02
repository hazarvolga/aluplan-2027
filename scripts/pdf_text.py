#!/usr/bin/env python3
"""Minimal PDF text extraction with the Python standard library only.

The 2027 marketing package ships eight PDFs. They are InDesign exports with
real text layers (fonts, ``/ToUnicode`` maps, occasional Form XObjects), not
scans. Rather than pull in a third-party PDF library, this module implements
the subset needed to recover the text verbatim:

* object scan (``N G obj … endobj``) without relying on the xref table
* stream decoding for ``/FlateDecode``
* page tree walk with inherited resources
* font decoding via ``/ToUnicode`` CMaps, ``/Differences`` glyph names and
  ``WinAnsiEncoding`` fallback
* content stream interpretation (``Tf``, ``Tm``, ``Td``, ``TD``, ``T*``,
  ``TL``, ``Tj``, ``TJ``, ``'``, ``"``) plus recursion into Form XObjects

Text is emitted in content-stream order — the order the document was authored
in — with line breaks when the text matrix moves vertically. That preserves
reading order in multi-column layouts better than geometric reconstruction.

Known limits, deliberately not solved: ligature glyphs without a Unicode
mapping, right-to-left scripts, and text drawn as vector outlines.
"""

from __future__ import annotations

import re
import zlib

OBJ_RE = re.compile(rb"(?<!\d)(\d+)\s+(\d+)\s+obj\b")
STREAM_RE = re.compile(rb"\bstream\r?\n")

WHITESPACE = b"\x00\t\n\x0c\r "

# Horizontal gap, in multiples of the font size, above which a space is
# inserted. Real spaces are usually explicit glyphs; this only catches gaps
# the author made by repositioning text.
SPACE_GAP = 0.45

# Glyph names that appear in /Differences arrays. Anything not listed falls
# back to the character itself when the name is a single letter, or to an
# empty string for unknown names.
GLYPH_NAMES = {
    "space": " ",
    "exclam": "!",
    "quotedbl": '"',
    "numbersign": "#",
    "dollar": "$",
    "percent": "%",
    "ampersand": "&",
    "quotesingle": "'",
    "quoteright": "\u2019",
    "quoteleft": "\u2018",
    "parenleft": "(",
    "parenright": ")",
    "asterisk": "*",
    "plus": "+",
    "comma": ",",
    "hyphen": "-",
    "period": ".",
    "slash": "/",
    "zero": "0",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "colon": ":",
    "semicolon": ";",
    "less": "<",
    "equal": "=",
    "greater": ">",
    "question": "?",
    "at": "@",
    "bracketleft": "[",
    "backslash": "\\",
    "bracketright": "]",
    "asciicircum": "^",
    "underscore": "_",
    "grave": "`",
    "braceleft": "{",
    "bar": "|",
    "braceright": "}",
    "asciitilde": "~",
    "endash": "\u2013",
    "emdash": "\u2014",
    "bullet": "\u2022",
    "ellipsis": "\u2026",
    "quotedblleft": "\u201c",
    "quotedblright": "\u201d",
    "fi": "fi",
    "fl": "fl",
    "ff": "ff",
    "ffi": "ffi",
    "ffl": "ffl",
    "copyright": "\u00a9",
    "registered": "\u00ae",
    "trademark": "\u2122",
    "degree": "\u00b0",
    "plusminus": "\u00b1",
    "multiply": "\u00d7",
    "divide": "\u00f7",
    "Euro": "\u20ac",
    "adieresis": "\u00e4",
    "odieresis": "\u00f6",
    "udieresis": "\u00fc",
    "Adieresis": "\u00c4",
    "Odieresis": "\u00d6",
    "Udieresis": "\u00dc",
    "germandbls": "\u00df",
    "eacute": "\u00e9",
    "egrave": "\u00e8",
    "agrave": "\u00e0",
    "ccedilla": "\u00e7",
    "ntilde": "\u00f1",
}


# --------------------------------------------------------------------------- #
# object layer
# --------------------------------------------------------------------------- #

class Ref:
    """An indirect reference (``12 0 R``); only the object number is kept."""

    __slots__ = ("num",)

    def __init__(self, num: int) -> None:
        self.num = num

    def __repr__(self) -> str:  # pragma: no cover - debugging aid
        return f"Ref({self.num})"


class Stream:
    """A stream object: its dictionary plus the still-encoded bytes."""

    __slots__ = ("dict", "raw")

    def __init__(self, dictionary: dict, raw: bytes) -> None:
        self.dict = dictionary
        self.raw = raw


TOKEN_RE = re.compile(
    rb"""
    (?P<name>/[^\s/<>\[\]()%]*)|
    (?P<number>[-+]?\d*\.?\d+)|
    (?P<hex><[0-9A-Fa-f\s]*>)|
    (?P<array_open>\[)|
    (?P<array_close>\])|
    (?P<dict_open><<)|
    (?P<dict_close>>>)|
    (?P<keyword>[A-Za-z'"]+)
    """,
    re.VERBOSE | re.DOTALL,
)


def _read_literal(data: bytes, index: int) -> tuple[bytes, int]:
    """Read a ``(…)`` string starting at ``index`` (the opening paren)."""
    depth = 0
    out = bytearray()
    length = len(data)
    while index < length:
        char = data[index]
        if char == 0x5C:  # backslash
            index += 1
            if index >= length:
                break
            escape = data[index]
            mapping = {
                0x6E: b"\n",
                0x72: b"\r",
                0x74: b"\t",
                0x62: b"\b",
                0x66: b"\f",
                0x28: b"(",
                0x29: b")",
                0x5C: b"\\",
            }
            if escape in mapping:
                out += mapping[escape]
                index += 1
            elif 0x30 <= escape <= 0x37:
                digits = bytearray()
                while index < length and 0x30 <= data[index] <= 0x37 and len(digits) < 3:
                    digits.append(data[index])
                    index += 1
                out.append(int(digits, 8) & 0xFF)
            elif escape in (0x0A, 0x0D):
                index += 1
                if escape == 0x0D and index < length and data[index] == 0x0A:
                    index += 1
            else:
                out.append(escape)
                index += 1
            continue
        if char == 0x28:
            depth += 1
            if depth > 1:
                out.append(char)
            index += 1
            continue
        if char == 0x29:
            depth -= 1
            index += 1
            if depth == 0:
                return bytes(out), index
            out.append(char)
            continue
        out.append(char)
        index += 1
    return bytes(out), index


def _decode_hex(raw: bytes) -> bytes:
    digits = re.sub(rb"[^0-9A-Fa-f]", b"", raw)
    if len(digits) % 2:
        digits += b"0"
    return bytes.fromhex(digits.decode("ascii"))


def tokenize(body: bytes) -> list[tuple[str, object]]:
    """Tokenise a PDF object body into ``(kind, value)`` pairs."""
    tokens: list[tuple[str, object]] = []
    index = 0
    length = len(body)
    while index < length:
        char = body[index:index + 1]
        if char == b"%":
            newline = body.find(b"\n", index)
            index = length if newline == -1 else newline + 1
            continue
        if char in WHITESPACE or char == b"":
            index += 1
            continue
        if char == b"(":
            text, index = _read_literal(body, index)
            tokens.append(("literal", text))
            continue
        match = TOKEN_RE.match(body, index)
        if not match:
            index += 1
            continue
        index = match.end()
        if match.group("name") is not None:
            tokens.append(("name", match.group("name")[1:].decode("latin-1")))
        elif match.group("number") is not None:
            tokens.append(("number", match.group("number").decode("latin-1")))
        elif match.group("hex") is not None:
            tokens.append(("hex", match.group("hex")))
        elif match.group("array_open") is not None:
            tokens.append(("array_open", "["))
        elif match.group("array_close") is not None:
            tokens.append(("array_close", "]"))
        elif match.group("dict_open") is not None:
            tokens.append(("dict_open", "<<"))
        elif match.group("dict_close") is not None:
            tokens.append(("dict_close", ">>"))
        else:
            tokens.append(("keyword", match.group("keyword").decode("latin-1")))
    return tokens


def _parse_value(tokens: list, index: int) -> tuple[object, int]:
    """Parse one value out of a token list, returning it and the next index."""
    if index >= len(tokens):
        return None, index
    kind, value = tokens[index]

    if kind == "dict_open":
        result: dict = {}
        index += 1
        while index < len(tokens) and tokens[index][0] != "dict_close":
            key_kind, key_value = tokens[index]
            if key_kind != "name":
                index += 1
                continue
            index += 1
            item, index = _read_item(tokens, index)
            result[str(key_value)] = item
        return result, index + 1

    if kind == "array_open":
        items: list = []
        index += 1
        while index < len(tokens) and tokens[index][0] != "array_close":
            item, index = _read_item(tokens, index)
            items.append(item)
        return items, index + 1

    if kind == "number":
        text = str(value)
        try:
            number = float(text)
        except ValueError:
            return 0.0, index + 1
        return (int(number) if number.is_integer() else number), index + 1

    if kind == "name":
        return value, index + 1

    if kind == "hex":
        return _decode_hex(value), index + 1

    if kind == "literal":
        return value, index + 1

    if kind == "keyword":
        return value, index + 1

    return None, index + 1


def _read_item(tokens: list, index: int) -> tuple[object, int]:
    """Parse one value, collapsing ``N G R`` into a :class:`Ref`."""
    if (
        index + 2 < len(tokens)
        and tokens[index][0] == "number"
        and tokens[index + 1][0] == "number"
        and tokens[index + 2] == ("keyword", "R")
    ):
        try:
            number = int(float(str(tokens[index][1])))
        except ValueError:
            number = 0
        return Ref(number), index + 3
    return _parse_value(tokens, index)


class PdfDocument:
    """Object table plus helpers for one PDF file."""

    def __init__(self, data: bytes) -> None:
        self.data = data
        self.objects: dict[int, object] = {}
        if not self._scan_via_xref():
            self._scan()

    # -- xref-driven scan (authoritative) ---------------------------------- #

    def _scan_via_xref(self) -> bool:
        data = self.data
        marker = data.rfind(b"startxref")
        if marker == -1:
            return False
        match = re.match(rb"startxref\s+(\d+)", data[marker:])
        if not match:
            return False
        offset = int(match.group(1))
        if offset <= 0 or offset >= len(data):
            return False

        entries: dict[int, int] = {}
        trailer: dict = {}
        seen_offsets: set[int] = set()
        guard = 0

        while 0 <= offset < len(data) and guard < 64:
            guard += 1
            if offset in seen_offsets:
                break
            seen_offsets.add(offset)
            cursor = offset
            while cursor < len(data) and data[cursor:cursor + 1] in WHITESPACE:
                cursor += 1
            if data[cursor:cursor + 4] != b"xref":
                break  # cross-reference stream: not handled here
            cursor += 4
            while True:
                while cursor < len(data) and data[cursor:cursor + 1] in WHITESPACE:
                    cursor += 1
                if data[cursor:cursor + 7] == b"trailer":
                    cursor += 7
                    break
                header = re.match(rb"(\d+)\s+(\d+)", data[cursor:])
                if not header:
                    return False
                first = int(header.group(1))
                count = int(header.group(2))
                cursor += header.end()
                for index in range(count):
                    entry = data[cursor:cursor + 20]
                    if len(entry) < 18:
                        return False
                    kind = entry[17:18]
                    if kind == b"n":
                        try:
                            position = int(entry[0:10])
                        except ValueError:
                            position = 0
                        number = first + index
                        if position and number not in entries:
                            entries[number] = position
                    cursor += 20

            trailer_text = data[cursor:]
            trailer_tokens = tokenize(trailer_text[:4000])
            parsed, _ = _parse_value(trailer_tokens, 0) if trailer_tokens else ({}, 0)
            if isinstance(parsed, dict):
                for key, value in parsed.items():
                    trailer.setdefault(key, value)
                prev = parsed.get("Prev")
                if isinstance(prev, int):
                    offset = prev
                    continue
            break

        if not entries:
            return False

        for number, position in entries.items():
            value = self._parse_at(number, position)
            if value is not None:
                self.objects[number] = value
        return bool(self.objects)

    def _parse_at(self, number: int, position: int) -> object:
        data = self.data
        header = re.match(rb"\s*(\d+)\s+(\d+)\s+obj", data[position:position + 64])
        if not header or int(header.group(1)) != number:
            return None
        start = position + header.end()
        stream_match = STREAM_RE.search(data, start)
        endobj = data.find(b"endobj", start)

        if stream_match is not None and (endobj == -1 or stream_match.start() < endobj):
            tokens = tokenize(data[start:stream_match.start()])
            dictionary: dict = {}
            if tokens:
                parsed, _ = _parse_value(tokens, 0)
                if isinstance(parsed, dict):
                    dictionary = parsed
            length = dictionary.get("Length")
            if isinstance(length, Ref):
                length = self.objects.get(length.num)
            if isinstance(length, int) and 0 <= length <= len(data):
                raw = data[stream_match.end():stream_match.end() + length]
            else:
                endstream = data.find(b"endstream", stream_match.end())
                if endstream == -1:
                    endstream = len(data)
                raw = data[stream_match.end():endstream].rstrip(b"\r\n")
            return Stream(dictionary, raw)

        if endobj == -1:
            return None
        tokens = tokenize(data[start:endobj])
        if not tokens:
            return None
        value, _ = _read_item(tokens, 0)
        return value

    # -- heuristic scan (fallback) ----------------------------------------- #

    def _scan(self) -> None:
        data = self.data
        matches = list(OBJ_RE.finditer(data))
        for index, match in enumerate(matches):
            number = int(match.group(1))
            start = match.end()
            endobj = data.find(b"endobj", start)
            limit = matches[index + 1].start() if index + 1 < len(matches) else len(data)
            boundary = min(endobj, limit) if endobj != -1 else limit
            stream_match = STREAM_RE.search(data, start, boundary)

            if stream_match is not None:
                tokens = tokenize(data[start:stream_match.start()])
                dictionary: dict = {}
                if tokens:
                    parsed, _ = _parse_value(tokens, 0)
                    if isinstance(parsed, dict):
                        dictionary = parsed
                length = dictionary.get("Length")
                if isinstance(length, Ref):
                    length = self.objects.get(length.num)
                if isinstance(length, int) and 0 <= length <= len(data):
                    raw = data[stream_match.end():stream_match.end() + length]
                else:
                    endstream = data.find(b"endstream", stream_match.end())
                    if endstream == -1:
                        endstream = len(data)
                    raw = data[stream_match.end():endstream].rstrip(b"\r\n")
                self.objects[number] = Stream(dictionary, raw)
            else:
                tokens = tokenize(data[start:boundary])
                if tokens:
                    value, _ = _read_item(tokens, 0)
                    self.objects[number] = value

    # -- resolution ------------------------------------------------------- #

    def resolve(self, value: object) -> object:
        seen = 0
        while isinstance(value, Ref) and seen < 32:
            value = self.objects.get(value.num)
            seen += 1
        return value

    def stream_bytes(self, stream: Stream) -> bytes:
        filters = self.resolve(stream.dict.get("Filter"))
        if filters is None:
            return stream.raw
        if not isinstance(filters, list):
            filters = [filters]
        data = stream.raw
        for name in filters:
            name = self.resolve(name)
            if name in ("FlateDecode", "Fl"):
                try:
                    data = zlib.decompress(data)
                except zlib.error:
                    try:
                        data = zlib.decompressobj().decompress(data)
                    except zlib.error:
                        return b""
            else:
                # DCTDecode/JPXDecode are images; other filters are not text.
                return b""
        return data

    # -- page tree -------------------------------------------------------- #

    def pages(self) -> list[dict]:
        catalog = None
        for value in self.objects.values():
            if isinstance(value, dict) and self.resolve(value.get("Type")) == "Catalog":
                catalog = value
                break
        if catalog is None:
            return []
        root = self.resolve(catalog.get("Pages"))
        result: list[dict] = []
        self._walk_pages(root, {}, result, 0)
        return result

    def _walk_pages(self, node: object, inherited: dict, out: list, depth: int) -> None:
        if depth > 32 or not isinstance(node, dict):
            return
        merged = dict(inherited)
        resources = self.resolve(node.get("Resources"))
        if isinstance(resources, dict):
            merged["Resources"] = resources
        kids = self.resolve(node.get("Kids"))
        if isinstance(kids, list):
            for kid in kids:
                self._walk_pages(self.resolve(kid), merged, out, depth + 1)
        else:
            out.append({"dict": node, "resources": merged.get("Resources", {})})


# --------------------------------------------------------------------------- #
# fonts
# --------------------------------------------------------------------------- #

def _utf16(hex_string: str) -> str:
    if len(hex_string) % 2:
        hex_string = "0" + hex_string
    raw = bytes.fromhex(hex_string)
    if len(raw) % 2:
        raw = b"\x00" + raw
    try:
        return raw.decode("utf-16-be")
    except UnicodeDecodeError:
        return raw.decode("latin-1", errors="replace")


def _codepoint(value: int) -> str:
    try:
        return chr(value)
    except ValueError:
        return ""


def parse_tounicode(data: bytes) -> dict[bytes, str]:
    """Parse a ``/ToUnicode`` CMap into ``code bytes -> text``."""
    mapping: dict[bytes, str] = {}
    text = data.decode("latin-1", errors="replace")

    for block in re.findall(r"beginbfchar(.*?)endbfchar", text, re.DOTALL):
        for src, dst in re.findall(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", block):
            mapping[bytes.fromhex(src)] = _utf16(dst)

    for block in re.findall(r"beginbfrange(.*?)endbfrange", text, re.DOTALL):
        for match in re.finditer(
            r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(?:<([0-9A-Fa-f]+)>|\[(.*?)\])",
            block,
            re.DOTALL,
        ):
            low = bytes.fromhex(match.group(1))
            high = bytes.fromhex(match.group(2))
            width = len(low) or 1
            start = int.from_bytes(low, "big")
            end = int.from_bytes(high, "big")
            if end < start or end - start > 65535:
                continue
            if match.group(3) is not None:
                base = int(match.group(3), 16)
                for offset in range(end - start + 1):
                    mapping[(start + offset).to_bytes(width, "big")] = _codepoint(base + offset)
            else:
                targets = re.findall(r"<([0-9A-Fa-f]+)>", match.group(4) or "")
                for offset, target in enumerate(targets):
                    if start + offset > end:
                        break
                    mapping[(start + offset).to_bytes(width, "big")] = _utf16(target)
    return mapping


class Font:
    """Decodes one font's byte strings into text."""

    def __init__(self, doc: PdfDocument, dictionary: dict) -> None:
        self.subtype = doc.resolve(dictionary.get("Subtype"))
        self.two_byte = self.subtype == "Type0"
        self.tounicode: dict[bytes, str] = {}
        self.differences: dict[int, str] = {}
        self.encoding_name = ""

        tounicode = doc.resolve(dictionary.get("ToUnicode"))
        if isinstance(tounicode, Stream):
            self.tounicode = parse_tounicode(doc.stream_bytes(tounicode))

        self.widths: dict[int, float] = {}
        self.width_scale = 0.001
        matrix = doc.resolve(dictionary.get("FontMatrix"))
        if isinstance(matrix, list) and matrix and isinstance(matrix[0], (int, float)):
            self.width_scale = float(matrix[0])
        widths = doc.resolve(dictionary.get("Widths"))
        first = doc.resolve(dictionary.get("FirstChar"))
        if isinstance(widths, list) and isinstance(first, int):
            for offset, width in enumerate(widths):
                width = doc.resolve(width)
                if isinstance(width, (int, float)):
                    self.widths[first + offset] = float(width)
        cid_widths = doc.resolve(dictionary.get("W"))
        if isinstance(cid_widths, list):
            self._read_cid_widths(doc, cid_widths)

        encoding = doc.resolve(dictionary.get("Encoding"))
        if isinstance(encoding, str):
            self.encoding_name = encoding
        elif isinstance(encoding, dict):
            base = doc.resolve(encoding.get("BaseEncoding"))
            if isinstance(base, str):
                self.encoding_name = base
            differences = doc.resolve(encoding.get("Differences"))
            if isinstance(differences, list):
                code = 0
                for item in differences:
                    item = doc.resolve(item)
                    if isinstance(item, int):
                        code = item
                    elif isinstance(item, str):
                        self.differences[code] = GLYPH_NAMES.get(
                            item, item if len(item) == 1 else ""
                        )
                        code += 1

    def _read_cid_widths(self, doc: PdfDocument, items: list) -> None:
        index = 0
        while index < len(items):
            first = doc.resolve(items[index])
            if not isinstance(first, int):
                index += 1
                continue
            if index + 1 >= len(items):
                break
            second = doc.resolve(items[index + 1])
            if isinstance(second, list):
                for offset, width in enumerate(second):
                    width = doc.resolve(width)
                    if isinstance(width, (int, float)):
                        self.widths[first + offset] = float(width)
                index += 2
            elif isinstance(second, int) and index + 2 < len(items):
                width = doc.resolve(items[index + 2])
                if isinstance(width, (int, float)):
                    for code in range(first, second + 1):
                        self.widths[code] = float(width)
                index += 3
            else:
                index += 2

    def advance(self, raw: bytes, size: float) -> float:
        """Width of ``raw`` in text space units at ``size``."""
        if not raw:
            return 0.0
        if self.two_byte:
            codes = [int.from_bytes(raw[i:i + 2], "big") for i in range(0, len(raw) - 1, 2)]
        else:
            codes = list(raw)
        total = 0.0
        for code in codes:
            width = self.widths.get(code)
            if width is None:
                width = self.widths.get(0, 0.0)
            total += width
        return total * self.width_scale * size

    def decode(self, raw: bytes) -> str:
        if self.tounicode:
            if self.two_byte:
                codes = [raw[i:i + 2] for i in range(0, len(raw) - 1, 2)]
            else:
                codes = [raw[i:i + 1] for i in range(len(raw))]
            return "".join(self.tounicode.get(code, "") for code in codes)

        if self.two_byte:
            # Identity-H without a ToUnicode map cannot be decoded reliably.
            return ""

        if self.differences:
            return "".join(
                self.differences.get(byte, bytes([byte]).decode("cp1252", errors="replace"))
                for byte in raw
            )

        encoding = "cp1252" if self.encoding_name.endswith("Encoding") else "latin-1"
        return raw.decode(encoding, errors="replace")


# --------------------------------------------------------------------------- #
# content stream
# --------------------------------------------------------------------------- #

class TextSink:
    """Accumulates decoded text, inserting line breaks on vertical moves."""

    def __init__(self) -> None:
        self.parts: list[str] = []
        self.last_y: float | None = None
        self.last_x: float | None = None
        self.size = 12.0
        self.undecodable = 0
        self.chars = 0

    def add(self, text: str, x: float, y: float, advance: float = 0.0) -> None:
        if not text:
            return
        if self.last_y is not None and abs(y - self.last_y) > max(1.0, self.size * 0.35):
            self.parts.append("\n")
        elif (
            self.last_x is not None
            and self.parts
            and not self.parts[-1].endswith((" ", "\n"))
            and not text.startswith(" ")
            and x - self.last_x > self.size * SPACE_GAP
        ):
            self.parts.append(" ")
        self.parts.append(text)
        self.chars += len(text)
        self.last_x = x + advance
        self.last_y = y

    def text(self) -> str:
        joined = "".join(self.parts)
        joined = re.sub(r"[ \t]+\n", "\n", joined)
        joined = re.sub(r"\n{3,}", "\n\n", joined)
        return joined.strip()


def _interpret(
    doc: PdfDocument,
    data: bytes,
    resources: object,
    sink: TextSink,
    depth: int,
) -> None:
    """Run a content stream through the text operators."""
    if depth > 8:
        return
    resources = doc.resolve(resources) or {}
    fonts = doc.resolve(resources.get("Font")) or {}
    xobjects = doc.resolve(resources.get("XObject")) or {}

    font_cache: dict[str, Font] = {}
    font: Font | None = None
    x = y = 0.0
    leading = 12.0

    tokens = tokenize(data)
    operands: list = []
    index = 0

    while index < len(tokens):
        kind, value = tokens[index]
        if kind != "keyword":
            item, index = _read_item(tokens, index)
            operands.append(item)
            continue
        index += 1

        operator = str(value)
        if operator == "BT":
            x = y = 0.0
        elif operator == "Tf" and len(operands) >= 2:
            name, size = operands[-2], operands[-1]
            if isinstance(size, (int, float)) and float(size) > 0:
                sink.size = float(size)
            if isinstance(name, str):
                if name not in font_cache:
                    font_dict = doc.resolve(fonts.get(name))
                    font_cache[name] = Font(doc, font_dict if isinstance(font_dict, dict) else {})
                font = font_cache[name]
        elif operator == "Tm" and len(operands) >= 6:
            try:
                x, y = float(operands[-2]), float(operands[-1])
            except (TypeError, ValueError):
                pass
        elif operator in ("Td", "TD") and len(operands) >= 2:
            try:
                dx, dy = float(operands[-2]), float(operands[-1])
            except (TypeError, ValueError):
                dx = dy = 0.0
            x += dx
            y += dy
            if operator == "TD":
                leading = -dy
        elif operator == "TL" and operands:
            try:
                leading = float(operands[-1])
            except (TypeError, ValueError):
                pass
        elif operator == "T*":
            y -= leading
        elif operator == "Tj" and operands:
            raw = operands[-1]
            if isinstance(raw, bytes):
                sink.add(
                    _decode(font, raw, sink),
                    x,
                    y,
                    font.advance(raw, sink.size) if font else 0.0,
                )
        elif operator == "TJ" and operands:
            items = operands[-1]
            if isinstance(items, list):
                buffer: list[str] = []
                advance = 0.0
                for item in items:
                    if isinstance(item, bytes):
                        buffer.append(_decode(font, item, sink))
                        if font:
                            advance += font.advance(item, sink.size)
                    elif isinstance(item, (int, float)):
                        advance -= float(item) / 1000.0 * sink.size
                        if item < -120:
                            buffer.append(" ")
                sink.add("".join(buffer), x, y, advance)
        elif operator in ("'", '"') and operands:
            y -= leading
            raw = operands[-1]
            if isinstance(raw, bytes):
                sink.add(
                    _decode(font, raw, sink),
                    x,
                    y,
                    font.advance(raw, sink.size) if font else 0.0,
                )
        elif operator == "Do" and operands:
            name = operands[-1]
            if isinstance(name, str):
                xobject = doc.resolve(xobjects.get(name))
                if isinstance(xobject, Stream):
                    if doc.resolve(xobject.dict.get("Subtype")) == "Form":
                        _interpret(
                            doc,
                            doc.stream_bytes(xobject),
                            doc.resolve(xobject.dict.get("Resources")) or resources,
                            sink,
                            depth + 1,
                        )

        operands = []


def _decode(font: Font | None, raw: bytes, sink: TextSink) -> str:
    if font is None:
        return raw.decode("latin-1", errors="replace")
    text = font.decode(raw)
    if not text and raw.strip():
        sink.undecodable += 1
    return text


def _content_bytes(doc: PdfDocument, page: dict) -> bytes:
    contents = doc.resolve(page.get("Contents"))
    if contents is None:
        return b""
    if isinstance(contents, Stream):
        return doc.stream_bytes(contents)
    if isinstance(contents, list):
        chunks = []
        for item in contents:
            stream = doc.resolve(item)
            if isinstance(stream, Stream):
                chunks.append(doc.stream_bytes(stream))
        return b"\n".join(chunks)
    return b""


def extract_file_text(data: bytes) -> tuple[str, int, int]:
    """PDF bytes in, ``(text, undecodable_glyph_runs, page_count)`` out."""
    document = PdfDocument(data)
    sink = TextSink()
    pages = document.pages()
    for page in pages:
        _interpret(
            document,
            _content_bytes(document, page["dict"]),
            page["resources"],
            sink,
            0,
        )
    return sink.text(), sink.undecodable, len(pages)
