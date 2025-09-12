import { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { QuestionFlow } from './components/QuestionFlow';
import { ResultsPage } from './components/ResultsPage';
import { AdminPage } from './components/AdminPage';
import { calculateDiagnosis } from './utils/scoring';
import { streamLifeline } from './services/ai';
import { Answer, DiagnosisResult, LifelineEvent, AiMessage } from './types';

type AppState = 'landing' | 'questions' | 'generating' | 'results' | 'admin';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  
  // 診断結果を3つのstateに分割して管理
  const [localDiagnosis, setLocalDiagnosis] = useState<DiagnosisResult | null>(null);
  const [lifespan, setLifespan] = useState<number | null>(null);
  const [lifelineItems, setLifelineItems] = useState<LifelineEvent[]>([]);

  const controllerRef = useRef<AbortController | null>(null);

  const handleStartDiagnosis = () => {
    setCurrentState('questions');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    controllerRef.current?.abort(); // 途中で戻る場合もストリームを中断
  };

  const handleRestart = () => {
    setLocalDiagnosis(null);
    setLifespan(null);
    setLifelineItems([]);
    setCurrentState('landing');
    controllerRef.current?.abort();
  };

  const handleQuestionsComplete = async (answers: Answer[]) => {
    // 既存のstateをリセット
    setLocalDiagnosis(null);
    setLifespan(null);
    setLifelineItems([]);
    setCurrentState('generating');

    // AbortControllerの準備
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    // 1. ローカルでの診断を実行
    const localResult = calculateDiagnosis(answers);
    setLocalDiagnosis(localResult);

    // 2. AIストリーミングの準備
    const form: any = {};
    answers.forEach(a => { form[a.questionId] = a.value; });
    const startAge = parseInt(form.age || '30', 10);
    const endAge = parseInt(localStorage.getItem('ai.age.end') || '90', 10);

    try {
      const response = await streamLifeline(form, localResult, startAge, endAge);

      if (!response.body) throw new Error('Response body is empty.');

      // 結果ページへ遷移
      setCurrentState('results');

      // 3. ストリームを読み取ってUIを更新
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let sseBuffer = '';
      let ndjsonBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        
        let eventIdx;
        while ((eventIdx = sseBuffer.indexOf('\n\n')) >= 0) {
          const eventBlock = sseBuffer.slice(0, eventIdx);
          sseBuffer = sseBuffer.slice(eventIdx + 2);

          for (const line of eventBlock.split('\n')) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content ?? '';
              if (delta) {
                ndjsonBuffer += delta;

                let nlIndex;
                while ((nlIndex = ndjsonBuffer.indexOf('\n')) >= 0) {
                  const oneLine = ndjsonBuffer.slice(0, nlIndex).trim();
                  ndjsonBuffer = ndjsonBuffer.slice(nlIndex + 1);
                  if (!oneLine) continue;

                  try {
                    const msg = JSON.parse(oneLine) as AiMessage;
                    if (msg.type === 'lifespan') {
                      setLifespan(msg.value);
                    } else if (msg.type === 'year') {
                      setLifelineItems(prev => [...prev, { age: msg.age, text: msg.text, turning: msg.turning }].sort((a,b) => a.age - b.age));
                    }
                  } catch (e) {
                    console.warn('Invalid NDJSON line received:', oneLine, e);
                  }
                }
              }
            } catch {
              // JSON.parse(data)の失敗は無視
            }
          }
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream reading was aborted.');
      } else {
        console.error("AI lifeline streaming failed:", error);
        alert(`AIストリームの生成に失敗しました。\n${error instanceof Error ? error.message : '不明なエラー'}`);
        setCurrentState('landing');
      }
    } finally {
      // ローディング状態の解除はUI側で行うため、ここでは不要
    }
  };

  // コンポーネントの出し分け
  if (currentState === 'landing') {
    return (
      <Layout onNavigateHome={handleBackToLanding} onNavigateAdmin={() => setCurrentState('admin')}>
        <LandingPage onStart={handleStartDiagnosis} />
      </Layout>
    );
  }

  if (currentState === 'questions') {
    return (
      <Layout onNavigateHome={handleBackToLanding}>
        <QuestionFlow onComplete={handleQuestionsComplete} onBack={handleBackToLanding} />
      </Layout>
    );
  }

  if (currentState === 'generating' || currentState === 'results') {
    return (
      <Layout onNavigateHome={handleBackToLanding} onNavigateAdmin={() => setCurrentState('admin')}>
        <ResultsPage
          diagnosisResult={localDiagnosis}
          lifespan={lifespan}
          lifelineItems={lifelineItems}
          isLoading={currentState === 'generating' && !lifespan} // 初回データ受信までをローディングとする
          onRestart={handleRestart}
        />
      </Layout>
    );
  }

  if (currentState === 'admin') {
    return (
      <Layout onNavigateHome={handleBackToLanding} onNavigateAdmin={() => setCurrentState('admin')}>
        <AdminPage />
      </Layout>
    );
  }

  return (
    <Layout onNavigateHome={handleBackToLanding} onNavigateAdmin={() => setCurrentState('admin')}>
      <LandingPage onStart={handleStartDiagnosis} />
    </Layout>
  );
}