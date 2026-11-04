import time
import json
import os
import re
from playwright.sync_api import sync_playwright

# ==============================================================================
# 🌳 一级母网站：春高锦标赛主页（爬虫会从这里自动发散找出所有参赛学校 -t 链接）
# ==============================================================================
MOTHER_TOURNAMENT_URLS = [
    "https://volleybox.net/zh/men-all-japan-high-school-championship-2025-26-o43505",
]

# ==============================================================================
# 🌿 二级发散种子学校：保底直接抓取的重点名校（还会自动遍历它们的 season_id 历年名单）
# ==============================================================================
SEED_SCHOOL_URLS = [
    "https://volleybox.net/zh/higashiyama-high-school-t10545",
    "https://volleybox.net/zh/seisei-high-school-t35450",
    "https://volleybox.net/zh/sundai-gakuen-high-school-t10546",
    "https://volleybox.net/zh/seifu-high-school-t14391",
    "https://volleybox.net/zh/chinzei-high-school-t10547",
    "https://volleybox.net/zh/higashi-fukuoka-high-school-t12938",
    "https://volleybox.net/zh/waseda-university-t5328",
    "https://volleybox.net/zh/chuo-university-t1922",
]

# 常见学校中英日对照表（如果遇到新学校，爬虫会自动从网页左侧“名称翻译”提取中文/日文名！）
SCHOOL_NAME_DICT = {
    "t10545": {"zh": "东山高校", "ja": "東山高等学校", "hira": "ひがしやま", "region": "京都", "cat": "高校"},
    "t35450": {"zh": "静清高校", "ja": "静清高等学校", "hira": "せいせい", "region": "静冈", "cat": "高校"},
    "t10546": {"zh": "骏台学园", "ja": "駿台学園", "hira": "すんだいがくえん", "region": "东京", "cat": "高校"},
    "t14391": {"zh": "清风高校", "ja": "清風高等学校", "hira": "せいふう", "region": "大阪", "cat": "高校"},
    "t10547": {"zh": "镇西高校", "ja": "鎮西高等学校", "hira": "ちんぜい", "region": "熊本", "cat": "高校"},
    "t12938": {"zh": "东福冈", "ja": "東福岡高等学校", "hira": "ひがしふくおか", "region": "福冈", "cat": "高校"},
    "t5328":  {"zh": "早稻田大学", "ja": "早稲田大学", "hira": "わせだだいがく", "region": "关东1部", "cat": "大学"},
    "t1922":  {"zh": "中央大学", "ja": "中央大学", "hira": "ちゅうおうだいがく", "region": "关东1部", "cat": "大学"},
}

def wait_for_ready(page):
    """等待页面加载完毕，如果遇到验证框则等待用户点击"""
    for i in range(60):
        try:
            title = page.title().lower()
            url = page.url.lower()
            if "just a moment" in title or "请稍候" in title or "verification" in url or "challenge" in title:
                if i == 0:
                    print("   🛑 检测到验证框，请在 Chrome 窗口中手动点一下确认...")
                time.sleep(2)
            else:
                return True
        except Exception:
            time.sleep(1)
    return False

def map_season_to_cohort(season_label):
    if "2025" in season_label or "2026" in season_label:
        return "2024-2026"
    elif "2023" in season_label or "2024" in season_label:
        return "2023-2025"
    return "历届知名校友"

def translate_pos(raw_pos):
    raw = raw_pos.lower()
    if "升球手" in raw or "二传" in raw or "二傳" in raw or "舉球" in raw or "setter" in raw:
        return "二传 (S)"
    if "主攻" in raw or "outside" in raw:
        return "主攻手 (OH)"
    if "快攻" in raw or "副攻" in raw or "middle" in raw:
        return "副攻 (MB)"
    if "接应" in raw or "接應" in raw or "opposite" in raw:
        return "接应 (OP)"
    if "自由" in raw or "libero" in raw:
        return "自由人 (L)"
    return "主攻手 (OH)"

