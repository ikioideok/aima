import { RecruitPosition } from '../types';

export const recruitPositions: RecruitPosition[] = [
    {
        title: '営業（法人）',
        type: '正社員 / フルタイム',
        summary: '新規・既存の法人顧客に向けた提案営業。課題ヒアリングから提案まで担当。',
        tags: ['営業', '法人', '提案'],
        details: {
            overview: 'マーケティング支援の提案を通じて、お客様の課題解決と成果創出を担います。',
            responsibilities: [
                '既存顧客のフォローと追加提案',
                '新規顧客へのアプローチ・商談',
                '提案資料の作成とプレゼン',
                '社内チームとの連携・進行管理'
            ],
            requirements: [
                '法人営業の実務経験（目安2年以上）',
                '基本的なPCスキル（資料作成、メール）',
                '社内外との調整・折衝経験'
            ],
            niceToHave: [
                'Web/広告/制作業界での営業経験',
                'マーケティング領域の知識'
            ],
            stack: ['Notion', 'Google Workspace', 'Zoom'],
            location: '大阪（リモート相談可）',
            hours: '10:00-19:00（休憩1時間）',
            salary: '年収400万〜650万円（経験・能力による）',
            benefits: [
                '社会保険完備',
                '交通費支給',
                'PC貸与'
            ]
        }
    },
    {
        title: 'ディレクター',
        type: '正社員 / フルタイム',
        summary: '制作/マーケ案件の進行管理と品質管理。社内外の調整をリード。',
        tags: ['ディレクション', '制作', '進行'],
        details: {
            overview: '案件の企画から納品まで、スケジュールと品質を守りながら進行を管理します。',
            responsibilities: [
                '制作案件の進行管理とスケジュール調整',
                'クライアントとの窓口対応',
                '制作物の品質チェック',
                '社内外のメンバー連携'
            ],
            requirements: [
                'ディレクションまたは進行管理の経験',
                '基本的なビジネスマナーと報連相',
                'ドキュメント作成力'
            ],
            niceToHave: [
                'Web/広告/制作会社での実務経験',
                '編集・ライティング経験'
            ],
            stack: ['Notion', 'Google Workspace', 'Slack'],
            location: '大阪（リモート相談可）',
            hours: '10:00-19:00（休憩1時間）',
            salary: '年収380万〜600万円（経験・能力による）',
            benefits: [
                '社会保険完備',
                '交通費支給',
                'PC貸与'
            ]
        }
    }
];
