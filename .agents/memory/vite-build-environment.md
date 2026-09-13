---
name: Artifact build environment
description: The environment variables needed when manually building a Vite artifact outside its managed workflow.
---

Manual builds for this artifact need both `PORT` and `BASE_PATH`; the managed workflow supplies them automatically, but a direct `vite build` does not.

**Why:** The Vite config intentionally fails fast when either runtime value is missing, so a plain package build can look broken even when the app workflow is healthy.

**How to apply:** When validating a direct build, provide a local port and the artifact’s registered base path, then treat the managed workflow and preview as the source of truth for runtime behavior.