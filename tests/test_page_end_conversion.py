"""Runtime contracts for the page-family conversion policy."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]

COMMERCIAL_ROUTES = (
    "/products/allplan-professional",
    "/solutions/road-railway",
    "/package-overview",
    "/paket-karsilastirma",
)
TRAINING_ROUTES = (
    "/solutions-v2/training/online",
    "/video-kutuphanesi/road-design",
)
SUPPORT_ROUTES = (
    "/solutions-v2/connect-license",
    "/solutions-v2/connect-license/activation",
    "/solutions-v2/connect-login",
    "/faq",
)
CORPORATE_ROUTES = ("/about", "/references")
HIDDEN_ROUTES = (
    "/",
    "/contact",
    "/search",
    "/health",
    "/kvkk",
    "/gizlilik-politikasi",
    "/kullanim-sartlari",
)
ALL_ROUTES = (
    *COMMERCIAL_ROUTES,
    *TRAINING_ROUTES,
    *SUPPORT_ROUTES,
    *CORPORATE_ROUTES,
    *HIDDEN_ROUTES,
)


def render_policy() -> dict:
    completed = subprocess.run(
        ["node", "tests/page_end_conversion_runtime.mjs", *ALL_ROUTES],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class PageEndConversionPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        runtime = render_policy()
        cls.results = runtime["results"]
        cls.approved_urls = set(runtime["approvedUrls"])

    def test_commercial_routes_offer_quote_then_trial(self):
        for route in COMMERCIAL_ROUTES:
            with self.subTest(route=route):
                model = self.results[route]
                self.assertEqual(model["kind"], "commercial")
                self.assertEqual(
                    [action["label"] for action in model["actions"]],
                    ["Teklif İste", "Ücretsiz Deneme"],
                )

    def test_training_routes_offer_training_request_then_quote(self):
        for route in TRAINING_ROUTES:
            with self.subTest(route=route):
                model = self.results[route]
                self.assertEqual(model["kind"], "training")
                self.assertEqual(
                    [action["label"] for action in model["actions"]],
                    ["Eğitim Talebi", "Teklif İste"],
                )

    def test_support_routes_offer_only_support_platform(self):
        for route in SUPPORT_ROUTES:
            with self.subTest(route=route):
                model = self.results[route]
                self.assertEqual(model["kind"], "support")
                self.assertEqual(
                    [action["label"] for action in model["actions"]],
                    ["Destek Platformuna Git"],
                )

    def test_corporate_routes_offer_only_quote(self):
        for route in CORPORATE_ROUTES:
            with self.subTest(route=route):
                model = self.results[route]
                self.assertEqual(model["kind"], "corporate")
                self.assertEqual(
                    [action["label"] for action in model["actions"]],
                    ["Teklif İste"],
                )

    def test_hidden_routes_render_no_conversion_model(self):
        for route in HIDDEN_ROUTES:
            with self.subTest(route=route):
                self.assertIsNone(self.results[route])

    def test_every_action_uses_an_approved_destination(self):
        rendered_urls = {
            action["href"]
            for model in self.results.values()
            if model is not None
            for action in model["actions"]
        }
        self.assertTrue(rendered_urls)
        self.assertTrue(rendered_urls.issubset(self.approved_urls))


class PageEndConversionComponentTests(unittest.TestCase):
    def test_component_renders_the_model_with_secure_external_actions(self):
        component = read("src/components/sections/PageEndConversion.tsx")

        self.assertIn(
            "export function PageEndConversion({ model }: { model: PageEndConversionModel })",
            component,
        )
        for marker in [
            "data-page-end-conversion={model.kind}",
            "{model.title}",
            "{model.description}",
            "model.actions.map",
            "action.emphasis === 'primary'",
            'target="_blank"',
            'rel="noopener noreferrer"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertNotIn("{model.kicker}", component)
        self.assertIn("alu-trial-banner", component)
        self.assertIn("alu-trial-banner__inner", component)
        self.assertIn("alu-button--primary", component)
        self.assertIn("alu-button--secondary", component)


if __name__ == "__main__":
    unittest.main()
