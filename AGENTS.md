# LifeLong WM PB AI Agent

## Project Goal

이 프로젝트는 JB금융그룹 대회용 개인 PB AI Agent 웹 프로토타입이다.

핵심 흐름은 다음과 같다.

1. 고객이 PB 온보딩 설문을 먼저 수행한다.
2. 설문 응답으로 행동경제학 기반 개인 프로파일과 16가지 PB 타입 코드를 산출한다.
3. 산출 결과를 투자자성향 5단계와 연결한다.
4. 그 결과에 따라 대시보드 위젯 순서와 정보 밀도를 동적으로 재배치한다.
5. JB금융그룹 상품군을 실제 권유가 아니라 적합성 검증 대상 후보로 보여준다.
6. 서버의 `/api/agent`가 OpenAI API를 호출해 PB 상담 브리핑을 생성한다.

## Main Files

- `index.html`: 설문, 결과, 적응형 대시보드, AI Agent 채팅 화면.
- `styles.css`: 전체 UI 스타일.
- `app.js`: 설문 문항, 점수 계산, PB 타입 산출, 투자자성향 분류, 위젯 재배치, JB 상품 적합성 렌즈.
- `server.py`: 정적 파일 서버와 `/api/agent` 백엔드. API 키는 브라우저에 노출하지 않고 서버에서만 읽는다.
- `api코드.py`: OpenAI API 키가 들어 있는 로컬 파일. 키를 출력하거나 커밋하지 않는다.
- `behavioral_economics_of_ai.pdf`: 설문 측정 축 참고 자료.
- `pbagent지침.md`: 투자권유, 투자자성향, 고령투자자 보호, 적합성 원칙 관련 내부 지침 자료.

## How To Run

```bash
python3 server.py
```

브라우저에서 접속한다.

```text
http://127.0.0.1:8000/
```

서버는 기본적으로 `OPENAI_API_KEY` 환경변수를 먼저 보고, 없으면 `api.py` 또는 `api*.py` 파일에서 `sk-...` 형식의 키를 찾는다. 현재 폴더에서는 `api코드.py`를 읽을 수 있다.

## Behavioral Profile Model

`behavioral_economics_of_ai.pdf`의 Task Battery를 압축해 다음 측정 축을 사용한다.

- Risk Aversion / Risk Tolerance: 위험회피 또는 위험감수 성향.
- Loss Aversion: 손실회피.
- Time Preferences: 현재편향, 미래지향, 장기할인.
- Social Preferences: 가족, 보호자, 부양가족 고려.
- Framing Effects: 표현 방식에 따라 판단이 흔들리는 정도.
- Anchoring: 초기 기준점에 끌리는 정도.
- Probability Weighting: 희귀 사건이나 낮은 확률을 과대/과소평가하는 정도.
- Financial Literacy: 금융 이해도.
- Liquidity Need: 유동성 필요.
- Health/Insurance Concern: 건강, 보험, 의료비 리스크.

PB 타입은 4축으로 압축한다.

- `O/D`: Opportunity 또는 Defense.
- `S/C`: Shield 또는 Calm.
- `F/N`: Future 또는 Now.
- `G/I`: Guided 또는 Independent.

예: `DSNG`는 방어중심, 손실민감, 현재유동성, 상담가이드형이다.

## Investor Suitability Model

`pbagent지침.md`를 반영해 PB 타입과 별도로 투자자성향 5단계를 계산한다.

- 안정형: 상품위험도 1단계 이하 후보만.
- 안정추구형: 상품위험도 2단계 이하 후보만.
- 위험중립형: 상품위험도 3단계 이하 후보만.
- 적극투자형: 상품위험도 4단계 이하 후보만.
- 공격투자형: 상품위험도 5단계 이하 후보까지 검토 가능.

웹앱의 투자자성향은 공식 판매 시스템의 법적 판정이 아니라 프로토타입용 추정값이다. 실제 판매 또는 권유에는 회사 공식 투자자정보 확인서와 상품위험등급을 사용해야 한다.

## PB Agent Compliance Rules

`pbagent지침.md`에서 반영한 운영 원칙이다.

- 투자권유 전 투자목적, 재산상황, 투자경험, 금융지식, 투자기간, 손실감내수준, 소득, 연령을 확인한다.
- 투자자성향보다 위험도가 높은 상품이나 운용방식은 권유하지 않는다.
- 고객이 원했다는 이유만으로 부적합 권유가 정당화되지 않는다.
- 부적합 상품을 권유해 놓고 사후적으로 확인서를 받는 방식은 회피로 보아야 한다.
- 투자일임 및 금전신탁은 별도 투자자정보 확인, 자산배분 적합성 검증, 운용방식 설명이 필요하다.
- 투자일임 및 금전신탁에서 성향 초과 운용은 부적합 확인서로 처리하지 않는다.
- 고령투자자는 일반 투자자보다 강화된 보호기준을 적용한다.
- 65세 이상 고령투자자 또는 부적합투자자가 파생결합증권, 파생상품, 파생결합펀드, 조건부자본증권, 고난도상품, 관련 신탁을 검토하면 녹취와 숙려 절차를 안내한다.
- 로보어드바이저 또는 AI Agent는 더 나은 수익을 보장하지 않는다는 사실을 설명해야 한다.

