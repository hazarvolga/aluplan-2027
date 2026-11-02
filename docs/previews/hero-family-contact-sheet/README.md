# Hero Family Contact Sheet

This approval preview intentionally reuses the canonical web derivatives under
`public/assets/heroes/families/`; it does not keep duplicate preview assets.

Run it from the project root:

```sh
python3 -m http.server 8772 --bind 127.0.0.1
```

Then open:

`http://127.0.0.1:8772/docs/previews/hero-family-contact-sheet/`

The generic `docs/previews`-only server described by the parent preview README
cannot serve this contact sheet because its canonical images live outside that
server root.
