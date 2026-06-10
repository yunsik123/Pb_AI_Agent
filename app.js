/* ============================================================
   JB Financial Group · LifeLong WM PB AI Agent
   App Logic — All computation preserved, UI rendering updated
   ============================================================ */

const assessmentSteps = [
  {
    id: "life",
    label: "라이프케어 맥락",
    title: "기본 정보를 알려주세요",
    description: "고객님의 생활 상황, 재무 목적, 자산 규모, 비상자금을 먼저 파악합니다.",
    questions: [
      {
        id: "lifeStage",
        title: "현재 생애주기에 가장 가까운 것은?",
        options: [
          ["starter", "사회초년생", "현금흐름과 목표 저축이 중요", { futureOrientation: 6, riskTolerance: 3, liquidityNeed: 8, financialLiteracy: -4 }],
          ["family", "가족 부양기", "교육비, 보험, 부채를 함께 봐야 함", { socialPreference: 10, liquidityNeed: 6, lossSensitivity: 4 }],
          ["retiree", "은퇴 준비기", "현금흐름과 손실 방어가 중요", { futureOrientation: 8, lossSensitivity: 8, riskTolerance: -8 }],
          ["senior", "시니어", "Slow Banking과 보호 장치가 필요", { lossSensitivity: 12, riskTolerance: -12, financialLiteracy: -8, anchoringSusceptibility: 6 }],
          ["hnw", "고액자산/승계 관심", "절세, 상속, 집중위험 관리가 중요", { financialLiteracy: 10, futureOrientation: 8, anchoringSusceptibility: -4 }],
        ],
      },
      {
        id: "objective",
        title: "가장 중요한 재무 목적은?",
        options: [
          ["home", "주거/목돈 마련", "목표 시점과 원금 방어가 중요", { futureOrientation: 6, liquidityNeed: 5, lossSensitivity: 4 }],
          ["retirement", "은퇴 현금흐름", "인출 순서와 장기 지속성이 중요", { futureOrientation: 11, lossSensitivity: 6 }],
          ["growth", "장기 자산 성장", "분산된 성장 자산을 활용", { riskTolerance: 12, futureOrientation: 7, lossSensitivity: -4 }],
          ["medical", "의료/건강 대비", "보험과 현금성 버퍼가 중요", { healthConcern: 14, liquidityNeed: 8, lossSensitivity: 5 }],
          ["protection", "사기/실수 방지", "확인 절차와 보호자 흐름이 중요", { lossSensitivity: 8, anchoringSusceptibility: 6, framingSusceptibility: 5 }],
        ],
      },
      {
        id: "assetBand",
        title: "운용 가능한 금융자산 규모는?",
        options: [
          ["mass", "3천만 원 미만", "생활비와 비상금이 우선", { liquidityNeed: 10, financialLiteracy: -2 }],
          ["core", "3천만-1억 원", "목표별 계좌 분리가 필요", { futureOrientation: 3 }],
          ["affluent", "1억-5억 원", "분산과 세후 수익률을 함께 고려", { financialLiteracy: 4, futureOrientation: 4 }],
          ["hnw", "5억-20억 원", "절세와 집중위험 관리가 중요", { financialLiteracy: 8, futureOrientation: 5, riskTolerance: 2 }],
          ["uhnw", "20억 원 이상", "승계, 대체자산, 자문 체계가 중요", { financialLiteracy: 11, futureOrientation: 8, socialPreference: 4 }],
        ],
      },
      {
        id: "emergency",
        title: "소득이 끊겨도 버틸 수 있는 비상자금은?",
        options: [
          ["low", "1개월 미만", "투자보다 유동성 확보가 먼저", { liquidityNeed: 15, riskTolerance: -8, lossSensitivity: 5, futureOrientation: -5 }],
          ["mid", "1-3개월", "현금성 자산을 더 확보해야 함", { liquidityNeed: 8, lossSensitivity: 3 }],
          ["stable", "3-6개월", "기본 방어력은 있음", { futureOrientation: 4 }],
          ["high", "6개월 이상", "투자 여력이 상대적으로 높음", { riskTolerance: 5, futureOrientation: 5, liquidityNeed: -5 }],
        ],
      },
    ],
  },
  {
    id: "risk",
    label: "위험/확률 선호",
    title: "투자 선택지를 골라 보세요",
    description: "여러 투자 상황에서 어떤 선택을 하시는지 확인합니다.",
    questions: [
      {
        id: "lotteryChoice",
        title: "둘 중 하나만 고른다면?",
        options: [
          ["safe", "확정 4% 수익", "예측 가능한 결과가 편하다", { riskTolerance: -12, lossSensitivity: 4 }],
          ["balanced", "70% 확률 7%, 30% 확률 0%", "제한된 변동성은 받아들인다", { riskTolerance: 2 }],
          ["risky", "50% 확률 15%, 50% 확률 -5%", "손실 가능성이 있어도 기대수익이 중요", { riskTolerance: 13, lossSensitivity: -4 }],
          ["venture", "20% 확률 40%, 80% 확률 -8%", "작은 확률의 큰 보상도 검토", { riskTolerance: 18, probabilityDistortion: 9, lossSensitivity: -6 }],
        ],
      },
      {
        id: "drawdown",
        title: "내 포트폴리오가 한 달에 -12%라면?",
        options: [
          ["exit", "대부분 정리한다", "손실 확대를 막는 것이 우선", { lossSensitivity: 16, riskTolerance: -12, framingSusceptibility: 4 }],
          ["reduce", "일부 줄인다", "위험 노출을 낮춘다", { lossSensitivity: 8, riskTolerance: -5 }],
          ["hold", "계획을 보고 유지한다", "사전에 정한 기준을 따른다", { lossSensitivity: -2, anchoringSusceptibility: -4 }],
          ["buy", "분할 매수한다", "하락을 기회로 본다", { riskTolerance: 12, lossSensitivity: -8, probabilityDistortion: 3 }],
        ],
      },
      {
        id: "rareEvent",
        title: "성공 확률 5%, 성공 시 20배 수익인 상품을 보면?",
        options: [
          ["avoid", "거의 보지 않는다", "낮은 확률은 낮은 확률일 뿐", { riskTolerance: -8, probabilityDistortion: -8 }],
          ["small", "소액만 검토한다", "잃어도 되는 범위로 제한", { riskTolerance: 3, probabilityDistortion: 1 }],
          ["interested", "상당히 끌린다", "큰 성공 가능성이 매력적", { riskTolerance: 9, probabilityDistortion: 10 }],
          ["large", "비중을 크게 둘 수 있다", "희귀 보상에 강하게 반응", { riskTolerance: 14, probabilityDistortion: 16, lossSensitivity: -4 }],
        ],
      },
      {
        id: "complexProduct",
        title: "구조가 복잡하지만 기대수익이 높은 상품은?",
        options: [
          ["reject", "구조가 이해되지 않으면 제외", "투명성이 가장 중요", { financialLiteracy: -2, lossSensitivity: 8, riskTolerance: -6 }],
          ["explain", "설명을 듣고 소액만", "이해 후 제한적으로 접근", { financialLiteracy: 2, riskTolerance: 1 }],
          ["compare", "수수료와 손실구간을 비교", "조건을 뜯어본 뒤 판단", { financialLiteracy: 10, anchoringSusceptibility: -5 }],
          ["accept", "수익률이 좋으면 적극 검토", "복잡성보다 보상이 중요", { riskTolerance: 10, framingSusceptibility: 6, probabilityDistortion: 5 }],
        ],
      },
    ],
  },
  {
    id: "bias",
    label: "손실/프레이밍/앵커",
    title: "같은 상황, 다른 표현이면?",
    description: "같은 내용이라도 표현이나 숫자에 따라 판단이 달라지는지 확인합니다.",
    questions: [
      {
        id: "mixedGamble",
        title: "50% 확률로 +150만 원, 50% 확률로 -100만 원이면?",
        options: [
          ["reject", "거절한다", "손실 가능성이 더 크게 느껴진다", { lossSensitivity: 15, riskTolerance: -8 }],
          ["maybe", "목적자금이 아니면 검토", "자금 성격에 따라 다르다", { lossSensitivity: 6, riskTolerance: 1 }],
          ["accept", "받아들인다", "기대값이 양수면 가능", { riskTolerance: 8, lossSensitivity: -8, financialLiteracy: 4 }],
          ["repeat", "반복 기회면 적극 수용", "장기 확률을 더 중시", { riskTolerance: 12, lossSensitivity: -12, futureOrientation: 5 }],
        ],
      },
      {
        id: "framePair",
        title: "둘 중 더 설득력 있게 들리는 설명은?",
        options: [
          ["gain", "10년 중 7년은 수익", "수익 프레임이 더 와닿음", { framingSusceptibility: 7, riskTolerance: 3 }],
          ["loss", "10년 중 3년은 손실", "손실 프레임이 더 중요", { framingSusceptibility: 9, lossSensitivity: 8 }],
          ["same", "둘은 같은 말", "표현보다 수치를 본다", { framingSusceptibility: -12, financialLiteracy: 6 }],
          ["needData", "변동폭까지 봐야 판단", "프레임보다 분포가 중요", { framingSusceptibility: -8, financialLiteracy: 10 }],
        ],
      },
      {
        id: "anchorReturn",
        title: "처음 본 기대수익률 12%가 머리에 남았다면?",
        options: [
          ["believe", "그 숫자를 기준으로 판단한다", "처음 제시값 영향이 큼", { anchoringSusceptibility: 15, framingSusceptibility: 4 }],
          ["adjust", "낮춰 잡지만 기준은 된다", "일부 보정한다", { anchoringSusceptibility: 7 }],
          ["benchmark", "동종 상품 평균과 비교한다", "외부 기준으로 재평가", { anchoringSusceptibility: -6, financialLiteracy: 6 }],
          ["scenario", "최악/보통/최선 시나리오로 본다", "단일 숫자를 믿지 않음", { anchoringSusceptibility: -12, financialLiteracy: 9 }],
        ],
      },
      {
        id: "newsReaction",
        title: "뉴스가 '역대급 위기'라고 말할 때 나는?",
        options: [
          ["panic", "즉시 대응해야 할 것 같다", "강한 문구에 행동이 빨라짐", { framingSusceptibility: 12, lossSensitivity: 8, riskTolerance: -5 }],
          ["check", "내 보유자산 영향부터 본다", "상황을 확인하고 대응", { framingSusceptibility: -3 }],
          ["rules", "사전에 정한 규칙만 따른다", "뉴스보다 원칙이 우선", { framingSusceptibility: -10, anchoringSusceptibility: -6 }],
          ["opportunity", "오히려 가격 기회를 찾는다", "위기를 기회 프레임으로 봄", { riskTolerance: 8, lossSensitivity: -5, framingSusceptibility: 2 }],
        ],
      },
    ],
  },
  {
    id: "timeSocial",
    label: "시간/사회 선호",
    title: "돈과 시간, 가족에 대한 생각",
    description: "현재와 미래의 균형, 가족과의 의사결정 방식을 확인합니다.",
    questions: [
      {
        id: "nowFuture",
        title: "오늘 100만 원과 1년 뒤 115만 원 중?",
        options: [
          ["today", "오늘 100만 원", "현재 유동성이 더 중요", { futureOrientation: -14, liquidityNeed: 8 }],
          ["maybeLater", "상황에 따라 1년 뒤", "현금 여력에 따라 달라짐", { futureOrientation: 1, liquidityNeed: 3 }],
          ["later", "1년 뒤 115만 원", "기다릴 수 있다", { futureOrientation: 10, liquidityNeed: -4 }],
          ["invest", "더 장기라면 더 기다린다", "복리와 장기 목표를 중시", { futureOrientation: 16, riskTolerance: 3 }],
        ],
      },
      {
        id: "monthlySurplus",
        title: "매월 남는 돈이 생기면?",
        options: [
          ["spend", "생활 만족에 일부 사용", "현재 효용도 중요", { futureOrientation: -8, liquidityNeed: 4 }],
          ["save", "비상금부터 채운다", "안전판을 먼저 만든다", { liquidityNeed: 8, lossSensitivity: 4 }],
          ["split", "저축과 투자를 나눈다", "균형 배분을 선호", { futureOrientation: 5 }],
          ["invest", "대부분 장기 투자", "미래 목표를 우선", { futureOrientation: 12, riskTolerance: 6 }],
        ],
      },
      {
        id: "familyDuty",
        title: "투자 판단에서 가족/보호자 영향은?",
        options: [
          ["solo", "내 판단이 우선", "독립적인 의사결정", { socialPreference: -8, financialLiteracy: 5 }],
          ["share", "큰 결정은 공유", "가족과 리스크를 같이 봄", { socialPreference: 6 }],
          ["protect", "부양가족 안정이 우선", "수익보다 지속가능성", { socialPreference: 12, lossSensitivity: 6 }],
          ["guardian", "보호자 확인이 있으면 좋음", "오류와 사기 방지가 중요", { socialPreference: 10, anchoringSusceptibility: 8, framingSusceptibility: 5 }],
        ],
      },
      {
        id: "agentStyle",
        title: "AI PB가 어떤 방식이면 좋은가요?",
        options: [
          ["simple", "짧고 쉬운 말로 단계 안내", "설명 밀도는 낮게", { financialLiteracy: -8, framingSusceptibility: 6 }],
          ["coach", "질문하며 함께 결정", "상담형 흐름 선호", { socialPreference: 5, anchoringSusceptibility: 4 }],
          ["balanced", "핵심 지표와 이유를 함께", "균형 잡힌 설명 선호", { financialLiteracy: 3 }],
          ["expert", "수치, 지표, 시나리오 상세", "전문가형 화면 선호", { financialLiteracy: 13, anchoringSusceptibility: -6, framingSusceptibility: -5 }],
        ],
      },
    ],
  },
];

