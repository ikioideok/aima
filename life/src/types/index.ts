export interface Question {
  id: string;
  category: 'personality' | 'values' | 'skills' | 'lifestyle' | 'goals';
  text: string;
  type: 'scale' | 'choice' | 'multiple';
  options?: string[];
  scaleLabels?: { min: string; max: string };
  weights: {
    bigFive?: {
      openness?: number;
      conscientiousness?: number;
      extraversion?: number;
      agreeableness?: number;
      neuroticism?: number;
    };
    careerAnchor?: {
      technical?: number;
      management?: number;
      autonomy?: number;
      security?: number;
      entrepreneurship?: number;
      service?: number;
      challenge?: number;
      lifestyle?: number;
    };
    lifePath?: {
      leadership?: number;
      creativity?: number;
      cooperation?: number;
      stability?: number;
      freedom?: number;
      nurturing?: number;
      analysis?: number;
      material?: number;
      wisdom?: number;
    };
  };
}

export interface Answer {
  questionId: string;
  value: number | string | string[];
}

// AIからストリーミングで送られてくるNDJSONの各行の型
export type LifespanMessage = { type: 'lifespan'; value: number; rationale: string };
export type YearMessage = { type: 'year'; age: number; text: string; turning: boolean };
export type AiMessage = LifespanMessage | YearMessage;

// 画面表示に使うライフラインのイベントの型
export type LifelineEvent = {
  age: number;
  text: string;
  turning: boolean;
};

// 新しいフォームデータ型
export interface FormData {
  // 基本プロフィール
  age?: string;
  gender?: string;
  birthPlace?: string;
  residence?: string;
  family?: string;
  
  // 学歴・キャリア
  education?: string;
  occupation?: string;
  tenure?: string;
  changes?: string;
  income?: string;
  futureJob?: string;
  
  // 経済・資産
  savings?: string;
  investing?: string;
  debt?: string;
  spending?: string;
  financeFear?: number;
  
  // 健康・生活習慣
  height?: string;
  weight?: string;
  smoke?: string;
  drink?: string;
  exercise?: string;
  sleep?: string;
  stress?: string;
  checkup?: string;
  
  // 恋愛・結婚・家庭
  loveExp?: string;
  marriage?: string;
  marriageAge?: string;
  children?: string;
  familyRel?: string;
  
  // 性格・価値観
  social?: string;
  decision?: string;
  stressAct?: string;
  priority?: string;
  selfOne?: string;
  
  // 夢・目標
  tenYears?: string;
  bucket?: string;
  liveWhere?: string;
  ideal?: string;
}

export interface BigFiveResult {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface CareerAnchorResult {
  technical: number;
  management: number;
  autonomy: number;
  security: number;
  entrepreneurship: number;
  service: number;
  challenge: number;
  lifestyle: number;
}

export interface LifePathResult {
  primaryPath: number;
  secondaryPath: number;
  description: string;
  characteristics: string[];
}

export interface DiagnosisResult {
  bigFive: BigFiveResult;
  careerAnchor: CareerAnchorResult;
  lifePath: LifePathResult;
  recommendations: {
    careers: string[];
    learningThemes: string[];
    sideBusinesses: string[];
  };
  tenYearPlan: {
    years: string;
    focus: string;
    goals: string[];
  }[];
  // lifelineはAIからのストリームで別途管理するため、オプショナルな LifelineEvent[] 型に変更
  lifeline?: LifelineEvent[];
  futureLetters?: { fromAge: number; text: string }[];
  routeMap?: { name: string; description: string; steps: { label: string; detail: string }[] }[];
  fortuneScores?: { love: number; work: number; health: number; money: number; self: number; family: number };
  highlights?: { age: number; title: string; description?: string }[];
  motto?: string;
  lifeExpectancy?: {
    age: number;        // 推定寿命（中央値）
    low: number;        // 悲観ケース
    high: number;       // 楽観ケース
    rationale: string[]; // 主な要因の説明
  };
}
