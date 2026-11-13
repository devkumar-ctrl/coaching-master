# Brand font slot — AlmaBetter

The app's `--font-family-primary` stack is:

```
gellix, "gellix Fallback", sans-serif
```

`@font-face` rules in `frontend/app/globals.css` load from this directory:

| File (this folder) | Weight |
|---|---|
| `gellix-regular.woff2` | 400 |
| `gellix-medium.woff2` | 500 |
| `gellix-semibold.woff2` | 600 |
| `gellix-bold.woff2` | 700 |

Until the licensed woff2 files are placed here, requests 404 harmlessly and the stack renders `gellix Fallback` (metric-adjusted Arial, `size-adjust: 104.3%`).

Do not hardcode any other font family in components — replace the files here instead.