const factorLabels = {
  riskTolerance: "위험감수",
  lossSensitivity: "손실회피",
  futureOrientation: "미래지향",
  socialPreference: "사회/가족",
  framingSusceptibility: "프레이밍",
  anchoringSusceptibility: "앵커링",
  probabilityDistortion: "확률가중",
  financialLiteracy: "금융이해도",
  liquidityNeed: "유동성필요",
  healthConcern: "건강/보험",
};

const factorColors = {
  riskTolerance: "#4AE3C0",
  lossSensitivity: "#E35B8F",
  futureOrientation: "#5B8FE3",
  socialPreference: "#4DB882",
  framingSusceptibility: "#E3A84A",
  anchoringSusceptibility: "#A36BE3",
  probabilityDistortion: "#E36B5B",
  financialLiteracy: "#5BB8E3",
  liquidityNeed: "#D4A84A",
  healthConcern: "#4DB882",
};

const investorClasses = [
  { id: "stable", label: "안정형", maxRisk: 1, description: "원금 보전과 유동성이 최우선입니다." },
  { id: "stablePlus", label: "안정추구형", maxRisk: 2, description: "제한적 변동성만 수용합니다." },
  { id: "neutral", label: "위험중립형", maxRisk: 3, description: "수익과 위험의 균형을 봅니다." },
  { id: "active", label: "적극투자형", maxRisk: 4, description: "상당한 변동성을 감수할 수 있습니다." },
  { id: "aggressive", label: "공격투자형", maxRisk: 5, description: "고위험 자산도 검토할 수 있습니다." },
];

