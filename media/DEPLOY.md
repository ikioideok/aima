# Deployment Guide for Media on Sakura

This document describes how to deploy the media portion of the site to a Sakura shared server using GitHub Actions with SFTP.

## Required Secrets

Before the workflow can deploy, the following secrets must be set in the repository settings (Settings → Secrets and variables → Actions → New repository secret). Do **not** commit any secret values to the repository.

| Secret name | Purpose | Example |
|---|---|---|
| `SAKURA_HOST` | Hostname of your Sakura server | `s1234.sakura.ne.jp` |
| `SAKURA_USER` | SFTP username used for deployment | `your_sakura_user` |
| `SAKURA_PASSWORD` or `SAKURA_SSH_KEY` | Password for SFTP or private SSH key (set one of them) | — |
| `SAKURA_REMOTE_DIR` | Directory on the server where the site will be uploaded | `/home/USER/www/public_html/media/` |
| `VITE_CMS_API_BASE` | (Optional) Base URL of your CMS API if using CMS | `https://cms.example.com` |
| `VITE_ADMIN_TOKEN` | (Optional) Admin token for your CMS | `abcdef1234567890` |

To add a secret, navigate to **Settings → Secrets and variables → Actions** in this repository, click **New repository secret**, and enter the name and value. For keys, paste the entire private key contents.

## Deployment Flow

1. Make changes to content or code under the `media/` directory and push them to a branch.
2. Open a Pull Request (PR) against `main`. The workflow will build the site but skips deployment for PRs.
3. Once the PR is reviewed and secrets have been configured, merge the PR into `main`.
4. A push to `main` triggers the `deploy-media` workflow. The job performs the following:
   - Checks out the repository.
   - Installs dependencies and runs the build and `postbuild` scripts in `media`.
   - Uploads the contents of `media/dist/media` via SFTP to the directory specified by `SAKURA_REMOTE_DIR`, **only** if all required secrets are non‑empty. If any secret is missing, the workflow logs “Secrets未設定のためデプロイ省略” and skips deployment.

## Verification Checklist

After a successful deployment:

- Open the top page at `https://<your-domain>/media/` and ensure it loads.
- Directly access a deep path (e.g. `https://<your-domain>/media/articles/some-article/`) and confirm it does not return a 404; the SPA fallback should serve `index.html`.
- Check that CSS/JS assets are served from `/media/assets/...` and have long‑term caching headers.
- Ensure that article headings (e.g. H2/H3 in Japanese) appear correctly in the table of contents.

## Rollback & Manual Deployment

If you need to roll back to a previous build:

1. Check the workflow run logs to find the job that produced a working build.
2. Locally or via CI, rebuild the `media` project at that commit (`cd media && npm ci && npm run build && npm run postbuild`).
3. Upload the resulting `dist/media` directory manually via SFTP to the path configured in `SAKURA_REMOTE_DIR`.

Manual deployments can be performed by running the same build commands locally and uploading via your preferred SFTP client. Remember to exclude hidden files and source maps (`*.map`).

## Future Enhancements

- Add a step in the workflow to generate and upload a sitemap.xml (TODO).
- Support additional CMS/AI functionality by setting the optional `VITE_CMS_API_BASE` and `VITE_ADMIN_TOKEN` secrets and redeploying.
