import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function AdminPage() {
  const [provider, setProvider] = useState<string>(localStorage.getItem("ai.provider") || "openai");
  const [openaiKey, setOpenaiKey] = useState<string>(localStorage.getItem("ai.openai.key") || "");
  const [openaiModel, setOpenaiModel] = useState<string>(localStorage.getItem("ai.openai.model") || "gpt-5");
  const [openaiBase, setOpenaiBase] = useState<string>(localStorage.getItem("ai.openai.base") || "https://api.openai.com");
  const [geminiKey, setGeminiKey] = useState<string>(localStorage.getItem("ai.gemini.key") || "");
  const [geminiModel, setGeminiModel] = useState<string>(localStorage.getItem("ai.gemini.model") || "gemini-1.5-flash-latest");
  const [endAge, setEndAge] = useState<string>(localStorage.getItem("ai.age.end") || "90");
  const [streamEnabled, setStreamEnabled] = useState<boolean>((localStorage.getItem("ai.stream.enabled") || "false") === "true");

  function save() {
    localStorage.setItem("ai.provider", provider);
    localStorage.setItem("ai.openai.key", openaiKey.trim());
    localStorage.setItem("ai.openai.model", openaiModel.trim());
    localStorage.setItem("ai.openai.base", openaiBase.trim());
    localStorage.setItem("ai.gemini.key", geminiKey.trim());
    localStorage.setItem("ai.gemini.model", geminiModel.trim());
    localStorage.setItem("ai.age.end", endAge.trim());
    localStorage.setItem("ai.stream.enabled", String(streamEnabled));
    alert("設定を保存しました（ローカルストレージ）");
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI設定（開発用）</CardTitle>
          <CardDescription>GPT/Geminiのどちらかを選び、APIキーを保存（ローカル）します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">プロバイダ</label>
              <select value={provider} onChange={(e)=>setProvider(e.target.value)} className="w-full border rounded-md px-3 py-2">
                <option value="openai">OpenAI (GPT)</option>
                <option value="gemini">Google Gemini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">未来年表の上限年齢</label>
              <input value={endAge} onChange={(e)=>setEndAge(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-medium">OpenAI</div>
              <input placeholder="OpenAI API Key" value={openaiKey} onChange={(e)=>setOpenaiKey(e.target.value)} className="w-full border rounded-md px-3 py-2" />
              <input placeholder="Model (例: gpt-4o-mini)" value={openaiModel} onChange={(e)=>setOpenaiModel(e.target.value)} className="w-full border rounded-md px-3 py-2" />
              <input placeholder="Base URL (開発は /openai を推奨)" value={openaiBase} onChange={(e)=>setOpenaiBase(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div className="space-y-2">
              <div className="font-medium">Gemini</div>
              <input placeholder="Gemini API Key" value={geminiKey} onChange={(e)=>setGeminiKey(e.target.value)} className="w-full border rounded-md px-3 py-2" />
              <input placeholder="Model (例: gemini-1.5-flash-latest)" value={geminiModel} onChange={(e)=>setGeminiModel(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <div className="border rounded-md p-3 bg-gray-50">
            <label className="inline-flex items-center gap-2 text-sm text-gray-800">
              <input type="checkbox" checked={streamEnabled} onChange={(e)=>setStreamEnabled(e.target.checked)} />
              ストリーミングを有効化（OpenAI組織のVerifyが必要。未Verifyならオフ推奨）
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={save} className="bg-gray-900 text-white hover:bg-gray-800">保存</Button>
          </div>

          <p className="text-xs text-gray-500">注意: APIキーはブラウザのローカルストレージに保存されます（開発用途）。本番ではサーバ経由にしてください。</p>
        </CardContent>
      </Card>
    </div>
  );
}