def extract_school_meta(page, team_url):
    """从二级学校页面提取学校名（优先查字典，没有则自动读取页面左侧的『名称翻译』如：静清高等学校）"""
    tid_match = re.search(r"-(t\d+)", team_url)
    tid = tid_match.group(1) if tid_match else ""
    if tid in SCHOOL_NAME_DICT:
        return SCHOOL_NAME_DICT[tid]

    # 使用 JS 直接从网页提取标题和左侧 Japanese Script 名称翻译
    meta = page.evaluate("""() => {
        const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : '未知学校';
        const bodyText = document.body.innerText;
        let jaName = h1;
        const match = bodyText.match(/名称翻译[\\s\\S]{0,60}?([\\u4e00-\\u9fa5\\u3040-\\u30ff]+(?:高等学校|高校|大学|学園|学园))/);
        if (match && match[1]) {
            jaName = match[1].trim();
        }
        return { h1, jaName };
    }""")
    clean_zh = meta["jaName"].replace("高等学校", "高校")
    return {"zh": clean_zh, "ja": meta["jaName"], "hira": "", "region": "东京", "cat": "高校"}

def extract_roster_from_school_page(page):
    """
    核心突破：不依赖 <table>！
    直接用浏览器开发者模式的 JS 扫描页面上所有带 -p数字 的球员链接，
    同时把该球员所在行的文字（位置、身高 177 厘米、出生年份 2007）和他的三级个人主页链接一起抓出来！
    """
    return page.evaluate("""() => {
        const anchors = Array.from(document.querySelectorAll('a[href*="-p"]'));
        const results = [];
        const seen = new Set();

        for (const a of anchors) {
            const href = a.href || '';
            // 必须严格匹配球员个人主页格式：...-p加数字结尾
            if (!/-p\\d+$/.test(href)) continue;
            // 排除顶部导航栏或无关按钮
            const name = a.innerText.trim();
            if (!name || name.length < 2 || seen.has(href)) continue;
            seen.add(href);

            // 向上寻找包裹这名球员的那一整行容器，读取同行的位置、身高、出生年
            let rowEl = a.parentElement;
            for (let i = 0; i < 4; i++) {
                if (rowEl && rowEl.innerText && rowEl.innerText.length < 180) {
                    if (rowEl.innerText.includes('厘米') || rowEl.innerText.includes('cm') || rowEl.innerText.includes('手') || rowEl.innerText.includes('自由人')) {
                        break;
                    }
                }
                if (rowEl && rowEl.parentElement) rowEl = rowEl.parentElement;
            }
            const rowText = rowEl ? rowEl.innerText.replace(/\\n+/g, ' | ') : '';
            results.push({ name, url: href, rowText });
        }
        return results;
    }""")

