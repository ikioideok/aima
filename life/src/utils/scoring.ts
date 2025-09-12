import { Answer, DiagnosisResult, BigFiveResult, CareerAnchorResult, LifePathResult, FormData } from '../types';

export function calculateDiagnosis(answers: Answer[]): DiagnosisResult {
  // フォームデータからの分析ロジック
  const formData: FormData = {};
  answers.forEach(answer => {
    formData[answer.questionId as keyof FormData] = answer.value as any;
  });

  const bigFive = calculateBigFive(formData);
  const careerAnchor = calculateCareerAnchor(formData);
  const lifePath = calculateLifePath(formData);
  const recommendations = generateRecommendations(careerAnchor, bigFive);
  const tenYearPlan = generateTenYearPlan(formData);
  const lifeExpectancy = calculateLifeExpectancy(formData);

  // 追加生成
  const lifeline = generateLifeline(formData, tenYearPlan);
  const futureLetters = generateFutureLetters(formData, bigFive, careerAnchor, tenYearPlan);
  const routeMap = generateRouteMap(formData, recommendations, tenYearPlan);
  const fortuneScores = generateFortuneScores(formData, bigFive, careerAnchor);
  const highlights = generateHighlights(tenYearPlan);
  const motto = generateMotto(formData, bigFive, careerAnchor);

  return {
    bigFive,
    careerAnchor,
    lifePath,
    recommendations,
    tenYearPlan,
    lifeExpectancy,
    lifeline,
    futureLetters,
    routeMap,
    fortuneScores,
    highlights,
    motto
  };
}

// ビッグファイブ分析（フォームデータから推測）
function calculateBigFive(data: FormData): BigFiveResult {
  let openness = 50;
  let conscientiousness = 50;
  let extraversion = 50;
  let agreeableness = 50;
  let neuroticism = 50;

  // 社交性から外向性を判定
  if (data.social === 'yes') extraversion += 30;
  else if (data.social === 'no') extraversion -= 20;

  // 決断スタイルから誠実性と開放性を判定
  if (data.decision === 'plan') conscientiousness += 25;
  else if (data.decision === 'intuition') openness += 20;

  // 転職経験から開放性を判定
  if (data.changes === '2回以上') openness += 20;
  if (data.changes === 'なし') conscientiousness += 15;

  // ストレス行動から性格を判定
  if (data.stressAct === '相談する') agreeableness += 20;
  if (data.stressAct === '運動') conscientiousness += 15;
  if (data.stress === '高い') neuroticism += 25;
  else if (data.stress === '低い') neuroticism -= 20;

  // 教育レベルから開放性を判定
  if (data.education === '大学院以上') openness += 15;
  if (data.education === '大学') openness += 10;

  // 投資状況から開放性を判定
  if (data.investing === '不動産など本格的') openness += 15;
  if (data.investing === 'していない') conscientiousness -= 10;

  // 健康習慣から誠実性を判定
  if (data.exercise === '週3回以上') conscientiousness += 20;
  if (data.checkup === '毎年受診') conscientiousness += 15;

  return {
    openness: Math.min(Math.max(openness, 0), 100),
    conscientiousness: Math.min(Math.max(conscientiousness, 0), 100),
    extraversion: Math.min(Math.max(extraversion, 0), 100),
    agreeableness: Math.min(Math.max(agreeableness, 0), 100),
    neuroticism: Math.min(Math.max(neuroticism, 0), 100)
  };
}

