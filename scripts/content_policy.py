"""Explicit, approved deviations from immutable historical source content."""
OLD_TRIAL_SENTENCE = "30 gün boyunca Allplan'ı ücretsiz deneyin. Kredi kartı bilgisi gerekmez."
CURRENT_TRIAL_SENTENCE = "14 gün boyunca Allplan'ı ücretsiz deneyin. Kredi kartı bilgisi gerekmez."


def _replace_contact_trial(value):
    if isinstance(value, dict):
        return {key: _replace_contact_trial(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_replace_contact_trial(item) for item in value]
    return CURRENT_TRIAL_SENTENCE if value == OLD_TRIAL_SENTENCE else value


def apply_approved_content_policy(pages):
    """26 Oct 2026 approval + allplan.com/trial-or-subscription/: 14 day trial.

    Scope is the exact obsolete Contact sentence; addon trial terms are untouched.
    """
    return {route: _replace_contact_trial(page) if route == '/contact' else page
            for route, page in pages.items()}
