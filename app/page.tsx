"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// 预置管理员账号密码（你也可以在网页里注册任意新用户）
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
  { id: "uv25-spr", main_category: "大学", tournament: "春联", year: "2025", round: "関東1部 最終戦", date_label: "2025年5月19日", time: "15時00分", court: "Aコート", gender: "Men", home_team: "早稲田大学", home_hira: "わせだだいがく", home_pref: "関東1部", away_team: "明治大学", away_hira: "めいじだいがく", away_pref: "関東1部", home_sets: 3, away_sets: 2, sets: ["25 - 23", "21 - 25", "25 - 20", "20 - 25", "15 - 12"] },
];

// ==================== 2. 45+ 都道府县代表校与大学/俱乐部名录 ====================
const INITIAL_TEAMS = [
  { id: "hs-tk1", name_zh: "骏台学园", name_ja: "駿台学園", name_hira: "すんだいがくえん", main_category: "高校", region: "东京", gender: "MEN", desc: "2023-2025春高三连霸・2026春高第3位" },
  { id: "hs-tk2", name_zh: "东亚学园", name_ja: "東亜学園", name_hira: "とうあがくえん", main_category: "高校", region: "东京", gender: "MEN", desc: "2024/2025/2026春高东京代表" },
  { id: "hs-tk3", name_zh: "东洋高校", name_ja: "東洋高校", name_hira: "とうよう", main_category: "高校", region: "东京", gender: "MEN", desc: "2026第78回春高八强・柳田将洋母校" },
  { id: "hs-tk4", name_zh: "驹泽大高", name_ja: "駒澤大高", name_hira: "こまざわだいこう", main_category: "高校", region: "东京", gender: "MEN", desc: "2024/2025春高东京代表" },
  { id: "hs-tk5", name_zh: "下北泽成德", name_ja: "下北沢成徳", name_hira: "しもきたざわせいとく", main_category: "高校", region: "东京", gender: "WOMEN", desc: "2026春高出场・女排传统豪门" },
  { id: "hs-tk6", name_zh: "八王子实践", name_ja: "八王子実践", name_hira: "はちおうじじっせん", main_category: "高校", region: "东京", gender: "WOMEN", desc: "2026第78回春高女排八强" },
  { id: "hs-tk7", name_zh: "文京学院大女", name_ja: "文京学院大女", name_hira: "ぶんきょうがくいんだいじょ", main_category: "高校", region: "东京", gender: "WOMEN", desc: "2026第78回春高女排八强" },
  { id: "hs-ky1", name_zh: "东山高校", name_ja: "東山", name_hira: "ひがしやま", main_category: "高校", region: "京都", gender: "MEN", desc: "🏆 2026第78回春高全国优胜" },
  { id: "hs-ky2", name_zh: "洛南高校", name_ja: "洛南", name_hira: "らくなん", main_category: "高校", region: "京都", gender: "MEN", desc: "2024/2025春高京都代表" },
  { id: "hs-ky3", name_zh: "京都橘", name_ja: "京都橘", name_hira: "きょうとたちばな", main_category: "高校", region: "京都", gender: "WOMEN", desc: "2026第78回春高京都女子代表" },
  { id: "hs-os1", name_zh: "清风高校", name_ja: "清風", name_hira: "せいふう", main_category: "高校", region: "大阪", gender: "MEN", desc: "🥈 2026第78回春高男子准优胜" },
  { id: "hs-os2", name_zh: "昇阳高校", name_ja: "昇陽", name_hira: "しょうよう", main_category: "高校", region: "大阪", gender: "MEN", desc: "2024/2025春高大阪代表" },
  { id: "hs-os3", name_zh: "常翔学园", name_ja: "常翔学園", name_hira: "じょうしょうがくえん", main_category: "高校", region: "大阪", gender: "MEN", desc: "2026第78回春高大阪代表" },
  { id: "hs-os4", name_zh: "金兰会高校", name_ja: "金蘭会", name_hira: "きんらんかい", main_category: "高校", region: "大阪", gender: "WOMEN", desc: "🏆 2026第78回春高女子全国优胜" },
  { id: "hs-os5", name_zh: "大阪国际", name_ja: "大阪国際", name_hira: "おおさかこくさい", main_category: "高校", region: "大阪", gender: "WOMEN", desc: "2026第78回春高女子第3位(四强)" },
  { id: "hs-kn1", name_zh: "庆应义塾高", name_ja: "慶應義塾", name_hira: "けいおうぎじゅく", main_category: "高校", region: "神奈川", gender: "MEN", desc: "2025/2026春高神奈川代表" },
  { id: "hs-kn2", name_zh: "东海大相模", name_ja: "東海大相模", name_hira: "とうかいだいさがみ", main_category: "高校", region: "神奈川", gender: "MEN", desc: "2024/2026春高神奈川代表・16强" },
  { id: "hs-kn3", name_zh: "川崎橘", name_ja: "川崎橘", name_hira: "かわさきたちばな", main_category: "高校", region: "神奈川", gender: "MEN", desc: "2024/2025春高神奈川代表" },
  { id: "hs-kn4", name_zh: "横滨隼人", name_ja: "横浜隼人", name_hira: "よこはまはやと", main_category: "高校", region: "神奈川", gender: "WOMEN", desc: "2026春高神奈川女子代表・16强" },
  { id: "hs-hk1", name_zh: "东海大札幌", name_ja: "東海大札幌", name_hira: "とうかいだいさっぽろ", main_category: "高校", region: "北海道", gender: "MEN", desc: "2024/2026春高北海道代表" },
  { id: "hs-hk2", name_zh: "札幌大谷", name_ja: "札幌大谷", name_hira: "さっぽろおおたに", main_category: "高校", region: "北海道", gender: "MEN", desc: "2025/2026春高北海道代表" },
  { id: "hs-hk4", name_zh: "旭川实", name_ja: "旭川実", name_hira: "あさひかわじつ", main_category: "高校", region: "北海道", gender: "WOMEN", desc: "2026春高北海道女子代表" },
  { id: "hs-ao1", name_zh: "弘前工", name_ja: "弘前工", name_hira: "ひろさきこう", main_category: "高校", region: "青森", gender: "MEN", desc: "2024/2025/2026春高青森代表" },
  { id: "hs-iw1", name_zh: "一关修红", name_ja: "一関修紅", name_hira: "いちのせきしゅうこう", main_category: "高校", region: "岩手", gender: "MEN", desc: "2025/2026春高岩手代表" },
  { id: "hs-my1", name_zh: "东北高校", name_ja: "東北", name_hira: "とうほく", main_category: "高校", region: "宫城", gender: "MEN", desc: "2024/2025/2026春高宫城代表" },
  { id: "hs-my2", name_zh: "古川学园", name_ja: "古川学園", name_hira: "ふるかわがくえん", main_category: "高校", region: "宫城", gender: "WOMEN", desc: "2026春高宫城女子名门" },
  { id: "hs-ak1", name_zh: "雄物川", name_ja: "雄物川", name_hira: "おものがわ", main_category: "高校", region: "秋田", gender: "MEN", desc: "2026第78回春高第3位(四强)" },
  { id: "hs-ym1", name_zh: "山形中央", name_ja: "山形中央", name_hira: "やまがたちゅうおう", main_category: "高校", region: "山形", gender: "MEN", desc: "2024/2026春高山形代表" },
  { id: "hs-ym3", name_zh: "米泽中央", name_ja: "米沢中央", name_hira: "よねざわちゅうおう", main_category: "高校", region: "山形", gender: "WOMEN", desc: "2026春高山形女子代表・16强" },
  { id: "hs-fk1", name_zh: "郡山北工", name_ja: "郡山北工", name_hira: "こおりやまきたこう", main_category: "高校", region: "福岛", gender: "MEN", desc: "2024/2025/2026春高福岛代表" },
  { id: "hs-ib1", name_zh: "土浦日大", name_ja: "土浦日大", name_hira: "つちうらにちだい", main_category: "高校", region: "茨城", gender: "MEN", desc: "2024/2025/2026春高茨城代表・16强" },
  { id: "hs-tc1", name_zh: "足利大附", name_ja: "足利大附", name_hira: "あしかがだいふ", main_category: "高校", region: "栃木", gender: "MEN", desc: "2024/2025/2026春高栃木代表" },
  { id: "hs-gm1", name_zh: "高崎高校", name_ja: "高崎", name_hira: "たかさき", main_category: "高校", region: "群马", gender: "MEN", desc: "2025/2026春高群马代表" },
  { id: "hs-st1", name_zh: "春日部共荣", name_ja: "春日部共栄", name_hira: "かすかべきょうえい", main_category: "高校", region: "埼玉", gender: "MEN", desc: "2026春高埼玉代表" },
  { id: "hs-st4", name_zh: "细田学园", name_ja: "細田学園", name_hira: "ほそだがくえん", main_category: "高校", region: "埼玉", gender: "WOMEN", desc: "2026春高埼玉女子代表・16强" },
  { id: "hs-cb1", name_zh: "市立船桥", name_ja: "市立船橋", name_hira: "しりつふなばし", main_category: "高校", region: "千叶", gender: "MEN", desc: "2026春高千叶代表" },
  { id: "hs-cb2", name_zh: "习志野", name_ja: "習志野", name_hira: "ならしの", main_category: "高校", region: "千叶", gender: "MEN", desc: "2024/2025春高千叶代表" },
  { id: "hs-yn1", name_zh: "日本航空", name_ja: "日本航空", name_hira: "にほんこうくう", main_category: "高校", region: "山梨", gender: "MEN", desc: "2024/2025/2026春高山梨代表・16强" },
  { id: "hs-ng1", name_zh: "松本国际", name_ja: "松本国際", name_hira: "まつもとこくさい", main_category: "高校", region: "长野", gender: "MEN", desc: "2025/2026春高长野代表" },
  { id: "hs-ni1", name_zh: "关根学园", name_ja: "関根学園", name_hira: "せきねがくえん", main_category: "高校", region: "新潟", gender: "MEN", desc: "2026春高新潟代表" },
  { id: "hs-ty1", name_zh: "高冈第一", name_ja: "高岡第一", name_hira: "たかおかだいいち", main_category: "高校", region: "富山", gender: "MEN", desc: "2024/2025/2026春高富山代表" },
  { id: "hs-is1", name_zh: "小松大谷", name_ja: "小松大谷", name_hira: "こまつおおたに", main_category: "高校", region: "石川", gender: "MEN", desc: "2024/2025/2026春高石川代表" },
  { id: "hs-fi1", name_zh: "福井工大福井", name_ja: "福井工大福井", name_hira: "ふくいこうだいふくい", main_category: "高校", region: "福井", gender: "MEN", desc: "2024春高准优胜・2026春高八强" },
  { id: "hs-gf1", name_zh: "县岐阜商", name_ja: "県岐阜商", name_hira: "けんぎふしょう", main_category: "高校", region: "岐阜", gender: "MEN", desc: "2024/2026春高岐阜代表" },
  { id: "hs-sz1", name_zh: "静清高校", name_ja: "静清", name_hira: "せいせい", main_category: "高校", region: "静冈", gender: "MEN", desc: "2026春高静冈代表・16强" },
  { id: "hs-sz3", name_zh: "富士见", name_ja: "富士見", name_hira: "ふじみ", main_category: "高校", region: "静冈", gender: "WOMEN", desc: "2026第78回春高女排八强" },
  { id: "hs-ac1", name_zh: "星城高校", name_ja: "星城", name_hira: "せいじょう", main_category: "高校", region: "爱知", gender: "MEN", desc: "2024/2025春高爱知代表・石川祐希母校" },
  { id: "hs-ac2", name_zh: "爱工大名电", name_ja: "愛工大名電", name_hira: "あいこうだいめいでん", main_category: "高校", region: "爱知", gender: "MEN", desc: "2026春高爱知代表" },
  { id: "hs-me1", name_zh: "松阪工", name_ja: "松阪工", name_hira: "まつさかこう", main_category: "高校", region: "三重", gender: "MEN", desc: "2024/2025/2026春高三重代表" },
  { id: "hs-sg1", name_zh: "近江高校", name_ja: "近江", name_hira: "おうみ", main_category: "高校", region: "滋贺", gender: "MEN", desc: "2024/2025/2026春高滋贺代表" },
  { id: "hs-hy1", name_zh: "市立尼崎", name_ja: "市立尼崎", name_hira: "しりつあまがさき", main_category: "高校", region: "兵库", gender: "MEN", desc: "2025春高四强・2026春高16强" },
  { id: "hs-nr1", name_zh: "添上高校", name_ja: "添上", name_hira: "そえかみ", main_category: "高校", region: "奈良", gender: "MEN", desc: "2024/2026春高奈良代表" },
  { id: "hs-wk1", name_zh: "开智高校", name_ja: "開智", name_hira: "かいち", main_category: "高校", region: "和歌山", gender: "MEN", desc: "2024/2025/2026春高和歌山代表" },
  { id: "hs-tt1", name_zh: "鸟取中央育英", name_ja: "鳥取中央育英", name_hira: "とっとりちゅうおういくえい", main_category: "高校", region: "鸟取", gender: "MEN", desc: "2024/2025/2026春高鸟取代表" },
  { id: "hs-sm1", name_zh: "安来高校", name_ja: "安来", name_hira: "やすぎ", main_category: "高校", region: "岛根", gender: "MEN", desc: "2026春高岛根代表" },
  { id: "hs-ok1", name_zh: "冈山东商", name_ja: "岡山東商", name_hira: "おかやまとうしょう", main_category: "高校", region: "冈山", gender: "MEN", desc: "2026春高冈山代表" },
  { id: "hs-ok3", name_zh: "就实高校", name_ja: "就実", name_hira: "しゅうじつ", main_category: "高校", region: "冈山", gender: "WOMEN", desc: "🥈 2026第78回春高女排准优胜" },
  { id: "hs-hr1", name_zh: "崇德高校", name_ja: "崇徳", name_hira: "そうとく", main_category: "高校", region: "广岛", gender: "MEN", desc: "2024/2026春高广岛代表・16强" },
  { id: "hs-yg1", name_zh: "高川学园", name_ja: "高川学園", name_hira: "たかがわがくえん", main_category: "高校", region: "山口", gender: "MEN", desc: "2024/2025/2026春高山口代表" },
  { id: "hs-tk_s1", name_zh: "德岛科学技术", name_ja: "徳島科学技術", name_hira: "とくしまかがくぎじゅつ", main_category: "高校", region: "德岛", gender: "MEN", desc: "2024/2025/2026春高德岛代表" },
  { id: "hs-kg1", name_zh: "高松工艺", name_ja: "高松工芸", name_hira: "たかまつこうげい", main_category: "高校", region: "香川", gender: "MEN", desc: "2024/2026春高香川代表" },
  { id: "hs-eh1", name_zh: "新田高校", name_ja: "新田", name_hira: "にった", main_category: "高校", region: "爱媛", gender: "MEN", desc: "2024/2025/2026春高爱媛代表" },
  { id: "hs-kc1", name_zh: "市立高知商", name_ja: "市立高知商", name_hira: "しりつこうちしょう", main_category: "高校", region: "高知", gender: "MEN", desc: "2025/2026春高高知代表" },
  { id: "hs-fo1", name_zh: "东福冈", name_ja: "東福岡", name_hira: "ひがしふくおか", main_category: "高校", region: "福冈", gender: "MEN", desc: "2025第77回春高准优胜" },
  { id: "hs-sa1", name_zh: "佐贺学园", name_ja: "佐賀学園", name_hira: "さががくえん", main_category: "高校", region: "佐贺", gender: "MEN", desc: "2024/2026春高佐贺代表" },
  { id: "hs-ns1", name_zh: "镇西学院", name_ja: "鎮西学院", name_hira: "ちんぜいがくいん", main_category: "高校", region: "长崎", gender: "MEN", desc: "2025/2026春高长崎代表" },
  { id: "hs-km1", name_zh: "镇西高校", name_ja: "鎮西", name_hira: "ちんぜい", main_category: "高校", region: "熊本", gender: "MEN", desc: "2024/2025/2026春高熊本代表・八强" },
  { id: "hs-km2", name_zh: "熊本信爱女", name_ja: "熊本信愛女", name_hira: "くまもとしんあいじょ", main_category: "高校", region: "熊本", gender: "WOMEN", desc: "2026第78回春高女排八强" },
  { id: "hs-oi1", name_zh: "大分南", name_ja: "大分南", name_hira: "おおいたみなみ", main_category: "高校", region: "大分", gender: "MEN", desc: "2024/2025/2026春高大分代表" },
  { id: "hs-oi2", name_zh: "东九州龙谷", name_ja: "東九州龍谷", name_hira: "ひがしきゅうしゅうりゅうこく", main_category: "高校", region: "大分", gender: "WOMEN", desc: "2026第78回春高女排第3位(四强)" },
  { id: "hs-mz1", name_zh: "都城工", name_ja: "都城工", name_hira: "みやこのじょうこう", main_category: "高校", region: "宫崎", gender: "MEN", desc: "2024/2025/2026春高宫崎代表・八强" },
  { id: "hs-kg_s1", name_zh: "川内商工", name_ja: "川内商工", name_hira: "せんだいしょうこう", main_category: "高校", region: "鹿儿岛", gender: "MEN", desc: "2024/2025/2026春高鹿儿岛代表・16强" },
  { id: "hs-okn1", name_zh: "西原高校", name_ja: "西原", name_hira: "にしはら", main_category: "高校", region: "冲绳", gender: "MEN", desc: "2024/2025/2026春高冲绳代表" },

  // 大学 & 俱乐部
  { id: "uv-1", name_zh: "早稻田大学", name_ja: "早稲田大学", name_hira: "わせだだいがく", main_category: "大学", region: "关东1部", gender: "MEN", desc: "全日本インカレ多冠王" },
  { id: "uv-2", name_zh: "中央大学", name_ja: "中央大学", name_hira: "ちゅうおうだいがく", main_category: "大学", region: "关东1部", gender: "MEN", desc: "石川祐希/关田诚大母校" },
  { id: "uv-3", name_zh: "明治大学", name_ja: "明治大学", name_hira: "めいじだいがく", main_category: "大学", region: "关东1部", gender: "MEN", desc: "东日本インカレ优胜" },
  { id: "uv-6", name_zh: "庆应义塾大学", name_ja: "慶應義塾大学", name_hira: "けいおうぎじゅくだいがく", main_category: "大学", region: "关东1部", gender: "MEN", desc: "柳田将洋母校" },
  { id: "cl-1", name_zh: "三得利太阳鸟大阪", name_ja: "サントリーサンバーズ大阪", name_hira: "さんとりーさんばーずおおさか", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE", city: "大阪", stars: "高桥蓝、小野寺太志、穆塞尔斯基" },
  { id: "cl-2", name_zh: "名古屋狼犬", name_ja: "ウルフドッグス名古屋", name_hira: "うるふどっぐすなごや", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE", city: "爱知", stars: "小川智大、高梨健太、尼米尔" },
  { id: "cl-3", name_zh: "大阪布鲁顿", name_ja: "大阪ブルテオン", name_hira: "おおさかぶるておん", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE", city: "大阪", stars: "西田有志、山内晶大、山本智大" },
  { id: "cl-6", name_zh: "佩鲁贾 (Perugia)", name_ja: "シル・サフェーティ・ペルージャ", name_hira: "ぺるーじゃ", main_category: "职业俱乐部", country: "意大利 (Serie A1)", league: "意大利超级联赛", city: "佩鲁贾", stars: "石川祐希、詹内利、塞梅纽克" },
  { id: "cl-7", name_zh: "米兰 (Milano)", name_ja: "パワー・バレー・ミラノ", name_hira: "みらの", main_category: "职业俱乐部", country: "意大利 (Serie A1)", league: "意大利超级联赛", city: "米兰", stars: "大冢达宣、波罗" },
  { id: "cl-10", name_zh: "雅斯特泽布斯基", name_ja: "ヤストシェンブスキ", name_hira: "やすとしぇんぶすき", main_category: "职业俱乐部", country: "波兰 (PlusLiga)", league: "波兰 PlusLiga", city: "波兰", stars: "福纳尔、胡贝尔" },
];

// ==================== 3. 「其他」板块：天皇杯 & U21 / U19 数据 ====================
const OTHER_TOURNAMENTS_DATA: {
  [key: string]: {
    type: "cup" | "youth";
    desc: string;
    schedule: { date: string; round: string; venue: string; match: string; note: string }[];
    scores?: { id: string; round: string; date: string; home: string; home_cat: string; away: string; away_cat: string; score: string; sets: string }[];
    roster?: { id: string; name_zh: string; name_ja: string; name_hira: string; pos: string; height: string; spike: string; school: string; grade: string }[];
  };
} = {
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
      { id: "tk-3", round: "1回戦 (学界德比)", date: "2025-12-12", home: "駿台学園", home_cat: "高校代表", away: "近畿大学", away_cat: "大学代表", score: "2 : 1", sets: "25-23, 22-25, 25-21" },
    ],
  },
  "U21": {
    type: "youth",
    desc: "U21 青年代表队（大学低年级与高中毕业生成长舞台）",
    schedule: [
      { date: "2025-08-21", round: "小组赛 R1", venue: "第1球场", match: "日本 U21 vs 巴西 U21", note: "3 - 1 (25-22, 23-25, 25-20, 25-19)" },
      { date: "2025-08-23", round: "小组赛 R2", venue: "第1球场", match: "日本 U21 vs 意大利 U21", note: "2 - 3 (25-23, 25-21, 20-25, 21-25, 12-15)" },
      { date: "2025-08-27", round: "8强复赛", venue: "中心球场", match: "日本 U21 vs 波兰 U21", note: "3 - 2 (晋级四强关键战)" },
    ],
    roster: [
      { id: "u21-1", name_zh: "川野琢磨", name_ja: "川野 琢磨", name_hira: "かわの たくま", pos: "OH (主攻)", height: "197 cm", spike: "347 cm", school: "早稻田大学 (原骏台学园)", grade: "大1" },
      { id: "u21-2", name_zh: "小野骏太", name_ja: "小野 駿太", name_hira: "おの しゅんた", pos: "OH (主攻)", height: "186 cm", spike: "338 cm", school: "早稻田大学", grade: "大2" },
      { id: "u21-3", name_zh: "秋本悠月", name_ja: "秋本 悠月", name_hira: "あきもと ゆづき", pos: "MB (副攻)", height: "192 cm", spike: "340 cm", school: "中央大学 (原骏台学园)", grade: "大2" },
      { id: "u21-4", name_zh: "近藤兰丸", name_ja: "近藤 蘭丸", name_hira: "こんどう らんまる", pos: "S (二传)", height: "178 cm", spike: "320 cm", school: "明治大学 (原东福冈)", grade: "大2" },
    ],
  },
  "U19": {
    type: "youth",
    desc: "U19 少年代表队（现役春高高中生代表队）",
    schedule: [
      { date: "2025-07-24", round: "小组赛", venue: "A球场", match: "日本 U19 vs 法国 U19", note: "3 - 1 (25-21, 22-25, 25-18, 25-20)" },
      { date: "2025-07-26", round: "16强淘汰赛", venue: "中心球场", match: "日本 U19 vs 美国 U19", note: "3 - 0 (25-19, 25-22, 25-20)" },
    ],
    roster: [
      { id: "u19-1", name_zh: "岩田怜纬", name_ja: "岩田 怜緯", name_hira: "いわた れい", pos: "OH (主攻)", height: "189 cm", spike: "338 cm", school: "东山高校 (京都)", grade: "高3" },
      { id: "u19-2", name_zh: "竹内庆一郎", name_ja: "竹内 慶一郎", name_hira: "たけうち けいいちろう", pos: "S (二传)", height: "188 cm", spike: "328 cm", school: "骏台学园 (东京)", grade: "高3" },
      { id: "u19-3", name_zh: "堀内晴翔", name_ja: "堀内 晴翔", name_hira: "ほりうち はると", pos: "OH (主攻)", height: "187 cm", spike: "334 cm", school: "骏台学园 (东京)", grade: "高3" },
      { id: "u19-4", name_zh: "西村海司", name_ja: "西村 海司", name_hira: "にしむら かいじ", pos: "OH (主攻)", height: "186 cm", spike: "335 cm", school: "清风高校 (大阪)", grade: "高2" },
    ],
  },
};

// ==================== 4. 选手个人详细档案库 ====================
const INITIAL_PLAYERS = [
  { id: "p-iwata", name_zh: "岩田怜纬", name_ja: "岩田 怜緯", name_hira: "いわた れい", name_en: "Rei Iwata", team_name: "东山高校", cohort: "2024-2026", hometown: "日本 · 京都府", position: "主攻手 (OH)", birthday: "2008年", height: "189 cm", weight: "76 kg", spike_reach: "338 cm", block_reach: "320 cm", dominant_hand: "右", club_history: [{ period: "2024 - 2027", team: "东山高校 (ひがしやま)", league: "2026第78回春高全国优胜 & MVP" }], national_history: [{ period: "2025 - 2026", team: "日本 U19 代表", tournaments: ["U19锦标赛", "第78回春高MVP"] }] },
  { id: "p-nishimura", name_zh: "西村海司", name_ja: "西村 海司", name_hira: "にしむら かいじ", name_en: "Kaiji Nishimura", team_name: "清风高校", cohort: "2024-2026", hometown: "日本 · 大阪府", position: "主攻手 (OH)", birthday: "2009年", height: "186 cm", weight: "74 kg", spike_reach: "335 cm", block_reach: "318 cm", dominant_hand: "右", club_history: [{ period: "2025 - 2028", team: "清风高校 (せいふう)", league: "2026第78回春高准优胜 & 优秀选手赏" }], national_history: [{ period: "2025 - 2026", team: "日本 U19 代表", tournaments: ["第78回春高优秀选手赏"] }] },
  { id: "p-horiuchi", name_zh: "堀内晴翔", name_ja: "堀内 晴翔", name_hira: "ほりうち はると", name_en: "Haruto Horiuchi", team_name: "骏台学园", cohort: "2024-2026", hometown: "日本 · 东京都", position: "主攻手 (OH)", birthday: "2007年", height: "187 cm", weight: "75 kg", spike_reach: "334 cm", block_reach: "316 cm", dominant_hand: "右", club_history: [{ period: "2023 - 2026", team: "骏台学园 (すんだいがくえん)", league: "2026第78回春高第3位 & 优秀选手赏" }], national_history: [] },
  { id: "p1", name_zh: "竹内庆一郎", name_ja: "竹内 慶一郎", name_hira: "たけうち けいいちろう", name_en: "Keiichiro Takeuchi", team_name: "骏台学园", cohort: "2024-2026", hometown: "日本 · 东京都", position: "二传 (S)", birthday: "2007年", height: "188 cm", weight: "75 kg", spike_reach: "328 cm", block_reach: "315 cm", dominant_hand: "右", club_history: [{ period: "2024 - 2027", team: "骏台学园 (すんだいがくえん)", league: "春高全国优胜成员" }], national_history: [{ period: "2025 - 2026", team: "日本 U19 代表", tournaments: ["全国高校选拔合宿"] }] },
  { id: "p2", name_zh: "川野琢磨", name_ja: "川野 琢磨", name_hira: "かわの たくま", name_en: "Takuma Kawano", team_name: "骏台学园 / 早稻田大学", cohort: "2023-2025", hometown: "日本 · 东京都", position: "主攻手 (OH)", birthday: "2006年10月25日", height: "197 cm", weight: "82 kg", spike_reach: "347 cm", block_reach: "330 cm", dominant_hand: "右", club_history: [{ period: "2022 - 2025", team: "骏台学园 (すんだいがくえん)", league: "2025春高三连霸王牌" }, { period: "2025 -", team: "早稻田大学 (わせだだいがく)", league: "关东大学1部联赛" }], national_history: [{ period: "2025", team: "日本 U21 代表", tournaments: ["U21青年锦标赛"] }] },
  { id: "p4", name_zh: "石川祐希", name_ja: "石川 祐希", name_hira: "いしかわ ゆうき", name_en: "Yuki Ishikawa", team_name: "佩鲁贾 (Perugia) / 中央大学 / 星城高校", cohort: "历届知名校友", hometown: "日本 · 爱知县冈崎市", position: "主攻手 (OH)", birthday: "1995年12月11日", height: "192 cm", weight: "90 kg", spike_reach: "351 cm", block_reach: "327 cm", dominant_hand: "右", club_history: [{ period: "2024 - 2026", team: "Sir Sicoma Monini Perugia (佩鲁贾)", league: "意大利超级联赛" }, { period: "2014 - 2018", team: "中央大学 (ちゅうおうだいがく)", league: "全日本インカレ冠军" }], national_history: [{ period: "2021 - 2026", team: "日本国家男子排球队 (队长)", tournaments: ["2024 巴黎奥运会", "VNL 银牌"] }] },
  { id: "p5", name_zh: "高桥蓝", name_ja: "髙橋 藍", name_hira: "たかはし らん", name_en: "Ran Takahashi", team_name: "三得利太阳鸟大阪 / 东山高校", cohort: "历届知名校友", hometown: "日本 · 京都府", position: "主攻手 (OH)", birthday: "2001年9月2日", height: "188 cm", weight: "83 kg", spike_reach: "343 cm", block_reach: "315 cm", dominant_hand: "右", club_history: [{ period: "2024 - 2026", team: "三得利太阳鸟大阪 (サントリー)", league: "日本 SV.LEAGUE" }, { period: "2017 - 2020", team: "东山高校 (ひがしやま)", league: "2020春高全国优胜 & MVP" }], national_history: [{ period: "2020 - 2026", team: "日本国家男子排球队", tournaments: ["2024 巴黎奥运会", "VNL 银牌"] }] },
];

// ==================== 5. 豆瓣小组格式初始帖子库 ====================
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
      { id: "c2", author: "Sundai_Fan", content: "骏台虽然止步四强，但竹内庆一郎和堀内晴翔这届已经很传奇了。", time: "11-03 12:12", likes: 12, liked: false },
    ],
  },
  {
    id: "db-2",
    category: "跨界/国字号",
    isEssence: true,
    title: "天皇杯跨界看点 & 今年U19/U21国青队入选名单讨论专楼",
    author: "实验数据",
    lastReplyTime: "11-03 11:50",
    likes: 64,
    liked: false,
    content: "今年天皇杯又有駿台学園和早稲田大学越级打SV.LEAGUE职业俱乐部的比赛了！另外U21名单里川野琢磨和秋本悠月都在，大家最期待谁的表现？",
    comments: [
      { id: "c3", author: "Waseda_VB", content: "早稻田去年天皇杯把职业队逼到决胜局太燃了！", time: "11-03 11:50", likes: 8, liked: false },
    ],
  },
  {
    id: "db-3",
    category: "大学联赛",
    isEssence: false,
    title: "关东大学1部春联/秋联 & 全日本インカレ历届决赛比分整理（持续更新）",
    author: "北贝UO",
    lastReplyTime: "11-03 11:29",
    likes: 41,
    liked: false,
    content: "整理了早稻田、中央大、明治大、顺天堂、筑波、庆应义塾近三年的交手记录，欢迎大家在楼里补充各校新入部1年生名单！",
    comments: [],
  },
];