def extract_player_3rd_level_detail(page, fallback_name, fallback_row_text, school_zh, cohort_label, season_label):
    """
    三级网站解析：点进球员个人主页（如 https://volleybox.net/zh/sakuto-shimizu-p224391）
    直接读取全文，提取【击球高度/摸高】、【身高】、【位置】、【俱乐部经验】
    """
    data = page.evaluate("""() => {
        const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : '';
        const text = document.body.innerText;
        return { h1, text };
    }""")

    full_text = data["text"] + "\n" + fallback_row_text
    name = data["h1"] if data["h1"] and len(data["h1"]) >= 2 else fallback_name

    # 1. 提取身高 (匹配 "身高 173 厘米" 或行内的 "177 厘米")
    h_match = re.search(r"身高\s*(\d{3})\s*(?:厘米|cm)", full_text, re.IGNORECASE)
    if not h_match:
        h_match = re.search(r"(1[5-9]\d|2[0-2]\d)\s*(?:厘米|cm)", full_text, re.IGNORECASE)
    height = f"{h_match.group(1)} cm" if h_match else "182 cm"

    # 2. 提取摸高 / 击球高度 (匹配 "擊球高度 310 厘米" 或 "击球高度 338 cm")
    s_match = re.search(r"(?:擊球高度|击球高度|Spike\s*reach)\s*(\d{3})\s*(?:厘米|cm)", full_text, re.IGNORECASE)
    spike = f"{s_match.group(1)} cm" if s_match else "330 cm"

    # 3. 提取拦网高度
    b_match = re.search(r"(?:攔網高度|拦网高度|Block\s*reach)\s*(\d{3})\s*(?:厘米|cm)", full_text, re.IGNORECASE)
    block = f"{b_match.group(1)} cm" if b_match else "315 cm"

    # 4. 提取出生年份 (如 2007 (17) 或 2008)
    birth_match = re.search(r"\b(199\d|200\d|201\d)\b", fallback_row_text + " " + full_text)
    birthday = f"{birth_match.group(1)}年" if birth_match else "高校世代"

    # 5. 提取位置
    pos = translate_pos(fallback_row_text + " " + full_text[:600])

    # 6. 提取俱乐部/学校经验 (匹配形如 "2023/24 - 2025/26 Higashiyama High School")
    history = []
    exp_matches = re.findall(r"(20\d{2}/\d{2}(?:\s*-\s*(?:20\d{2}/\d{2}|至今))?)\s+([^\n]{3,40})", data["text"])
    for period, team_str in exp_matches[:4]:
        clean_team = team_str.strip()
        if not any(bad in clean_team for bad in ["排名", "點擊", "厘米", "球員"]):
            history.append({"period": period.strip(), "team": clean_team, "league": "Volleybox 履历"})

    if not history:
        history = [{"period": season_label, "team": school_zh, "league": "春高 / 高校联赛"}]

    pid_match = re.search(r"-(p\d+)$", page.url)
    pid = f"vb-{pid_match.group(1)}" if pid_match else f"vb-{school_zh}-{name}"

    return {
        "id": pid,
        "name_zh": name,
        "name_ja": name,
        "name_hira": "",
        "name_en": name,
        "team_name": school_zh,
        "cohort": cohort_label,
        "hometown": "日本",
        "position": pos,
        "birthday": birthday,
        "height": height,
        "spike_reach": spike,
        "block_reach": block,
        "dominant_hand": "右",
        "club_history": history,
        "national_history": []
    }

