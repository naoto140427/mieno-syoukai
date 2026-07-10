# Testing Guidelines & Workflows

## E2E Testing Protocol (Playwright)
This project uses Playwright for E2E testing. 
The testing workflow requested by the user must be strictly followed when making changes or verifying deployments:

1. **Local Test Phase**
   - Run the standard test suite locally to ensure no regressions.
   - Command: `npx playwright test` (will automatically spin up local build if `BASE_URL` is omitted).
   - Only proceed to deployment once local tests pass.

2. **Preview Environment Test Phase (Post-Deployment)**
   - After code is deployed to the preview/production environment, run the same E2E tests against the actual remote environment.
   - **Target URL**: `https://preview.mieno-shokai.com/`
   - Command: `BASE_URL=https://preview.mieno-shokai.com/ npx playwright test`
   - Ensure the application behaves correctly in the real environment.