// キャリアアンカー分析
function calculateCareerAnchor(data: FormData): CareerAnchorResult {
  let technical = 20;
  let management = 20;
  let autonomy = 20;
  let security = 20;
  let entrepreneurship = 20;
  let service = 20;
  let challenge = 20;
  let lifestyle = 20;

  // 職業から推測
  const occupation = data.occupation?.toLowerCase() || '';
  if (occupation.includes('エンジニア') || occupation.includes('技術') || occupation.includes('開発')) {
    technical += 40;
  }
  if (occupation.includes('管理') || occupation.includes('マネージャー') || occupation.includes('部長')) {
    management += 40;
  }
  if (occupation.includes('営業') || occupation.includes('セールス')) {
    challenge += 30;
  }
  if (occupation.includes('自営') || occupation.includes('代表') || occupation.includes('社長')) {
    entrepreneurship += 40;
  }

  // 価値観から推測
  if (data.priority === 'お金') entrepreneurship += 30, challenge += 15;
  if (data.priority === '安定') security += 30;
  if (data.priority === '自由') autonomy += 30, lifestyle += 20;
  if (data.priority === '挑戦') challenge += 30, entrepreneurship += 15;
  if (data.priority === '家族') lifestyle += 30, service += 15;
  if (data.priority === '健康') lifestyle += 25;

  // 転職経験から推測
  if (data.changes === '2回以上') autonomy += 20, challenge += 15;
  if (data.changes === 'なし') security += 20, technical += 10;

  // 年収から推測
  if (data.income === '800万以上') management += 15, entrepreneurship += 15, technical += 10;
  if (data.income === '〜300万') service += 15, lifestyle += 10;

  // 教育レベルから推測
  if (data.education === '大学院以上') technical += 15, management += 10;

  // 将来の仕事への希望から推測
  const futureJob = data.futureJob?.toLowerCase() || '';
  if (futureJob.includes('起業') || futureJob.includes('独立')) {
    entrepreneurship += 25, autonomy += 15;
  }
  if (futureJob.includes('管理') || futureJob.includes('マネジメント')) {
    management += 25;
  }

  return {
    technical: Math.min(technical, 100),
    management: Math.min(management, 100),
    autonomy: Math.min(autonomy, 100),
    security: Math.min(security, 100),
    entrepreneurship: Math.min(entrepreneurship, 100),
    service: Math.min(service, 100),
    challenge: Math.min(challenge, 100),
    lifestyle: Math.min(lifestyle, 100)
  };
}

// ライフパス計算（数秘術風）
function calculateLifePath(data: FormData): LifePathResult {
  // 年齢から基本ライフパスナンバーを計算
  const age = parseInt(data.age || '30');
  let lifePathNumber = (age % 9) + 1;

  // 価値観で調整
  const priorityMap: { [key: string]: number } = {
    'お金': 8, 
    '家族': 6, 
    '健康': 4, 
    '自由': 5, 
    '挑戦': 1, 
    '安定': 4
  };
  
  if (data.priority && priorityMap[data.priority]) {
    lifePathNumber = priorityMap[data.priority];
  }

  // 誕生地域から微調整
  if (data.residence === 'overseas') lifePathNumber = 5; // 自由の道
  if (data.residence === 'rural') lifePathNumber = 4; // 安定の道

  const pathDescriptions: { [key: number]: string } = {
    1: 'リーダーシップと独立のパス',
    2: '協調と平和のパス', 
    3: '創造と表現のパス',
    4: '安定と継続のパス',
    5: '自由と冒険のパス',
    6: '愛と奉仕のパス',
    7: '分析と探求のパス',
    8: '成功と物質的達成のパス',
    9: '知恵と人道のパス'
  };

  const pathCharacteristics: { [key: number]: string[] } = {
    1: ['強いリーダーシップ', '独立性', '先駆者精神', '決断力'],
    2: ['協調性', 'サポート力', '平和主義', '感受性'],
    3: ['創造性', '表現力', '楽観性', 'コミュニケーション能力'],
    4: ['安定性', '責任感', '実用性', '忍耐力'],
    5: ['自由愛好', '冒険心', '柔軟性', '多様性'],
    6: ['愛と奉仕', '家族思い', '責任感', '癒しの力'],
    7: ['分析力', '探求心', '直感力', '精神性'],
    8: ['物質的成功', 'ビジネス感覚', '組織力', '野心'],
    9: ['知恵', '人道主義', '導き', '寛容性']
  };

  return {
    primaryPath: lifePathNumber,
    secondaryPath: ((lifePathNumber + 1) % 9) + 1,
    description: pathDescriptions[lifePathNumber],
    characteristics: pathCharacteristics[lifePathNumber]
  };
}

