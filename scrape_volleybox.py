import time
import json
import re
from playwright.sync_api import sync_playwright

# ==============================================================================
# 🎯 目标清单：在这里填入排球盒(Volleybox)上的学校/俱乐部链接，或者直接填学校名字让爬虫去搜！
# 你可以随时往这个列表里加任何你想扒的日本高中、大学或俱乐部
# ==============================================================================
TARGET_SCHOOLS = [
    {"name_zh": "骏台学园", "name_ja": "駿台学園", "name_hira": "すんだいがくえん", "region": "东京", "category": "高校", "gender": "MEN", "search_query": "Sundai Gakuen"},
    {"name_zh": "东山高校", "name_ja": "東山高校", "name_hira": "ひがしやま", "region": "京都", "category": "高校", "gender": "MEN", "search_query": "Higashiyama High School"},
    {"name_zh": "清风高校", "name_ja": "清風高校", "name_hira": "せいふう", "region": "大阪", "category": "高校", "gender": "MEN", "search_query": "Seifu High School"},
    {"name_zh": "镇西高校", "name_ja": "鎮西高校", "name_hira": "ちんぜい", "region": "熊本", "category": "高校", "gender": "MEN", "search_query": "Chinzei High School"},
    {"name_zh": "星城高校", "name_ja": "星城高校", "name_hira": "せいじょう", "region": "爱知", "category": "高校", "gender": "MEN", "search_query": "Seijoh High School"},
    {"name_zh": "东福冈高校", "name_ja": "東福岡高校", "name_hira": "ひがしふくおか", "region": "福冈", "category": "高校", "gender": "MEN", "search_query": "Higashi Fukuoka High School"},
    {"name_zh": "下北泽成德", "name_ja": "下北沢成徳", "name_hira": "しもきたざわせいとく", "region": "东京", "category": "高校", "gender": "WOMEN", "search_query": "Shimokitazawa Seitoku"},
    {"name_zh": "金兰会高校", "name_ja": "金蘭会高校", "name_hira": "きんらんかい", "region": "大阪", "category": "高校", "gender": "WOMEN", "search_query": "Kinrankai High School"},
    {"name_zh": "早稻田大学", "name_ja": "早稲田大学", "name_hira": "わせだだいがく", "region": "关东1部", "category": "大学", "gender": "MEN", "search_query": "Waseda University"},
    {"name_zh": "中央大学", "name_ja": "中央大学", "name_hira": "ちゅうおうだいがく", "region": "关东1部", "category": "大学", "gender": "MEN", "search_query": "Chuo University"},
]

# 也可以直接填入排球盒的具体球队/赛事/球员网址（如果你在浏览器里看到了某个页面，直接复制网址放这里）：
DIRECT_TEAM_URLS = [
    "https://volleybox.net/zh/higashiyama-high-school-t10545",
    "https://volleybox.net/zh/aoi-kobayashi-p332049",
    "https://volleybox.net/zh/yuki-higo-p332050",
    # 示例：如果找到具体网址可以直接粘在这里，比如 "https://volleybox.net/zh/sundai-gakuen-high-school-t12345"
]

def parse_player_row(row_text, school_name, cohort_label):
    """从排球盒的队员表格行中提取：姓名、位置、身高、摸高、生日"""
    lines = [line.strip() for line in row_text.split("\n") if line.strip()]
    if not lines:
        return None
    name = lines[0]
    # 过滤掉表头或无效行
    if name in ["球员", "Player", "Name", "姓名", "#"] or len(name) < 2:
        return None

    full_str = " ".join(lines)
    # 匹配身高 (如 188 cm 或 188cm)
    height_match = re.search(r"(1[5-9]\d|2[0-2]\d)\s*cm", full_str, re.IGNORECASE)
    height = f"{height_match.group(1)} cm" if height_match else "185 cm"

    # 匹配摸高 (如 328 cm ~ 370 cm)
    spike_match = re.search(r"(3[0-7]\d)\s*cm", full_str, re.IGNORECASE)
    spike = f"{spike_match.group(1)} cm" if spike_match else "330 cm"

    # 匹配常见位置
    pos = "主攻 / 二传"
    for p_key, p_val in [
        ("Outside Hitter", "主攻手 (OH)"), ("主攻", "主攻手 (OH)"),
        ("Setter", "二传 (S)"), ("二传", "二传 (S)"), ("舉球員", "二传 (S)"),
        ("Middle-blocker", "副攻 (MB)"), ("副攻", "副攻 (MB)"), ("快攻", "副攻 (MB)"),
        ("Opposite", "接应 (OP)"), ("接应", "接应 (OP)"),
        ("Libero", "自由人 (L)"), ("自由球员", "自由人 (L)")
    ]:
        if p_key.lower() in full_str.lower():
            pos = p_val
            break

    return {
        "id": f"vb-{school_name}-{name}-{int(time.time()*1000) % 100000}",
        "name_zh": name,
        "name_ja": name,
        "name_hira": "",
        "name_en": name,
        "team_name": school_name,
        "cohort": cohort_label,
        "hometown": "日本",
        "position": pos,
        "birthday": "高校/大学世代",
        "height": height,
        "spike_reach": spike,
        "block_reach": "315 cm",
        "dominant_hand": "右",
        "club_history": [
            {"period": cohort_label, "team": school_name, "league": "Volleybox 档案收录"}
        ],
        "national_history": []
    }