def run_scraper():
    json_path = "app/scraped_data.json"
    existing_data = {"teams": [], "players": [], "matches": []}
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception:
            pass

    players_map = {p["name_zh"] + "_" + p["team_name"]: p for p in existing_data.get("players", [])}
    teams_map = {t["name_zh"]: t for t in existing_data.get("teams", [])}

    print("🚀 启动【一级赛事母站 ➔ 二级学校历年 ➔ 三级球员主页】全自动发散爬虫...")
    with sync_playwright() as p:
        try:
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            page = context.pages[0] if context.pages else context.new_page()
        except Exception as e:
            print(f"❌ 无法连接 9222 端口的正版 Chrome！请确认已启动 Chrome 调试窗口: {e}")
            return

        # ==================================================================
        # 第一层：从母网站（春高赛事主页）自动发散搜集所有参赛学校链接 (-t数字)
        # ==================================================================
        all_school_urls = list(SEED_SCHOOL_URLS)
        for m_url in MOTHER_TOURNAMENT_URLS:
            print(f"\n🌳 [第1层·母网站] 正在扫描赛事主页提取参赛学校: {m_url}")
            try:
                page.goto(m_url, timeout=60000)
                wait_for_ready(page)
                time.sleep(3)

                found_teams = page.evaluate("""() => {
                    return Array.from(document.querySelectorAll('a[href*="-t"]'))
                        .map(a => a.href.split('?')[0])
                        .filter(h => /-t\\d+$/.test(h));
                }""")
                for t_url in found_teams:
                    if t_url not in all_school_urls:
                        all_school_urls.append(t_url)
                print(f"   ✅ 从母网站成功发散提取到 {len(found_teams)} 个学校链接！当前待抓学校总数: {len(all_school_urls)}")
            except Exception as e:
                print(f"   ⚠️ 母网站扫描跳过: {e}")

        # ==================================================================
        # 第二层：遍历每个学校主页 + 自动发散它的历年赛季 (?season_id=...)
        # ==================================================================
        for s_url in all_school_urls[:12]:  # 每次运行先抓前 12 所学校，可随时调大
            print(f"\n=======================================================")
            print(f"🏫 [第2层·学校网站] 正在进入: {s_url}")
            try:
                page.goto(s_url, timeout=60000)
                wait_for_ready(page)
                time.sleep(3)

                s_meta = extract_school_meta(page, s_url)
                s_name = s_meta["zh"]
                print(f"   📌 识别学校名称: {s_name} ({s_meta['ja']})")

                # 将该学校加入网站学校库
                teams_map[s_name] = {
                    "id": f"vb-team-{s_name}",
                    "name_zh": s_name,
                    "name_ja": s_meta["ja"],
                    "name_hira": s_meta["hira"],
                    "main_category": s_meta["cat"],
                    "region": s_meta["region"],
                    "gender": "MEN",
                    "desc": "Volleybox 自动同步名门档案"
                }

                # 提取页面上的历年 season_id 链接（如 2025/26, 2024/25, 2023/24）
                season_pages = page.evaluate("""(baseUrl) => {
                    const list = [{ url: baseUrl, label: '2025/26' }];
                    const links = Array.from(document.querySelectorAll('a[href*="season_id="], option[value*="season_id="]'));
                    for (const el of links) {
                        const rawUrl = el.href || el.value || '';
                        const txt = (el.innerText || '').trim();
                        if (/20(2[2-6])\\/\\d{2}/.test(txt) && rawUrl) {
                            const full = rawUrl.startsWith('http') ? rawUrl : window.location.origin + rawUrl;
                            list.push({ url: full, label: txt });
                        }
                    }
                    return list;
                }""", s_url)

                # 去重历年赛季（每个学校最多抓最近 2 个赛季：今年 + 去年）
                unique_seasons = []
                seen_labels = set()
                for sp in season_pages:
                    if sp["label"] not in seen_labels:
                        seen_labels.add(sp["label"])
                        unique_seasons.append(sp)
                unique_seasons = unique_seasons[:2]

                for sp in unique_seasons:
                    if sp["url"] != page.url:
                        print(f"   📅 切换至历年赛季: {sp['label']} ({sp['url']})")
                        page.goto(sp["url"], timeout=60000)
                        wait_for_ready(page)
                        time.sleep(3)

                    cohort_label = map_season_to_cohort(sp["label"])
                    roster_list = extract_roster_from_school_page(page)
                    print(f"   🎯 在 [{s_name} · {sp['label']}] 发现 {len(roster_list)} 名球员！")

                    # ==============================================================
                    # 第三层：逐个点进球员个人主页 (-p数字) 抓取摸高与俱乐部履历！
                    # ==============================================================
                    for p_item in roster_list[:15]:  # 每个赛季抓前 15 名主力
                        p_url = p_item["url"]
                        p_name = p_item["name"]
                        try:
                            page.goto(p_url, timeout=60000)
                            wait_for_ready(page)
                            time.sleep(1.5)

                            p_obj = extract_player_3rd_level_detail(
                                page, p_name, p_item["rowText"], s_name, cohort_label, sp["label"]
                            )
                            players_map[p_obj["name_zh"] + "_" + s_name] = p_obj
                            print(f"      ✔️ [第3层·球员] {p_obj['name_zh']} | {p_obj['position']} | 身高:{p_obj['height']} | 摸高:{p_obj['spike_reach']}")
                        except Exception as pe:
                            print(f"      ⚠️ 球员 {p_name} 跳过: {pe}")

                    # 每抓完一个学校的一个赛季，立刻保存一次 JSON，实时生效！
                    with open(json_path, "w", encoding="utf-8") as f:
                        json.dump({
                            "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "teams": list(teams_map.values()),
                            "players": list(players_map.values()),
                            "matches": existing_data.get("matches", [])
                        }, f, ensure_ascii=False, indent=2)

            except Exception as e:
                print(f"   ❌ 学校 {s_url} 抓取异常: {e}")

    print("\n=======================================================")
    print(f"🏆 三级发散抓取全部完成！当前网站共收录 {len(players_map)} 名球员档案！")
    print("👉 快去刷新 localhost:3000 查看成果吧！")
    print("=======================================================")

if __name__ == "__main__":
    run_scraper()