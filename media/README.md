# AI Marketing News

マーケティングの最新ニュースと実務知見を届けるメディアです。SEO、広告、コンテンツ、SNS、CRM/MA、マーケティングAI活用までをカバーします。

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  ## Admin UI
  - Access: `/media/admin`
  - Env: `VITE_CMS_API_BASE` (CMS API URL), `VITE_ADMIN_TOKEN`
  - Features: AI outline generation and article drafting (requires CMS API with `OPENAI_API_KEY` or `GEMINI_API_KEY`).
  - Provider select: Default is `Gemini (gemini-2.5-pro)`. You can switch to `GPT-5 (OpenAI)` or override the model ID per request.
<!-- Deployment trigger -->