// レコメンデーション生成
function generateRecommendations(careerAnchor: CareerAnchorResult, bigFive: BigFiveResult) {
  const careers: string[] = [];
  const learningThemes: string[] = [];
  const sideBusinesses: string[] = [];

  // 最強のキャリアアンカーを特定
  const topAnchor = Object.entries(careerAnchor)
    .sort(([,a], [,b]) => b - a)[0][0];

  // キャリア推奨
  const careerMap: { [key: string]: string[] } = {
    technical: ['システムエンジニア', 'データサイエンティスト', '研究開発職', 'ITアーキテクト'],
    management: ['プロジェクトマネージャー', 'コンサルタント', '事業企画', 'チームリーダー'],
    autonomy: ['フリーランス', '独立コンサルタント', '起業家', 'クリエイター'],
    security: ['公務員', '大手企業社員', '金融業界', '医療従事者'],
    entrepreneurship: ['スタートアップ起業', 'ベンチャー企業', '新規事業開発', 'イノベーター'],
    service: ['教育関係', 'NPO職員', 'カウンセラー', 'ソーシャルワーカー'],
    challenge: ['営業職', 'コンサルタント', 'プロジェクトマネージャー', '新規開拓'],
    lifestyle: ['リモートワーカー', 'フレックス勤務', 'ワーケーション', '時短勤務']
  };

  careers.push(...(careerMap[topAnchor] || []));

  // 学習テーマ
  if (bigFive.openness > 60) learningThemes.push('創造性開発', '新技術習得', '多様性理解');
  if (bigFive.conscientiousness > 60) learningThemes.push('プロジェクト管理', '効率化技術');
  if (bigFive.extraversion > 60) learningThemes.push('リーダーシップ', 'コミュニケーション');
  
  // 共通的に重要な学習テーマ
  learningThemes.push('AI・DX関連', 'グローバルスキル', '健康管理');

  // 副業推奨
  if (careerAnchor.entrepreneurship > 50) {
    sideBusinesses.push('オンライン事業', 'コンサルティング', 'コンテンツ販売');
  }
  if (careerAnchor.lifestyle > 50) {
    sideBusinesses.push('ブログ・YouTube', '在宅サービス', 'パッシブインカム');
  }
  
  // 共通副業
  sideBusinesses.push('スキル販売', '投資・資産運用', 'オンライン教育');

  return { careers, learningThemes, sideBusinesses };
}

// 10年プラン生成
function generateTenYearPlan(data: FormData) {
  const ageNow = parseInt(data.age || '30');
  const endAge = 90; // 死ぬまでの目安

  // 個人傾向
  const priority = data.priority || '安定';
  const topAnchor = (() => {
    const anchors = ['技術・専門','管理・経営','自律・独立','安定・保障','起業・創造','奉仕・貢献','挑戦・競争','ライフスタイル'];
    // 簡易: 価値観に応じて軸を割り当て
    if (priority === '自由') return '自律・独立';
    if (priority === '挑戦') return '挑戦・競争';
    if (priority === 'お金') return '起業・創造';
    if (priority === '家族') return 'ライフスタイル';
    if (priority === '健康') return '安定・保障';
    return anchors[(ageNow % anchors.length)];
  })();

  const entries: { years: string; focus: string; goals: string[] }[] = [];

  for (let age = ageNow; age <= endAge; age++) {
    const decade = Math.floor(age / 10) * 10;
    // フォーカス決定
    const focus = (
      decade < 40 ? '基盤拡張' :
      decade < 50 ? '主戦力化' :
      decade < 60 ? '方向転換/深掘り' :
      decade < 70 ? 'ポートフォリオ化' :
      decade < 80 ? '継承/地域貢献' :
      '生活の質最適化'
    );

    // ドメイン別ゴールを具体化
    const goals: string[] = [];
    // キャリア
    if (topAnchor === '起業・創造' || priority === 'お金') {
      goals.push(`キャリア: 新収益源を1本追加（小規模プロダクト/副業）`);
    } else if (topAnchor === '自律・独立' || priority === '自由') {
      goals.push(`キャリア: 裁量の大きい案件に比重を移す（リモート/業務委託）`);
    } else if (topAnchor === '管理・経営') {
      goals.push(`キャリア: チーム/プロジェクトの責任範囲を拡大（人材育成/予算）`);
    } else if (topAnchor === '技術・専門') {
      goals.push(`キャリア: 中核技術のアウトプット（月1本の公開/登壇）`);
    } else {
      goals.push(`キャリア: 年次の振り返りと目標再設定（半期KPIを明確化）`);
    }

    // 家族/人間関係
    if (priority === '家族') {
      goals.push(`家族: 月1回のイベント/旅行を計画（写真・記録を残す）`);
    } else {
      goals.push(`関係: メンター/同領域の知人と四半期1回面談/相談`);
    }

    // 健康
    const health = age < 45 ? '筋力/姿勢の維持（週2回の運動）' : age < 65 ? '内臓/血圧の管理（定期検診）' : '可動域の確保（ストレッチ/散歩）';
    goals.push(`健康: ${health}`);

    // 資産
    const asset = age < 40 ? 'つみたて投資の増額（+1万円/月）' : age < 55 ? 'リスク資産と現金の比率見直し（60/40目安）' : '生活費2年分の現預金クッション維持';
    goals.push(`資産: ${asset}`);

    // 重要イベント（数年に一度）
    if (age % 5 === 0 && age !== ageNow) {
      const milestone = (
        age < 40 ? '専門資格/成果の可視化' :
        age < 50 ? '役割拡大/部門横断のリード' :
        age < 60 ? 'セカンド分野の立ち上げ' :
        age < 70 ? '仕事の比率を60%に調整' :
        age < 80 ? '地域/NPOへの定期参加' :
        '生活動線のダウンサイジング検討'
      );
      goals.push(`節目: ${milestone}`);
    }

    entries.push({ years: `${age}歳`, focus: `${focus}（${topAnchor}）`, goals });
  }

  return entries;
}

