"""Generic builder: convert an allplan_learnnow course (A/B/C/D/E lesson format)
into committed lesson JSON for an akademi series. Reused for Arazi and Lejant.

Usage: python3 -I scripts/build_series.py <course_dir> <series_slug>
  series_slug: url/data folder name, e.g. 'arazi-modelleme' or 'lejant'.
Step figures are left empty (source B sections carry no inline images, so no
proximity mis-placement); article figures are copied with their correct
association. YouTube videos get a youtubeId (embeddable); Vimeo stays deferred.
"""
import re
import os
import json
import shutil
import sys
import unicodedata

REPO = "/Users/hazarvolgaekiz/dev/studio/aluplan-2027"

TR = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")


def slugify(text: str) -> str:
    text = text.translate(TR)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text


def main(src: str, series_slug: str) -> None:
    out_data = f"{REPO}/src/data/{series_slug}"
    out_img = f"{REPO}/public/akademi/{series_slug}"
    os.makedirs(out_data, exist_ok=True)
    os.makedirs(out_img, exist_ok=True)
    url_base = f"/akademi/{series_slug}"

    img_re = re.compile(r"!\[[^\]]*\]\((?:\.\./)*assets/screenshots/([^)]+)\)")
    copied: set[str] = set()

    def copy_img(fname: str) -> str | None:
        srcp = f"{src}/assets/screenshots/{fname}"
        if os.path.isfile(srcp):
            if fname not in copied:
                shutil.copy(srcp, f"{out_img}/{fname}")
                copied.add(fname)
            return f"{url_base}/{fname}"
        return None

    def extract_imgs(text: str) -> tuple[str, list[str]]:
        imgs: list[str] = []
        for m in img_re.finditer(text):
            p = copy_img(m.group(1))
            if p:
                imgs.append(p)
        clean = img_re.sub("", text)
        clean = re.sub(r"[ \t]+", " ", clean)
        clean = re.sub(r"\n{3,}", "\n\n", clean).strip()
        return clean, imgs

    def split_sections(md: str) -> dict[str, str]:
        parts = re.split(r"\n#{2,3} ([A-E])\. ", md)
        secs: dict[str, str] = {}
        for i in range(1, len(parts), 2):
            secs[parts[i]] = parts[i + 1]
        return secs

    def parse_objectives(body: str) -> list[str]:
        return [re.sub(r"\s+", " ", ln[2:].strip())
                for ln in body.splitlines() if ln.strip().startswith("- ")]

    def parse_steps(body: str) -> list[dict]:
        steps: list[dict] = []
        chunks = re.split(r"\n#### ", "\n" + body)
        for c in chunks[1:]:
            parts = c.split("\n", 1)
            head = parts[0].strip()
            rest = parts[1] if len(parts) > 1 else ""
            # "Adım N — Heading" or "00:00 | Heading"
            heading = head
            m = re.match(r"Ad[ıi]m\s*\d+\s*[—\-–]\s*(.*)", head)
            if m:
                heading = m.group(1).strip()
            clean, _ = extract_imgs(rest)
            steps.append({"time": "", "heading": heading, "body": clean, "figures": []})
        return steps

    def parse_commands(body: str) -> list[dict]:
        cmds: list[dict] = []
        for line in body.splitlines():
            line = line.strip()
            if not line.startswith("|"):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) < 4:
                continue
            if set("".join(cells)) <= set(":- "):
                continue
            if cells[0].startswith("**Komut") or cells[0].startswith("Komut"):
                continue
            name = re.sub(r"\*\*", "", cells[0]).strip()
            menu = re.sub(r"\*\*", "", cells[1]).strip()
            sc = re.sub(r"[`*]", "", cells[2]).strip()
            desc = cells[3].strip()
            if name:
                cmds.append({"name": name, "menu": menu, "shortcut": sc, "desc": desc})
        return cmds

    vid_re = re.compile(r"\[([^\]]+?)\s*\(`([^`]+)`\s*[—\-]\s*([\d.]+)\s*MB\)\]")

    def parse_media(body: str) -> dict:
        videos: list[dict] = []
        for m in vid_re.finditer(body):
            title, fname, size = m.group(1).strip(), m.group(2), m.group(3)
            yt = re.search(r"_youtube_([A-Za-z0-9_-]+?)_[0-9a-f]{6,}", fname)
            vm = re.search(r"_vimeo_(\d+)", fname)
            v = {"title": title, "file": fname,
                 "vimeoId": vm.group(1) if vm else "", "sizeMB": float(size)}
            if yt:
                v["youtubeId"] = yt.group(1)
            videos.append(v)
        return {"videos": videos, "pdfs": [], "samples": []}

    def parse_articles(body: str) -> list[dict]:
        arts: list[dict] = []
        chunks = re.split(r"\n#{3,4} [^\n]*?Kaynak Makale ", "\n" + body)
        for c in chunks[1:]:
            m = re.match(r"\[`([^`]+)`\]:\s*(.*)", c)
            if not m:
                continue
            aid = m.group(1)
            title = m.group(2).split("\n")[0].strip()
            rest = c.split("\n", 1)[1] if "\n" in c else ""
            rest = re.sub(r"\*Ayr[ıi] dosya ba[ğg]lant[ıi]s[ıi]:.*", "", rest)
            clean, imgs = extract_imgs(rest)
            clean = clean.replace("---", "").strip()
            if len(clean) > 2200:
                clean = clean[:2200].rstrip() + " …"
            arts.append({"id": aid, "title": title, "body": clean, "figures": imgs})
        return arts

    index: list[dict] = []
    for fn in sorted(os.listdir(f"{src}/dersler")):
        if not fn.endswith(".md"):
            continue
        no = int(fn[:2])
        md = open(f"{src}/dersler/{fn}", encoding="utf-8").read()
        h1 = re.search(r"#\s*Ders\s*\d+\s*[—\-–]\s*(.*)", md)
        title_raw = h1.group(1).strip() if h1 else fn
        title_raw = re.sub(r"\s*\(`[^`]+`\)", "", title_raw)
        # bilingual "Türkçe / English" -> keep Turkish
        title = title_raw.split(" / ")[0].strip()
        title = re.sub(r"^\d+[-.]?\s+", "", title).strip()
        srcmod_m = re.search(r"Veri Çekirdeği Modülü:\*\*\s*`([^`]+)`", md)
        srcmod = srcmod_m.group(1) if srcmod_m else ""
        secs = split_sections(md)
        slug = slugify(title) or f"ders-{no:02d}"
        lesson = {
            "no": no, "slug": slug, "title": title, "duration": "",
            "sourceModule": srcmod,
            "objectives": parse_objectives(secs.get("A", "")),
            "steps": parse_steps(secs.get("B", "")),
            "commands": parse_commands(secs.get("C", "")),
            "media": parse_media(secs.get("D", "")),
            "articles": parse_articles(secs.get("E", "")),
        }
        with open(f"{out_data}/{no:02d}.json", "w", encoding="utf-8") as f:
            json.dump(lesson, f, ensure_ascii=False, indent=2)
            f.write("\n")
        index.append({"no": no, "slug": slug, "title": title,
                      "steps": len(lesson["steps"]), "commands": len(lesson["commands"]),
                      "videos": len(lesson["media"]["videos"]),
                      "yt": sum(1 for v in lesson["media"]["videos"] if v.get("youtubeId")),
                      "articles": len(lesson["articles"])})
    with open(f"{out_data}/_index.json", "w", encoding="utf-8") as f:
        json.dump([{"no": i["no"], "slug": i["slug"], "title": i["title"]} for i in index],
                  f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"[{series_slug}] parsed {len(index)} lessons; copied {len(copied)} screenshots")
    for it in index:
        print(f"  {it['no']:02d} {it['slug']:34} steps={it['steps']} cmds={it['commands']} "
              f"vid={it['videos']} yt={it['yt']} art={it['articles']}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