export default function Home() {
  const [lang, setLang] = useState<"ZH" | "JA" | "EN">("ZH");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // ==================== 账号与管理员权限状态 ====================
  const [currentUser, setCurrentUser] = useState<{ username: string; role: "admin" | "user" } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // 一级主导航
  const [mainTab, setMainTab] = useState<string>("首页");

  // 高校 & 大学 状态
  const [subTab, setSubTab] = useState<"赛事" | "学校">("赛事");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedTournament, setSelectedTournament] = useState<string>("春高");
  const [selectedRound, setSelectedRound] = useState<string>("1回戦");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "Men" | "Women">("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("东京");

  // 职业俱乐部 状态
  const [selectedCountry, setSelectedCountry] = useState<string>("日本 (SV.LEAGUE)");

  // 「其他」板块状态
  const [otherPrimaryTab, setOtherPrimaryTab] = useState<string>("天皇杯・皇后杯");
  const [otherSubTab, setOtherSubTab] = useState<"赛程" | "比分" | "入选选手">("赛程");

  // 下钻详情页状态
  const [activeSchool, setActiveSchool] = useState<any | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<string>("2024-2026");
  const [activePlayer, setActivePlayer] = useState<any | null>(null);

  // 豆瓣小组式论坛状态
  const [posts, setPosts] = useState<any[]>(INITIAL_POSTS);
  const [forumCategory, setForumCategory] = useState<string>("全部");
  const [forumSort, setForumSort] = useState<"recent" | "hot" | "essence">("recent");
  const [showPostForm, setShowPostForm] = useState<boolean>(false);
  const [newPostCategory, setNewPostCategory] = useState<string>("春高/高中");
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const [teams] = useState<any[]>(INITIAL_TEAMS);
  const [players] = useState<any[]>(INITIAL_PLAYERS);
  const [matches] = useState<any[]>(INITIAL_MATCHES);

  // 初始化读取本地保存的帖子与登录状态
  useEffect(() => {
    const savedPosts = localStorage.getItem("volleyhub_douban_posts_v4");
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {}
    }
    const savedSession = localStorage.getItem("volleyhub_current_user");
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {}
    }
  }, []);

  const savePostsToLocal = (updated: any[]) => {
    setPosts(updated);
    try {
      localStorage.setItem("volleyhub_douban_posts_v4", JSON.stringify(updated));
    } catch (e) {}
  };

  // ==================== 注册 / 登录 / 退出逻辑 ====================
  const handleAuthSubmit = () => {
    setAuthError("");
    const uname = authUsername.trim();
    const pwd = authPassword.trim();

    if (!uname || !pwd) {
      setAuthError("请输入用户名和密码！");
      return;
    }

    // 1. 优先检查是否为预置管理员账号 (admin 或 inukai，密码 volley2026)
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
        setAuthError("管理员密码错误！（默认管理员密码：volley2026）");
        return;
      }
    }

    // 2. 普通用户注册与登录（保存在浏览器本地用户库）
    const rawUsers = localStorage.getItem("volleyhub_registered_users");
    const usersMap: { [key: string]: string } = rawUsers ? JSON.parse(rawUsers) : {};

    if (authMode === "register") {
      if (usersMap[uname]) {
        setAuthError("该用户名已被注册，请直接切换到「登录」！");
        return;
      }
      usersMap[uname] = pwd;
      localStorage.setItem("volleyhub_registered_users", JSON.stringify(usersMap));
      const normalUser = { username: uname, role: "user" as const };
      setCurrentUser(normalUser);
      localStorage.setItem("volleyhub_current_user", JSON.stringify(normalUser));
      setShowAuthModal(false);
      setAuthUsername("");
      setAuthPassword("");
    } else {
      if (!usersMap[uname]) {
        setAuthError("该账号尚未注册，请先点击切换到「注册新账号」！");
        return;
      }
      if (usersMap[uname] !== pwd) {
        setAuthError("密码不正确，请重新输入！");
        return;
      }
      const normalUser = { username: uname, role: "user" as const };
      setCurrentUser(normalUser);
      localStorage.setItem("volleyhub_current_user", JSON.stringify(normalUser));
      setShowAuthModal(false);
      setAuthUsername("");
      setAuthPassword("");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("volleyhub_current_user");
  };

  // ==================== 论坛：发帖 / 删帖 / 加精 / 删评论 ====================
  const publishPost = () => {
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

    const created = {
      id: "db-" + Date.now(),
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

    const nextPosts = [created, ...posts];
    savePostsToLocal(nextPosts);
    setNewPostTitle("");
    setNewPostContent("");
    setShowPostForm(false);
    setForumCategory("全部");
    setActivePostId(created.id);
  };

  // 权限判断：管理员可删所有帖子；普通用户只能删自己发的帖子
  const canDeleteItem = (authorName: string) => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    return currentUser.username === authorName;
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = posts.filter((p) => p.id !== postId);
    savePostsToLocal(updated);
    if (activePostId === postId) setActivePostId(null);
  };

  // 管理员专属：一键设为精华 / 取消精华
  const handleToggleEssence = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.role !== "admin") return;
    const updated = posts.map((p) => (p.id === postId ? { ...p, isEssence: !p.isEssence } : p));
    savePostsToLocal(updated);
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: (p.comments || []).filter((c: any) => c.id !== commentId),
      };
    });
    savePostsToLocal(updated);
  };

  const handleTogglePostLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, liked: !p.liked, likes: !p.liked ? p.likes + 1 : p.likes - 1 } : p
    );
    savePostsToLocal(updated);
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        lastReplyTime: timeStr,
        comments: [
          ...(p.comments || []),
          { id: "c-" + Date.now(), author: currentUser.username, content: text, time: timeStr, likes: 0, liked: false },
        ],
      };
    });
    savePostsToLocal(updated);
    setCommentInputs({ ...commentInputs, [postId]: "" });
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
    "ALL", "东京", "京都", "大阪", "神奈川", "熊本", "福冈", "福井", "秋田", "宫城", "北海道",
    "青森", "岩手", "山形", "福岛", "茨城", "栃木", "群马", "埼玉", "千叶", "山梨", "长野",
    "新潟", "富山", "石川", "岐阜", "静冈", "爱知", "三重", "滋贺", "兵库", "奈良", "和歌山",
    "鸟取", "岛根", "冈山", "广岛", "山口", "德岛", "香川", "爱媛", "高知", "佐贺", "长崎",
    "大分", "宫崎", "鹿儿岛", "冲绳"
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
    const matchSearch =
      !globalSearch ||
      m.home_team.toLowerCase().includes(globalSearch.toLowerCase()) ||
      m.away_team.toLowerCase().includes(globalSearch.toLowerCase());
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
    .filter(
      (p) =>
        !globalSearch ||
        p.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.author.toLowerCase().includes(globalSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (forumSort === "hot") return (b.comments?.length || 0) + b.likes - ((a.comments?.length || 0) + a.likes);
      return 0;
    });

  const currentOtherData = OTHER_TOURNAMENTS_DATA[otherPrimaryTab];

  return (
    <main className={`min-h-screen ${theme.bgWrapper} backdrop-blur-[3px] font-sans transition-colors duration-300 pb-24`}>
      {/* ==================== 登录 / 注册 模态弹窗 ==================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-md border-2 ${theme.border} ${theme.cardBg} p-6 md:p-8 shadow-2xl space-y-5`}>
            <div className="flex justify-between items-center border-b pb-3 border-zinc-300 dark:border-zinc-700">
              <h3 className="text-lg font-black tracking-tight">
                {authMode === "login" ? "🔑 账号登录" : "📝 注册新账号"}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-sm opacity-60 hover:opacity-100 cursor-pointer">
                ✕
              </button>
            </div>

            {/* 切换登录 / 注册 Tab */}
            <div className="grid grid-cols-2 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`py-2 cursor-pointer ${authMode === "login" ? "bg-[#3d95ad] text-white" : "opacity-70"}`}
              >
                已有账号登录
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`py-2 cursor-pointer ${authMode === "register" ? "bg-[#3d95ad] text-white" : "opacity-70"}`}
              >
                新用户注册
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold mb-1">用户名</label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder={authMode === "login" ? "输入用户名" : "设置你的社区昵称..."}
                  className={`w-full border ${theme.border} bg-transparent px-3 py-2 text-sm rounded-xs`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">密码</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={authMode === "login" ? "输入密码" : "设置你的登录密码..."}
                  className={`w-full border ${theme.border} bg-transparent px-3 py-2 text-sm rounded-xs`}
                />
              </div>

              {authError && <p className="text-xs text-rose-500 font-bold">{authError}</p>}

              <div className="text-[11px] opacity-65 bg-zinc-500/10 p-2.5 rounded-xs leading-relaxed">
                💡 <strong>权限说明</strong>：<br />
                · 可自由注册账号并设置密码，发布帖子与评论，且<strong>只能删除自己发布的帖子和评论</strong>。<br />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 text-xs border border-zinc-400 rounded-xs cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAuthSubmit}
                className="px-6 py-2 bg-[#3d95ad] text-white text-xs font-bold rounded-xs hover:opacity-90 cursor-pointer"
              >
                {authMode === "login" ? "立即登录" : "完成注册并登录"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 顶部导航栏 ==================== */}
      <header className={`sticky top-0 z-40 border-b ${theme.headerBg} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className={`flex flex-wrap items-center justify-between py-4 border-b ${theme.border} gap-4`}>
            <div onClick={() => handleMainNav("首页")} className="cursor-pointer flex items-baseline gap-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic">
                VolleyHub<span className="text-amber-600 not-italic">.</span>
              </h1>
              <span className={`text-[11px] font-mono uppercase tracking-widest px-2 py-0.5 border ${theme.border} rounded-sm`}>
                ARCHIVE 2026
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center border ${theme.border} rounded-full px-3.5 py-1.5 bg-transparent`}>
                <span className="text-xs mr-2 opacity-60">🔍</span>
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="搜索选手 / 学校 / 赛事..."
                  className="bg-transparent text-xs focus:outline-none w-32 md:w-44"
                />
                {globalSearch && (
                  <button onClick={() => setGlobalSearch("")} className="text-xs opacity-60 hover:opacity-100 ml-1">
                    ✕
                  </button>
                )}
              </div>

              <div className={`flex items-center border ${theme.border} rounded-md overflow-hidden text-xs font-mono`}>
                {(["ZH", "JA", "EN"] as const).map((l, idx) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 transition ${idx > 0 ? `border-l ${theme.border}` : ""} ${
                      lang === l ? theme.accentBg + " font-bold" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {l === "ZH" ? "中" : l === "JA" ? "日" : "EN"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsDark(!isDark)}
                className={`flex items-center border ${theme.border} rounded-full px-2.5 py-1 text-xs gap-1 hover:opacity-80`}
              >
                <span className={!isDark ? "opacity-100 font-bold" : "opacity-40"}>☀️</span>
                <span className="opacity-30">|</span>
                <span className={isDark ? "opacity-100 font-bold" : "opacity-40"}>🌙</span>
              </button>

              {/* 顶部账号状态按钮 */}
              {currentUser ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-xs font-bold ${currentUser.role === "admin" ? "bg-amber-500 text-zinc-950" : "bg-[#3d95ad] text-white"}`}>
                    {currentUser.role === "admin" ? `🛡️ 管理员: ${currentUser.username}` : `👤 ${currentUser.username}`}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`px-2 py-1 border ${theme.border} rounded-xs opacity-75 hover:opacity-100 cursor-pointer`}
                  >
                    退出
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`px-3 py-1 text-xs font-bold border ${theme.border} rounded-xs hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer`}
                >
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
                  <button
                    onClick={() => handleMainNav(item.id)}
                    className={`px-3 md:px-4 py-1 rounded-sm transition whitespace-nowrap cursor-pointer ${
                      active
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 underline decoration-2 underline-offset-4"
                        : "hover:opacity-70"
                    }`}
                  >
                    {item.label}
                  </button>
                  <span className="opacity-30 font-light mx-1">|</span>
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ==================== 主体容器 ==================== */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8">
        {/* 1. 选手个人档案页 */}
        {activePlayer ? (
          <div className={`border ${theme.border} ${theme.cardBg} backdrop-blur-md shadow-sm`}>
            <div className={`flex items-center justify-between px-6 py-3 border-b ${theme.border} text-xs font-mono`}>
              <button onClick={() => setActivePlayer(null)} className="hover:underline font-bold cursor-pointer">
                ← 返回上一级
              </button>
              <span>PLAYER ARCHIVE · {activePlayer.name_en}</span>
            </div>

            <div className={`px-6 md:px-10 py-6 border-b ${theme.border} flex flex-wrap justify-between items-end gap-4`}>
              <div>
                <div className="text-xs font-mono text-amber-600 font-bold mb-1">{activePlayer.name_hira}</div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">{getName(activePlayer)}</h2>
                <p className="text-xs opacity-60 mt-1 font-mono">
                  {activePlayer.name_ja} ({activePlayer.name_hira})
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-mono border ${theme.border} rounded-full`}>
                  {activePlayer.team_name}
                </span>
                <span className={`px-3 py-1 text-xs font-mono ${theme.accentBg} rounded-full`}>
                  {activePlayer.position}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className={`md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r ${theme.border} space-y-3.5`}>
                <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">PERSONAL PROFILE</h3>
                {[
                  { label: "出身", value: activePlayer.hometown },
                  { label: "位置", value: activePlayer.position },
                  { label: "生日", value: activePlayer.birthday },
                  { label: "身高", value: activePlayer.height },
                  { label: "击球高度", value: activePlayer.spike_reach },
                  { label: "拦网高度", value: activePlayer.block_reach },
                  { label: "惯用手", value: activePlayer.dominant_hand },
                ].map((attr) => (
                  <div key={attr.label} className={`flex justify-between items-baseline py-2 border-b ${theme.border} text-sm`}>
                    <span className="opacity-65 font-medium">{attr.label}</span>
                    <span className="font-mono font-bold">{attr.value}</span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-8 flex flex-col">
                <div className={`p-6 md:p-8 border-b ${theme.border} flex-1`}>
                  <h3 className="text-lg font-black tracking-tight mb-4">球队经验 / CLUB & SCHOOL</h3>
                  <div className="space-y-3">
                    {(activePlayer.club_history || []).map((exp: any, i: number) => (
                      <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border ${theme.border} rounded-sm`}>
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-600 block">{exp.period}</span>
                          <span className="text-base font-bold">{exp.team}</span>
                        </div>
                        <span className="text-xs opacity-70 font-mono mt-1 sm:mt-0">{exp.league}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1">
                  <h3 className="text-lg font-black tracking-tight mb-4">代表队与获奖经历 / REPRESENTATIVE</h3>
                  <div className="space-y-3">
                    {(activePlayer.national_history || []).map((nat: any, i: number) => (
                      <div key={i} className={`p-4 border ${theme.border} rounded-sm`}>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-bold text-sm">{nat.team}</span>
                          <span className="font-mono text-xs text-amber-600 font-bold">{nat.period}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(nat.tournaments || []).map((t: string, idx: number) => (
                            <span key={idx} className={`text-xs px-2.5 py-1 border ${theme.border} rounded-sm font-mono`}>
                              🏆 {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSchool ? (
          /* ==================== 2. 学校 / 俱乐部 队员名册页 ==================== */
          <div className={`border ${theme.border} ${theme.cardBg} backdrop-blur-md`}>
            <div className={`px-6 py-4 border-b ${theme.border} flex flex-wrap items-center justify-between gap-4`}>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveSchool(null)}
                  className={`px-3 py-1 text-xs font-mono border ${theme.border} hover:opacity-70 font-bold cursor-pointer`}
                >
                  ← 返回列表
                </button>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${theme.border}`}>
                  {activeSchool.region || activeSchool.country || selectedRegion}
                </span>
                <div>
                  {activeSchool.name_hira && (
                    <span className="text-[11px] font-mono text-amber-600 block">{activeSchool.name_hira}</span>
                  )}
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">{getName(activeSchool)}</h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
              <div className={`md:col-span-3 border-b md:border-b-0 md:border-r ${theme.border} p-4 space-y-2`}>
                <div className="text-[11px] font-mono uppercase opacity-50 px-2 mb-3">ROSTER YEARS</div>
                {["2024-2026", "2023-2025", "历届知名校友"].map((cohort) => (
                  <button
                    key={cohort}
                    onClick={() => setSelectedCohort(cohort)}
                    className={`w-full text-left px-4 py-3 font-mono text-sm border-b ${theme.border} transition flex justify-between items-center cursor-pointer ${
                      selectedCohort === cohort ? "bg-amber-500/20 font-black border-l-4 border-l-amber-600" : "hover:opacity-70"
                    }`}
                  >
                    <span>{cohort}</span>
                    {selectedCohort === cohort && <span>→</span>}
                  </button>
                ))}
              </div>

              <div className="md:col-span-9 p-6 md:p-8 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b-2 ${theme.border} text-xs font-mono uppercase opacity-70`}>
                      <th className="py-3 px-4">姓名</th>
                      <th className="py-3 px-4">身高</th>
                      <th className="py-3 px-4">摸高</th>
                      <th className="py-3 px-4">位置</th>
                      <th className="py-3 px-4 text-right">档案</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-300/50 dark:divide-zinc-800">
                    {players
                      .filter((p) => {
                        if (!activeSchool || !p.team_name) return false;
                        return (
                          p.team_name.includes(activeSchool.name_zh) ||
                          (activeSchool.name_ja && p.team_name.includes(activeSchool.name_ja))
                        );
                      })
                      .map((player) => (
                        <tr
                          key={player.id}
                          onClick={() => setActivePlayer(player)}
                          className="cursor-pointer hover:bg-amber-500/10 transition group"
                        >
                          <td className="py-4 px-4">
                            <div className="text-[11px] font-mono text-amber-600">{player.name_hira}</div>
                            <div className="font-bold text-base group-hover:underline">{getName(player)}</div>
                          </td>
                          <td className="py-4 px-4 font-mono text-sm">{player.height}</td>
                          <td className="py-4 px-4 font-mono text-sm font-bold text-amber-600">{player.spike_reach}</td>
                          <td className="py-4 px-4 text-sm">{player.position}</td>
                          <td className="py-4 px-4 text-right font-mono text-xs opacity-60 group-hover:opacity-100">
                            查看 →
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : mainTab === "首页" ? (
          /* ==================== 3. 首页 2x2 矩阵 ==================== */
          <div className="space-y-10">
            <div className={`border-b ${theme.border} pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4`}>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">
                  VOLLEYBALL ARCHIVE & COMMUNITY
                </p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                  SELECT PORTAL.
                </h2>
              </div>
              <p className="text-xs md:text-sm opacity-75 max-w-md">
                收录高校排球（春高/IH/国体）、大学联赛（春联/秋联/东日/全日）、职业俱乐部及天皇杯、U19/U21档案。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "高校", title: "高校 (高中)", en: "HIGH SCHOOL", sub: "春高全轮次(1回戦~決勝)球场比分卡 · IH · 国体 · 47都道府县出场校名录", badge: "春高对阵表已补全" },
                { id: "职业俱乐部", title: "职业俱乐部", en: "PRO CLUBS", sub: "二级导航：日本 / 意大利 / 波兰 ｜ 三级：三得利 / 名古屋狼犬 / 佩鲁贾", badge: "职业联赛档案" },
                { id: "大学", title: "大学", en: "UNIVERSITY", sub: "春联 · 秋联 · 东日 · 全日 四大高校联赛赛果与关东/关西大学名门", badge: "大学四大赛事" },
                { id: "其他", title: "其他 (天皇杯 / U21 / U19)", en: "TOURNAMENTS", sub: "一级：天皇杯・皇后杯 · U21 · U19 ｜ 二级：赛程 / 比分 / 入选选手", badge: "跨界与国青档案" },
              ].map((card, i) => (
                <div
                  key={card.id}
                  onClick={() => handleMainNav(card.id)}
                  className={`group relative overflow-hidden border ${theme.border} ${theme.cardBg} p-8 md:p-10 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between min-h-[210px]`}
                >
                  <span className="absolute -bottom-6 -right-4 text-6xl font-black tracking-tighter opacity-[0.05] pointer-events-none font-mono">
                    {card.en}
                  </span>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono opacity-50">0{i + 1} / PORTAL</span>
                    <span className={`text-xs font-mono px-2.5 py-1 border ${theme.border} rounded-full`}>{card.badge}</span>
                  </div>
                  <div className="my-6">
                    <h3 className="text-3xl font-black group-hover:text-amber-600 transition">{card.title}</h3>
                    <p className="text-xs md:text-sm opacity-75 mt-2">{card.sub}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pt-4 border-t border-zinc-300/50 dark:border-zinc-800">
                    <span>ENTER</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : mainTab === "其他" ? (
          /* ==================== 4. 「其他」板块：天皇杯 & U21 / U19 ==================== */
          <div className="space-y-6">
            <div className={`flex flex-wrap items-center gap-3 border-b ${theme.border} pb-4`}>
              {Object.keys(OTHER_TOURNAMENTS_DATA).map((key) => {
                const active = otherPrimaryTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setOtherPrimaryTab(key);
                      setOtherSubTab("赛程");
                    }}
                    className={`px-5 py-2.5 text-sm md:text-base font-black tracking-tight border ${theme.border} transition cursor-pointer ${
                      active ? "bg-amber-500 text-zinc-950 border-amber-500" : `${theme.cardBg} opacity-75 hover:opacity-100`
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            <div className={`flex flex-wrap items-center justify-between border ${theme.border} ${theme.cardBg} p-5 gap-4`}>
              <div className="flex items-center text-lg md:text-xl font-black">
                <span className="opacity-30 mr-3">|</span>
                <button
                  onClick={() => setOtherSubTab("赛程")}
                  className={`px-4 py-1 rounded-xs transition cursor-pointer ${
                    otherSubTab === "赛程" ? theme.accentBg : "opacity-55 hover:opacity-100"
                  }`}
                >
                  赛程
                </button>
                <span className="opacity-30 mx-3">|</span>
                {currentOtherData.type === "cup" ? (
                  <button
                    onClick={() => setOtherSubTab("比分")}
                    className={`px-4 py-1 rounded-xs transition cursor-pointer ${
                      otherSubTab === "比分" ? theme.accentBg : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    比分
                  </button>
                ) : (
                  <button
                    onClick={() => setOtherSubTab("入选选手")}
                    className={`px-4 py-1 rounded-xs transition cursor-pointer ${
                      otherSubTab === "入选选手" ? theme.accentBg : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    入选选手
                  </button>
                )}
                <span className="opacity-30 ml-3">|</span>
              </div>
              <div className="text-xs opacity-75">{currentOtherData.desc}</div>
            </div>

            {otherSubTab === "赛程" && (
              <div className={`border ${theme.border} ${theme.cardBg} overflow-x-auto`}>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className={`border-b-2 ${theme.border} text-xs font-mono uppercase opacity-70`}>
                      <th className="py-3.5 px-5">日期</th>
                      <th className="py-3.5 px-5">轮次</th>
                      <th className="py-3.5 px-5">对阵双方</th>
                      <th className="py-3.5 px-5">场馆 / 备注</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-300/50 dark:divide-zinc-800">
                    {currentOtherData.schedule.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-500/5">
                        <td className="py-4 px-5 font-mono text-xs">{item.date}</td>
                        <td className="py-4 px-5 font-bold text-amber-600">{item.round}</td>
                        <td className="py-4 px-5 font-black text-base">{item.match}</td>
                        <td className="py-4 px-5 text-xs font-mono opacity-75">
                          {item.venue} · {item.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {otherSubTab === "比分" && currentOtherData.scores && (
              <div className="space-y-4">
                {currentOtherData.scores.map((sc) => (
                  <div key={sc.id} className={`border ${theme.border} ${theme.cardBg} p-6`}>
                    <div className={`flex justify-between items-center pb-3 mb-4 border-b ${theme.border} text-xs font-mono`}>
                      <span className={`px-2.5 py-0.5 font-bold ${theme.accentBg}`}>{sc.round}</span>
                      <span>{sc.date}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 text-center">
                      <div className="md:col-span-4 md:text-right">
                        <span className="text-[11px] font-mono px-2 py-0.5 border border-amber-500/50 text-amber-600 rounded-full">
                          {sc.home_cat}
                        </span>
                        <div className="text-xl font-black mt-1">{sc.home}</div>
                      </div>
                      <div className="md:col-span-3">
                        <div className="text-2xl font-black font-mono">{sc.score}</div>
                        <div className="text-xs font-mono opacity-65 mt-1">局分: {sc.sets}</div>
                      </div>
                      <div className="md:col-span-4 md:text-left">
                        <span className="text-[11px] font-mono px-2 py-0.5 border border-amber-500/50 text-amber-600 rounded-full">
                          {sc.away_cat}
                        </span>
                        <div className="text-xl font-black mt-1">{sc.away}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {otherSubTab === "入选选手" && currentOtherData.roster && (
              <div className={`border ${theme.border} ${theme.cardBg} overflow-x-auto`}>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className={`border-b-2 ${theme.border} text-xs font-mono uppercase opacity-70`}>
                      <th className="py-3.5 px-5">姓名 (平假名读音)</th>
                      <th className="py-3.5 px-5">位置</th>
                      <th className="py-3.5 px-5">身高</th>
                      <th className="py-3.5 px-5">摸高</th>
                      <th className="py-3.5 px-5">所属学校 / 年级</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-300/50 dark:divide-zinc-800">
                    {currentOtherData.roster.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => {
                          const found = players.find((p) => p.name_zh === r.name_zh);
                          if (found) setActivePlayer(found);
                        }}
                        className="hover:bg-amber-500/10 cursor-pointer transition"
                      >
                        <td className="py-4 px-5">
                          <div className="text-[11px] font-mono text-amber-600">{r.name_hira}</div>
                          <div className="font-bold text-base">{r.name_zh} ({r.name_ja})</div>
                        </td>
                        <td className="py-4 px-5 font-mono text-xs font-bold">{r.pos}</td>
                        <td className="py-4 px-5 font-mono">{r.height}</td>
                        <td className="py-4 px-5 font-mono font-bold text-amber-600">{r.spike}</td>
                        <td className="py-4 px-5">
                          <span className="font-bold">{r.school}</span>
                          <span className="ml-2 text-xs font-mono opacity-60">({r.grade})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : mainTab === "职业俱乐部" ? (
          /* ==================== 5. 职业俱乐部视图 ==================== */
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {["日本 (SV.LEAGUE)", "意大利 (Serie A1)", "波兰 (PlusLiga)"].map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-5 py-2.5 text-sm font-black border ${theme.border} transition cursor-pointer ${
                    selectedCountry === country ? "bg-amber-500 text-zinc-950" : `${theme.cardBg} opacity-75`
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams
                .filter((t) => t.main_category === "职业俱乐部" && t.country === selectedCountry)
                .map((club) => (
                  <div
                    key={club.id}
                    onClick={() => setActiveSchool(club)}
                    className={`border ${theme.border} ${theme.cardBg} p-6 cursor-pointer hover:shadow-lg transition`}
                  >
                    <div className="text-xs font-mono text-amber-600">{club.name_hira}</div>
                    <h3 className="text-xl font-black mt-1">{getName(club)}</h3>
                    <p className="text-xs opacity-60 font-mono mt-1">{club.league}</p>
                    <p className="text-xs mt-4 pt-3 border-t border-zinc-300/50 font-bold">代表球星：{club.stars}</p>
                  </div>
                ))}
            </div>
          </div>
        ) : mainTab === "论坛" ? (
          /* ==================== 6. 豆瓣小组格式论坛 (含注册登录与管理员删帖权限) ==================== */
          <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8 shadow-xs`}>
            {/* 顶部当前身份提示条 */}
            <div className={`mb-5 p-3.5 border ${theme.border} bg-zinc-500/5 flex flex-wrap items-center justify-between gap-3 text-xs`}>
              <div>
                {currentUser ? (
                  <span>
                    当前登录：<strong>{currentUser.username}</strong>{" "}
                    {currentUser.role === "admin" ? (
                      <span className="text-amber-600 font-bold">（管理员权限：可删除任意人的帖子与评论、可设置精华）</span>
                    ) : (
                      <span className="opacity-70">（普通用户权限：可发布新帖，并可删除自己发布的帖子与评论）</span>
                    )}
                  </span>
                ) : (
                  <span className="opacity-75">
                    你当前处于游客浏览状态。点击注册或登录发布帖子。
                  </span>
                )}
              </div>
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1 bg-[#3d95ad] text-white font-bold rounded-xs cursor-pointer"
                >
                  去登录 / 注册账号 →
                </button>
              )}
            </div>

            {/* 第一排：豆瓣分类标签 */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800 text-sm">
              {["全部", "春高/高中", "大学联赛", "职业俱乐部", "跨界/国字号", "求资源/问答"].map((cat) => {
                const active = forumCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setForumCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xs transition cursor-pointer font-medium ${
                      active
                        ? "bg-[#3d95ad] text-white font-bold shadow-xs"
                        : "text-[#257985] dark:text-sky-400 hover:bg-[#3d95ad]/10"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* 第二排：排序 + 右侧「+发言」按钮 */}
            <div className="flex flex-wrap items-center justify-between py-4 gap-4">
              <div className="flex items-center gap-2 text-sm md:text-base font-bold">
                <button
                  onClick={() => setForumSort("recent")}
                  className={`cursor-pointer ${forumSort === "recent" ? "text-[#1f6f78] dark:text-amber-400 underline underline-offset-4" : "text-[#257985] opacity-70 hover:opacity-100"}`}
                >
                  最近讨论
                </button>
                <span className="opacity-30">/</span>
                <button
                  onClick={() => setForumSort("hot")}
                  className={`cursor-pointer ${forumSort === "hot" ? "text-[#1f6f78] dark:text-amber-400 underline underline-offset-4" : "text-[#257985] opacity-70 hover:opacity-100"}`}
                >
                  最热讨论
                </button>
                <span className="opacity-30">/</span>
                <button
                  onClick={() => setForumSort("essence")}
                  className={`cursor-pointer ${forumSort === "essence" ? "text-[#1f6f78] dark:text-amber-400 underline underline-offset-4" : "text-[#257985] opacity-70 hover:opacity-100"}`}
                >
                  精华讨论
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    setShowAuthModal(true);
                  } else {
                    setShowPostForm(!showPostForm);
                  }
                }}
                className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-[#ca6445] font-bold text-sm rounded-xs hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer"
              >
                {showPostForm ? "✕ 收起发言框" : "+ 发言"}
              </button>
            </div>

            {/* 发帖面板 */}
            {showPostForm && currentUser && (
              <div className="my-4 p-5 border-2 border-[#3d95ad]/50 bg-[#3d95ad]/5 rounded-xs space-y-4">
                <div className="text-sm font-bold text-[#1f6f78] dark:text-sky-300">
                  以「{currentUser.username}」身份发布新讨论
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className={`border ${theme.border} bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold rounded-xs`}
                  >
                    <option value="春高/高中">分区：春高/高中</option>
                    <option value="大学联赛">分区：大学联赛</option>
                    <option value="职业俱乐部">分区：职业俱乐部</option>
                    <option value="跨界/国字号">分区：跨界/国字号</option>
                    <option value="求资源/问答">分区：求资源/问答</option>
                  </select>

                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="【必填】请输入讨论标题..."
                    className={`md:col-span-3 border ${theme.border} bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-bold rounded-xs`}
                  />
                </div>

                <textarea
                  rows={3}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="输入帖子正文内容..."
                  className={`w-full border ${theme.border} bg-white dark:bg-zinc-900 p-3 text-sm rounded-xs`}
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-4 py-1.5 text-xs border border-zinc-400 rounded-xs cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={publishPost}
                    className="px-6 py-1.5 bg-[#3d95ad] text-white font-bold text-xs rounded-xs hover:opacity-90 cursor-pointer"
                  >
                    立即发布发言
                  </button>
                </div>
              </div>
            )}

            {/* 豆瓣小组四列表格 + 操作列 */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-300 dark:border-zinc-700 text-xs text-zinc-500">
                    <th className="py-2.5 px-2 font-normal w-[52%]">讨论</th>
                    <th className="py-2.5 px-2 font-normal w-[14%]">作者</th>
                    <th className="py-2.5 px-2 font-normal w-[8%] text-center">回复</th>
                    <th className="py-2.5 px-2 font-normal w-[14%] text-right">最后回复</th>
                    <th className="py-2.5 px-2 font-normal w-[12%] text-right">管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
                  {displayedPosts.map((post) => {
                    const isOpen = activePostId === post.id;
                    const allowDel = canDeleteItem(post.author);
                    return (
                      <React.Fragment key={post.id}>
                        <tr
                          onClick={() => setActivePostId(isOpen ? null : post.id)}
                          className="hover:bg-[#3d95ad]/5 cursor-pointer transition"
                        >
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {post.isEssence && (
                                <span className="px-1.5 py-0.5 bg-[#e86077] text-white text-[11px] font-bold rounded-xs">
                                  精华
                                </span>
                              )}
                              <span className="text-[#257985] dark:text-sky-400 font-medium">
                                {post.category}
                              </span>
                              <span className="opacity-40">｜</span>
                              <span className="text-[#1f6f78] dark:text-sky-200 font-medium hover:underline">
                                {post.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-[#257985] dark:text-sky-400 text-xs">
                            {post.author}
                          </td>
                          <td className="py-3.5 px-2 text-center font-mono text-xs text-zinc-600 dark:text-zinc-400">
                            {(post.comments || []).length}
                          </td>
                          <td className="py-3.5 px-2 text-right font-mono text-xs text-zinc-400">
                            {post.lastReplyTime}
                          </td>
                          <td className="py-3.5 px-2 text-right space-x-2 whitespace-nowrap">
                            {currentUser?.role === "admin" && (
                              <button
                                type="button"
                                onClick={(e) => handleToggleEssence(post.id, e)}
                                className="text-[11px] text-amber-600 hover:underline font-bold cursor-pointer"
                              >
                                {post.isEssence ? "取消加精" : "加精"}
                              </button>
                            )}
                            {allowDel && (
                              <button
                                type="button"
                                onClick={(e) => handleDeletePost(post.id, e)}
                                className="text-[11px] text-rose-500 hover:underline font-bold cursor-pointer"
                              >
                                {currentUser?.role === "admin" && currentUser.username !== post.author ? "管理员删除" : "删除"}
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* 展开帖子详情与回应 */}
                        {isOpen && (
                          <tr>
                            <td colSpan={5} className="bg-zinc-500/5 p-5 border-l-4 border-l-[#3d95ad]">
                              <div className="space-y-4">
                                <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
                                <div className="flex items-center gap-4 text-xs">
                                  <button
                                    type="button"
                                    onClick={(e) => handleTogglePostLike(post.id, e)}
                                    className={`px-3 py-1 rounded-xs border ${theme.border} cursor-pointer ${
                                      post.liked ? "bg-rose-500 text-white border-rose-500 font-bold" : ""
                                    }`}
                                  >
                                    {post.liked ? "❤️ 已赞同" : "🤍 赞同"} ({post.likes})
                                  </button>
                                  <span className="opacity-60">共 {(post.comments || []).length} 条回应</span>
                                </div>

                                {/* 回应列表（支持作者本人或管理员删除单条回应） */}
                                <div className="space-y-2.5 pt-2 border-t border-zinc-300/50 dark:border-zinc-800">
                                  {(post.comments || []).map((c: any) => (
                                    <div key={c.id} className="text-xs py-2 border-b border-zinc-200/50 dark:border-zinc-800/60 flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                          <strong className="text-[#257985] dark:text-sky-400">{c.author}</strong>
                                          <span className="font-mono">{c.time}</span>
                                        </div>
                                        <p className="text-sm">{c.content}</p>
                                      </div>

                                      {canDeleteItem(c.author) && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteComment(post.id, c.id)}
                                          className="text-[11px] text-rose-500 hover:underline font-bold cursor-pointer"
                                        >
                                          删除回应
                                        </button>
                                      )}
                                    </div>
                                  ))}

                                  {/* 添加回应输入框 */}
                                  <div className="flex gap-2 pt-2">
                                    <input
                                      type="text"
                                      value={commentInputs[post.id] || ""}
                                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                      placeholder={currentUser ? `以 ${currentUser.username} 身份添加回应...` : "请先登录后添加回应..."}
                                      className={`flex-1 border ${theme.border} bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs rounded-xs`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddComment(post.id)}
                                      className="px-4 py-1.5 bg-[#3d95ad] text-white text-xs font-bold rounded-xs cursor-pointer"
                                    >
                                      加上去
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ==================== 7. 高校 / 大学 视图 ==================== */
          <div className="space-y-6">
            <div className={`flex flex-wrap items-center justify-between border-b ${theme.border} pb-4 gap-4`}>
              <div className="flex items-center text-xl md:text-2xl font-black tracking-tight">
                <span className="opacity-30 font-light mr-3">|</span>
                <button
                  onClick={() => setSubTab("赛事")}
                  className={`px-4 py-1 transition cursor-pointer ${
                    subTab === "赛事" ? "bg-amber-500 text-zinc-950 rounded-sm" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  赛事
                </button>
                <span className="opacity-30 font-light mx-3">|</span>
                <button
                  onClick={() => setSubTab("学校")}
                  className={`px-4 py-1 transition cursor-pointer ${
                    subTab === "学校" ? "bg-amber-500 text-zinc-950 rounded-sm" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  学校
                </button>
                <span className="opacity-30 font-light ml-3">|</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 inline-block bg-sky-500 rounded-xs"></span> 男子 (MEN)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 inline-block bg-rose-400 rounded-xs"></span> 女子 (WOMEN)
                </span>
              </div>
            </div>

            {subTab === "赛事" ? (
              <div className="space-y-6">
                <div className={`p-4 md:p-5 border ${theme.border} ${theme.cardBg} flex flex-wrap items-center justify-between gap-4`}>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2.5">
                      <label className="text-sm font-bold">年份</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={`border ${theme.border} bg-transparent px-3.5 py-1.5 text-sm font-mono font-bold rounded-sm`}
                      >
                        <option value="ALL" className="text-black">ALL</option>
                        <option value="2026" className="text-black">2026</option>
                        <option value="2025" className="text-black">2025</option>
                        <option value="2024" className="text-black">2024</option>
                        <option value="2023" className="text-black">2023</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <label className="text-sm font-bold">赛事</label>
                      <select
                        value={selectedTournament}
                        onChange={(e) => setSelectedTournament(e.target.value)}
                        className={`border ${theme.border} bg-transparent px-3.5 py-1.5 text-sm font-bold rounded-sm`}
                      >
                        {getTournamentOptions().map((opt) => (
                          <option key={opt.value} value={opt.value} className="text-black">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs md:text-sm">
                    {(["ALL", "Men", "Women"] as const).map((g, i) => (
                      <React.Fragment key={g}>
                        {i > 0 && <span className="opacity-30">/</span>}
                        <button
                          onClick={() => setGenderFilter(g)}
                          className={`px-3 py-1 rounded-sm transition cursor-pointer ${
                            genderFilter === g ? theme.accentBg + " font-bold" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {g === "ALL" ? "ALL" : g === "Men" ? "男子" : "女子"}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {isHarukoMode && (
                  <div className={`grid grid-cols-4 md:grid-cols-7 border ${theme.border} ${theme.cardBg} divide-x divide-y md:divide-y-0 divide-zinc-300 dark:divide-zinc-800 text-center font-bold text-xs md:text-sm`}>
                    {["赛程一览", "1回戦", "2回戦", "3回戦", "準々決勝", "準決勝", "決勝"].map((r) => {
                      const active = selectedRound === r;
                      return (
                        <button
                          key={r}
                          onClick={() => setSelectedRound(r)}
                          className={`py-3 px-2 transition cursor-pointer ${
                            active ? "bg-amber-500 text-zinc-950 font-black" : "hover:bg-amber-500/10 opacity-75"
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isHarukoMode && selectedRound === "赛程一览" ? (
                  <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8 space-y-6`}>
                    <h3 className="text-xl font-black border-b pb-3">
                      {selectedYear} 春高 決勝トーナメント & 受賞一覧
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className={`p-4 border-l-4 border-l-sky-500 border ${theme.border}`}>
                        <div className="font-black text-sky-600 mb-2">■ 男子結果 (2026 第78回)</div>
                        <p>優勝：<strong>東山 (京都)</strong> ｜ 準優勝：<strong>清風 (大阪)</strong></p>
                        <p className="mt-1">3位：雄物川 (秋田) · 駿台学園 (東京)</p>
                        <p className="mt-1 text-xs opacity-75">MVP：岩田 怜緯 (東山)</p>
                      </div>
                      <div className={`p-4 border-l-4 border-l-rose-400 border ${theme.border}`}>
                        <div className="font-black text-rose-500 mb-2">■ 女子結果 (2026 第78回)</div>
                        <p>優勝：<strong>金蘭会 (大阪)</strong> ｜ 準優勝：<strong>就実 (岡山)</strong></p>
                        <p className="mt-1">3位：東九州龍谷 (大分) · 大阪国際 (大阪)</p>
                        <p className="mt-1 text-xs opacity-75">MVP：馬場 柚希 (金蘭会)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.keys(groupedSlots).length > 0 ? (
                      Object.entries(groupedSlots).map(([slotTitle, slotMatches]) => (
                        <div key={slotTitle} className="space-y-4">
                          <div className={`px-4 py-2.5 ${theme.accentBg} font-mono text-xs md:text-sm font-bold flex justify-between items-center rounded-xs`}>
                            <span>🗓️ {slotTitle}</span>
                            <span>{slotMatches[0]?.tournament} · {slotMatches[0]?.round}</span>
                          </div>

                          <div
                            className={`grid grid-cols-1 ${
                              slotMatches.length === 1
                                ? "md:grid-cols-1 max-w-2xl mx-auto"
                                : slotMatches.length === 2
                                ? "md:grid-cols-2"
                                : "md:grid-cols-2 lg:grid-cols-4"
                            } gap-4`}
                          >
                            {slotMatches.map((m) => {
                              const isMen = m.gender === "Men";
                              return (
                                <div
                                  key={m.id}
                                  className={`border ${theme.border} ${theme.cardBg} flex flex-col justify-between border-b-4 ${
                                    isMen ? "border-b-sky-500" : "border-b-rose-400"
                                  }`}
                                >
                                  <div className={`py-2 px-3 border-b ${theme.border} text-xs font-mono opacity-65 flex justify-between`}>
                                    <span className={`px-1.5 py-0.5 text-[10px] font-bold ${isMen ? "bg-sky-500/20 text-sky-600" : "bg-rose-400/20 text-rose-500"}`}>
                                      {isMen ? "男子" : "女子"}
                                    </span>
                                    <span className="font-bold">{m.court}</span>
                                    <span>{m.year}</span>
                                  </div>

                                  <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="grid grid-cols-7 items-start text-center gap-1 mb-3">
                                      <div className="col-span-3">
                                        <div className="text-[10px] font-mono text-amber-600 truncate">{m.home_hira}</div>
                                        <div className="font-black text-sm md:text-base">{m.home_team}</div>
                                        <div className="text-xs opacity-60">({m.home_pref})</div>
                                      </div>
                                      <div className={`col-span-1 text-xl self-center ${isMen ? "text-sky-500" : "text-rose-400"}`}>✕</div>
                                      <div className="col-span-3">
                                        <div className="text-[10px] font-mono text-amber-600 truncate">{m.away_hira}</div>
                                        <div className="font-black text-sm md:text-base">{m.away_team}</div>
                                        <div className="text-xs opacity-60">({m.away_pref})</div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-7 items-center text-center my-2">
                                      <div className={`col-span-2 text-4xl font-black font-mono ${m.home_sets > m.away_sets ? "text-amber-500" : "opacity-40"}`}>
                                        {m.home_sets}
                                      </div>
                                      <div className="col-span-3 space-y-0.5 font-mono text-xs">
                                        {(m.sets || []).map((s: string, idx: number) => (
                                          <div key={idx}>{s}</div>
                                        ))}
                                      </div>
                                      <div className={`col-span-2 text-4xl font-black font-mono ${m.away_sets > m.home_sets ? "text-amber-500" : "opacity-40"}`}>
                                        {m.away_sets}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-10 border ${theme.border} ${theme.cardBg} text-center text-sm opacity-70`}>
                        当前筛选条件暂无比赛记录，可将年份切换为 <strong>ALL</strong> 查看历年赛事。
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* ---------- 学校名录视图 ---------- */
              <div className="space-y-6">
                <div className={`flex flex-wrap items-center gap-2 border ${theme.border} ${theme.cardBg} p-4 text-xs md:text-sm font-bold`}>
                  {currentRegions.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1 rounded-full transition cursor-pointer ${
                        selectedRegion === reg ? theme.accentBg : "border border-zinc-300/60 dark:border-zinc-700 hover:opacity-80"
                      }`}
                    >
                      {reg === "ALL" ? "全部地区 (ALL)" : reg}
                    </button>
                  ))}
                </div>

                <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border-l-2 border-l-sky-500 pl-5 space-y-3">
                      <div className="text-sm font-black font-mono text-sky-600 mb-4">
                        MEN / 男子部 ({selectedRegion} · 共 {menTeams.length} 校)
                      </div>
                      {menTeams.map((school) => (
                        <div
                          key={school.id}
                          onClick={() => setActiveSchool(school)}
                          className={`py-3 px-4 border-b ${theme.border} cursor-pointer hover:bg-amber-500/10 transition flex justify-between items-center`}
                        >
                          <div>
                            <div className="text-[11px] font-mono text-amber-600">{school.name_hira}</div>
                            <div className="font-bold text-base">
                              {getName(school)} <span className="text-xs font-normal opacity-60">({school.region})</span>
                            </div>
                            <div className="text-xs opacity-60 mt-0.5">{school.desc}</div>
                          </div>
                          <span className="text-xs font-mono opacity-40">→</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-l-2 border-l-rose-400 pl-5 space-y-3">
                      <div className="text-sm font-black font-mono text-rose-500 mb-4">
                        WOMEN / 女子部 ({selectedRegion} · 共 {womenTeams.length} 校)
                      </div>
                      {womenTeams.length > 0 ? (
                        womenTeams.map((school) => (
                          <div
                            key={school.id}
                            onClick={() => setActiveSchool(school)}
                            className={`py-3 px-4 border-b ${theme.border} cursor-pointer hover:bg-amber-500/10 transition flex justify-between items-center`}
                          >
                            <div>
                              <div className="text-[11px] font-mono text-amber-600">{school.name_hira}</div>
                              <div className="font-bold text-base">
                                {getName(school)} <span className="text-xs font-normal opacity-60">({school.region})</span>
                              </div>
                              <div className="text-xs opacity-60 mt-0.5">{school.desc}</div>
                            </div>
                            <span className="text-xs font-mono opacity-40">→</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs opacity-50 py-4">该地区暂未收录女子校，可点击上方“全部地区 (ALL)”查看全量女排代表校。</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}