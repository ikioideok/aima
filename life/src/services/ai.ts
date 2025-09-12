import { FormData, DiagnosisResult } from "../types";

type Provider = "openai" | "gemini";

// API設定を取得するヘルパー関数
function getConfig() {
  const provider = (localStorage.getItem("ai.provider") as Provider) || (import.meta.env.VITE_AI_PROVIDER as Provider) || "openai";
  const defaultOpenAIBase = import.meta.env.DEV ? "/openai" : "https://api.openai.com";

  return {
    provider,
    openai: {
      apiKey: localStorage.getItem("ai.openai.key") || import.meta.env.VITE_OPENAI_API_KEY,
      model: localStorage.getItem("ai.openai.model") || import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
      baseURL: (localStorage.getItem("ai.openai.base") || import.meta.env.VITE_OPENAI_BASE_URL || defaultOpenAIBase).replace(/\$/, ''),
    },
    gemini: {
      apiKey: localStorage.getItem("ai.gemini.key") || import.meta.env.VITE_GEMINI_API_KEY,
      model: localStorage.getItem("ai.gemini.model") || import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash-latest",
    },
  };
}

// AIに渡すプロンプトを構築する関数（テンプレートリテラルを避けて構文エラーを防止）
function buildPrompt(form: FormData, diag: DiagnosisResult | null, startAge: number, endAge: number): { system: string; user: string } {
  const profileData = JSON.stringify(form, null, 2);
  const diagnosisSummary = diag
    ? JSON.stringify({
        bigFive: diag.bigFive,
        topCareerAnchor: Object.entries(diag.careerAnchor).sort(([,a],[,b])=> (b as number)-(a as number))[0]?.[0],
        lifePath: diag.lifePath,
      }, null, 2)
    : "(診断結果なし)";

  const system = [
    'あなたは優れたキャリアコーチ兼ライフプランナーです。ユーザーのプロフィールと性格診断結果に基づき、推定寿命とその後の人生の出来事を生成します。',
    '出力は **必ずNDJSON形式（1行に1つのJSONオブジェクト）** で、以下の2種類のオブジェクトのみを出力してください。',
    '1. 寿命: `{"type":"lifespan","value":85,"rationale":"健康的な習慣と安定した精神状態を考慮しました。"}`',
    '2. 各年の出来事: `{"type":"year","age":35,"text":"新しいプロジェクトのリーダーに抜擢され、管理能力が試される一年。","turning":true}`',
    '\n### ルール',
    '- **最初に必ず寿命（lifespan）オブジェクトを1行だけ出力してください。**',
    '- その後、ユーザーの現在年齢から寿命までの各年について、年齢（age）を昇順で1年ずつ出来事（year）オブジェクトを出力してください。',
    '- 出来事（text）は、具体的で現実的、かつポジティブな学びや成長に繋がる内容にしてください。80文字以内が望ましいです。',
    '- 人生の転機となる重要な年には `"turning":true` を設定してください。',
    '- **出力にはJSONオブジェクト以外のテキスト（前置き、後書き、コードブロック等）を絶対に含めないでください。**'
  ].join('\n');

  const user = [
    '以下は私のプロフィールと診断結果です。指示通りにNDJSON形式でライフラインを生成してください。',
    '\n# プロフィール',
    '```json',
    profileData,
    '```',
    '\n# 診断サマリー',
    '```json',
    diagnosisSummary,
    '```'
  ].join('\n');

  return { system, user };
}


/**
 * AIライフライン生成のストリームを開始し、Responseオブジェクトを返す。
 * これにより、呼び出し元でボディのReadableStreamを処理できる。
 */
export async function streamLifeline(form: FormData, diag: DiagnosisResult | null, startAge: number, endAge: number): Promise<Response> {
  const config = getConfig();
  const { system, user } = buildPrompt(form, diag, startAge, endAge);

  if (config.provider !== 'openai') {
    throw new Error('現在、ストリーミング機能はOpenAIプロバイダーのみ対応しています。');
  }

  const { apiKey, model, baseURL } = config.openai;
  if (!apiKey) {
    throw new Error("OpenAI APIキーが設定されていません。");
  }

  const url = `${baseURL}/v1/chat/completions`;

  const requestBody = {
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    stream: true,
  };

  // デバッグ用にリクエスト内容をコンソールに出力
  console.log("Sending request to OpenAI:", JSON.stringify(requestBody, null, 2));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error("OpenAI API Error Response:", errorBody);
    throw new Error(`OpenAI APIエラー: ${response.status} ${response.statusText}`);
  }

  return response;
}