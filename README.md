# jeyeoneo.github.io

Public GitHub Pages site for Jeyeon Yona Eo.

## Published Scope

This repository intentionally keeps only the deployment minimum:

- `index.html`
- `assets/`
- `data/`
- `.github/workflows/deploy-pages.yml`
- `.nojekyll`

Private source documents, local assistant settings, and design drafts are excluded from version control and from the Pages artifact.

## Deployment

GitHub Pages is deployed through GitHub Actions.

- Automatic deploy on push to `main`
- Manual deploy with `workflow_dispatch`

The workflow packages only the public site files into the Pages artifact.
