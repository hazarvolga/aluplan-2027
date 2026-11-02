"""Keyboard and relationship contracts for every tab family."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class TabAccessibilityContractTests(unittest.TestCase):
    def test_shared_keyboard_helper_wraps_focus_and_selection(self):
        completed = subprocess.run(
            ["node", "tests/tab_keyboard_runtime.mjs"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        result = json.loads(completed.stdout)

        self.assertEqual(
            [(item["selected"], item["focused"], item["prevented"]) for item in result["horizontal"]],
            [([0], [0], True), ([2], [2], True), ([0], [0], True), ([2], [2], True), ([], [], False)],
        )
        self.assertEqual(
            [(item["selected"], item["focused"]) for item in result["vertical"]],
            [([0], [0]), ([2], [2])],
        )
        self.assertEqual(result["empty"], {
            "key": "ArrowRight",
            "selected": [],
            "focused": [],
            "prevented": False,
        })

    def test_all_tab_families_use_roving_focus_and_shared_keyboard_behavior(self):
        component_markers = {
            "src/components/sections/DisciplineWorkflowSection.tsx": [
                "handleStructuredTabKey",
                "tabIndex={isSelected ? 0 : -1}",
                "onKeyDown={(event) => handleStructuredTabKey",
                'aria-controls={`${id}-panel`}',
                'id={`${id}-panel`}',
                "aria-labelledby={`${id}-tab-${activeRole.id}`}",
            ],
            "src/components/sections/ProfessionalServicesSection.tsx": [
                "handleStructuredTabKey",
                "tabIndex={safeGroupIdx === idx ? 0 : -1}",
                'aria-controls="services-panel"',
                "onKeyDown={(event) => handleStructuredTabKey",
                'role="tabpanel"',
                'id="services-panel"',
                "aria-labelledby={`services-tab-${safeGroupIdx}`}",
            ],
            "src/components/sections/ReferencesDirectorySection.tsx": [
                "handleStructuredTabKey",
                "tabIndex={isActive ? 0 : -1}",
                'aria-controls="references-panel"',
                "onKeyDown={(event) => handleStructuredTabKey",
                'role="tabpanel"',
                "aria-labelledby={`references-tab-${activeCategoryIndex}`}",
            ],
            "src/components/sections/SubpageView.tsx": [
                "handleStructuredTabKey",
                "tabIndex={activeTabIdx === sIdx ? 0 : -1}",
                'aria-controls="module-panel"',
                "onKeyDown={(event) => handleStructuredTabKey",
                'role="tabpanel"',
                'id="module-panel"',
                "aria-labelledby={`module-tab-${activeTabIdx}`}",
            ],
            "src/components/sections/TrainingTabs.tsx": [
                "handleStructuredTabKey",
                "onKeyDown={(event) => handleStructuredTabKey",
            ],
        }

        for relative, markers in component_markers.items():
            source = read(relative)
            for marker in markers:
                with self.subTest(component=relative, marker=marker):
                    self.assertIn(marker, source)

    def test_search_inputs_have_programmatic_names(self):
        search_page = read("src/components/sections/SearchPageSection.tsx")
        references = read("src/components/sections/ReferencesDirectorySection.tsx")
        site_shell = read("src/components/shell/SiteShell.tsx")

        self.assertIn('aria-label="Site içeriğinde ara"', search_page)
        self.assertIn('aria-label="Referans kurum ara"', references)
        self.assertIn('aria-label="Site içinde ara"', site_shell)
        self.assertEqual(references.count('id="references-panel"'), 2)

    def test_social_links_are_icon_only_but_keep_accessible_names(self):
        site_shell = read("src/components/shell/SiteShell.tsx")

        self.assertEqual(site_shell.count("aria-label={soc.label}"), 2)
        self.assertEqual(
            site_shell.count(
                '<AluIcon name={getSocialIconName(soc.label)} size="sm" />'
            ),
            2,
        )
        self.assertNotIn("<span>{soc.label}</span>", site_shell)


if __name__ == "__main__":
    unittest.main()