// 寿命推定（簡易モデル）
function calculateLifeExpectancy(data: FormData) {
  let base = 84;
  if (data.gender === 'male') base -= 3;
  if (data.gender === 'female') base += 1;

  const rationale: string[] = [];
  // 喫煙
  if (data.smoke === '毎日') { base -= 5; rationale.push('喫煙習慣（毎日）'); }
  else if (data.smoke === '時々') { base -= 2; rationale.push('喫煙習慣（時々）'); }
  else if (data.smoke === '吸わない') { base += 1; rationale.push('非喫煙'); }
  // 飲酒
  if (data.drink === '週3回以上') { base -= 1; rationale.push('飲酒頻度（週3回以上）'); }
  else if (data.drink === 'ほとんど飲まない') { base += 1; rationale.push('節酒'); }
  // 運動
  if (data.exercise === '週3回以上') { base += 2; rationale.push('運動習慣（週3回以上）'); }
  else if (data.exercise === '週1〜2回') { base += 1; rationale.push('運動習慣（週1〜2回）'); }
  else if (data.exercise === 'しない') { base -= 2; rationale.push('運動不足'); }
  // 睡眠
  if (data.sleep === '6〜7時間') { base += 1; rationale.push('適正睡眠'); }
  else if (data.sleep === '5時間未満') { base -= 2; rationale.push('短時間睡眠'); }
  // ストレス
  if (data.stress === '高い') { base -= 2; rationale.push('高ストレス'); }
  else if (data.stress === '低い') { base += 1; rationale.push('低ストレス'); }
  // 健康診断
  if (data.checkup === '毎年受診') { base += 2; rationale.push('健康診断（毎年）'); }
  else if (data.checkup === '受けていない') { base -= 2; rationale.push('健康診断（未受診）'); }
  // BMI
  const h = parseFloat(data.height || '0');
  const w = parseFloat(data.weight || '0');
  if (h > 0 && w > 0) {
    const m = h / 100;
    const bmi = w / (m * m);
    if (bmi < 18.5) { base -= 1; rationale.push('低体重傾向'); }
    else if (bmi >= 25 && bmi < 30) { base -= 1; rationale.push('過体重'); }
    else if (bmi >= 30) { base -= 3; rationale.push('肥満'); }
    else { base += 1; rationale.push('適正体重'); }
  }
  // 金融不安
  const fear = typeof data.financeFear === 'number' ? data.financeFear : 3;
  if (fear >= 4) { base -= 1; rationale.push('資産形成への不安'); }
  else if (fear <= 2) { base += 1; rationale.push('資産形成の安心感'); }

  const age = Math.round(Math.max(60, Math.min(100, base)));
  const low = Math.max(55, age - 5);
  const high = Math.min(105, age + 5);
  return { age, low, high, rationale };
}

// ライフライン（年齢ごとにカテゴリ別の出来事）
function generateLifeline(data: FormData, plan: { years: string; focus: string; goals: string[] }[]) {
  const toAge = (label: string) => parseInt(label.replace('歳', ''), 10) || 0;
  return plan.map((p) => {
    const age = toAge(p.years);
    const items = [
      { type: '仕事' as const, text: p.goals.find((g) => g.startsWith('キャリア:'))?.replace('キャリア: ', '') || '担当領域の拡張' },
      { type: '人間関係' as const, text: (p.goals.find((g) => g.startsWith('家族:')) || p.goals.find((g) => g.startsWith('関係:')) || '信頼できるつながりを増やす').replace(/^(家族|関係):\s*/, '') },
      { type: '健康' as const, text: (p.goals.find((g) => g.startsWith('健康:')) || '定期運動と検診を継続').replace('健康: ', '') },
      { type: '出来事' as const, text: (p.goals.find((g) => g.startsWith('節目:')) || '日々の積み重ねを記録').replace('節目: ', ''), turning: p.goals.some((g) => g.startsWith('節目:')) }
    ];
    return { age, items };
  });
}