const jbSources = [
  {
    label: "JB금융그룹 계열사",
    url: "https://www.jbfg.com/ko/about/network.do",
  },
  {
    label: "전북은행 펀드/연금저축 메뉴",
    url: "https://www.jbbank.co.kr/CUSTOMER_MAIN.act",
  },
  {
    label: "전북은행 연금펀드 상품안내",
    url: "https://www.jbbank.co.kr/pnsn_fund_gds_gdnc_01.act",
  },
  {
    label: "광주은행 예금/신탁 상품몰",
    url: "https://www.kjbank.com/ib20/mnu/FPMDPTR020000",
  },
  {
    label: "JB자산운용 상품소개",
    url: "https://www.jbam.co.kr/",
  },
  {
    label: "금융투자협회 표준투자권유준칙",
    url: "https://law.kofia.or.kr/service/law/lawFullScreenContent.do?historySeq=1556&seq=149",
  },
  {
    label: "금융위원회 고령투자자 녹취/숙려",
    url: "https://www.fsc.go.kr/no010101/75872?curPage=255&srchBeginDt=2022-12-&srchCtgry=&srchEndDt=&srchKey=sj&srchText=",
  },
];

const jbProductShelf = [
  {
    id: "kjb-deposit",
    group: "광주은행",
    name: "KJB주거래우대예금 / 매월이자Wa예금",
    category: "예금",
    risk: 1,
    fit: ["stable", "stablePlus", "neutral", "active", "aggressive"],
    use: "비상금, 대기성 자금, 은퇴 현금흐름",
    caution: "금리와 우대조건은 가입 시점 공식 상품설명서로 확인",
    source: "광주은행 예금/신탁 상품몰",
  },
  {
    id: "kjb-parking",
    group: "광주은행",
    name: "매일이자Wa파킹통장",
    category: "입출금/파킹",
    risk: 1,
    fit: ["stable", "stablePlus", "neutral", "active", "aggressive"],
    use: "생활비, 의료비 버퍼, 시장 급락 대기자금",
    caution: "예금자보호와 한도, 적용금리 조건 확인",
    source: "광주은행 예금/신탁 상품몰",
  },
  {
    id: "jbb-fund-mall",
    group: "전북은행",
    name: "펀드 Mall / 펀드검색 / 펀드신규",
    category: "펀드",
    risk: 3,
    fit: ["neutral", "active", "aggressive"],
    use: "중장기 분산투자 후보 탐색",
    caution: "투자설명서, 위험등급, 보수, 환매조건 확인 후 권유 가능",
    source: "전북은행 펀드/연금저축 메뉴",
  },
  {
    id: "jbb-elf",
    group: "전북은행",
    name: "ELF 신규",
    category: "파생결합펀드",
    risk: 4,
    fit: ["active", "aggressive"],
    use: "조건부 수익구조 이해도가 높은 고객에 한정 검토",
    caution: "고령자 또는 부적합투자자는 녹취/숙려 및 부적합 차단 필요",
    source: "전북은행 펀드/연금저축 메뉴",
  },
  {
    id: "jbb-pension-fund",
    group: "전북은행",
    name: "연금저축계좌 / 연금펀드",
    category: "연금",
    risk: 2,
    fit: ["stablePlus", "neutral", "active", "aggressive"],
    use: "은퇴 준비, 세액공제, 장기 목적자금",
    caution: "중도해지와 연금외수령 세제 불이익 설명 필수",
    source: "전북은행 연금펀드 상품안내",
  },
  {
    id: "kjb-trust",
    group: "광주은행",
    name: "신탁상품",
    category: "신탁",
    risk: 3,
    fit: ["neutral", "active", "aggressive"],
    use: "자금 목적과 운용방식이 명확한 고객의 신탁 검토",
    caution: "투자일임/금전신탁은 별도 투자자정보 확인과 자산배분 적합성 필요",
    source: "광주은행 예금/신탁 상품몰",
  },
  {
    id: "jbam-funds",
    group: "JB자산운용",
    name: "증권펀드 / 부동산펀드 / 에너지자원펀드",
    category: "자산운용",
    risk: 4,
    fit: ["active", "aggressive"],
    use: "대체투자와 펀드 운용역량 검토",
    caution: "개별 펀드의 공모/사모 여부, 환매제한, 기초자산, 손실위험 확인",
    source: "JB자산운용 상품소개",
  },
  {
    id: "jb-capital",
    group: "JB우리캐피탈",
    name: "할부/리스/대출성 상품",
    category: "부채관리",
    risk: 2,
    fit: ["stable", "stablePlus", "neutral", "active", "aggressive"],
    use: "투자 권유가 아니라 부채상환, 현금흐름 관리 관점에서 검토",
    caution: "금리, 중도상환수수료, 총부채원리금상환비율 확인",
    source: "JB금융그룹 계열사",
  },
];

const state = {
  step: 0,
  answers: {},
  completed: false,
  signals: {
    marketStress: false,
    healthRisk: false,
    fraudSignal: false,
    lifeEvent: false,
  },
  messages: [],
};

/* ============================================================
   DOM References
   ============================================================ */
