CMS API

Endpoints
- `POST /generate-outline`: Generate an article outline from a keyword. Protected by `X-Admin-Token`.
- `POST /generate-article`: Generate a full article (HTML body) from an outline. Protected.
- `POST /set-featured`: Overwrite featured article JSON.
- `POST /add-to/:list`: Add article to `recent` or `special`.

Environment variables
- `GITHUB_TOKEN`: GitHub token with repo scope.
- `GITHUB_REPO_OWNER`: Repository owner.
- `GITHUB_REPO_NAME`: Repository name.
- `GITHUB_BRANCH`: Target branch (default `main`).
- `ADMIN_TOKEN`: Admin token required in `X-Admin-Token` header.
- `OPENAI_API_KEY`: OpenAI API key for generation.
- `OPENAI_MODEL`: Model ID (default `gpt-5`).
- `OPENAI_API_BASE`: API base (default `https://api.openai.com/v1`).

Start
- `npm start`

