# DevOps Rules

## Tips

You can connect to "ssh cs00x-lan" without password

## Developers workflow

**Manual** commit and push (dev machine) -> GitHub -> **automatic** (triggered by a push) pull (server) -> **automatic** build (server) -> **automatic** deploy (server local registry)

## Always

1. Treat the GitHub repository as the single source of truth.
2. Keep those product and environment builds local they must not be delegated to GitHub Actions or GHCR.
3. Prefer solutions that maximize independence from third-party vendors.
4. Check the detailled logs of pods

## Never

4. Let residual scripts and log files.
5. Let residual pods