"""Prevent new literal component colors from silently bypassing theme tokens."""
import unittest

from scripts.check_component_colors import main, violations


class ComponentColorGuardTests(unittest.TestCase):
    def test_repository_has_no_unapproved_literals(self):
        self.assertEqual(main(), 0)

    def test_css_literals_are_rejected_but_semantic_tokens_are_allowed(self):
        self.assertTrue(violations('example.module.css', '.card {color:#0f766e; background:rgb(1, 2, 3)}'))
        self.assertTrue(violations('example.module.css', '.card {border-color:rebeccapurple}'))
        self.assertTrue(violations('example.module.css', '.card {--role-accent:#0f766e; color:var(--role-accent)}'))
        self.assertTrue(violations('example.module.css', '.card {color:cornflowerblue}'))
        self.assertFalse(violations('example.module.css', '.card {color:var(--accent-fg);background:var(--surface-raised)}'))
        self.assertFalse(violations('example.module.css', '.card {color:color-mix(in srgb, var(--accent-fg), var(--text-primary))}'))

    def test_jsx_literals_are_rejected_without_matching_normal_text(self):
        self.assertTrue(violations('example.tsx', '<p style={{ color: "#abcdef" }}>Hello</p>'))
        self.assertTrue(violations('example.tsx', '<svg fill="red" />'))
        self.assertFalse(violations('example.tsx', '<a href="#abc" style={{ color: "var(--accent-fg)" }}>red</a>'))

    def test_exceptions_are_narrow(self):
        self.assertFalse(violations('sections/DebugComponentLabel.module.css', '.label{background:#f97316}'))
        self.assertTrue(violations('other.module.css', '.label{background:#f97316}'))
        self.assertTrue(violations('sections/DebugComponentLabel.module.css', '.label{background:#123456}'))


if __name__ == '__main__':
    unittest.main()