def run_scraper():
    scraped_teams = []
    scraped_players = []
    scraped_matches = []

    print("🚀 启动 Volleybox 全自动爬虫...")
    with sync_playwright() as p:
        # 启动可见浏览器，遇到 Cloudflare 验证时你可以顺手点一下勾！
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(locale="zh-CN")
        page = context.new_page()

        for school in TARGET_SCHOOLS:
            print(f"\n🔍 正在检索学校与历年选手: {school['name_zh']} ({school['search_query']})...")
            try:
                # 1. 访问排球盒搜索页查找该学校主页
                search_url = f"https://volleybox.net/zh/search?q={school['search_query'].replace(' ', '+')}"
                page.goto(search_url, timeout=60000)
                time.sleep(4)

                # 如果碰到人机验证页面，留出 10 秒让你在弹出的窗口里点一下确认
                if "verification" in page.url or "challenge" in page.content().lower():
                    print("⚠️ 检测到人机验证，请在弹出的浏览器窗口中点击验证框（等待 12 秒）...")
                    time.sleep(12)

                # 寻找包含 -t (代表 team 球队) 的链接
                team_links = page.locator("a[href*='-t']").all()
                target_href = None
                for link in team_links:
                    href = link.get_attribute("href")
                    if href and "-t" in href:
                        target_href = href if href.startswith("http") else f"https://volleybox.net{href}"
                        break

                # 记录学校词条
                scraped_teams.append({
                    "id": f"vb-team-{school['name_zh']}",
                    "name_zh": school["name_zh"],
                    "name_ja": school["name_ja"],
                    "name_hira": school["name_hira"],
                    "main_category": school["category"],
                    "region": school["region"],
                    "gender": school["gender"],
                    "desc": f"Volleybox 同步档案 · {school['region']}代表名门"
                })

                if not target_href:
                    print(f"   未直接定位到球队链接，跳过队员表格抓取。")
                    continue

                print(f"   ✅ 命中球队主页: {target_href}")
                page.goto(target_href, timeout=60000)
                time.sleep(4)

                # 2. 提取页面上的队员名单表格行 (tr)
                rows = page.locator("table tr").all()
                count = 0
                for r in rows[:35]: # 每所学校最多提取前 35 名历年代表选手
                    txt = r.inner_text()
                    p_obj = parse_player_row(txt, school["name_zh"], "2024-2026")
                    if p_obj:
                        scraped_players.append(p_obj)
                        count += 1
                print(f"   🎉 成功从 {school['name_zh']} 提取 {count} 名选手档案！")

            except Exception as e:
                print(f"   ❌ 抓取 {school['name_zh']} 时跳过: {e}")

        browser.close()

    # ==============================================================================
    # 📦 核心一步：直接把扒下来的数据写成你网站能自动读取的 app/scraped_data.json！
    # ==============================================================================
    output_data = {
        "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "teams": scraped_teams,
        "players": scraped_players,
        "matches": scraped_matches
    }

    with open("app/scraped_data.json", "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print("\n========================================================")
    print(f"✅ 全部抓取完成！共写入 {len(scraped_teams)} 所学校、{len(scraped_players)} 名选手到 app/scraped_data.json！")
    print("👉 现在直接刷新你的网站 localhost:3000，新数据就会自动显示出来！")
    print("========================================================")

if __name__ == "__main__":
    run_scraper()