// レター（50歳/80歳）
function generateFutureLetters(data: FormData, big: BigFiveResult, anchor: CareerAnchorResult, plan: { years: string; focus: string; goals: string[] }[]) {
  const current = parseInt(data.age || '30', 10);
  const targets = [50, 80];
  return targets.map((t) => {
    const tone = big.neuroticism < 45 ? '静かで落ち着いた' : '率直で温かい';
    const focus = plan.find((p) => parseInt(p.years, 10) === t)?.focus || 'これからの指針';
    const text = `${t}歳のあなたから。いま大切にしていることを続けてください。焦らず、でも止まらず。${focus}に沿って、今日の一歩を積み重ねれば十分です。人との縁を手入れし、体をいたわり、学びを怠らないで。未来の私は、その積み重ねに心から感謝しています。`;
    return { fromAge: t, text };
  });
}

// 分岐地図（A/B/C）
function generateRouteMap(data: FormData, rec: { careers: string[]; learningThemes: string[]; sideBusinesses: string[] }, plan: { years: string; focus: string; goals: string[] }[]) {
  const a = {
    name: 'A: 現職深化ルート',
    description: 'いまの強みを核に主戦力化',
    steps: [
      { label: '1年目', detail: '専門領域のアウトプット月1回（登壇/記事）' },
      { label: '3年目', detail: `役割拡大（${rec.careers[0] || 'リーダー職'}に接続）` },
      { label: '5年目', detail: '報酬・裁量を引き上げ、安定基盤を確立' }
    ]
  };
  const b = {
    name: 'B: 自律/副業ルート',
    description: '小さく試し、複線化する',
    steps: [
      { label: '半年', detail: `副業開始（${rec.sideBusinesses[0] || 'オンライン事業'}）` },
      { label: '2年目', detail: '収益源を2本に増やす（小さく安定）' },
      { label: '4年目', detail: '必要に応じ本業の比率を70%→50%へ' }
    ]
  };
  const c = {
    name: 'C: 転職/起業ルート',
    description: '環境を変えて成長を加速',
    steps: [
      { label: '準備', detail: `半年で市場価値を可視化（ポートフォリオ/実績）` },
      { label: '実行', detail: '転職/起業。初年度は学習とプロセス整備に投資' },
      { label: '3年目', detail: '事業/職務の勝ち筋を固めて拡張' }
    ]
  };
  return [a, b, c];
}

// テーマ別スコア
function generateFortuneScores(data: FormData, big: BigFiveResult, anchor: CareerAnchorResult) {
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const love = 50 + (data.loveExp === '多い' ? 15 : data.marriage === '結婚願望あり' ? 10 : 0) + (big.agreeableness - 50) * 0.3;
  const work = 50 + (anchor.entrepreneurship - 50) * 0.3 + (big.conscientiousness - 50) * 0.4;
  const health = 50 + (data.exercise === '週3回以上' ? 20 : 0) - (data.smoke === '毎日' ? 20 : 0) - (data.stress === '高い' ? 10 : 0);
  const money = 50 + (data.savings === '500万以上' ? 15 : 0) + (data.investing?.includes('本格') ? 10 : 0) + (work - 50) * 0.2;
  const self = 50 + (big.openness - 50) * 0.3 + (big.extraversion - 50) * 0.2;
  const family = 50 + (data.family === '既婚（子あり）' ? 15 : 0) + (data.priority === '家族' ? 15 : 0);
  return { love: clamp(love), work: clamp(work), health: clamp(health), money: clamp(money), self: clamp(self), family: clamp(family) };
}

// ハイライトシーン
function generateHighlights(plan: { years: string; focus: string; goals: string[] }[]) {
  const picks = [30, 42, 50, 65, 75].map((age) => {
    const p = plan.find((x) => parseInt(x.years, 10) === age);
    const title = (
      age === 30 ? '大きな転職のチャンス' :
      age === 42 ? '大切な人との別れ' :
      age === 50 ? '責任と裁量の拡大' :
      age === 65 ? '夢だったプロジェクトの成功' :
      '静かな成熟'
    );
    return { age, title, description: p?.focus };
  });
  return picks;
}

// モットー
function generateMotto(data: FormData, big: BigFiveResult, anchor: CareerAnchorResult) {
  if (big.conscientiousness > 60 && anchor.management > 50) return '挑戦と再生の人生';
  if (big.agreeableness > 60 && data.priority === '家族') return '静かな幸福を積み重ねる人生';
  if (anchor.autonomy > 60 || data.priority === '自由') return '自分で選び続ける人生';
  return '学びと貢献の人生';
}
