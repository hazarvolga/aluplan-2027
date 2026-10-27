"""Preserve original downloads. Sources are read-only; no synthetic documents."""
import hashlib
import io
import json
import os
from pathlib import Path
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = Path('src/data/documents-manifest.json')
DOCUMENTS = (
    ('public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf', 'public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf'),
    ('public/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf', 'public/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf'),
    ('public/docs/Declaration_Allplan_2021-06-01.pdf', 'public/docs/Declaration_Allplan_2021-06-01.pdf'),
    ('public/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf', 'public/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf'),
    *((f'assets/documents/ax3000/{name}', f'public/docs/ax3000/{name}') for name in (
        'ax3000-brochure-de.pdf', 'ax3000-brochure-en.pdf',
        'ax3000-brochure-en-alternative.pdf', 'ax3000-functions-en.pdf',
        'ax3000-functions-en.docx', 'ax3000-functions-hexagon-en.docx',
    )),
    # Preserve the alternate spelling already used by homepage CTAs.
    ('public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf', 'public/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf'),
)


def contained(root: Path, relative: str) -> Path:
    candidate = root / relative
    if not candidate.resolve().is_relative_to(root.resolve()):
        raise ValueError(f'Path escapes allowed root: {relative}')
    return candidate


def validate_document(data: bytes, suffix: str) -> None:
    if suffix == '.pdf':
        if not data.startswith(b'%PDF-') or b'%%EOF' not in data[-2048:]:
            raise ValueError('Invalid PDF signature or missing EOF')
    elif suffix == '.docx':
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                required = {'[Content_Types].xml', 'word/document.xml'}
                if not required.issubset(archive.namelist()) or archive.testzip():
                    raise ValueError('Invalid DOCX archive structure')
        except zipfile.BadZipFile as exc:
            raise ValueError('Invalid DOCX ZIP signature') from exc
    else:
        raise ValueError(f'Unsupported document type: {suffix}')


def prepare_documents(root: Path, source_root: Path):
    root, source_root = root.resolve(), source_root.resolve()
    if root.is_relative_to(source_root) or source_root.is_relative_to(root):
        raise ValueError('Source and destination roots must be separate')
    prepared = []
    for source_rel, target_rel in DOCUMENTS:
        source = contained(source_root, source_rel)
        target = contained(root, target_rel)
        if target.exists() and source.samefile(target):
            raise ValueError(f'Destination aliases source: {target_rel}')
        data = source.read_bytes()
        validate_document(data, target.suffix)
        record = {'source': source_rel, 'target': target_rel,
                  'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}
        prepared.append((target, data, record))
    return prepared


def atomic_write(target: Path, data: bytes) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(data)
        temporary.chmod(0o644)
        os.replace(temporary, target)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def sync_documents(root: Path, source_root: Path) -> list[dict]:
    # Read, validate and check every path before changing any document.
    prepared = prepare_documents(root, source_root)
    for target, data, _ in prepared:
        if not target.exists() or target.read_bytes() != data:
            atomic_write(target, data)
    return [record for _, _, record in prepared]


def write_manifest(root: Path, records: list[dict]) -> None:
    target = contained(root, str(MANIFEST))
    atomic_write(target, (json.dumps(records, ensure_ascii=False, indent=2) + '\n').encode())


def verify_documents(root: Path) -> list[str]:
    """Check committed digests/types without requiring the old checkout at build time."""
    errors = []
    try:
        records = json.loads((root / MANIFEST).read_text())
    except (OSError, ValueError) as exc:
        return [f'Document manifest unavailable: {exc}']
    if not isinstance(records, list) or any(
        not isinstance(record, dict)
        or not all(isinstance(record.get(key), str) for key in ('source', 'target', 'sha256'))
        or not isinstance(record.get('bytes'), int) or record['bytes'] < 1
        for record in records
    ):
        return ['Document manifest must contain well-formed records']
    expected = {(source, target) for source, target in DOCUMENTS}
    if {(r.get('source'), r.get('target')) for r in records} != expected or len(records) != len(expected):
        errors.append('Document manifest does not match allowlist')
    for record in records:
        try:
            target = contained(root, record['target'])
            data = target.read_bytes()
            validate_document(data, target.suffix)
            if len(data) != record['bytes'] or hashlib.sha256(data).hexdigest() != record['sha256']:
                errors.append(f'Document digest mismatch: {record["target"]}')
        except (OSError, ValueError, KeyError) as exc:
            errors.append(f'Document verification failed: {exc}')
    return errors


def preflight_documents(root: Path, source_root: Path) -> bool:
    """Validate source documents locally or committed copies in standalone builds."""
    if source_root.is_dir():
        prepare_documents(root, source_root)
        return True

    errors = verify_documents(root)
    if errors:
        raise ValueError('Committed document verification failed: ' + '; '.join(errors))
    return False


if __name__ == '__main__':
    records = sync_documents(ROOT, ROOT.parent / 'aluplan-2026')
    write_manifest(ROOT, records)
    print(f'Preserved {len(records)} document URLs from 10 original source files')
