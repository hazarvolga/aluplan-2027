"""Approved demand-link migration; operational license forms remain unchanged."""
MAIN_REQUEST_FORM = 'https://forms.office.com/r/hXhnKAG912'
LEGACY_DEMAND_FORM = 'https://forms.office.com/r/XLQm9JPTSR'


def normalize_request_links(value):
    """Return a fresh tree, changing only the exact retired demand URL."""
    if isinstance(value, dict):
        return {key: normalize_request_links(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_request_links(item) for item in value]
    if isinstance(value, str) and value.rstrip('/') == LEGACY_DEMAND_FORM:
        return MAIN_REQUEST_FORM
    return value