const els = {
  assessmentView: document.querySelector("#assessmentView"),
  dashboardView: document.querySelector("#dashboardView"),
  progressText: document.querySelector("#progressText"),
  progressBar: document.querySelector("#progressBar"),
  stepKicker: document.querySelector("#stepKicker"),
  stepTitle: document.querySelector("#stepTitle"),
  stepDescription: document.querySelector("#stepDescription"),
  questions: document.querySelector("#questions"),
  prevStep: document.querySelector("#prevStep"),
  nextStep: document.querySelector("#nextStep"),
  stepNav: document.querySelector("#stepNav"),
  typeTitle: document.querySelector("#typeTitle"),
  typeSummary: document.querySelector("#typeSummary"),
  typeBadges: document.querySelector("#typeBadges"),
  scoreBars: document.querySelector("#scoreBars"),
  signalButtons: document.querySelector("#signalButtons"),
  widgetZone: document.querySelector("#widgetZone"),
  schemaCode: document.querySelector("#schemaCode"),
  chatLog: document.querySelector("#chatLog"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  generateBrief: document.querySelector("#generateBrief"),
  agentMode: document.querySelector("#agentMode"),
  policyStatus: document.querySelector("#policyStatus"),
  policyList: document.querySelector("#policyList"),
  investorClass: document.querySelector("#investorClass"),
  jbProductList: document.querySelector("#jbProductList"),
  jbSourceList: document.querySelector("#jbSourceList"),
  assessBody: document.querySelector("#assessBody"),
  assessHero: document.querySelector(".assess-hero"),
  schemaCode: document.querySelector("#schemaCode"),
  restartAssessment: document.querySelector("#restartAssessment"),
  goDashboard: document.querySelector("#goDashboard"),
  goAgent: document.querySelector("#goAgent"),
};

/* ============================================================
   Utility Functions (unchanged)
   ============================================================ */
function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function findQuestion(questionId) {
  for (const step of assessmentSteps) {
    const found = step.questions.find((question) => question.id === questionId);
    if (found) return found;
  }
  return null;
}

function findSelectedOption(questionId) {
  const question = findQuestion(questionId);
  const value = state.answers[questionId];
  return question?.options.find((option) => option[0] === value) || null;
}

function isStepComplete(stepIndex = state.step) {
  return assessmentSteps[stepIndex].questions.every((question) => Boolean(state.answers[question.id]));
}

/* ============================================================
   Step Nav Rendering (new)
   ============================================================ */
function renderStepNav() {
  els.stepNav.innerHTML = assessmentSteps
    .map((step, index) => {
      const active = index === state.step ? "active" : "";
      const completed = index < state.step || (index <= state.step && isStepComplete(index)) ? "completed" : "";
      const cls = `step-nav-item ${active} ${completed}`.trim();
      return `
        <button class="${cls}" data-step-index="${index}" type="button">
          <span class="step-num">${completed && !active ? "✓" : String(index + 1).padStart(2, "0")}</span>
          <span class="step-label">${step.label}</span>
        </button>
      `;
    })
    .join("");
}

/* ============================================================
   Assessment Rendering
   ============================================================ */
function renderStep() {
  const step = assessmentSteps[state.step];
  const progress = ((state.step + 1) / assessmentSteps.length) * 100;

  els.progressText.textContent = `${state.step + 1} / ${assessmentSteps.length}`;
  els.progressBar.style.width = `${progress}%`;
  els.stepKicker.textContent = `Step ${String(state.step + 1).padStart(2, "0")}`;
  els.stepTitle.textContent = step.title;
  els.stepDescription.textContent = step.description;

  renderStepNav();

  els.questions.innerHTML = step.questions
    .map((question, index) => {
      const selectedValue = state.answers[question.id];
      const options = question.options
        .map(([value, label, description]) => {
          const selected = selectedValue === value ? "selected" : "";
          return `
            <button class="option-card ${selected}" data-question="${question.id}" data-value="${value}" type="button">
              <strong>${label}</strong>
              <span>${description}</span>
            </button>
          `;
        })
        .join("");

      return `
        <article class="question-card">
          <p class="question-index">Q${state.step * 4 + index + 1}</p>
          <h3>${question.title}</h3>
          <div class="option-grid">${options}</div>
        </article>
      `;
    })
    .join("");

  els.prevStep.disabled = state.step === 0;
  els.nextStep.disabled = !isStepComplete();
  els.nextStep.innerHTML = state.step === assessmentSteps.length - 1
    ? '결과 보기 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>'
    : '다음 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>';
}

/* ============================================================
   Score / Profile Computation (unchanged)
   ============================================================ */
function getScores() {
  const scores = Object.keys(factorLabels).reduce((acc, key) => {
    acc[key] = 50;
    return acc;
  }, {});

  Object.entries(state.answers).forEach(([questionId, value]) => {
    const question = findQuestion(questionId);
    const option = question?.options.find((item) => item[0] === value);
    const delta = option?.[3] || {};
    Object.entries(delta).forEach(([key, amount]) => {
      scores[key] = clamp((scores[key] || 50) + amount);
    });
  });

  if (state.signals.marketStress) {
    scores.lossSensitivity = clamp(scores.lossSensitivity + 8);
    scores.framingSusceptibility = clamp(scores.framingSusceptibility + 5);
  }
  if (state.signals.healthRisk) {
    scores.healthConcern = clamp(scores.healthConcern + 15);
    scores.liquidityNeed = clamp(scores.liquidityNeed + 6);
  }
  if (state.signals.fraudSignal) {
    scores.lossSensitivity = clamp(scores.lossSensitivity + 10);
    scores.anchoringSusceptibility = clamp(scores.anchoringSusceptibility + 8);
  }
  if (state.signals.lifeEvent) {
    scores.futureOrientation = clamp(scores.futureOrientation + 7);
    scores.liquidityNeed = clamp(scores.liquidityNeed + 5);
  }

  return scores;
}

function getProfile() {
  const scores = getScores();
  const selected = {
    lifeStage: findSelectedOption("lifeStage"),
    objective: findSelectedOption("objective"),
    assetBand: findSelectedOption("assetBand"),
    emergency: findSelectedOption("emergency"),
    agentStyle: findSelectedOption("agentStyle"),
  };

  const guidanceNeed = clamp(
    Math.round((scores.framingSusceptibility + scores.anchoringSusceptibility + (100 - scores.financialLiteracy)) / 3),
  );

  const axes = {
    risk: scores.riskTolerance >= 55 ? ["O", "Opportunity", "기회추구"] : ["D", "Defense", "방어중심"],
    loss: scores.lossSensitivity >= 56 ? ["S", "Shield", "손실민감"] : ["C", "Calm", "손실침착"],
    time: scores.futureOrientation >= 56 ? ["F", "Future", "장기지향"] : ["N", "Now", "현재유동성"],
    guidance: guidanceNeed >= 52 ? ["G", "Guided", "상담가이드"] : ["I", "Independent", "자기주도"],
  };

  const code = `${axes.risk[0]}${axes.loss[0]}${axes.time[0]}${axes.guidance[0]}`;
  const name = `${axes.risk[2]} ${axes.loss[2]} ${axes.time[2]} ${axes.guidance[2]}형`;
  const summary = [
    `${selected.objective?.[1] || "재무 목표"}를 중심으로`,
    axes.risk[0] === "D" ? "원금 훼손과 변동성 설명을 앞에 두고" : "성장 기회와 리밸런싱 선택지를 앞에 두고",
    axes.guidance[0] === "G" ? "단계형 상담 UI를 제공합니다." : "고밀도 분석 UI를 제공합니다.",
  ].join(" ");

  return {
    scores,
    selected,
    axes,
    code,
    name,
    summary,
    guidanceNeed,
  };
}

function getInvestorClass(profile) {
  const s = profile.scores;
  const raw = Math.round(s.riskTolerance * 0.45 + s.futureOrientation * 0.18 + s.financialLiteracy * 0.16 - s.lossSensitivity * 0.18 - s.liquidityNeed * 0.08);
  const adjusted = raw + 35;

  let index = 0;
  if (adjusted >= 72) index = 4;
  else if (adjusted >= 61) index = 3;
  else if (adjusted >= 50) index = 2;
  else if (adjusted >= 39) index = 1;

  if (profile.selected.lifeStage?.[0] === "senior") index = Math.min(index, 2);
  if (profile.scores.lossSensitivity >= 72) index = Math.min(index, 2);
  if (profile.scores.liquidityNeed >= 72) index = Math.min(index, 1);
  if (profile.selected.emergency?.[0] === "low") index = Math.min(index, 1);

  return {
    ...investorClasses[index],
    score: clamp(adjusted),
  };
}

function getJbSuitability(profile, investorClass) {
  const senior = profile.selected.lifeStage?.[0] === "senior";
  const wantsPension = profile.selected.objective?.[0] === "retirement";
  const wantsMedical = profile.selected.objective?.[0] === "medical";
  const needsLiquidity = profile.scores.liquidityNeed > 62 || wantsMedical;

  return jbProductShelf
    .map((item) => {
      const allowed = item.risk <= investorClass.maxRisk && item.fit.includes(investorClass.id);
      const highRiskSenior = senior && item.risk >= 4;
      const priority =
        (allowed ? 50 : 10) +
        (item.category === "입출금/파킹" && needsLiquidity ? 25 : 0) +
        (item.category === "연금" && wantsPension ? 28 : 0) +
        (item.category === "예금" && investorClass.maxRisk <= 2 ? 20 : 0) +
        (item.category === "펀드" && profile.scores.futureOrientation > 60 ? 12 : 0) +
        (item.category === "자산운용" && ["hnw", "uhnw"].includes(profile.selected.assetBand?.[0]) ? 18 : 0) -
        (highRiskSenior ? 35 : 0);

      return {
        ...item,
        allowed: allowed && !highRiskSenior,
        status: allowed && !highRiskSenior ? "검토 가능" : highRiskSenior ? "고령자 보호상 차단" : "성향 초과",
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority);
}

function getAllocation(profile) {
  const s = profile.scores;
  let stock = 20 + s.riskTolerance * 0.38 + s.futureOrientation * 0.12 - s.lossSensitivity * 0.16;
  let bond = 24 + s.lossSensitivity * 0.22 + (100 - s.riskTolerance) * 0.1;
  let cash = 14 + s.liquidityNeed * 0.2 + (100 - s.futureOrientation) * 0.08;
  let alternatives = ["hnw", "uhnw"].includes(profile.selected.assetBand?.[0]) ? 8 + s.riskTolerance * 0.05 : 0;
  let insurance = profile.selected.objective?.[0] === "medical" || state.signals.healthRisk ? 10 + s.healthConcern * 0.08 : 4;

  if (state.signals.marketStress) {
    stock -= 8;
    bond += 5;
    cash += 4;
  }
  if (profile.selected.lifeStage?.[0] === "senior") {
    stock = Math.min(stock, 28);
    cash += 6;
    bond += 5;
  }

  stock = Math.max(8, stock);
  bond = Math.max(8, bond);
  cash = Math.max(6, cash);
  alternatives = Math.max(0, alternatives);
  insurance = Math.max(0, insurance);

  const total = stock + bond + cash + alternatives + insurance;
  return {
    stock: Math.round((stock / total) * 100),
    bond: Math.round((bond / total) * 100),
    cash: Math.round((cash / total) * 100),
    alternatives: Math.round((alternatives / total) * 100),
    insurance: Math.round((insurance / total) * 100),
  };
}

function getPolicy(profile, allocation, investorClass, jbProducts) {
  const rules = [];
  const senior = profile.selected.lifeStage?.[0] === "senior";
  const lowLiteracy = profile.scores.financialLiteracy < 44;
  const blockedProducts = jbProducts.filter((item) => !item.allowed && item.priority >= 40);
  const highRiskProducts = jbProducts.filter((item) => item.risk >= 4 && item.priority >= 40);

  rules.push("투자 목적, 위험감수, 손실회피 점수를 추천 전 검증합니다.");
  rules.push(`${investorClass.label} 고객에게는 상품위험도 ${investorClass.maxRisk}단계 이하 상품군만 권유 후보로 표시합니다.`);
  if (senior) rules.push("시니어 프로파일이므로 Slow Banking, 큰 버튼, 2단계 확인을 적용합니다.");
  if (lowLiteracy) rules.push("금융 이해도 점수가 낮아 복잡 상품 설명과 쉬운 용어 전환을 강제합니다.");
  if (profile.scores.lossSensitivity > 64) rules.push("손실회피가 높아 최악 시나리오와 손실 한도를 먼저 보여줍니다.");
  if (state.signals.fraudSignal) rules.push("이상거래 신호가 있어 실행형 CTA를 숨기고 상담 연결을 우선합니다.");
  if (profile.selected.objective?.[0] === "medical" || state.signals.healthRisk) {
    rules.push("건강/보험 신호가 있어 의료비 버퍼와 보장 점검 위젯을 상단으로 올립니다.");
  }
  if (allocation.stock > 55 && profile.scores.lossSensitivity > 62) {
    rules.push("주식 비중과 손실회피 점수 간 충돌이 있어 사람 상담 검토가 필요합니다.");
  }
  if (blockedProducts.length > 0) {
    rules.push(`성향 초과 또는 고령자 보호 사유로 ${blockedProducts.slice(0, 2).map((item) => item.name).join(", ")} 상품군은 권유 후보에서 제외합니다.`);
  }
  if (senior && highRiskProducts.length > 0) {
    rules.push("65세 이상 고령 투자자의 고난도/파생결합/신탁성 상품 검토에는 녹취와 2영업일 이상 숙려 절차가 필요합니다.");
  }

  const blocked = state.signals.fraudSignal || (allocation.stock > 55 && profile.scores.lossSensitivity > 62) || blockedProducts.some((item) => item.priority >= 60);
  return {
    status: blocked ? "보류" : "통과",
    rules,
    blocked,
  };
}

function buildWidgets(profile, allocation, policy, investorClass, jbProducts) {
  const s = profile.scores;
  const objective = profile.selected.objective?.[1] || "목표";
  const suitableJb = jbProducts.filter((item) => item.allowed).slice(0, 3);
  const blockedJb = jbProducts.filter((item) => !item.allowed && item.priority >= 40).slice(0, 2);
  const widgets = [
    {
      id: "fraud",
      title: "이상거래 보호 모드",
      body: "실행 버튼을 숨기고 본인 확인, 보호자 알림, 상담 연결을 먼저 제공합니다.",
      size: "full",
      accent: "accent-berry",
      priority: state.signals.fraudSignal ? 130 : -1,
      metrics: [
        ["실행", "차단"],
        ["확인", "2단계"],
        ["알림", "보호자"],
      ],
      tags: ["VeriSafeAgent식 행동 검증", "고령자 보호", "권유 보류"],
    },
    {
      id: "market",
      title: "시장 급락 대응",
      body: "급락일에는 수익률보다 방어 상태, 리밸런싱 간격, 손실 한도를 먼저 표시합니다.",
      size: "full",
      accent: "accent-amber",
      priority: state.signals.marketStress ? 122 : -1,
      metrics: [
        ["현금성", `${allocation.cash}%`],
        ["채권", `${allocation.bond}%`],
        ["실행", "분할"],
      ],
      tags: ["손실 한도", "분할 매수", "공포 프레임 완화"],
    },
    {
      id: "portfolio",
      title: `${objective} 맞춤 포트폴리오`,
      body: `${profile.code} 타입 기준으로 자산배분 초안을 만들고, 규제 룰을 통과한 설명만 보여줍니다.`,
      size: "wide",
      accent: "accent-teal",
      priority: 90,
      metrics: [
        ["주식/ETF", `${allocation.stock}%`],
        ["채권", `${allocation.bond}%`],
        ["현금성", `${allocation.cash}%`],
      ],
      tags: [profile.name, policy.status === "통과" ? "설명 가능" : "상담 검토"],
    },
    {
      id: "jb",
      title: "JB금융그룹 상품 적합성 렌즈",
      body: `${investorClass.label} 기준으로 JB 계열 상품군을 검토 가능 후보와 차단 후보로 나눕니다. 실제 권유 전에는 공식 상품설명서와 위험등급을 다시 확인합니다.`,
      size: "wide",
      accent: "accent-teal",
      priority: 92,
      metrics: [
        ["성향단계", investorClass.label],
        ["검토가능", `${suitableJb.length}개군`],
        ["차단/주의", `${blockedJb.length}개군`],
      ],
      tags: [
        ...suitableJb.map((item) => item.name),
        ...blockedJb.map((item) => `${item.name} ${item.status}`),
      ].slice(0, 5),
    },
    {
      id: "capital",
      title: "손실 방어 레이어",
      body: "손실회피와 유동성 필요가 높을수록 원금 훼손 가능성과 최악 시나리오를 상단에 배치합니다.",
      size: "medium",
      accent: "accent-blue",
      priority: 55 + s.lossSensitivity * 0.45 + s.liquidityNeed * 0.2,
      metrics: [
        ["손실회피", `${s.lossSensitivity}`],
        ["유동성", `${s.liquidityNeed}`],
        ["방어자산", `${allocation.bond + allocation.cash}%`],
      ],
      tags: ["MDD 설명", "현금 버퍼", "목표자금 보호"],
    },
    {
      id: "goal",
      title: "목적 기반 계좌",
      body: "하나의 총자산이 아니라 주거, 은퇴, 의료, 여유자금 바구니를 분리해 위험을 다르게 적용합니다.",
      size: "medium",
      accent: "accent-green",
      priority: 62 + s.futureOrientation * 0.22 + (state.signals.lifeEvent ? 24 : 0),
      metrics: [
        ["목표", objective],
        ["미래지향", `${s.futureOrientation}`],
        ["생애신호", state.signals.lifeEvent ? "활성" : "대기"],
      ],
      tags: ["Mental Accounting", "만기 매칭", "현금흐름"],
    },
    {
      id: "slow",
      title: "Slow Banking UI",
      body: "복잡한 표를 줄이고 큰 버튼, 쉬운 설명, 읽기 순서, 확인 단계를 강화합니다.",
      size: "small",
      accent: "accent-amber",
      priority:
        profile.selected.lifeStage?.[0] === "senior" || s.financialLiteracy < 44 || profile.guidanceNeed > 60
          ? 86
          : 36,
      metrics: [
        ["이해도", `${s.financialLiteracy}`],
        ["가이드", `${profile.guidanceNeed}`],
        ["확인", "단계형"],
      ],
      tags: ["큰 버튼", "쉬운 용어", "2단계 확인"],
    },
    {
      id: "health",
      title: "건강/보험 리스크",
      body: "건강 신호와 보험 데이터를 재무 목표와 함께 분석해 의료비 버퍼와 보장 공백을 보여줍니다.",
      size: "medium",
      accent: "accent-green",
      priority:
        profile.selected.objective?.[0] === "medical" || state.signals.healthRisk ? 104 : 42 + s.healthConcern * 0.15,
      metrics: [
        ["건강점수", `${s.healthConcern}`],
        ["보험/의료", `${allocation.insurance}%`],
        ["버퍼", `${allocation.cash}%`],
      ],
      tags: ["보험 점검", "의료비 버퍼", "생활 리스크"],
    },
    {
      id: "bias",
      title: "행동편향 코치",
      body: "프레이밍, 앵커링, 희귀사건 과대평가가 높을수록 결정을 늦추고 비교 기준을 자동으로 제시합니다.",
      size: "small",
      accent: "accent-berry",
      priority: 38 + s.framingSusceptibility * 0.3 + s.anchoringSusceptibility * 0.25 + s.probabilityDistortion * 0.18,
      metrics: [
        ["프레임", `${s.framingSusceptibility}`],
        ["앵커", `${s.anchoringSusceptibility}`],
        ["확률", `${s.probabilityDistortion}`],
      ],
      tags: ["쿨다운", "기준 재설정", "시나리오 비교"],
    },
    {
      id: "expert",
      title: "전문가 분석 패널",
      body: "금융 이해도가 높고 자기주도성이 강한 경우 MDD, 샤프지수, 세후 수익률을 전면에 배치합니다.",
      size: "small",
      accent: "accent-blue",
      priority: s.financialLiteracy > 62 && profile.guidanceNeed < 52 ? 82 : 28,
      metrics: [
        ["MDD", "표시"],
        ["Sharpe", "표시"],
        ["세후", "비교"],
      ],
      tags: ["고밀도 UI", "전문 지표", "세후 비교"],
    },
    {
      id: "tax",
      title: "절세/승계 전략",
      body: "자산 규모가 커질수록 계좌 유형, 세후 수익률, 증여/상속 플랜을 함께 봅니다.",
      size: "medium",
      accent: "accent-teal",
      priority: ["hnw", "uhnw"].includes(profile.selected.assetBand?.[0]) ? 88 : 22,
      metrics: [
        ["자산구간", profile.selected.assetBand?.[1] || "-"],
        ["대체자산", `${allocation.alternatives}%`],
        ["세후", "점검"],
      ],
      tags: ["절세", "집중위험", "상속"],
    },
    {
      id: "family",
      title: "가족/보호자 관점",
      body: "부양가족과 보호자 확인 선호가 높으면 수익률보다 지속가능성과 설명 공유 흐름을 우선합니다.",
      size: "small",
      accent: "accent-green",
      priority: 30 + s.socialPreference * 0.45,
      metrics: [
        ["사회선호", `${s.socialPreference}`],
        ["공유", s.socialPreference > 60 ? "권장" : "선택"],
        ["부양", profile.selected.lifeStage?.[0] === "family" ? "중요" : "보통"],
      ],
      tags: ["가족 공유", "부양 리스크", "보호자 알림"],
    },
  ];

  return widgets
    .filter((widget) => widget.priority >= 35)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 9);
}

/* ============================================================
   Dashboard Rendering
   ============================================================ */
function renderScoreBars(profile) {
  const keys = [
    "riskTolerance",
    "lossSensitivity",
    "futureOrientation",
    "socialPreference",
    "framingSusceptibility",
    "anchoringSusceptibility",
    "probabilityDistortion",
    "financialLiteracy",
    "liquidityNeed",
    "healthConcern",
  ];

  els.scoreBars.innerHTML = keys
    .map((key) => {
      const value = profile.scores[key];
      return `
        <div class="score-row">
          <span>${factorLabels[key]}</span>
          <div class="score-track"><span style="width:${value}%; background:${factorColors[key]};"></span></div>
          <strong>${value}</strong>
        </div>
      `;
    })
    .join("");
}

function renderWidgets(widgets) {
  els.widgetZone.innerHTML = widgets
    .map((widget, index) => {
      const metrics = widget.metrics
        .map(([label, value]) => `<div class="metric-box"><span>${label}</span><strong>${value}</strong></div>`)
        .join("");
      const tags = widget.tags.map((tag) => `<span>${tag}</span>`).join("");
      return `
        <article class="widget ${widget.size} ${widget.accent}">
          <p class="question-index">Priority ${String(index + 1).padStart(2, "0")}</p>
          <h3>${widget.title}</h3>
          <p>${widget.body}</p>
          <div class="widget-metrics">${metrics}</div>
          <div class="widget-tags">${tags}</div>
        </article>
      `;
    })
    .join("");
}

function renderPolicy(policy) {
  els.policyStatus.textContent = policy.status;
  els.policyStatus.style.background = policy.blocked ? "var(--accent-amber-soft)" : "var(--accent-green-soft)";
  els.policyStatus.style.color = policy.blocked ? "var(--accent-amber)" : "var(--accent-green)";
  els.policyStatus.style.borderColor = policy.blocked ? "rgba(227, 168, 74, 0.15)" : "rgba(77, 184, 130, 0.15)";
  els.policyList.innerHTML = policy.rules.map((rule) => `<li>${rule}</li>`).join("");
}

function renderJbProducts(profile, investorClass, jbProducts) {
  els.investorClass.textContent = investorClass.label;
  els.investorClass.style.background = investorClass.maxRisk <= 2 ? "var(--accent-blue-soft)" : investorClass.maxRisk >= 4 ? "var(--accent-berry-soft)" : "var(--accent-green-soft)";
  els.investorClass.style.color = investorClass.maxRisk <= 2 ? "var(--accent-blue)" : investorClass.maxRisk >= 4 ? "var(--accent-berry)" : "var(--accent-green)";
  els.investorClass.style.borderColor = investorClass.maxRisk <= 2 ? "rgba(91,143,227,0.15)" : investorClass.maxRisk >= 4 ? "rgba(227,91,143,0.15)" : "rgba(77,184,130,0.15)";

  const visible = jbProducts.slice(0, 6);
  els.jbProductList.innerHTML = visible
    .map((item) => {
      const blocked = item.allowed ? "" : "blocked";
      return `
        <article class="jb-product ${blocked}">
          <strong>${item.group} · ${item.name}</strong>
          <span>${item.use}</span>
          <span>${item.caution}</span>
          <small>${item.status} · 위험도 ${item.risk}</small>
        </article>
      `;
    })
    .join("");

  if (els.jbSourceList) {
    els.jbSourceList.innerHTML = jbSources
      .map(
        (source) => `
          <a href="${source.url}" target="_blank" rel="noreferrer">
            ${source.label}
            <span>${source.url}</span>
          </a>
        `,
      )
      .join("");
  }
}

function getSchema(profile, allocation, policy, widgets, investorClass, jbProducts) {
  return {
    source: "behavioral_economics_of_ai.pdf task battery",
    pbAgentGuideline: {
      localFile: "pbagent지침.md",
      coreRules: [
        "투자권유 전 투자자정보 확인",
        "투자자성향보다 높은 위험도 상품 권유 금지",
        "고령투자자 고난도/파생결합/신탁성 상품은 녹취·숙려 절차 필요",
        "일임·금전신탁은 별도 확인서와 자산배분 적합성 검증 필요",
      ],
    },
    dynamicPage: {
      kind: "stateful SPA + backend AI endpoint",
      screens: ["PB assessment", "profile scoring", "adaptive dashboard", "AI agent chat"],
    },
    profile: {
      typeCode: profile.code,
      typeName: profile.name,
      axes: Object.fromEntries(Object.entries(profile.axes).map(([key, value]) => [key, value[1]])),
      selected: {
        lifeStage: profile.selected.lifeStage?.[1],
        objective: profile.selected.objective?.[1],
        assetBand: profile.selected.assetBand?.[1],
        emergency: profile.selected.emergency?.[1],
      },
      scores: profile.scores,
      investorClass,
    },
    jbProductLens: jbProducts.slice(0, 6).map((item) => ({
      group: item.group,
      name: item.name,
      category: item.category,
      risk: item.risk,
      status: item.status,
      allowed: item.allowed,
      caution: item.caution,
      source: item.source,
    })),
    jbSources,
    strategy: {
      allocation,
      policyStatus: policy.status,
      executionMode: policy.blocked ? "humanReview" : "advisoryDraft",
    },
    sdui: {
      renderer: "allowed component registry",
      federationIdea: ["financeMFE", "healthMFE", "insuranceMFE", "complianceMFE"],
      components: widgets.map((widget, index) => ({
        order: index + 1,
        id: widget.id,
        size: widget.size,
        priority: Math.round(widget.priority),
        props: {
          title: widget.title,
          density: profile.guidanceNeed > 60 ? "low" : profile.scores.financialLiteracy > 65 ? "high" : "medium",
        },
      })),
    },
  };
}

function renderType(profile) {
  els.typeTitle.textContent = `${profile.code} · ${profile.name}`;
  els.typeSummary.textContent = profile.summary;
  els.typeBadges.innerHTML = [
    profile.code,
    ...Object.values(profile.axes).map((axis) => axis[2]),
    `가이드 필요도 ${profile.guidanceNeed}`,
  ]
    .map((badge) => `<span>${badge}</span>`)
    .join("");
}

function ensureInitialAgentMessage(profile, investorClass) {
  if (state.messages.length > 0) return;
  state.messages.push({
    role: "assistant",
    text: `${profile.code} 타입과 ${investorClass.label} 투자자성향이 산출됐습니다. 현재 화면은 ${profile.axes.risk[2]}, ${profile.axes.loss[2]}, ${profile.axes.time[2]}, ${profile.axes.guidance[2]} 기준으로 위젯과 JB 상품군 검토 순서를 다시 조립한 상태입니다.`,
  });
}

function renderMessages() {
  els.chatLog.innerHTML = state.messages
    .map((message) => `<div class="message ${message.role}">${escapeHtml(message.text).replaceAll("\n", "<br />")}</div>`)
    .join("");
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function renderSignals() {
  els.signalButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", state.signals[button.dataset.signal]);
  });
}

function renderDashboard() {
  const profile = getProfile();
  const investorClass = getInvestorClass(profile);
  const jbProducts = getJbSuitability(profile, investorClass);
  const allocation = getAllocation(profile);
  const policy = getPolicy(profile, allocation, investorClass, jbProducts);
  const widgets = buildWidgets(profile, allocation, policy, investorClass, jbProducts);

  renderType(profile);
  renderScoreBars(profile);
  renderWidgets(widgets);
  renderPolicy(policy);
  renderJbProducts(profile, investorClass, jbProducts);
  renderSignals();
  ensureInitialAgentMessage(profile, investorClass);
  renderMessages();
  if (els.schemaCode) {
    els.schemaCode.textContent = JSON.stringify(getSchema(profile, allocation, policy, widgets, investorClass, jbProducts), null, 2);
  }
}

function showDashboard() {
  state.completed = true;
  els.assessmentView.classList.add("hidden");
  els.dashboardView.classList.remove("hidden");
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAssessment() {
  state.step = 0;
  state.answers = {};
  state.completed = false;
  state.messages = [];
  state.signals.marketStress = false;
  state.signals.healthRisk = false;
  state.signals.fraudSignal = false;
  state.signals.lifeEvent = false;
  els.dashboardView.classList.add("hidden");
  els.assessmentView.classList.remove("hidden");
  // Restore hero, hide survey body
  if (els.assessHero) {
    els.assessHero.classList.remove("dismissed", "hidden");
    els.assessHero.style.display = '';
  }
  if (els.assessBody) {
    els.assessBody.classList.add("hidden");
    els.assessBody.classList.remove("entering");
  }
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   AI Agent API Call (unchanged)
   ============================================================ */
async function callAgent(message) {
  const profile = getProfile();
  const investorClass = getInvestorClass(profile);
  const jbProducts = getJbSuitability(profile, investorClass);
  const allocation = getAllocation(profile);
  const policy = getPolicy(profile, allocation, investorClass, jbProducts);
  const widgets = buildWidgets(profile, allocation, policy, investorClass, jbProducts);

  if (window.location.protocol === "file:") {
    state.messages.push({
      role: "error",
      text: "AI Agent 호출은 서버 실행이 필요합니다. 이 폴더에서 `python3 server.py`로 실행한 뒤 http://127.0.0.1:8000 으로 접속하세요.",
    });
    renderMessages();
    return;
  }

  els.agentMode.textContent = "Thinking";
  els.generateBrief.disabled = true;

  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        profile: {
          code: profile.code,
          name: profile.name,
          summary: profile.summary,
          axes: Object.fromEntries(Object.entries(profile.axes).map(([key, value]) => [key, value[2]])),
          scores: profile.scores,
          selected: {
            lifeStage: profile.selected.lifeStage?.[1],
            objective: profile.selected.objective?.[1],
            assetBand: profile.selected.assetBand?.[1],
            emergency: profile.selected.emergency?.[1],
          },
          signals: state.signals,
          investorClass,
        },
        allocation,
        policy,
        jbProducts: jbProducts.slice(0, 6).map((item) => ({
          group: item.group,
          name: item.name,
          category: item.category,
          risk: item.risk,
          status: item.status,
          allowed: item.allowed,
          caution: item.caution,
          source: item.source,
        })),
        jbSources,
        widgets: widgets.map((widget) => ({ id: widget.id, title: widget.title, priority: Math.round(widget.priority) })),
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI 응답 생성 실패");

    state.messages.push({
      role: data.mode === "offline" ? "error" : "assistant",
      text: data.reply,
    });
    els.agentMode.textContent = data.mode === "offline" ? "Offline" : "Live";
  } catch (error) {
    state.messages.push({
      role: "error",
      text: `AI Agent 연결 실패: ${error.message}`,
    });
    els.agentMode.textContent = "Error";
  } finally {
    els.generateBrief.disabled = false;
    renderMessages();
  }
}

/* ============================================================
   Event Listeners
   ============================================================ */
els.questions.addEventListener("click", (event) => {
  const button = event.target.closest(".option-card");
  if (!button) return;
  state.answers[button.dataset.question] = button.dataset.value;
  renderStep();
});

els.prevStep.addEventListener("click", () => {
  if (state.step === 0) return;
  state.step -= 1;
  renderStep();
  // Scroll to top of question panel
  els.questions.scrollIntoView({ behavior: "smooth", block: "start" });
});

els.nextStep.addEventListener("click", () => {
  if (!isStepComplete()) return;
  if (state.step < assessmentSteps.length - 1) {
    state.step += 1;
    renderStep();
    // Scroll to top of question panel
    els.questions.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  showDashboard();
});

// Step nav click
els.stepNav.addEventListener("click", (event) => {
  const item = event.target.closest(".step-nav-item");
  if (!item) return;
  const targetIndex = parseInt(item.dataset.stepIndex, 10);
  // Only allow navigating to completed steps or current+1 if current is complete
  if (targetIndex <= state.step || (targetIndex === state.step + 1 && isStepComplete())) {
    state.step = targetIndex;
    renderStep();
  }
});

els.signalButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-signal]");
  if (!button) return;
  state.signals[button.dataset.signal] = !state.signals[button.dataset.signal];
  renderDashboard();
});

