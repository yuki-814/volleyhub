"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import scrapedData from "./scraped_data.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// 预置管理员账号密码
const ADMIN_ACCOUNTS = ["admin", "inukai"];
const ADMIN_PASS = "volley2026";

// ==================== 1. 春高各轮次 + IH + 大学联赛数据库 ====================
const INITIAL_MATCHES = [
  // 2026 春高 · 決勝
  { id: "hk26-f-w", main_category: "高校", tournament: "春高", year: "2026", round: "決勝", date_label: "2026年1月11日(日)", time: "11時00分", court: "特設コート", gender: "Women", home_team: "金蘭会", home_hira: "きんらんかい", home_pref: "大阪", away_team: "就実", away_hira: "しゅうじつ", away_pref: "岡山", home_sets: 3, away_sets: 1, sets: ["25 - 20", "29 - 27", "20 - 25", "28 - 26"] },
  { id: "hk26-f-m", main_category: "高校", tournament: "春高", year: "2026", round: "決勝", date_label: "2026年1月11日(日)", time: "13時30分", court: "特設コート", gender: "Men", home_team: "清風", home_hira: "せいふう", home_pref: "大阪", away_team: "東山", away_hira: "ひがしやま", away_pref: "京都", home_sets: 0, away_sets: 3, sets: ["21 - 25", "19 - 25", "17 - 25"] },
  // 2026 春高 · 準決勝
  { id: "hk26-sf-w1", main_category: "高校", tournament: "春高", year: "2026", round: "準決勝", date_label: "2026年1月10日(土)", time: "10時00分", court: "特設コート", gender: "Women", home_team: "金蘭会", home_hira: "きんらんかい", home_pref: "大阪", away_team: "東九州龍谷", away_hira: "ひがしきゅうしゅうりゅうこく", away_pref: "大分", home_sets: 3, away_sets: 2, sets: ["23 - 25", "25 - 17", "18 - 25", "25 - 22", "16 - 14"] },
  { id: "hk26-sf-w2", main_category: "高校", tournament: "春高", year: "2026", round: "準決勝", date_label: "2026年1月10日(土)", time: "12時00分", court: "特設コート", gender: "Women", home_team: "大阪国際", home_hira: "おおさかこくさい", home_pref: "大阪", away_team: "就実", away_hira: "しゅうじつ", away_pref: "岡山", home_sets: 0, away_sets: 3, sets: ["23 - 25", "19 - 25", "18 - 25"] },
  { id: "hk26-sf-m1", main_category: "高校", tournament: "春高", year: "2026", round: "準決勝", date_label: "2026年1月10日(土)", time: "14時15分", court: "特設コート", gender: "Men", home_team: "雄物川", home_hira: "おものがわ", home_pref: "秋田", away_team: "東山", away_hira: "ひがしやま", away_pref: "京都", home_sets: 0, away_sets: 3, sets: ["19 - 25", "19 - 25", "17 - 25"] },
  { id: "hk26-sf-m2", main_category: "高校", tournament: "春高", year: "2026", round: "準決勝", date_label: "2026年1月10日(土)", time: "16時15分", court: "特設コート", gender: "Men", home_team: "駿台学園", home_hira: "すんだいがくえん", home_pref: "東京", away_team: "清風", away_hira: "せいふう", away_pref: "大阪", home_sets: 2, away_sets: 3, sets: ["23 - 25", "25 - 23", "21 - 25", "25 - 19", "13 - 15"] },
  // 2026 春高 · 準々決勝
  { id: "hk26-qf-1", main_category: "高校", tournament: "春高", year: "2026", round: "準々決勝", date_label: "2026年1月8日(木)", time: "14時30分", court: "Aコート", gender: "Women", home_team: "金蘭会", home_hira: "きんらんかい", home_pref: "大阪", away_team: "熊本信愛女", away_hira: "くまもとしんあいじょ", away_pref: "熊本", home_sets: 2, away_sets: 0, sets: ["25 - 18", "25 - 11"] },
  { id: "hk26-qf-2", main_category: "高校", tournament: "春高", year: "2026", round: "準々決勝", date_label: "2026年1月8日(木)", time: "14時30分", court: "Bコート", gender: "Men", home_team: "駿台学園", home_hira: "すんだいがくえん", home_pref: "東京", away_team: "福井工大福井", away_hira: "ふくいこうだいふくい", away_pref: "福井", home_sets: 2, away_sets: 1, sets: ["22 - 25", "25 - 16", "25 - 18"] },
  { id: "hk26-qf-3", main_category: "高校", tournament: "春高", year: "2026", round: "準々決勝", date_label: "2026年1月8日(木)", time: "14時30分", court: "Cコート", gender: "Men", home_team: "東山", home_hira: "ひがしやま", home_pref: "京都", away_team: "鎮西", away_hira: "ちんぜい", away_pref: "熊本", home_sets: 2, away_sets: 0, sets: ["25 - 21", "29 - 27"] },
  { id: "hk26-qf-4", main_category: "高校", tournament: "春高", year: "2026", round: "準々決勝", date_label: "2026年1月8日(木)", time: "14時30分", court: "Dコート", gender: "Women", home_team: "八王子実践", home_hira: "はちおうじじっせん", home_pref: "東京", away_team: "就実", away_hira: "しゅうじつ", away_pref: "岡山", home_sets: 0, away_sets: 2, sets: ["16 - 25", "16 - 25"] },
  // 2026 春高 · 3回戦
  { id: "hk26-r3-1", main_category: "高校", tournament: "春高", year: "2026", round: "3回戦", date_label: "2026年1月8日(木)", time: "10時00分", court: "Aコート", gender: "Women", home_team: "金蘭会", home_hira: "きんらんかい", home_pref: "大阪", away_team: "誠英", away_hira: "せいえい", away_pref: "山口", home_sets: 2, away_sets: 0, sets: ["25 - 16", "25 - 13"] },
  { id: "hk26-r3-2", main_category: "高校", tournament: "春高", year: "2026", round: "3回戦", date_label: "2026年1月8日(木)", time: "10時00分", court: "Bコート", gender: "Men", home_team: "駿台学園", home_hira: "すんだいがくえん", home_pref: "東京", away_team: "日本航空", away_hira: "にほんこうくう", away_pref: "山梨", home_sets: 2, away_sets: 0, sets: ["25 - 16", "25 - 21"] },
  { id: "hk26-r3-3", main_category: "高校", tournament: "春高", year: "2026", round: "3回戦", date_label: "2026年1月8日(木)", time: "10時00分", court: "Cコート", gender: "Men", home_team: "川内商工", home_hira: "せんだいしょうこう", home_pref: "鹿児島", away_team: "福井工大福井", away_hira: "ふくいこうだいふくい", away_pref: "福井", home_sets: 1, away_sets: 2, sets: ["31 - 29", "22 - 25", "21 - 25"] },
  { id: "hk26-r3-4", main_category: "高校", tournament: "春高", year: "2026", round: "3回戦", date_label: "2026年1月8日(木)", time: "10時00分", court: "Dコート", gender: "Women", home_team: "福井工大福井", home_hira: "ふくいこうだいふくい", home_pref: "福井", away_team: "熊本信愛女", away_hira: "くまもとしんあいじょ", away_pref: "熊本", home_sets: 0, away_sets: 2, sets: ["18 - 25", "26 - 28"] },
  // 2026 春高 · 2回戦
  { id: "hk26-r2-1", main_category: "高校", tournament: "春高", year: "2026", round: "2回戦", date_label: "2026年1月6日(火)", time: "14時30分", court: "Aコート", gender: "Women", home_team: "福岡女学院", home_hira: "ふくおかじょがくいん", home_pref: "福岡", away_team: "文京学院大女", away_hira: "ぶんきょうがくいんだいじょ", away_pref: "東京", home_sets: 0, away_sets: 2, sets: ["16 - 25", "21 - 25"] },
  { id: "hk26-r2-2", main_category: "高校", tournament: "春高", year: "2026", round: "2回戦", date_label: "2026年1月6日(火)", time: "14時30分", court: "Bコート", gender: "Men", home_team: "静清", home_hira: "せいせい", home_pref: "静岡", away_team: "東亜学園", away_hira: "とうあがくえん", away_pref: "東京", home_sets: 2, away_sets: 1, sets: ["25 - 23", "20 - 25", "26 - 24"] },
  { id: "hk26-r2-3", main_category: "高校", tournament: "春高", year: "2026", round: "2回戦", date_label: "2026年1月6日(火)", time: "14時30分", court: "Cコート", gender: "Men", home_team: "愛工大名電", home_hira: "あいこうだいめいでん", home_pref: "愛知", away_team: "鎮西", away_hira: "ちんぜい", away_pref: "熊本", home_sets: 1, away_sets: 2, sets: ["12 - 25", "25 - 19", "16 - 25"] },
  { id: "hk26-r2-4", main_category: "高校", tournament: "春高", year: "2026", round: "2回戦", date_label: "2026年1月6日(火)", time: "14時30分", court: "Dコート", gender: "Women", home_team: "京都橘", home_hira: "きょうとたちばな", home_pref: "京都", away_team: "就実", away_hira: "しゅうじつ", away_pref: "岡山", home_sets: 0, away_sets: 2, sets: ["17 - 25", "16 - 25"] },
  // 2026 春高 · 1回戦
  { id: "hk26-r1-1", main_category: "高校", tournament: "春高", year: "2026", round: "1回戦", date_label: "2026年1月5日(月)", time: "10時00分", court: "Aコート", gender: "Women", home_team: "福井工大福井", home_hira: "ふくいこうだいふくい", home_pref: "福井", away_team: "高崎女", away_hira: "たかさきじょ", away_pref: "群馬", home_sets: 2, away_sets: 0, sets: ["25 - 11", "25 - 18"] },
  { id: "hk26-r1-2", main_category: "高校", tournament: "春高", year: "2026", round: "1回戦", date_label: "2026年1月5日(月)", time: "10時00分", court: "Bコート", gender: "Men", home_team: "東洋", home_hira: "とうよう", home_pref: "東京", away_team: "開智", away_hira: "かいち", away_pref: "和歌山", home_sets: 2, away_sets: 0, sets: ["25 - 14", "25 - 23"] },
  { id: "hk26-r1-3", main_category: "高校", tournament: "春高", year: "2026", round: "1回戦", date_label: "2026年1月5日(月)", time: "10時00分", court: "Cコート", gender: "Men", home_team: "静清", home_hira: "せいせい", home_pref: "静岡", away_team: "鳥取中央育英", away_hira: "とっとりちゅうおういくえい", away_pref: "鳥取", home_sets: 2, away_sets: 0, sets: ["25 - 22", "33 - 31"] },
  { id: "hk26-r1-4", main_category: "高校", tournament: "春高", year: "2026", round: "1回戦", date_label: "2026年1月5日(月)", time: "10時00分", court: "Dコート", gender: "Women", home_team: "京都橘", home_hira: "きょうとたちばな", home_pref: "京都", away_team: "豊川", away_hira: "とよかわ", away_pref: "愛知", home_sets: 2, away_sets: 0, sets: ["25 - 19", "25 - 9"] },
  // 2025 & 2024 春高 / IH / 国体 / 大学
  { id: "hk25-f-m", main_category: "高校", tournament: "春高", year: "2025", round: "決勝", date_label: "2025年1月12日(日)", time: "11時30分", court: "特設コート", gender: "Men", home_team: "駿台学園", home_hira: "すんだいがくえん", home_pref: "東京", away_team: "東福岡", away_hira: "ひがしふくおか", away_pref: "福岡", home_sets: 3, away_sets: 0, sets: ["25 - 21", "25 - 22", "25 - 17"] },
  { id: "ih25-f-m", main_category: "高校", tournament: "IH", year: "2025", round: "決勝", date_label: "2025年8月4日", time: "11時00分", court: "特設コート", gender: "Men", home_team: "駿台学園", home_hira: "すんだいがくえん", home_pref: "東京", away_team: "東福岡", away_hira: "ひがしふくおか", away_pref: "福岡", home_sets: 3, away_sets: 1, sets: ["25 - 22", "23 - 25", "25 - 18", "25 - 19"] },
  { id: "uv25-all", main_category: "大学", tournament: "全日", year: "2025", round: "男子決勝", date_label: "2025年12月1日", time: "14時00分", court: "特設コート", gender: "Men", home_team: "早稲田大学", home_hira: "わせだだいがく", home_pref: "関東1部", away_team: "順天堂大学", away_hira: "じゅんてんどうだいがく", away_pref: "関東1部", home_sets: 3, away_sets: 1, sets: ["25 - 20", "22 - 25", "25 - 19", "25 - 21"] },
];

