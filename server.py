import json
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DEFAULT_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1-mini")

PB_AGENT_RULES = [
    "투자권유 전 투자 목적, 재산상황, 투자경험, 금융지식, 투자기간, 손실감내수준, 소득, 연령을 확인한다.",
    "투자자성향보다 위험도가 높은 상품 또는 운용방식은 권유하지 않는다.",
    "고객이 원했다는 사정만으로 부적합 권유가 정당화되지 않는다.",
    "65세 이상 고령투자자 또는 부적합투자자가 고난도/파생결합/파생상품/조건부자본증권/관련 신탁을 검토하면 녹취와 2영업일 이상 숙려 절차를 안내한다.",
    "투자일임·금전신탁은 일반 상품판매보다 별도 확인서와 자산배분 적합성 검증이 필요하고, 부적합 확인서로 성향초과 운용을 처리하지 않는다.",
    "로보어드바이저나 AI Agent는 더 나은 수익을 보장하지 않으며, 설명가능한 후보와 검증결과만 제시한다.",
]

JB_CONTEXT = [
    "JB금융그룹 맥락에서는 전북은행, 광주은행, JB자산운용, JB우리캐피탈 등 계열 상품군을 참고하되 실제 판매 여부, 금리, 보수, 위험등급은 공식 상품설명서로 재확인한다.",
    "전북은행은 펀드 Mall, 펀드검색, 펀드신규, ELF신규, 연금저축계좌와 운용상품 전환 같은 펀드/연금 메뉴를 제공한다.",
    "전북은행 연금저축계좌는 장기 은퇴 목적과 세액공제 맥락에서 설명하되 중도해지, 연금외수령 세제 불이익을 반드시 고지한다.",
    "광주은행은 예금/신탁 상품몰에서 예금, 적금, 파킹통장, 신탁상품을 제공하므로 안정형·유동성 필요 고객의 후보군으로 활용한다.",
    "JB자산운용은 증권펀드, 부동산펀드, 에너지자원펀드 등 자산운용 상품군이 있으나 개별 펀드의 공모/사모, 환매제한, 기초자산, 손실위험을 확인해야 한다.",
    "JB우리캐피탈 상품은 투자권유가 아니라 부채관리·현금흐름 관리 관점에서만 언급한다.",
]


def load_api_key():
    env_key = os.environ.get("OPENAI_API_KEY")
    if env_key:
        return env_key

    candidates = [ROOT / "api.py"]
    candidates.extend(sorted(path for path in ROOT.glob("api*.py") if path.name != "server.py"))

    patterns = [
        r"OpenAI\(\s*api_key\s*=\s*['\"]([^'\"]+)['\"]",
        r"api_key\s*=\s*['\"](sk-[A-Za-z0-9_-]+)['\"]",
        r"(sk-[A-Za-z0-9_-]{20,})",
    ]

    for path in candidates:
        if not path.exists():
            continue
        text = path.read_text("utf-8", errors="ignore")
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)
    return None


def offline_reply(payload, reason):
    profile = payload.get("profile", {})
    allocation = payload.get("allocation", {})
    widgets = payload.get("widgets", [])
    jb_products = payload.get("jbProducts", [])
    top_widgets = ", ".join(widget.get("title", "") for widget in widgets[:3]) or "핵심 위젯"
    top_products = ", ".join(product.get("name", "") for product in jb_products[:3]) or "JB 상품군"
    return {
        "mode": "offline",
        "model": None,
        "reply": (
            f"오프라인 브리핑입니다. 현재 {profile.get('code', 'PB')} 타입은 {profile.get('name', '개인 맞춤형')}으로 분류됩니다.\n"
            f"추천 화면은 {top_widgets} 순서로 배치하는 것이 적절합니다.\n"
            f"JB 상품군은 {top_products}를 먼저 검토하되, 실제 권유 전 공식 설명서와 위험등급을 다시 확인해야 합니다.\n"
            f"초안 배분은 주식 {allocation.get('stock', '-')}%, 채권 {allocation.get('bond', '-')}%, 현금성 {allocation.get('cash', '-')}%입니다.\n"
            "실제 투자권유 전에는 적합성, 설명의무, 고령자 보호, 이상거래 검증을 다시 통과해야 합니다.\n"
            f"실시간 AI 호출은 현재 사용할 수 없습니다: {reason}"
        ),
    }


def build_prompt(payload):
    return f"""
너는 한국어로 답하는 JB금융그룹 대회용 개인 PB AI Agent 프로토타입이다.
사용자의 행동경제학 기반 프로파일, 투자자성향 단계, 추천 배분, JB 상품군 적합성, UI 위젯 우선순위를 보고 상담 브리핑을 만든다.

반드시 지킬 것:
- 실제 매수/매도 지시나 특정 종목/상품 추천으로 단정하지 않는다. "검토 후보", "상담 필요", "차단"으로 말한다.
- JB 상품군을 언급할 때는 전북은행/광주은행/JB자산운용/JB우리캐피탈의 상품군 수준으로만 말하고, 실제 판매조건·금리·위험등급은 공식 상품설명서 재확인을 요구한다.
- 금융소비자 보호 관점에서 적합성, 적정성, 설명의무, 손실 가능성, 유동성, 고령자 보호, 녹취·숙려를 언급한다.
- 투자자성향보다 높은 위험도 상품군은 권유하지 말고, 왜 차단되는지 설명한다.
- 사용자의 타입과 행동편향을 UI가 어떻게 바꿨는지 설명한다.
- 한국어로 5~7줄, 실무 제안처럼 간결하게 답한다.

PB Agent 내부 지침 요약:
{json.dumps(PB_AGENT_RULES, ensure_ascii=False, indent=2)}

JB금융그룹 상품/채널 맥락:
{json.dumps(JB_CONTEXT, ensure_ascii=False, indent=2)}

사용자 질문:
{payload.get("message", "")}

현재 프로파일/전략 JSON:
{json.dumps(payload, ensure_ascii=False, indent=2)}
""".strip()


def call_openai(payload):
    api_key = load_api_key()
    if not api_key:
        return offline_reply(payload, "OPENAI_API_KEY 또는 api.py/api코드.py의 키를 찾지 못했습니다.")

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=DEFAULT_MODEL,
            input=build_prompt(payload),
            temperature=0.35,
            max_output_tokens=700,
        )
        text = getattr(response, "output_text", None)
        if not text:
            text = str(response)
        return {
            "mode": "live",
            "model": DEFAULT_MODEL,
            "reply": text.strip(),
        }
    except Exception as exc:
        return offline_reply(payload, str(exc))


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/agent":
            self.send_error(404, "Not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            self.write_json({"error": f"Invalid JSON: {exc}"}, status=400)
            return

        result = call_openai(payload)
        self.write_json(result)

    def write_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    os.chdir(ROOT)
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Serving LifeLong WM PB AI Agent at http://127.0.0.1:{port}")
    print("API key source: OPENAI_API_KEY env or local api.py/api코드.py")
    server.serve_forever()


if __name__ == "__main__":
    main()