els.generateBrief.addEventListener("click", () => {
  callAgent("현재 프로파일과 대시보드 위젯 순서를 바탕으로 5줄짜리 PB 브리핑을 만들어줘.");
});

els.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = els.chatInput.value.trim();
  if (!message) return;
  state.messages.push({ role: "user", text: message });
  els.chatInput.value = "";
  renderMessages();
  callAgent(message);
});

els.restartAssessment.addEventListener("click", resetAssessment);

els.goDashboard.addEventListener("click", () => {
  if (!state.completed) {
    els.assessmentView.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  els.dashboardView.scrollIntoView({ behavior: "smooth", block: "start" });
});

els.goAgent.addEventListener("click", () => {
  if (!state.completed) return;
  document.querySelector("#agentColumn").scrollIntoView({ behavior: "smooth", block: "start" });
});

// Hero start button — proper view transition (hide hero, show survey)
const heroStartBtn = document.querySelector("#heroStartBtn");
if (heroStartBtn) {
  heroStartBtn.addEventListener("click", () => {
    if (els.assessHero) {
      els.assessHero.classList.add("dismissed");
      setTimeout(() => {
        els.assessHero.style.display = 'none';
        if (els.assessBody) {
          els.assessBody.classList.remove("hidden");
          els.assessBody.classList.add("entering");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 320);
    }
  });
}

// Floating AI Agent button
const fabAgent = document.querySelector("#fabAgent");
if (fabAgent) {
  fabAgent.addEventListener("click", () => {
    if (!state.completed) return;
    const agentCol = document.querySelector("#agentColumn");
    if (agentCol) {
      agentCol.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

/* ============================================================
   Init
   ============================================================ */
renderStep();