// ==================== 2. 45+ 都道府县代表校与大学/俱乐部名录 ====================
const INITIAL_TEAMS = [
  { id: "hs-tk1", name_zh: "骏台学园", name_ja: "駿台学園", name_hira: "すんだいがくえん", main_category: "高校", region: "东京", gender: "MEN", desc: "2023-2025春高三连霸・2026春高第3位" },
  { id: "hs-tk2", name_zh: "东亚学园", name_ja: "東亜学園", name_hira: "とうあがくえん", main_category: "高校", region: "东京", gender: "MEN", desc: "2024/2025/2026春高东京代表" },
  { id: "hs-ky1", name_zh: "东山高校", name_ja: "東山", name_hira: "ひがしやま", main_category: "高校", region: "京都", gender: "MEN", desc: "🏆 2026第78回春高全国优胜" },
  { id: "hs-os1", name_zh: "清风高校", name_ja: "清風", name_hira: "せいふう", main_category: "高校", region: "大阪", gender: "MEN", desc: "🥈 2026第78回春高男子准优胜" },
  { id: "hs-os4", name_zh: "金兰会高校", name_ja: "金蘭会", name_hira: "きんらんかい", main_category: "高校", region: "大阪", gender: "WOMEN", desc: "🏆 2026第78回春高女子全国优胜" },
  { id: "hs-km1", name_zh: "镇西高校", name_ja: "鎮西", name_hira: "ちんぜい", main_category: "高校", region: "熊本", gender: "MEN", desc: "2024/2025/2026春高熊本代表・八强" },
  { id: "hs-tk5", name_zh: "下北泽成德", name_ja: "下北沢成徳", name_hira: "しもきたざわせいとく", main_category: "高校", region: "东京", gender: "WOMEN", desc: "2026春高出场・女排传统豪门" },
  { id: "uv-1", name_zh: "早稻田大学", name_ja: "早稲田大学", name_hira: "わせだだいがく", main_category: "大学", region: "关东1部", gender: "MEN", desc: "全日本インカレ多冠王" },
  { id: "cl-1", name_zh: "三得利太阳鸟大阪", name_ja: "サントリーサンバーズ大阪", name_hira: "さんとりーさんばーずおおさか", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE", city: "大阪", stars: "高桥蓝、小野寺太志、穆塞尔斯基" },
  { id: "cl-6", name_zh: "佩鲁贾 (Perugia)", name_ja: "シル・サフェーティ・ペルージャ", name_hira: "ぺるーじゃ", main_category: "职业俱乐部", country: "意大利 (Serie A1)", league: "意大利超级联赛", city: "佩鲁贾", stars: "石川祐希、詹内利、塞梅纽克" },
];

// ==================== 3. 「其他」板块：天皇杯 & U21 / U19 数据 ====================
const OTHER_TOURNAMENTS_DATA: { [key: string]: any } = {
  "天皇杯・皇后杯": {
    type: "cup",
    desc: "全日本排球选手权大会（高中、大学、SV.LEAGUE职业俱乐部跨界同场竞技）",
    schedule: [
      { date: "2025-12-12", round: "1回戦 (学界德比)", venue: "大阪 Asue アリーナ", match: "駿台学園 (高校王者) vs 近畿大学 (大学代表)", note: "高中生越级挑战大学生" },
      { date: "2025-12-13", round: "2回戦 (跨界焦点)", venue: "大阪 Asue アリーナ", match: "早稲田大学 (大学王者) vs ヴォレアス北海道 (SV俱乐部)", note: "大学冠军挑战职业队" },
      { date: "2025-12-21", round: "決勝 (FINAL)", venue: "大阪 Asue アリーナ", match: "サントリーサンバーズ大阪 vs 大阪ブルテオン", note: "天皇杯年度决胜战" },
    ],
    scores: [
      { id: "tk-1", round: "男子決勝", date: "2025-12-21", home: "サントリーサンバーズ大阪", home_cat: "SV俱乐部", away: "大阪ブルテオン", away_cat: "SV俱乐部", score: "3 : 0", sets: "25-22, 25-20, 25-23" },
      { id: "tk-2", round: "2回戦 (跨界焦点)", date: "2025-12-13", home: "早稲田大学", home_cat: "大学代表", away: "ヴォレアス北海道", away_cat: "SV俱乐部", score: "3 : 2", sets: "25-23, 21-25, 25-22, 22-25, 15-13" },
    ],
  },
  "U21": {
    type: "youth",
    desc: "U21 青年代表队（大学低年级与高中毕业生成长舞台）",
    schedule: [
      { date: "2025-08-21", round: "小组赛 R1", venue: "第1球场", match: "日本 U21 vs 巴西 U21", note: "3 - 1 (25-22, 23-25, 25-20, 25-19)" },
    ],
    roster: [
      { id: "u21-1", name_zh: "川野琢磨", name_ja: "川野 琢磨", name_hira: "かわの たくま", pos: "OH (主攻)", height: "197 cm", spike: "347 cm", school: "早稻田大学 (原骏台学园)", grade: "大1" },
    ],
  },
};

// ==================== 4. 选手档案库 ====================
const INITIAL_PLAYERS = [
  { id: "p-iwata", name_zh: "岩田怜纬", name_ja: "岩田 怜緯", name_hira: "いわた れい", name_en: "Rei Iwata", team_name: "东山高校", cohort: "2024-2026", hometown: "日本 · 京都府", position: "主攻手 (OH)", birthday: "2008年", height: "189 cm", weight: "76 kg", spike_reach: "338 cm", block_reach: "320 cm", dominant_hand: "右", club_history: [{ period: "2024 - 2027", team: "东山高校 (ひがしやま)", league: "2026第78回春高全国优胜 & MVP" }], national_history: [{ period: "2025 - 2026", team: "日本 U19 代表", tournaments: ["U19锦标赛", "第78回春高MVP"] }] },
  { id: "p2", name_zh: "川野琢磨", name_ja: "川野 琢磨", name_hira: "かわの たくま", name_en: "Takuma Kawano", team_name: "骏台学园 / 早稻田大学", cohort: "2023-2025", hometown: "日本 · 东京都", position: "主攻手 (OH)", birthday: "2006年10月25日", height: "197 cm", weight: "82 kg", spike_reach: "347 cm", block_reach: "330 cm", dominant_hand: "右", club_history: [{ period: "2022 - 2025", team: "骏台学园 (すんだいがくえん)", league: "2025春高三连霸王牌" }, { period: "2025 -", team: "早稻田大学 (わせだだいがく)", league: "关东大学1部联赛" }], national_history: [{ period: "2025", team: "日本 U21 代表", tournaments: ["U21青年锦标赛"] }] },
  { id: "p4", name_zh: "石川祐希", name_ja: "石川 祐希", name_hira: "いしかわ ゆうき", name_en: "Yuki Ishikawa", team_name: "佩鲁贾 (Perugia) / 中央大学 / 星城高校", cohort: "历届知名校友", hometown: "日本 · 爱知县冈崎市", position: "主攻手 (OH)", birthday: "1995年12月11日", height: "192 cm", weight: "90 kg", spike_reach: "351 cm", block_reach: "327 cm", dominant_hand: "右", club_history: [{ period: "2024 - 2026", team: "Sir Sicoma Monini Perugia (佩鲁贾)", league: "意大利超级联赛" }], national_history: [{ period: "2021 - 2026", team: "日本国家男子排球队 (队长)", tournaments: ["2024 巴黎奥运会", "VNL 银牌"] }] },
];

// ==================== 5. 豆瓣论坛示范帖子 ====================
const INITIAL_POSTS = [
  {
    id: "db-1",
    category: "春高/高中",
    isEssence: true,
    title: "2026第78回春高男排决赛：京都东山 3-0 完胜大阪清风，时隔6年重夺全国优胜！",
    author: "京都排球速报",
    lastReplyTime: "11-03 12:12",
    likes: 86,
    liked: false,
    content: "半决赛清风五局绝杀骏台学园终结四连霸悬念，决赛上演关西德比！东山王牌岩田怜纬（いわた れい）进攻成功率极高，直落三局拿下第78回春高优胜！",
    comments: [
      { id: "c1", author: "春高老粉", content: "清风今年1年级的西村海司也很猛，明年绝对是夺冠热门！", time: "11-03 12:05", likes: 19, liked: false },
    ],
  },
];

export default function Home() {
  const [lang, setLang] = useState<"ZH" | "JA" | "EN">("ZH");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // 权限与弹窗
  const [currentUser, setCurrentUser] = useState<{ username: string; role: "admin" | "user" } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [mainTab, setMainTab] = useState<string>("首页");
  const [subTab, setSubTab] = useState<"赛事" | "学校">("赛事");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedTournament, setSelectedTournament] = useState<string>("春高");
  const [selectedRound, setSelectedRound] = useState<string>("1回戦");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "Men" | "Women">("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("东京");
  const [selectedCountry, setSelectedCountry] = useState<string>("日本 (SV.LEAGUE)");

  const [otherPrimaryTab, setOtherPrimaryTab] = useState<string>("天皇杯・皇后杯");
  const [otherSubTab, setOtherSubTab] = useState<"赛程" | "比分" | "入选选手">("赛程");

  const [activeSchool, setActiveSchool] = useState<any | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<string>("2024-2026");
  const [activePlayer, setActivePlayer] = useState<any | null>(null);

  const [posts, setPosts] = useState<any[]>(INITIAL_POSTS);
  const [forumCategory, setForumCategory] = useState<string>("全部");
  const [forumSort, setForumSort] = useState<"recent" | "hot" | "essence">("recent");
  const [showPostForm, setShowPostForm] = useState<boolean>(false);
  const [newPostCategory, setNewPostCategory] = useState<string>("春高/高中");
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const [teams] = useState<any[]>([...INITIAL_TEAMS, ...((scrapedData as any).teams || [])]);
  const [players] = useState<any[]>([...INITIAL_PLAYERS, ...((scrapedData as any).players || [])]);
  const [matches] = useState<any[]>([...INITIAL_MATCHES, ...((scrapedData as any).matches || [])]);

  // ==================== 云端后台同步 ====================
  const fetchCloudPosts = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      if (data.length === 0) {
        const seedRows = INITIAL_POSTS.map((p) => ({
          id: p.id,
          category: p.category,
          is_essence: p.isEssence,
          title: p.title,
          author: p.author,
          last_reply_time: p.lastReplyTime,
          likes: p.likes,
          content: p.content,
          comments: p.comments || [],
        }));
        await supabase.from("forum_posts").upsert(seedRows);
        setPosts(INITIAL_POSTS);
      } else {
        const mapped = data.map((row: any) => ({
          id: row.id,
          category: row.category,
          isEssence: row.is_essence,
          title: row.title,
          author: row.author,
          lastReplyTime: row.last_reply_time,
          likes: row.likes || 0,
          liked: false,
          content: row.content,
          comments: row.comments || [],
        }));
        setPosts(mapped);
      }
    }
  };

  useEffect(() => {
    fetchCloudPosts();
    const savedSession = localStorage.getItem("volleyhub_current_user");
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {}
    }
  }, []);

  const handleAuthSubmit = async () => {
    setAuthError("");
    const uname = authUsername.trim();
    const pwd = authPassword.trim();

    if (!uname || !pwd) {
      setAuthError("请输入用户名和密码！");
      return;
    }

    if (ADMIN_ACCOUNTS.includes(uname.toLowerCase())) {
      if (pwd === ADMIN_PASS) {
        const adminUser = { username: uname, role: "admin" as const };
        setCurrentUser(adminUser);
        localStorage.setItem("volleyhub_current_user", JSON.stringify(adminUser));
        setShowAuthModal(false);
        setAuthUsername("");
        setAuthPassword("");
        return;
      } else {
        setAuthError("管理员密码错误！");
        return;
      }
    }

    if (supabase) {
      if (authMode === "register") {
        const { data: exist } = await supabase.from("app_users").select("*").eq("username", uname).maybeSingle();
        if (exist) {
          setAuthError("该用户名已被抢注，请换个名字或直接登录！");
          return;
        }
        const { error: insertErr } = await supabase
          .from("app_users")
          .insert([{ username: uname, password: pwd, role: "user" }]);
        if (insertErr) {
          setAuthError("云端注册失败，请检查是否已在 Supabase 运行建表 SQL！");
          return;
        }
        const normalUser = { username: uname, role: "user" as const };
        setCurrentUser(normalUser);
        localStorage.setItem("volleyhub_current_user", JSON.stringify(normalUser));
        setShowAuthModal(false);
      } else {
        const { data: userRow } = await supabase.from("app_users").select("*").eq("username", uname).maybeSingle();
        if (!userRow) {
          setAuthError("账号不存在，请先点击「新用户注册」！");
          return;
        }
        if (userRow.password !== pwd) {
          setAuthError("密码不正确，请重新输入！");
          return;
        }
        const loggedUser = { username: userRow.username, role: (userRow.role === "admin" ? "admin" : "user") as "admin" | "user" };
        setCurrentUser(loggedUser);
        localStorage.setItem("volleyhub_current_user", JSON.stringify(loggedUser));
        setShowAuthModal(false);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("volleyhub_current_user");
  };

  const publishPost = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (!newPostTitle.trim()) {
      alert("请输入讨论标题后再发布！");
      return;
    }
    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newId = "db-" + Date.now();

    const createdUI = {
      id: newId,
      category: newPostCategory,
      isEssence: false,
      title: newPostTitle.trim(),
      author: currentUser.username,
      lastReplyTime: timeStr,
      likes: 0,
      liked: false,
      content: newPostContent.trim() || newPostTitle.trim(),
      comments: [],
    };

    setPosts([createdUI, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowPostForm(false);
    setForumCategory("全部");
    setActivePostId(newId);

    if (supabase) {
      await supabase.from("forum_posts").insert([
        {
          id: newId,
          category: createdUI.category,
          is_essence: false,
          title: createdUI.title,
          author: createdUI.author,
          last_reply_time: timeStr,
          likes: 0,
          content: createdUI.content,
          comments: [],
        },
      ]);
    }
  };

  const canDeleteItem = (authorName: string) => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    return currentUser.username === authorName;
  };

  const handleDeletePost = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(posts.filter((p) => p.id !== postId));
    if (activePostId === postId) setActivePostId(null);
    if (supabase) {
      await supabase.from("forum_posts").delete().eq("id", postId);
    }
  };

  const handleToggleEssence = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.role !== "admin") return;
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const nextEssence = !target.isEssence;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, isEssence: nextEssence } : p)));
    if (supabase) {
      await supabase.from("forum_posts").update({ is_essence: nextEssence }).eq("id", postId);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const nextComments = (target.comments || []).filter((c: any) => c.id !== commentId);
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: nextComments } : p)));
    if (supabase) {
      await supabase.from("forum_posts").update({ comments: nextComments }).eq("id", postId);
    }
  };

  const handleTogglePostLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const nextLiked = !target.liked;
    const nextLikes = nextLiked ? target.likes + 1 : target.likes - 1;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, liked: nextLiked, likes: nextLikes } : p)));
    if (supabase) {
      await supabase.from("forum_posts").update({ likes: nextLikes }).eq("id", postId);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const nextComments = [
      ...(target.comments || []),
      { id: "c-" + Date.now(), author: currentUser.username, content: text, time: timeStr, likes: 0, liked: false },
    ];

    setPosts(posts.map((p) => (p.id === postId ? { ...p, lastReplyTime: timeStr, comments: nextComments } : p)));
    setCommentInputs({ ...commentInputs, [postId]: "" });
    if (supabase) {
      await supabase.from("forum_posts").update({ comments: nextComments, last_reply_time: timeStr }).eq("id", postId);
    }
  };

  const getName = (item: any) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (lang === "JA") return item.name_ja || item.name_zh || item.name;
    if (lang === "EN") return item.name_en || item.name_zh || item.name;
    return item.name_zh || item.name || item.name_ja;
  };

  const handleMainNav = (tab: string) => {
    setMainTab(tab);
    setActiveSchool(null);
    setActivePlayer(null);
    if (tab === "高校") {
      setSubTab("赛事");
      setSelectedYear("2026");
      setSelectedTournament("春高");
      setSelectedRound("1回戦");
      setSelectedRegion("东京");
    } else if (tab === "大学") {
      setSubTab("赛事");
      setSelectedYear("2025");
      setSelectedTournament("ALL");
      setSelectedRegion("关东1部");
    } else if (tab === "职业俱乐部") {
      setSelectedCountry("日本 (SV.LEAGUE)");
    } else if (tab === "其他") {
      setOtherPrimaryTab("天皇杯・皇后杯");
      setOtherSubTab("赛程");
    }
  };

  const getTournamentOptions = () => {
    if (mainTab === "高校") {
      return [
        { value: "春高", label: "春高 (Haruko)" },
        { value: "IH", label: "IH (インターハイ)" },
        { value: "国体", label: "国体 (国民スポーツ大会)" },
        { value: "全明星", label: "全明星 (All-Star)" },
      ];
    }
    return [
      { value: "ALL", label: "全部大学赛事" },
      { value: "春联", label: "春联 (春季リーグ)" },
      { value: "秋联", label: "秋联 (秋季リーグ)" },
      { value: "东日", label: "东日 (東日本インカレ)" },
      { value: "全日", label: "全日 (全日本インカレ)" },
    ];
  };

  const theme = isDark
    ? {
        bgWrapper: "bg-[#090b10]/85 text-zinc-100",
        headerBg: "bg-[#090b10]/95 border-zinc-800",
        cardBg: "bg-zinc-900/90 border-zinc-800",
        border: "border-zinc-800",
        accentBg: "bg-amber-500 text-zinc-950",
      }
    : {
        bgWrapper: "bg-[#faf8f5]/85 text-zinc-900",
        headerBg: "bg-[#faf8f5]/95 border-zinc-300",
        cardBg: "bg-white/92 border-zinc-300",
        border: "border-zinc-300",
        accentBg: "bg-zinc-900 text-white",
      };

  const highSchoolRegions = [
    "ALL", "东京", "京都", "大阪", "神奈川", "熊本", "福冈", "福井", "秋田", "宫城", "北海道"
  ];
  const universityRegions = ["ALL", "关东1部", "关西1部"];
  const currentRegions = mainTab === "大学" ? universityRegions : highSchoolRegions;

  const regionTeams = teams.filter((t) => {
    const matchCategory = t.main_category === mainTab;
    const matchRegion = selectedRegion === "ALL" || t.region === selectedRegion;
    const matchSearch = !globalSearch || JSON.stringify(t).toLowerCase().includes(globalSearch.toLowerCase());
    return matchCategory && matchRegion && matchSearch;
  });

  const menTeams = regionTeams.filter((t) => t.gender !== "WOMEN");
  const womenTeams = regionTeams.filter((t) => t.gender === "WOMEN");

  const isHarukoMode = mainTab === "高校" && selectedTournament === "春高";

  const filteredMatches = matches.filter((m) => {
    const matchCat = m.main_category === mainTab;
    const matchYear = selectedYear === "ALL" || m.year === selectedYear;
    const matchTour = selectedTournament === "ALL" || m.tournament === selectedTournament;
    const matchRound = !isHarukoMode || selectedRound === "赛程一览" || m.round === selectedRound;
    const matchGender = genderFilter === "ALL" || m.gender === genderFilter;
    const matchSearch = !globalSearch || m.home_team.toLowerCase().includes(globalSearch.toLowerCase()) || m.away_team.toLowerCase().includes(globalSearch.toLowerCase());
    return matchCat && matchYear && matchTour && matchRound && matchGender && matchSearch;
  });

  const groupedSlots: { [key: string]: any[] } = {};
  filteredMatches.forEach((m) => {
    const key = `${m.date_label} · ${m.time}`;
    if (!groupedSlots[key]) groupedSlots[key] = [];
    groupedSlots[key].push(m);
  });

  const displayedPosts = posts
    .filter((p) => forumCategory === "全部" || p.category === forumCategory)
    .filter((p) => (forumSort === "essence" ? p.isEssence : true))
    .filter((p) => !globalSearch || p.title.toLowerCase().includes(globalSearch.toLowerCase()) || p.author.toLowerCase().includes(globalSearch.toLowerCase()))
    .sort((a, b) => {
      if (forumSort === "hot") return (b.comments?.length || 0) + b.likes - ((a.comments?.length || 0) + a.likes);
      return 0;
    });

  const currentOtherData = OTHER_TOURNAMENTS_DATA[otherPrimaryTab];

  return (
    <main className={`min-h-screen ${theme.bgWrapper} backdrop-blur-[3px] font-sans transition-colors duration-300 pb-24`}>
      {/* 登录模态框 */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-md border-2 ${theme.border} ${theme.cardBg} p-6 md:p-8 shadow-2xl space-y-5`}>
            <div className="flex justify-between items-center border-b pb-3 border-zinc-300 dark:border-zinc-700">
              <h3 className="text-lg font-black tracking-tight">
                {authMode === "login" ? "🔑 账号登录" : "📝 注册新账号"}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-sm opacity-60 hover:opacity-100 cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-center">
              <button type="button" onClick={() => { setAuthMode("login"); setAuthError(""); }} className={`py-2 cursor-pointer ${authMode === "login" ? "bg-[#3d95ad] text-white" : "opacity-70"}`}>
                已有账号登录
              </button>
              <button type="button" onClick={() => { setAuthMode("register"); setAuthError(""); }} className={`py-2 cursor-pointer ${authMode === "register" ? "bg-[#3d95ad] text-white" : "opacity-70"}`}>
                新用户注册
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold mb-1">用户名</label>
                <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder="输入用户名" className={`w-full border ${theme.border} bg-transparent px-3 py-2 text-sm rounded-xs`} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">密码</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="输入密码" className={`w-full border ${theme.border} bg-transparent px-3 py-2 text-sm rounded-xs`} />
              </div>
              {authError && <p className="text-xs text-rose-500 font-bold">{authError}</p>}
              <div className="text-[11px] opacity-65 bg-zinc-500/10 p-2.5 rounded-xs leading-relaxed">
                💡 <strong>权限说明</strong>：<br />
                · 可自由注册账号并设置密码，发布帖子与评论，且<strong>只能删除自己发布的帖子和评论</strong>。<br />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAuthModal(false)} className="px-4 py-2 text-xs border border-zinc-400 rounded-xs cursor-pointer">取消</button>
              <button type="button" onClick={handleAuthSubmit} className="px-6 py-2 bg-[#3d95ad] text-white text-xs font-bold rounded-xs hover:opacity-90 cursor-pointer">
                {authMode === "login" ? "立即登录" : "完成注册并登录"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 顶部导航栏 */}
      <header className={`sticky top-0 z-40 border-b ${theme.headerBg} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className={`flex flex-wrap items-center justify-between py-4 border-b ${theme.border} gap-4`}>
            <div onClick={() => handleMainNav("首页")} className="cursor-pointer flex items-baseline gap-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic">VolleyHub<span className="text-amber-600 not-italic">.</span></h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setIsDark(!isDark)} className={`flex items-center border ${theme.border} rounded-full px-2.5 py-1 text-xs gap-1 hover:opacity-80`}>
                <span className={!isDark ? "opacity-100 font-bold" : "opacity-40"}>☀️</span><span className="opacity-30">|</span><span className={isDark ? "opacity-100 font-bold" : "opacity-40"}>🌙</span>
              </button>
              {currentUser ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-xs font-bold ${currentUser.role === "admin" ? "bg-amber-500 text-zinc-950" : "bg-[#3d95ad] text-white"}`}>
                    {currentUser.role === "admin" ? `🛡️ 管理员: ${currentUser.username}` : `👤 ${currentUser.username}`}
                  </span>
                  <button onClick={handleLogout} className={`px-2 py-1 border ${theme.border} rounded-xs opacity-75 hover:opacity-100 cursor-pointer`}>退出</button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className={`px-3 py-1 text-xs font-bold border ${theme.border} rounded-xs hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer`}>
                  登录 / 注册
                </button>
              )}
            </div>
          </div>
          <nav className="flex items-center overflow-x-auto py-2.5 text-sm font-bold tracking-wide no-scrollbar">
            {[
              { id: "首页", label: "首页" },
              { id: "高校", label: "高校 (高中)" },
              { id: "大学", label: "大学" },
              { id: "职业俱乐部", label: "职业俱乐部" },
              { id: "其他", label: "其他" },
              { id: "论坛", label: "论坛" },
            ].map((item, idx) => {
              const active = mainTab === item.id && !activePlayer && !activeSchool;
              return (
                <React.Fragment key={item.id}>
                  <span className={`opacity-30 font-light mx-1 ${idx === 0 ? "inline" : "hidden"}`}>|</span>
                  <button onClick={() => handleMainNav(item.id)} className={`px-3 md:px-4 py-1 rounded-sm transition cursor-pointer ${active ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 underline decoration-2 underline-offset-4" : "hover:opacity-70"}`}>
                    {item.label}
                  </button>
                  <span className="opacity-30 font-light mx-1">|</span>
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 主体容器 */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8">
        {/* 1. 选手档案 */}
        {activePlayer ? (
          <div className={`border ${theme.border} ${theme.cardBg} backdrop-blur-md shadow-sm`}>
            <div className={`flex items-center justify-between px-6 py-3 border-b ${theme.border} text-xs font-mono`}>
              <button onClick={() => setActivePlayer(null)} className="hover:underline font-bold cursor-pointer">← 返回</button>
            </div>
            <div className={`px-6 md:px-10 py-6 border-b ${theme.border} flex justify-between items-end`}>
              <div>
                <h2 className="text-3xl md:text-5xl font-black">{getName(activePlayer)}</h2>
                <p className="text-xs opacity-60 mt-1 font-mono">{activePlayer.name_ja}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className={`md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r ${theme.border} space-y-3.5`}>
                <h3 className="text-xs font-mono uppercase opacity-50 mb-4">PROFILE</h3>
                {[
                  { label: "身高", value: activePlayer.height },
                  { label: "击球高度", value: activePlayer.spike_reach },
                  { label: "拦网高度", value: activePlayer.block_reach },
                  { label: "位置", value: activePlayer.position },
                ].map((attr) => (
                  <div key={attr.label} className={`flex justify-between items-baseline py-2 border-b ${theme.border} text-sm`}>
                    <span className="opacity-65 font-medium">{attr.label}</span>
                    <span className="font-mono font-bold">{attr.value}</span>
                  </div>
                ))}
              </div>
              <div className="md:col-span-8 flex flex-col">
                <div className={`p-6 md:p-8 border-b ${theme.border} flex-1`}>
                  <h3 className="text-lg font-black mb-4">球队经验</h3>
                  <div className="space-y-3">
                    {(activePlayer.club_history || []).map((exp: any, i: number) => (
                      <div key={i} className={`p-4 border ${theme.border} rounded-sm`}>
                        <span className="font-bold">{exp.team}</span>
                        <span className="text-xs opacity-70 ml-3">{exp.league}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSchool ? (
          /* 2. 学校名册 */
          <div className={`border ${theme.border} ${theme.cardBg} backdrop-blur-md`}>
            <div className={`px-6 py-4 border-b ${theme.border} flex items-center gap-3`}>
              <button onClick={() => setActiveSchool(null)} className={`px-3 py-1 text-xs font-mono border ${theme.border} hover:opacity-70 cursor-pointer`}>← 返回</button>
              <h2 className="text-2xl font-black">{getName(activeSchool)}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
              <div className={`md:col-span-3 border-r ${theme.border} p-4 space-y-2`}>
                {["2024-2026", "2023-2025", "历届知名校友"].map((cohort) => (
                  <button key={cohort} onClick={() => setSelectedCohort(cohort)} className={`w-full text-left px-4 py-3 text-sm border-b ${theme.border} ${selectedCohort === cohort ? "bg-amber-500/20 font-black border-l-4 border-l-amber-600" : ""}`}>
                    {cohort}
                  </button>
                ))}
              </div>
              <div className="md:col-span-9 p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className={`border-b-2 ${theme.border} opacity-70`}>
                      <th className="py-3 px-4">姓名</th>
                      <th className="py-3 px-4">身高</th>
                      <th className="py-3 px-4">摸高</th>
                      <th className="py-3 px-4">位置</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-300/50">
                    {players.filter((p) => p.team_name.includes(activeSchool.name_zh)).map((player) => (
                      <tr key={player.id} onClick={() => setActivePlayer(player)} className="cursor-pointer hover:bg-amber-500/10">
                        <td className="py-4 px-4 font-bold">{getName(player)}</td>
                        <td className="py-4 px-4">{player.height}</td>
                        <td className="py-4 px-4 font-bold text-amber-600">{player.spike_reach}</td>
                        <td className="py-4 px-4">{player.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : mainTab === "首页" ? (
          /* 3. 首页 2x2 矩阵 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: "高校", title: "高校 (高中)", sub: "春高全轮次比分卡 · IH · 国体" },
              { id: "职业俱乐部", title: "职业俱乐部", sub: "日本 SV.LEAGUE · 意大利 Serie A1" },
              { id: "大学", title: "大学", sub: "四大高校联赛赛果" },
              { id: "其他", title: "其他赛事", sub: "天皇杯 · U21 · U19" },
            ].map((card) => (
              <div key={card.id} onClick={() => handleMainNav(card.id)} className={`border ${theme.border} ${theme.cardBg} p-8 md:p-10 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all`}>
                <h3 className="text-3xl font-black mb-2">{card.title}</h3>
                <p className="text-sm opacity-75">{card.sub}</p>
              </div>
            ))}
          </div>
        ) : mainTab === "其他" ? (
          /* 4. 其他赛事模块 */
          <div className="space-y-6">
            <div className={`flex gap-3 border-b ${theme.border} pb-4`}>
              {Object.keys(OTHER_TOURNAMENTS_DATA).map((key) => (
                <button key={key} onClick={() => { setOtherPrimaryTab(key); setOtherSubTab("赛程"); }} className={`px-5 py-2.5 text-sm font-black border ${theme.border} cursor-pointer ${otherPrimaryTab === key ? "bg-amber-500 text-zinc-950" : ""}`}>
                  {key}
                </button>
              ))}
            </div>
            <div className={`border ${theme.border} ${theme.cardBg} p-5 flex gap-4`}>
              {["赛程", "比分", "入选选手"].map((tab) => (
                <button key={tab} onClick={() => setOtherSubTab(tab as any)} className={`px-4 py-1 transition cursor-pointer ${otherSubTab === tab ? theme.accentBg : "opacity-55"}`}>
                  {tab}
                </button>
              ))}
            </div>
            {otherSubTab === "赛程" && (
              <div className={`border ${theme.border} ${theme.cardBg} overflow-x-auto p-4`}>
                {OTHER_TOURNAMENTS_DATA[otherPrimaryTab].schedule.map((s: any, idx: number) => (
                  <div key={idx} className={`py-3 border-b ${theme.border} text-sm flex gap-4`}>
                    <span className="font-bold text-amber-600">{s.round}</span>
                    <span className="font-black">{s.match}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : mainTab === "职业俱乐部" ? (
          /* 5. 职业俱乐部模块 */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teams.filter((t) => t.main_category === "职业俱乐部").map((club) => (
              <div key={club.id} onClick={() => setActiveSchool(club)} className={`border ${theme.border} ${theme.cardBg} p-6 cursor-pointer hover:shadow-lg`}>
                <h3 className="text-xl font-black mt-1">{getName(club)}</h3>
                <p className="text-xs mt-4 pt-3 border-t border-zinc-300/50 font-bold">球星：{club.stars}</p>
              </div>
            ))}
          </div>
        ) : mainTab === "论坛" ? (
          /* 6. 论坛模块 */
          <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8`}>
            {currentUser && (
              <div className="mb-6 p-4 border border-zinc-300 dark:border-zinc-700 bg-zinc-500/5 rounded-xs space-y-3">
                <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} placeholder="输入讨论标题..." className={`w-full border ${theme.border} bg-transparent px-3 py-2 text-sm`} />
                <textarea rows={2} value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="输入正文..." className={`w-full border ${theme.border} bg-transparent p-3 text-sm`} />
                <button onClick={publishPost} className="px-6 py-1.5 bg-[#3d95ad] text-white font-bold text-xs rounded-xs">发布</button>
              </div>
            )}
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-300 text-xs text-zinc-500">
                  <th className="py-2.5 px-2">讨论</th>
                  <th className="py-2.5 px-2">作者</th>
                  <th className="py-2.5 px-2">管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {displayedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#3d95ad]/5">
                    <td className="py-3.5 px-2 font-medium">{post.title}</td>
                    <td className="py-3.5 px-2 text-[#257985] text-xs">{post.author}</td>
                    <td className="py-3.5 px-2 text-right">
                      {canDeleteItem(post.author) && (
                        <button onClick={(e) => handleDeletePost(post.id, e)} className="text-[11px] text-rose-500 font-bold">删除</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* 7. 高校/大学 赛事模块 */
          <div className="space-y-6">
            <div className={`flex gap-4 border-b ${theme.border} pb-4`}>
              <button onClick={() => setSubTab("赛事")} className={`px-4 py-1 transition ${subTab === "赛事" ? "bg-amber-500 text-zinc-950" : "opacity-50"}`}>赛事</button>
              <button onClick={() => setSubTab("学校")} className={`px-4 py-1 transition ${subTab === "学校" ? "bg-amber-500 text-zinc-950" : "opacity-50"}`}>学校</button>
            </div>
            {subTab === "赛事" ? (
              <div className="space-y-6">
                <div className={`p-4 border ${theme.border} ${theme.cardBg} flex gap-4`}>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={`border ${theme.border} bg-transparent px-3 py-1 text-sm`}><option value="2026">2026</option></select>
                  <select value={selectedTournament} onChange={(e) => setSelectedTournament(e.target.value)} className={`border ${theme.border} bg-transparent px-3 py-1 text-sm`}><option value="春高">春高 (Haruko)</option></select>
                </div>
                {isHarukoMode && (
                  <div className={`grid grid-cols-4 md:grid-cols-7 border ${theme.border} text-center font-bold text-xs`}>
                    {["赛程一览", "1回戦", "2回戦", "3回戦", "準々決勝", "準決勝", "決勝"].map((r) => (
                      <button key={r} onClick={() => setSelectedRound(r)} className={`py-3 px-2 transition ${selectedRound === r ? "bg-amber-500 text-zinc-950" : ""}`}>{r}</button>
                    ))}
                  </div>
                )}
                <div className="space-y-4">
                  {Object.entries(groupedSlots).map(([title, ms]) => (
                    <div key={title} className="space-y-2">
                      <div className={`px-4 py-2 ${theme.accentBg} text-xs font-bold`}>{title}</div>
                      {ms.map((m) => (
                        <div key={m.id} className={`border ${theme.border} ${theme.cardBg} p-4`}>
                          <div className="flex justify-between items-center text-sm font-black">
                            <span className="w-1/3 text-right">{m.home_team}</span>
                            <span className="text-xl text-amber-500">{m.home_sets} - {m.away_sets}</span>
                            <span className="w-1/3">{m.away_team}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                <div className="space-y-3">
                  <div className="font-black text-sky-600 mb-4">MEN / 男子部</div>
                  {menTeams.map((school) => (
                    <div key={school.id} onClick={() => setActiveSchool(school)} className={`py-3 px-4 border-b ${theme.border} cursor-pointer hover:bg-amber-500/10 font-bold`}>{getName(school)}</div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="font-black text-rose-500 mb-4">WOMEN / 女子部</div>
                  {womenTeams.map((school) => (
                    <div key={school.id} onClick={() => setActiveSchool(school)} className={`py-3 px-4 border-b ${theme.border} cursor-pointer hover:bg-amber-500/10 font-bold`}>{getName(school)}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}