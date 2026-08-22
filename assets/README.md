# Assets

Images used by this repository's documentation.

| File | Used by | Notes |
| --- | --- | --- |
| `dotfusion-logo.svg` | `README.md` | Primary logo, for light backgrounds |
| `dotfusion-logo-dark.svg` | `README.md` | Variant for dark backgrounds, served through `<picture>` and `prefers-color-scheme` |
| `social-preview.png` | GitHub repository settings | 1280 by 640 pixels, set under Settings, Social preview |

The README currently loads the logo from the Dotfusion content delivery network so that it stays in sync with the live site. Committing local copies here is more reliable, because GitHub proxies remote images and a change to the delivery network path would break the README silently. To switch, drop the two SVG files into this folder and replace the remote `srcset` and `src` values in the README with `assets/dotfusion-logo-dark.svg` and `assets/dotfusion-logo.svg`.

Keep images used by a single document next to that document rather than here. This folder is for assets shared across the repository.