## JB Financial Group Product Lens

웹앱은 JB금융그룹 상품을 직접 매수/가입 권유하지 않는다. 고객 프로파일과 투자자성향에 따라 어떤 JB 상품군을 검토할 수 있는지 보여주는 렌즈로만 사용한다.

현재 반영한 상품군은 다음과 같다.

- 광주은행: `KJB주거래우대예금`, `매월이자Wa예금`, `매일이자Wa파킹통장`, 신탁상품.
- 전북은행: 펀드 Mall, 펀드검색, 펀드신규, ELF신규, 연금저축계좌, 연금펀드.
- JB자산운용: 증권펀드, 부동산펀드, 에너지자원펀드 등 자산운용 상품군.
- JB우리캐피탈: 투자권유가 아니라 부채관리와 현금흐름 관리 맥락에서만 언급.

각 상품군은 `risk` 값을 갖고, 고객의 투자자성향 `maxRisk`보다 높으면 `성향 초과` 또는 `고령자 보호상 차단`으로 표시된다.

## Official References Used

- JB금융그룹 계열사 소개: https://www.jbfg.com/ko/about/network.do
- 전북은행 펀드/연금 메뉴: https://www.jbbank.co.kr/CUSTOMER_MAIN.act
- 전북은행 연금펀드 상품안내: https://www.jbbank.co.kr/pnsn_fund_gds_gdnc_01.act
- 광주은행 예금/신탁 상품몰: https://www.kjbank.com/ib20/mnu/FPMDPTR020000
- 광주은행 신탁 운용방법 및 보수율 현황: https://www.kjbank.com/ib20/mnu/FPMDPTR050400
- JB자산운용: https://www.jbam.co.kr/
- 금융투자협회 표준투자권유준칙: https://law.kofia.or.kr/service/law/lawFullScreenContent.do?historySeq=1556&seq=149
- 금융위원회 고난도 금융투자상품 및 고령투자자 녹취·숙려 제도: https://www.fsc.go.kr/no010101/75872?curPage=255&srchBeginDt=2022-12-&srchCtgry=&srchEndDt=&srchKey=sj&srchText=

## Dynamic UI Behavior

이 웹페이지는 정적 설명 페이지가 아니라 상태 기반 동적 웹페이지다.

- 설문 응답이 `state.answers`에 저장된다.
- `getScores()`가 행동경제학 점수로 변환한다.
- `getProfile()`이 16가지 PB 타입 코드를 만든다.
- `getInvestorClass()`가 투자자성향 5단계를 만든다.
- `getJbSuitability()`가 JB 상품군의 검토 가능/차단 상태를 만든다.
- `buildWidgets()`가 위젯 우선순위를 다시 계산한다.
- 상황 신호 버튼을 누르면 시장 급락, 건강 리스크, 이상거래, 생애 이벤트가 반영되어 위젯 순서가 다시 바뀐다.
- `callAgent()`가 현재 프로파일, 배분, 정책 검증, JB 상품 렌즈를 서버로 보내 AI Agent 응답을 받는다.

## API Agent Rules

`server.py`의 AI Agent는 다음 방식으로 답해야 한다.

- 한국어로 답한다.
- 특정 상품을 확정 추천하지 않는다.
- `검토 후보`, `상담 필요`, `차단` 같은 표현을 사용한다.
- JB 상품군을 언급할 때는 공식 상품설명서, 위험등급, 금리, 보수, 환매조건 재확인을 요구한다.
- 금융소비자 보호 관점에서 적합성, 적정성, 설명의무, 손실 가능성, 유동성, 고령자 보호, 녹취·숙려를 언급한다.
- 사용자 행동편향이 UI에 어떻게 반영되었는지 설명한다.

## Verification Commands

```bash
node --check app.js
python3 -m py_compile server.py
curl -s -I http://127.0.0.1:8000/
```

OpenAI API live 호출 확인 예시는 다음과 같다.

```bash
curl -s -X POST http://127.0.0.1:8000/api/agent \
  -H 'Content-Type: application/json' \
  -d '{"message":"현재 프로파일로 PB 브리핑","profile":{"code":"DSNG","name":"방어중심 손실민감 현재유동성 상담가이드형","investorClass":{"label":"안정추구형","maxRisk":2}},"allocation":{"stock":22,"bond":42,"cash":26},"policy":{"status":"통과","rules":["설명의무"]},"jbProducts":[],"widgets":[]}'
```

## Safety Notes

- `api코드.py`의 API 키를 출력하지 않는다.
- 프론트엔드에 API 키를 넣지 않는다.
- 실제 금융상품 추천, 투자권유, 매수/매도 지시로 보일 수 있는 문구는 피한다.
- 대회 프로토타입에서는 상품군 수준의 후보와 검증 흐름만 보여준다.
- 실제 서비스화 시에는 JB금융그룹의 공식 상품 DB, 투자자정보 확인서, 상품위험등급, 내부통제 시스템과 연동해야 한다.
