"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ==================== 1. 2026第78回春高全轮次真实比分库 (含平假名注音 & A~Dコート) ====================
const INITIAL_MATCHES = [
  // ================= 2026 春高 · 決勝 (2026年1月11日) =================
  {
    id: "hk26-f-w",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "決勝",
    date_label: "2026年1月11日(日)",
    time: "11時00分",
    court: "特設コート",
    gender: "Women",
    home_team: "金蘭会",
    home_hira: "きんらんかい",
    home_pref: "大阪",
    away_team: "就実",
    away_hira: "しゅうじつ",
    away_pref: "岡山",
    home_sets: 3,
    away_sets: 1,
    sets: ["25 - 20", "29 - 27", "20 - 25", "28 - 26"],
  },
  {
    id: "hk26-f-m",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "決勝",
    date_label: "2026年1月11日(日)",
    time: "13時30分",
    court: "特設コート",
    gender: "Men",
    home_team: "清風",
    home_hira: "せいふう",
    home_pref: "大阪",
    away_team: "東山",
    away_hira: "ひがしやま",
    away_pref: "京都",
    home_sets: 0,
    away_sets: 3,
    sets: ["21 - 25", "19 - 25", "17 - 25"],
  },

  // ================= 2026 春高 · 準決勝 (2026年1月10日) =================
  {
    id: "hk26-sf-w1",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準決勝",
    date_label: "2026年1月10日(土)",
    time: "10時00分",
    court: "特設コート",
    gender: "Women",
    home_team: "金蘭会",
    home_hira: "きんらんかい",
    home_pref: "大阪",
    away_team: "東九州龍谷",
    away_hira: "ひがしきゅうしゅうりゅうこく",
    away_pref: "大分",
    home_sets: 3,
    away_sets: 2,
    sets: ["23 - 25", "25 - 17", "18 - 25", "25 - 22", "16 - 14"],
  },
  {
    id: "hk26-sf-w2",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準決勝",
    date_label: "2026年1月10日(土)",
    time: "12時00分",
    court: "特設コート",
    gender: "Women",
    home_team: "大阪国際",
    home_hira: "おおさかこくさい",
    home_pref: "大阪",
    away_team: "就実",
    away_hira: "しゅうじつ",
    away_pref: "岡山",
    home_sets: 0,
    away_sets: 3,
    sets: ["23 - 25", "19 - 25", "18 - 25"],
  },
  {
    id: "hk26-sf-m1",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準決勝",
    date_label: "2026年1月10日(土)",
    time: "14時15分",
    court: "特設コート",
    gender: "Men",
    home_team: "雄物川",
    home_hira: "おものがわ",
    home_pref: "秋田",
    away_team: "東山",
    away_hira: "ひがしやま",
    away_pref: "京都",
    home_sets: 0,
    away_sets: 3,
    sets: ["19 - 25", "19 - 25", "17 - 25"],
  },
  {
    id: "hk26-sf-m2",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準決勝",
    date_label: "2026年1月10日(土)",
    time: "16時15分",
    court: "特設コート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "清風",
    away_hira: "せいふう",
    away_pref: "大阪",
    home_sets: 2,
    away_sets: 3,
    sets: ["23 - 25", "25 - 23", "21 - 25", "25 - 19", "13 - 15"],
  },

  // ================= 2026 春高 · 準々決勝 (2026年1月8日) =================
  {
    id: "hk26-qf-1",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "14時30分",
    court: "Aコート",
    gender: "Women",
    home_team: "金蘭会",
    home_hira: "きんらんかい",
    home_pref: "大阪",
    away_team: "熊本信愛女",
    away_hira: "くまもとしんあいじょ",
    away_pref: "熊本",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 18", "25 - 11"],
  },
  {
    id: "hk26-qf-2",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "14時30分",
    court: "Bコート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "福井工大福井",
    away_hira: "ふくいこうだいふくい",
    away_pref: "福井",
    home_sets: 2,
    away_sets: 1,
    sets: ["22 - 25", "25 - 16", "25 - 18"],
  },
  {
    id: "hk26-qf-3",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "14時30分",
    court: "Cコート",
    gender: "Men",
    home_team: "東山",
    home_hira: "ひがしやま",
    home_pref: "京都",
    away_team: "鎮西",
    away_hira: "ちんぜい",
    away_pref: "熊本",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 21", "29 - 27"],
  },
  {
    id: "hk26-qf-4",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "14時30分",
    court: "Dコート",
    gender: "Women",
    home_team: "八王子実践",
    home_hira: "はちおうじじっせん",
    home_pref: "東京",
    away_team: "就実",
    away_hira: "しゅうじつ",
    away_pref: "岡山",
    home_sets: 0,
    away_sets: 2,
    sets: ["16 - 25", "16 - 25"],
  },
  {
    id: "hk26-qf-5",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "15時40分",
    court: "Aコート",
    gender: "Women",
    home_team: "文京学院大女",
    home_hira: "ぶんきょうがくいんだいじょ",
    home_pref: "東京",
    away_team: "大阪国際",
    away_hira: "おおさかこくさい",
    away_pref: "大阪",
    home_sets: 0,
    away_sets: 2,
    sets: ["22 - 25", "24 - 26"],
  },
  {
    id: "hk26-qf-6",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "15時40分",
    court: "Bコート",
    gender: "Men",
    home_team: "雄物川",
    home_hira: "おものがわ",
    home_pref: "秋田",
    away_team: "東洋",
    away_hira: "とうよう",
    away_pref: "東京",
    home_sets: 2,
    away_sets: 1,
    sets: ["25 - 19", "20 - 25", "25 - 22"],
  },
  {
    id: "hk26-qf-7",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "15時40分",
    court: "Cコート",
    gender: "Men",
    home_team: "清風",
    home_hira: "せいふう",
    home_pref: "大阪",
    away_team: "都城工",
    away_hira: "みやконоじょうこう",
    away_pref: "宮崎",
    home_sets: 2,
    away_sets: 0,
    sets: ["27 - 25", "25 - 23"],
  },
  {
    id: "hk26-qf-8",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "準々決勝",
    date_label: "2026年1月8日(木)",
    time: "15時40分",
    court: "Dコート",
    gender: "Women",
    home_team: "東九州龍谷",
    home_hira: "ひがしきゅうしゅうりゅうこく",
    home_pref: "大分",
    away_team: "富士見",
    away_hira: "ふじみ",
    away_pref: "静岡",
    home_sets: 2,
    away_sets: 0,
    sets: ["26 - 24", "25 - 21"],
  },

  // ================= 2026 春高 · 3回戦 (2026年1月8日) =================
  {
    id: "hk26-r3-1",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "10時00分",
    court: "Aコート",
    gender: "Women",
    home_team: "金蘭会",
    home_hira: "きんらんかい",
    home_pref: "大阪",
    away_team: "誠英",
    away_hira: "せいえい",
    away_pref: "山口",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 16", "25 - 13"],
  },
  {
    id: "hk26-r3-2",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "10時00分",
    court: "Bコート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "日本航空",
    away_hira: "にほんこうくう",
    away_pref: "山梨",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 16", "25 - 21"],
  },
  {
    id: "hk26-r3-3",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "10時00分",
    court: "Cコート",
    gender: "Men",
    home_team: "川内商工",
    home_hira: "せんだいしょうこう",
    home_pref: "鹿児島",
    away_team: "福井工大福井",
    away_hira: "ふくいこうだいふくい",
    away_pref: "福井",
    home_sets: 1,
    away_sets: 2,
    sets: ["31 - 29", "22 - 25", "21 - 25"],
  },
  {
    id: "hk26-r3-4",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "10時00分",
    court: "Dコート",
    gender: "Women",
    home_team: "福井工大福井",
    home_hira: "ふくいこうだいふくい",
    home_pref: "福井",
    away_team: "熊本信愛女",
    away_hira: "くまもとしんあいじょ",
    away_pref: "熊本",
    home_sets: 0,
    away_sets: 2,
    sets: ["18 - 25", "26 - 28"],
  },
  {
    id: "hk26-r3-5",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "11時00分",
    court: "Aコート",
    gender: "Women",
    home_team: "八王子実践",
    home_hira: "はちおうじじっせん",
    home_pref: "東京",
    away_team: "横浜隼人",
    away_hira: "よこはまはやと",
    away_pref: "神奈川",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 20", "25 - 11"],
  },
  {
    id: "hk26-r3-6",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "11時00分",
    court: "Bコート",
    gender: "Men",
    home_team: "福岡大附大濠",
    home_hira: "ふくおかだいふおおほり",
    home_pref: "福岡",
    away_team: "東山",
    away_hira: "ひがしやま",
    away_pref: "京都",
    home_sets: 0,
    away_sets: 2,
    sets: ["21 - 25", "19 - 25"],
  },
  {
    id: "hk26-r3-7",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "11時00分",
    court: "Cコート",
    gender: "Men",
    home_team: "土浦日大",
    home_hira: "つちうらにちだい",
    home_pref: "茨城",
    away_team: "鎮西",
    away_hira: "ちんぜい",
    away_pref: "熊本",
    home_sets: 0,
    away_sets: 2,
    sets: ["12 - 25", "19 - 25"],
  },
  {
    id: "hk26-r3-8",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "11時00分",
    court: "Dコート",
    gender: "Women",
    home_team: "細田学園",
    home_hira: "ほそだがくえん",
    home_pref: "埼玉",
    away_team: "就実",
    away_hira: "しゅうじつ",
    away_pref: "岡山",
    home_sets: 1,
    away_sets: 2,
    sets: ["25 - 19", "16 - 25", "16 - 25"],
  },
  {
    id: "hk26-r3-9",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "12時10分",
    court: "Aコート",
    gender: "Women",
    home_team: "文京学院大女",
    home_hira: "ぶんきょうがくいんだいじょ",
    home_pref: "東京",
    away_team: "富山第一",
    away_hira: "とやまだいいち",
    away_pref: "富山",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 19", "25 - 13"],
  },
  {
    id: "hk26-r3-10",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "12時10分",
    court: "Bコート",
    gender: "Men",
    home_team: "市立尼崎",
    home_hira: "しりつあまがさき",
    home_pref: "兵庫",
    away_team: "雄物川",
    away_hira: "おものがわ",
    away_pref: "秋田",
    home_sets: 0,
    away_sets: 2,
    sets: ["23 - 25", "23 - 25"],
  },
  {
    id: "hk26-r3-11",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "12時10分",
    court: "Cコート",
    gender: "Men",
    home_team: "東洋",
    home_hira: "とうよう",
    home_pref: "東京",
    away_team: "東海大相模",
    away_hira: "とうかいだいさがみ",
    away_pref: "神奈川",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 20", "25 - 14"],
  },
  {
    id: "hk26-r3-12",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "12時10分",
    court: "Dコート",
    gender: "Women",
    home_team: "銀河学院",
    home_hira: "ぎんががくいん",
    home_pref: "広島",
    away_team: "大阪国際",
    away_hira: "おおさかこくさい",
    away_pref: "大阪",
    home_sets: 1,
    away_sets: 2,
    sets: ["27 - 25", "16 - 25", "13 - 25"],
  },
  {
    id: "hk26-r3-13",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "13時20分",
    court: "Aコート",
    gender: "Women",
    home_team: "奈良文化",
    home_hira: "ならぶんか",
    home_pref: "奈良",
    away_team: "東九州龍谷",
    away_hira: "ひがしきゅうしゅうりゅうこく",
    away_pref: "大分",
    home_sets: 0,
    away_sets: 2,
    sets: ["11 - 25", "17 - 25"],
  },
  {
    id: "hk26-r3-14",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "13時20分",
    court: "Bコート",
    gender: "Men",
    home_team: "崇徳",
    home_hira: "そうとく",
    home_pref: "広島",
    away_team: "清風",
    away_hira: "せいふう",
    away_pref: "大阪",
    home_sets: 0,
    away_sets: 2,
    sets: ["22 - 25", "20 - 25"],
  },
  {
    id: "hk26-r3-15",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "13時20分",
    court: "Cコート",
    gender: "Men",
    home_team: "都城工",
    home_hira: "みやこのじょうこう",
    home_pref: "宮崎",
    away_team: "静清",
    away_hira: "せいせい",
    away_pref: "静岡",
    home_sets: 2,
    away_sets: 1,
    sets: ["21 - 25", "25 - 17", "25 - 21"],
  },
  {
    id: "hk26-r3-16",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "3回戦",
    date_label: "2026年1月8日(木)",
    time: "13時20分",
    court: "Dコート",
    gender: "Women",
    home_team: "米沢中央",
    home_hira: "よねざわちゅうおう",
    home_pref: "山形",
    away_team: "富士見",
    away_hira: "ふじみ",
    away_pref: "静岡",
    home_sets: 0,
    away_sets: 2,
    sets: ["24 - 26", "13 - 25"],
  },

  // ================= 2026 春高 · 2回戦 (1月6日 ~ 1月7日 精选) =================
  {
    id: "hk26-r2-1",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "14時30分",
    court: "Aコート",
    gender: "Women",
    home_team: "福岡女学院",
    home_hira: "ふくおかじょがくいん",
    home_pref: "福岡",
    away_team: "文京学院大女",
    away_hira: "ぶんきょうがくいんだいじょ",
    away_pref: "東京",
    home_sets: 0,
    away_sets: 2,
    sets: ["16 - 25", "21 - 25"],
  },
  {
    id: "hk26-r2-2",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "14時30分",
    court: "Bコート",
    gender: "Men",
    home_team: "静清",
    home_hira: "せいせい",
    home_pref: "静岡",
    away_team: "東亜学園",
    away_hira: "とうあがくえん",
    away_pref: "東京",
    home_sets: 2,
    away_sets: 1,
    sets: ["25 - 23", "20 - 25", "26 - 24"],
  },
  {
    id: "hk26-r2-3",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "14時30分",
    court: "Cコート",
    gender: "Men",
    home_team: "愛工大名電",
    home_hira: "あいこうだいめいでん",
    home_pref: "愛知",
    away_team: "鎮西",
    away_hira: "ちんぜい",
    away_pref: "熊本",
    home_sets: 1,
    away_sets: 2,
    sets: ["12 - 25", "25 - 19", "16 - 25"],
  },
  {
    id: "hk26-r2-4",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "14時30分",
    court: "Dコート",
    gender: "Women",
    home_team: "京都橘",
    home_hira: "きょうとたちばな",
    home_pref: "京都",
    away_team: "就実",
    away_hira: "しゅうじつ",
    away_pref: "岡山",
    home_sets: 0,
    away_sets: 2,
    sets: ["17 - 25", "16 - 25"],
  },
  {
    id: "hk26-r2-5",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "15時40分",
    court: "Aコート",
    gender: "Women",
    home_team: "金蘭会",
    home_hira: "きんらんかい",
    home_pref: "大阪",
    away_team: "三重",
    away_hira: "みえ",
    away_pref: "三重",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 21", "25 - 17"],
  },
  {
    id: "hk26-r2-6",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "15時40分",
    court: "Bコート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "県岐阜商",
    away_hira: "けんぎふしょう",
    away_pref: "岐阜",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 17", "25 - 18"],
  },
  {
    id: "hk26-r2-7",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "15時40分",
    court: "Cコート",
    gender: "Men",
    home_team: "市立尼崎",
    home_hira: "しりつあまがさき",
    home_pref: "兵庫",
    away_team: "西原",
    away_hira: "にしはら",
    away_pref: "沖縄",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 23", "25 - 17"],
  },
  {
    id: "hk26-r2-8",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月6日(火)",
    time: "15時40分",
    court: "Dコート",
    gender: "Women",
    home_team: "富士見",
    home_hira: "ふじみ",
    home_pref: "静岡",
    away_team: "下北沢成徳",
    away_hira: "しもきたざわせいとく",
    away_pref: "東京",
    home_sets: 2,
    away_sets: 1,
    sets: ["20 - 25", "25 - 18", "30 - 28"],
  },
  {
    id: "hk26-r2-9",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月7日(水)",
    time: "12時10分",
    court: "Bコート",
    gender: "Men",
    home_team: "東北",
    home_hira: "とうほく",
    home_pref: "宮城",
    away_team: "東山",
    away_hira: "ひがしやま",
    away_pref: "京都",
    home_sets: 0,
    away_sets: 2,
    sets: ["18 - 25", "21 - 25"],
  },
  {
    id: "hk26-r2-10",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "2回戦",
    date_label: "2026年1月7日(水)",
    time: "13時20分",
    court: "Bコート",
    gender: "Men",
    home_team: "東海大札幌",
    home_hira: "とうかいだいさっぽろ",
    home_pref: "北海道",
    away_team: "東洋",
    away_hira: "とうよう",
    away_pref: "東京",
    home_sets: 0,
    away_sets: 2,
    sets: ["13 - 25", "11 - 25"],
  },

  // ================= 2026 春高 · 1回戦 (2026年1月5日 ~ 1月6日) =================
  {
    id: "hk26-r1-1",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "10時00分",
    court: "Aコート",
    gender: "Women",
    home_team: "福井工大福井",
    home_hira: "ふくいこうだいふくい",
    home_pref: "福井",
    away_team: "高崎女",
    away_hira: "たかさきじょ",
    away_pref: "群馬",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 11", "25 - 18"],
  },
  {
    id: "hk26-r1-2",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "10時00分",
    court: "Bコート",
    gender: "Men",
    home_team: "東洋",
    home_hira: "とうよう",
    home_pref: "東京",
    away_team: "開智",
    away_hira: "かいち",
    away_pref: "和歌山",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 14", "25 - 23"],
  },
  {
    id: "hk26-r1-3",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "10時00分",
    court: "Cコート",
    gender: "Men",
    home_team: "静清",
    home_hira: "せいせい",
    home_pref: "静岡",
    away_team: "鳥取中央育英",
    away_hira: "とっとりちゅうおういくえい",
    away_pref: "鳥取",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 22", "33 - 31"],
  },
  {
    id: "hk26-r1-4",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "10時00分",
    court: "Dコート",
    gender: "Women",
    home_team: "京都橘",
    home_hira: "きょうとたちばな",
    home_pref: "京都",
    away_team: "豊川",
    away_hira: "とよかわ",
    away_pref: "愛知",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 19", "25 - 9"],
  },
  {
    id: "hk26-r1-5",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "11時00分",
    court: "Aコート",
    gender: "Women",
    home_team: "横浜隼人",
    home_hira: "よこはまはやと",
    home_pref: "神奈川",
    away_team: "氷上",
    away_hira: "ひかみ",
    away_pref: "兵庫",
    home_sets: 2,
    away_sets: 0,
    sets: ["25 - 23", "25 - 23"],
  },
  {
    id: "hk26-r1-6",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "11時00分",
    court: "Bコート",
    gender: "Men",
    home_team: "愛工大名電",
    home_hira: "あいこうだいめいでん",
    home_pref: "愛知",
    away_team: "常翔学園",
    away_hira: "じょうしょうがくえん",
    away_pref: "大阪",
    home_sets: 2,
    away_sets: 1,
    sets: ["22 - 25", "25 - 20", "25 - 16"],
  },
  {
    id: "hk26-r1-7",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "11時00分",
    court: "Cコート",
    gender: "Men",
    home_team: "慶應義塾",
    home_hira: "けいおうぎじゅく",
    home_pref: "神奈川",
    away_team: "川内商工",
    away_hira: "せんだいしょうこう",
    away_pref: "鹿児島",
    home_sets: 0,
    away_sets: 2,
    sets: ["18 - 25", "15 - 25"],
  },
  {
    id: "hk26-r1-8",
    main_category: "高校",
    tournament: "春高",
    year: "2026",
    round: "1回戦",
    date_label: "2026年1月5日(月)",
    time: "11時00分",
    court: "Dコート",
    gender: "Women",
    home_team: "旭川実",
    home_hira: "あさひかわじつ",
    home_pref: "北海道",
    away_team: "敬愛学園",
    away_hira: "けいあいがくえん",
    away_pref: "千葉",
    home_sets: 2,
    away_sets: 0,
    sets: ["26 - 24", "25 - 23"],
  },

  // ================= 2025 & 2024 历届决赛数据 =================
  {
    id: "hk25-f-m",
    main_category: "高校",
    tournament: "春高",
    year: "2025",
    round: "決勝",
    date_label: "2025年1月12日(日)",
    time: "11時30分",
    court: "特設コート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "東福岡",
    away_hira: "ひがしふくおか",
    away_pref: "福岡",
    home_sets: 3,
    away_sets: 0,
    sets: ["25 - 21", "25 - 22", "25 - 17"],
  },
  {
    id: "hk24-f-m",
    main_category: "高校",
    tournament: "春高",
    year: "2024",
    round: "決勝",
    date_label: "2024年1月8日(月)",
    time: "11時30分",
    court: "特設コート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "福井工大福井",
    away_hira: "ふくいこうだいふくい",
    away_pref: "福井",
    home_sets: 3,
    away_sets: 0,
    sets: ["25 - 17", "25 - 18", "25 - 21"],
  },
  {
    id: "ih24-f-m",
    main_category: "高校",
    tournament: "IH",
    year: "2024",
    round: "決勝",
    date_label: "2024年7月29日(月)",
    time: "10時00分",
    court: "特設コート",
    gender: "Men",
    home_team: "駿台学園",
    home_hira: "すんだいがくえん",
    home_pref: "東京",
    away_team: "東山",
    home_hira_away: "ひがしやま",
    away_hira: "ひがしやま",
    away_pref: "京都",
    home_sets: 3,
    away_sets: 1,
    sets: ["25 - 21", "23 - 25", "25 - 18", "25 - 19"],
  },

  // ================= 大学专属赛事 (春联 / 秋联 / 东日 / 全日) =================
  {
    id: "uv25-all",
    main_category: "大学",
    tournament: "全日",
    year: "2025",
    round: "決勝",
    date_label: "2025年12月1日(日)",
    time: "14時00分",
    court: "Aコート",
    gender: "Men",
    home_team: "早稲田大学",
    home_hira: "わせだだいがく",
    home_pref: "関東1部",
    away_team: "順天堂大学",
    away_hira: "じゅんてんどうだいがく",
    away_pref: "関東1部",
    home_sets: 3,
    away_sets: 1,
    sets: ["25 - 20", "22 - 25", "25 - 19", "25 - 21"],
  },
  {
    id: "uv25-spr",
    main_category: "大学",
    tournament: "春联",
    year: "2025",
    round: "決勝",
    date_label: "2025年5月19日(日)",
    time: "15時00分",
    court: "Aコート",
    gender: "Men",
    home_team: "早稲田大学",
    home_hira: "わせだだいがく",
    home_pref: "関東1部",
    away_team: "明治大学",
    away_hira: "めいじだいがく",
    away_pref: "関東1部",
    home_sets: 3,
    away_sets: 2,
    sets: ["25 - 23", "21 - 25", "25 - 20", "20 - 25", "15 - 12"],
  },
];

// ==================== 2. 高校/大学/职业俱乐部全量名录 ====================
const INITIAL_TEAMS = [
  { id: "hs-1", name_zh: "骏台学园", name_ja: "駿台学園", name_hira: "すんだいがくえん", name_en: "Sundai Gakuen", main_category: "高校", region: "东京", gender: "MEN", desc: "春高三连霸 (2023-2025)・2026春高第3位" },
  { id: "hs-2", name_zh: "东亚学园", name_ja: "東亜学園", name_hira: "とうあがくえん", name_en: "Toa Gakuen", main_category: "高校", region: "东京", gender: "MEN", desc: "东京都传统豪强・2025春高四强" },
  { id: "hs-4", name_zh: "东洋高校", name_ja: "東洋高校", name_hira: "とうようこうこう", name_en: "Toyo High", main_category: "高校", region: "东京", gender: "MEN", desc: "柳田将洋母校・2026春高全国八强" },
  { id: "hs-5", name_zh: "下北泽成德", name_ja: "下北沢成徳", name_hira: "しもきたざわせいとく", name_en: "Shimokitazawa Seitoku", main_category: "高校", region: "东京", gender: "WOMEN", desc: "木村沙织、石川真佑母校・女排全国名门" },
  { id: "hs-5b", name_zh: "八王子实践", name_ja: "八王子実践", name_hira: "はちおうじじっせん", name_en: "Hachioji Jissen", main_category: "高校", region: "东京", gender: "WOMEN", desc: "2026春高女排全国八强" },
  { id: "hs-5c", name_zh: "文京学院大女", name_ja: "文京学院大女", name_hira: "ぶんきょうがくいんだいじょ", name_en: "Bunkyo Gakuin", main_category: "高校", region: "东京", gender: "WOMEN", desc: "2026春高女排全国八强" },
  { id: "hs-6", name_zh: "东山高校", name_ja: "東山高校", name_hira: "ひがしやまこうこう", name_en: "Higashiyama", main_category: "高校", region: "京都", gender: "MEN", desc: "🏆 2026第78回春高全国优胜・高桥蓝母校" },
  { id: "hs-8", name_zh: "清风高校", name_ja: "清風高校", name_hira: "せいふうこうこう", name_en: "Seifu High", main_category: "高校", region: "大阪", gender: "MEN", desc: "🥈 2026第78回春高准优胜・半决赛力克骏台学园" },
  { id: "hs-10", name_zh: "金兰会高校", name_ja: "金蘭会高校", name_hira: "きんらんかい", name_en: "Kinrankai", main_category: "高校", region: "大阪", gender: "WOMEN", desc: "🏆 2026第78回春高女排全国优胜" },
  { id: "hs-10b", name_zh: "大阪国际", name_ja: "大阪国際", name_hira: "おおさかこくさい", name_en: "Osaka Kokusai", main_category: "高校", region: "大阪", gender: "WOMEN", desc: "2026第78回春高女排第3位" },
  { id: "hs-11", name_zh: "镇西高校", name_ja: "鎮西高校", name_hira: "ちんぜいこうこう", name_en: "Chinzei High", main_category: "高校", region: "熊本", gender: "MEN", desc: "九州绝对霸主・2026春高全国八强" },
  { id: "hs-12", name_zh: "庆应义塾高", name_ja: "慶應義塾高校", name_hira: "けいおうぎじゅく", name_en: "Keio High", main_category: "高校", region: "神奈川", gender: "MEN", desc: "2025/2026春高神奈川代表" },
  { id: "hs-13", name_zh: "东海大相模", name_ja: "東海大相模", name_hira: "とうかいだいさがみ", name_en: "Tokai Sagami", main_category: "高校", region: "神奈川", gender: "MEN", desc: "2026春高最佳应援赏 & 16强" },
  { id: "hs-16", name_zh: "福井工大福井", name_ja: "福井工大福井", name_hira: "ふくいこうだいふくい", name_en: "Fukui Koudai", main_category: "高校", region: "福井", gender: "MEN", desc: "2024春高准优胜・2026春高八强" },
  { id: "hs-17", name_zh: "雄物川高校", name_ja: "雄物川高校", name_hira: "おものがわ", name_en: "Omonogawa", main_category: "高校", region: "秋田", gender: "MEN", desc: "2026第78回春高全国第3位 (四强)" },

  // 大学
  { id: "uv-1", name_zh: "早稻田大学", name_ja: "早稲田大学", name_hira: "わせだだいがく", name_en: "Waseda University", main_category: "大学", region: "关东1部", gender: "MEN", desc: "全日本インカレ多冠王" },
  { id: "uv-2", name_zh: "中央大学", name_ja: "中央大学", name_hira: "ちゅうおうだいがく", name_en: "Chuo University", main_category: "大学", region: "关东1部", gender: "MEN", desc: "石川祐希/关田诚大母校" },
  { id: "uv-3", name_zh: "明治大学", name_ja: "明治大学", name_hira: "めいじだいがく", name_en: "Meiji University", main_category: "大学", region: "关东1部", gender: "MEN", desc: "关东大学联赛劲旅" },
  { id: "uv-6", name_zh: "庆应义塾大学", name_ja: "慶應義塾大学", name_hira: "けいおうぎじゅくだいがく", name_en: "Keio University", main_category: "大学", region: "关东1部", gender: "MEN", desc: "柳田将洋母校" },

  // 职业俱乐部
  { id: "cl-1", name_zh: "三得利太阳鸟大阪", name_ja: "サントリーサンバーズ大阪", name_hira: "さんとりーさんばーずおおさか", name_en: "Suntory Sunbirds Osaka", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE MEN", city: "日本 · 大阪", stars: "高桥蓝、小野寺太志、穆塞尔斯基" },
  { id: "cl-2", name_zh: "名古屋狼犬", name_ja: "ウルフドッグス名古屋", name_hira: "うるふどっぐすなごや", name_en: "Wolfdogs Nagoya", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE MEN", city: "日本 · 爱知", stars: "小川智大、高梨健太、尼米尔" },
  { id: "cl-3", name_zh: "大阪布鲁顿", name_ja: "大阪ブルテオン", name_hira: "おおさかぶるておん", name_en: "Osaka Bluteon", main_category: "职业俱乐部", country: "日本 (SV.LEAGUE)", league: "日本 SV.LEAGUE MEN", city: "日本 · 大阪", stars: "西田有志、山内晶大、山本智大" },
  { id: "cl-6", name_zh: "佩鲁贾 (Perugia)", name_ja: "シル・サフェーティ・ペルージャ", name_hira: "ぺるーじゃ", name_en: "Sir Sicoma Monini Perugia", main_category: "职业俱乐部", country: "意大利 (Serie A1)", league: "意大利超级联赛", city: "意大利 · 佩鲁贾", stars: "石川祐希、詹内利、塞梅纽克" },
  { id: "cl-7", name_zh: "米兰 (Milano)", name_ja: "パワー・バレー・ミラノ", name_hira: "みらの", name_en: "Allianz Milano", main_category: "职业俱乐部", country: "意大利 (Serie A1)", league: "意大利超级联赛", city: "意大利 · 米兰", stars: "大冢达宣、波罗" },
  { id: "cl-10", name_zh: "雅斯特泽布斯基", name_ja: "ヤストシェンブスキ", name_hira: "やすとしぇんぶすき", name_en: "Jastrzębski Węgiel", main_category: "职业俱乐部", country: "波兰 (PlusLiga)", league: "波兰 PlusLiga", city: "波兰", stars: "福纳尔、胡贝尔" },
];

// ==================== 3. 选手个人详细档案库 (含2026第78回春高获奖选手) ====================
const INITIAL_PLAYERS = [
  {
    id: "p-iwata",
    name_zh: "岩田怜纬",
    name_ja: "岩田 怜緯",
    name_hira: "いわた れい",
    name_en: "Rei Iwata",
    team_name: "东山高校",
    cohort: "2024-2026",
    hometown: "日本 · 京都府",
    position: "主攻手 (OH)",
    birthday: "2008年",
    height: "189 cm",
    weight: "76 kg",
    spike_reach: "338 cm",
    block_reach: "320 cm",
    dominant_hand: "右",
    club_history: [
      { period: "2024 - 2027", team: "东山高校 (ひがしやま)", league: "2026第78回春高全国优胜 & 最优秀选手赏 (MVP)" },
    ],
    national_history: [
      { period: "2026", team: "日本青年选拔代表", tournaments: ["第78回春高最优秀选手赏 (MVP)"] },
    ],
  },
  {
    id: "p-nishimura",
    name_zh: "西村海司",
    name_ja: "西村 海司",
    name_hira: "にしむら かいじ",
    name_en: "Kaiji Nishimura",
    team_name: "清风高校",
    cohort: "2024-2026",
    hometown: "日本 · 大阪府",
    position: "主攻手 (OH)",
    birthday: "2009年",
    height: "186 cm",
    weight: "74 kg",
    spike_reach: "335 cm",
    block_reach: "318 cm",
    dominant_hand: "右",
    club_history: [
      { period: "2025 - 2028", team: "清风高校 (せいふう)", league: "2026第78回春高准优胜 & 优秀选手赏" },
    ],
    national_history: [
      { period: "2026", team: "日本 U18 代表候补", tournaments: ["第78回春高优秀选手赏"] },
    ],
  },
  {
    id: "p-horiuchi",
    name_zh: "堀内晴翔",
    name_ja: "堀内 晴翔",
    name_hira: "ほりうち はると",
    name_en: "Haruto Horiuchi",
    team_name: "骏台学园",
    cohort: "2024-2026",
    hometown: "日本 · 东京都",
    position: "主攻手 (OH)",
    birthday: "2007年",
    height: "187 cm",
    weight: "75 kg",
    spike_reach: "334 cm",
    block_reach: "316 cm",
    dominant_hand: "右",
    club_history: [
      { period: "2023 - 2026", team: "骏台学园 (すんだいがくえん)", league: "2026第78回春高第3位 & 优秀选手赏" },
    ],
    national_history: [],
  },
  {
    id: "p1",
    name_zh: "竹内庆一郎",
    name_ja: "竹内 慶一郎",
    name_hira: "たけうち けいいちろう",
    name_en: "Keiichiro Takeuchi",
    team_name: "骏台学园",
    cohort: "2024-2026",
    hometown: "日本 · 东京都",
    position: "二传 (S)",
    birthday: "2007年",
    height: "188 cm",
    weight: "75 kg",
    spike_reach: "328 cm",
    block_reach: "315 cm",
    dominant_hand: "右",
    club_history: [
      { period: "2024 - 2027", team: "骏台学园 (すんだいがくえん)", league: "春高全国优胜成员" },
    ],
    national_history: [
      { period: "2025 - 2026", team: "日本高校选拔", tournaments: ["全国高校选拔合宿"] },
    ],
  },
  {
    id: "p2",
    name_zh: "川野琢磨",
    name_ja: "川野 琢磨",
    name_hira: "かわの たくま",
    name_en: "Takuma Kawano",
    team_name: "骏台学园 / 早稻田大学",
    cohort: "2023-2025",
    hometown: "日本 · 东京都",
    position: "主攻手 (OH)",
    birthday: "2006年10月25日",
    height: "197 cm",
    weight: "82 kg",
    spike_reach: "347 cm",
    block_reach: "330 cm",
    dominant_hand: "右",
    club_history: [
      { period: "2022 - 2025", team: "骏台学园 (すんだいがくえん)", league: "2025春高三连霸王牌" },
      { period: "2025 -", team: "早稻田大学 (わせだだいがく)", league: "关东大学1部联赛" },
    ],
    national_history: [
      { period: "2024", team: "日本 U20 国家队", tournaments: ["U20 亚青赛"] },
    ],
  },
  {
    id: "p4",
    name_zh: "石川祐希",
    name_ja: "石川 祐希",
    name_hira: "いしかわ ゆうき",
    name_en: "Yuki Ishikawa",
    team_name: "佩鲁贾 (Perugia) / 中央大学",
    cohort: "历届知名校友",
    hometown: "日本 · 爱知县冈崎市",
    position: "主攻手 (OH)",
    birthday: "1995年12月11日",
    height: "192 cm",
    weight: "90 kg",
    spike_reach: "351 cm",
    block_reach: "327 cm",
    dominant_hand: "右",
    family: "石川真佑 (いしかわ まゆ · 妹妹)",
    club_history: [
      { period: "2024 - 2026", team: "Sir Sicoma Monini Perugia (佩鲁贾)", league: "意大利超级联赛" },
      { period: "2014 - 2018", team: "中央大学 (ちゅうおうだいがく)", league: "全日本インカレ冠军" },
    ],
    national_history: [
      { period: "2021 - 2026", team: "日本国家男子排球队 (队长)", tournaments: ["2024 巴黎奥运会", "2024 VNL 银牌"] },
    ],
  },
  {
    id: "p5",
    name_zh: "高桥蓝",
    name_ja: "髙橋 藍",
    name_hira: "たかはし らん",
    name_en: "Ran Takahashi",
    team_name: "三得利太阳鸟大阪 / 东山高校",
    cohort: "历届知名校友",
    hometown: "日本 · 京都府",
    position: "主攻手 (OH)",
    birthday: "2001年9月2日",
    height: "188 cm",
    weight: "83 kg",
    spike_reach: "343 cm",
    block_reach: "315 cm",
    dominant_hand: "右",
    club_history: [
      { period: "2024 - 2026", team: "三得利太阳鸟大阪 (サントリー)", league: "日本 SV.LEAGUE" },
      { period: "2017 - 2020", team: "东山高校 (ひがしやま)", league: "2020春高全国优胜 & MVP" },
    ],
    national_history: [
      { period: "2020 - 2026", team: "日本国家男子排球队", tournaments: ["2024 巴黎奥运会", "2024 VNL 银牌"] },
    ],
  },
];

// ==================== 4. 论坛初始帖子 ====================
const INITIAL_POSTS = [
  {
    id: "post-1",
    tag: "春高讨论",
    title: "【第78回春高】东山 3-0 完胜清风夺冠！金兰会 3-1 力克就实女排封后！",
    author: "春高前方速报",
    time: "2026-01-11 16:40",
    content: "2026年第78回春高全日程圆满落幕！男排方面，京都东山高校在决赛直落三局（25-21, 25-19, 25-17）击败半决赛爆冷骏台的清风高校，岩田怜纬拿下MVP！女排方面，大阪金兰会3-1击败冈山就实，马场柚希荣膺女排MVP！大家对今年哪场球印象最深？",
    likes: 64,
    liked: false,
    comments: [
      { id: "c1", author: "关西排球控", content: "准决赛清风3-2逆转骏台学园那场绝对是载入史册的名局，决胜局15-13太刺激了！", time: "10分钟前", likes: 21, liked: false },
    ],
  },
];

export default function Home() {
  const [lang, setLang] = useState<"ZH" | "JA" | "EN">("ZH");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // 一级主导航
  const [mainTab, setMainTab] = useState<string>("高校"); // 默认直接展示你刚升级的高校赛事页面

  // 二级与三级筛选状态
  const [subTab, setSubTab] = useState<"赛事" | "学校">("赛事");
  const [selectedYear, setSelectedYear] = useState<string>("2026"); // 纯数字年份！
  const [selectedTournament, setSelectedTournament] = useState<string>("春高");
  const [selectedRound, setSelectedRound] = useState<string>("1回戦"); // 对应草图2：赛程一览 | 1回戦 | 2回戦 | 3回戦 | 準々決勝 | 準決勝 | 決勝
  const [genderFilter, setGenderFilter] = useState<"ALL" | "Men" | "Women">("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("东京");
  const [selectedCountry, setSelectedCountry] = useState<string>("日本 (SV.LEAGUE)");

  // 下钻详情页状态
  const [activeSchool, setActiveSchool] = useState<any | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<string>("2024-2026");
  const [activePlayer, setActivePlayer] = useState<any | null>(null);

  // 论坛状态
  const [posts, setPosts] = useState<any[]>(INITIAL_POSTS);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("春高讨论");
  const [expandedPostId, setExpandedPostId] = useState<string | null>("post-1");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const [teams, setTeams] = useState<any[]>(INITIAL_TEAMS);
  const [players, setPlayers] = useState<any[]>(INITIAL_PLAYERS);
  const [matches, setMatches] = useState<any[]>(INITIAL_MATCHES);

  useEffect(() => {
    const savedPosts = localStorage.getItem("volleyhub_forum_posts_v2");
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {}
    }
  }, []);

  const updateAndSavePosts = (updated: any[]) => {
    setPosts(updated);
    localStorage.setItem("volleyhub_forum_posts_v2", JSON.stringify(updated));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost = {
      id: "post-" + Date.now(),
      tag: newPostTag,
      title: newPostTitle.trim(),
      author: "排球社区球友",
      time: "刚刚",
      content: newPostContent.trim(),
      likes: 0,
      liked: false,
      comments: [],
    };
    updateAndSavePosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setExpandedPostId(newPost.id);
  };

  const handleTogglePostLike = (postId: string) => {
    updateAndSavePosts(
      posts.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: !p.liked ? p.likes + 1 : p.likes - 1 } : p))
    );
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    updateAndSavePosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...(p.comments || []),
                { id: "c-" + Date.now(), author: "热心球友", content: text, time: "刚刚", likes: 0, liked: false },
              ],
            }
          : p
      )
    );
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
      setSelectedRound("決勝");
      setSelectedRegion("关东1部");
    } else if (tab === "职业俱乐部") {
      setSelectedCountry("日本 (SV.LEAGUE)");
    }
  };

  const getTournamentOptions = () => {
    if (mainTab === "高校") {
      return [
        { value: "春高", label: "春高 (Haruko)" },
        { value: "IH", label: "IH (インターハイ)" },
        { value: "国体", label: "国体" },
        { value: "全明星", label: "全明星" },
        { value: "ALL", label: "全部赛事" },
      ];
    }
    if (mainTab === "大学") {
      return [
        { value: "ALL", label: "全部大学赛事" },
        { value: "春联", label: "春联 (春季リーグ)" },
        { value: "秋联", label: "秋联 (秋季リーグ)" },
        { value: "东日", label: "东日 (東日本インカレ)" },
        { value: "全日", label: "全日 (全日本インカレ)" },
      ];
    }
    return [{ value: "ALL", label: "全部国际赛事" }];
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

  const highSchoolRegions = ["东京", "京都", "大阪", "神奈川", "熊本", "福井", "秋田"];
  const universityRegions = ["关东1部", "关西1部"];
  const currentRegions = mainTab === "大学" ? universityRegions : highSchoolRegions;

  const regionTeams = teams.filter((t) => {
    const matchCategory = t.main_category === mainTab;
    const matchRegion = selectedRegion === "ALL" || (t.region && t.region.includes(selectedRegion));
    const matchSearch = !globalSearch || JSON.stringify(t).toLowerCase().includes(globalSearch.toLowerCase());
    return matchCategory && matchRegion && matchSearch;
  });

  const menTeams = regionTeams.filter((t) => t.gender !== "WOMEN");
  const womenTeams = regionTeams.filter((t) => t.gender === "WOMEN");

  // 过滤当前轮次的比赛
  const roundMatches = matches.filter((m) => {
    const matchCat = m.main_category === mainTab;
    const matchYear = selectedYear === "ALL" || m.year === selectedYear;
    const matchTour = selectedTournament === "ALL" || m.tournament === selectedTournament;
    const matchRound = selectedRound === "赛程一览" || m.round === selectedRound;
    const matchGender = genderFilter === "ALL" || m.gender === genderFilter;
    const matchSearch =
      !globalSearch ||
      m.home_team.toLowerCase().includes(globalSearch.toLowerCase()) ||
      m.away_team.toLowerCase().includes(globalSearch.toLowerCase());
    return matchCat && matchYear && matchTour && matchRound && matchGender && matchSearch;
  });

  // 按 日期 + 时间段 分组比赛（完全还原官网 时间段 + A/B/C/Dコート 4列矩阵）
  const groupedSlots: { [key: string]: any[] } = {};
  roundMatches.forEach((m) => {
    const key = `${m.date_label} · ${m.time}`;
    if (!groupedSlots[key]) groupedSlots[key] = [];
    groupedSlots[key].push(m);
  });

  return (
    <main className={`min-h-screen ${theme.bgWrapper} backdrop-blur-[3px] font-sans transition-colors duration-300 pb-24`}>
      {/* ==================== 顶部全局导航栏 ==================== */}
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
                  className="bg-transparent text-xs focus:outline-none w-36 md:w-48"
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
                    className={`px-3 md:px-4 py-1 rounded-sm transition whitespace-nowrap ${
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
              <button onClick={() => setActivePlayer(null)} className="hover:underline font-bold">
                ← 返回上一级
              </button>
              <span>PLAYER ARCHIVE · {activePlayer.name_en}</span>
            </div>

            <div className={`px-6 md:px-10 py-6 border-b ${theme.border} flex flex-wrap justify-between items-end gap-4`}>
              <div>
                <div className="text-xs font-mono text-amber-600 font-bold mb-1">{activePlayer.name_hira}</div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">{getName(activePlayer)}</h2>
                <p className="text-xs opacity-60 mt-1 font-mono">
                  {activePlayer.name_ja} ({activePlayer.name_hira}) · {activePlayer.name_en}
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
                  <h3 className="text-lg font-black tracking-tight mb-4">国家队与获奖经历 / HONORS</h3>
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
          /* ==================== 2. 学校 / 俱乐部 队员名册页 (已修复严格过滤当前学校球员) ==================== */
          <div className={`border ${theme.border} ${theme.cardBg} backdrop-blur-md`}>
            <div className={`px-6 py-4 border-b ${theme.border} flex flex-wrap items-center justify-between gap-4`}>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveSchool(null)}
                  className={`px-3 py-1 text-xs font-mono border ${theme.border} hover:opacity-70 font-bold`}
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
                    className={`w-full text-left px-4 py-3 font-mono text-sm border-b ${theme.border} transition flex justify-between items-center ${
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
                <p className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">VOLLEYHUB ARCHIVE</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">SELECT PORTAL.</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "高校", title: "高校 (高中)", en: "HIGH SCHOOL", sub: "2026第78回春高全轮次(1回戦~決勝)A~D球场比分卡与受赏一览", badge: "春高全日程" },
                { id: "职业俱乐部", title: "职业俱乐部", en: "PRO CLUBS", sub: "日本 SV.LEAGUE · 意大利 Serie A1 · 波兰 PlusLiga", badge: "国家/俱乐部检索" },
                { id: "大学", title: "大学", en: "UNIVERSITY", sub: "春联 · 秋联 · 东日 · 全日 四大高校联赛档案", badge: "大学名门" },
                { id: "论坛", title: "互动社区论坛", en: "COMMUNITY", sub: "豆瓣小组式发帖、楼中楼评论回复与实时点赞", badge: "球迷共建" },
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
        ) : mainTab === "职业俱乐部" ? (
          /* ==================== 4. 职业俱乐部视图 ==================== */
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {["日本 (SV.LEAGUE)", "意大利 (Serie A1)", "波兰 (PlusLiga)"].map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-5 py-2.5 text-sm font-black border ${theme.border} transition ${
                    selectedCountry === country ? "bg-amber-500 text-zinc-950" : `${theme.cardBg} opacity-75`
                  }`}
                >
                  🌍 {country}
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
                    <p className="text-xs mt-4 pt-3 border-t border-zinc-300/50 font-bold">球星：{club.stars}</p>
                  </div>
                ))}
            </div>
          </div>
        ) : mainTab === "论坛" ? (
          /* ==================== 5. 论坛视图 ==================== */
          <div className="space-y-8">
            <div className={`border-2 ${theme.border} ${theme.cardBg} p-6`}>
              <h2 className="text-xl font-black mb-4">💬 创建新帖</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <select
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    className={`border ${theme.border} bg-transparent px-3 py-2 text-xs font-bold`}
                  >
                    <option value="春高讨论" className="text-black"># 春高讨论</option>
                    <option value="大学联赛" className="text-black"># 大学联赛</option>
                    <option value="职业俱乐部" className="text-black"># 职业俱乐部</option>
                  </select>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="输入帖子标题..."
                    className={`flex-1 border ${theme.border} bg-transparent px-4 py-2 text-sm font-bold`}
                  />
                </div>
                <textarea
                  rows={3}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="写下你的赛后感言..."
                  className={`w-full border ${theme.border} bg-transparent p-4 text-sm`}
                />
                <button type="submit" className="px-6 py-2 bg-amber-500 text-zinc-950 font-black text-xs">
                  + 发布帖子
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className={`border ${theme.border} ${theme.cardBg} p-6`}>
                  <div className="text-xs font-mono opacity-60 mb-1">
                    #{post.tag} · {post.author} · {post.time}
                  </div>
                  <h3 className="text-lg font-black mb-2">{post.title}</h3>
                  <p className="text-sm opacity-85 mb-4">{post.content}</p>
                  <div className="flex gap-4 text-xs font-mono">
                    <button onClick={() => handleTogglePostLike(post.id)} className={`px-3 py-1 border ${theme.border} rounded-full`}>
                      {post.liked ? "❤️ 已赞" : "🤍 点赞"} ({post.likes})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ==================== 6. 高校 / 大学 赛事与学校核心视图 (全新升级：对应第二份草图) ==================== */
          <div className="space-y-6">
            {/* 二级导航：| 赛事 | 学校 | */}
            <div className={`flex flex-wrap items-center justify-between border-b ${theme.border} pb-4 gap-4`}>
              <div className="flex items-center text-xl md:text-2xl font-black tracking-tight">
                <span className="opacity-30 font-light mr-3">|</span>
                <button
                  onClick={() => setSubTab("赛事")}
                  className={`px-4 py-1 transition ${
                    subTab === "赛事" ? "bg-amber-500 text-zinc-950 rounded-sm" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  赛事
                </button>
                <span className="opacity-30 font-light mx-3">|</span>
                <button
                  onClick={() => setSubTab("学校")}
                  className={`px-4 py-1 transition ${
                    subTab === "学校" ? "bg-amber-500 text-zinc-950 rounded-sm" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  学校
                </button>
                <span className="opacity-30 font-light ml-3">|</span>
              </div>

              {/* 男子 / 女子 图例说明 (复刻春高官网 ■男子 ■女子 标识) */}
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
                {/* 第一排筛选器：年份(纯数字!) + 赛事下拉框 + 男女切换 */}
                <div className={`p-4 md:p-5 border ${theme.border} ${theme.cardBg} flex flex-wrap items-center justify-between gap-4`}>
                  <div className="flex flex-wrap items-center gap-6">
                    {/* 1. 纯数字年份下拉框 */}
                    <div className="flex items-center gap-2.5">
                      <label className="text-sm font-bold">年份</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={`border ${theme.border} bg-transparent px-3.5 py-1.5 text-sm font-mono font-bold rounded-sm focus:outline-none`}
                      >
                        <option value="ALL" className="text-black">ALL</option>
                        <option value="2026" className="text-black">2026</option>
                        <option value="2025" className="text-black">2025</option>
                        <option value="2024" className="text-black">2024</option>
                        <option value="2023" className="text-black">2023</option>
                      </select>
                    </div>

                    {/* 2. 赛事下拉框 */}
                    <div className="flex items-center gap-2.5">
                      <label className="text-sm font-bold">赛事</label>
                      <select
                        value={selectedTournament}
                        onChange={(e) => setSelectedTournament(e.target.value)}
                        className={`border ${theme.border} bg-transparent px-3.5 py-1.5 text-sm font-bold rounded-sm focus:outline-none`}
                      >
                        {getTournamentOptions().map((opt) => (
                          <option key={opt.value} value={opt.value} className="text-black">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. 性别筛选 */}
                  <div className="flex items-center gap-1.5 font-mono text-xs md:text-sm">
                    {(["ALL", "Men", "Women"] as const).map((g, i) => (
                      <React.Fragment key={g}>
                        {i > 0 && <span className="opacity-30">/</span>}
                        <button
                          onClick={() => setGenderFilter(g)}
                          className={`px-3 py-1 rounded-sm transition ${
                            genderFilter === g ? theme.accentBg + " font-bold" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {g === "ALL" ? "ALL" : g === "Men" ? "男子" : "女子"}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* 第二排：完全对应第二份草图的【轮次导航条】 赛程一览 | 1回戦 | 2回戦 | 3回戦 | 準々決勝 | 準決勝 | 決勝 */}
                <div className={`grid grid-cols-4 md:grid-cols-7 border ${theme.border} ${theme.cardBg} divide-x divide-y md:divide-y-0 divide-zinc-300 dark:divide-zinc-800 text-center font-bold text-xs md:text-sm`}>
                  {["赛程一览", "1回戦", "2回戦", "3回戦", "準々決勝", "準決勝", "決勝"].map((r) => {
                    const active = selectedRound === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setSelectedRound(r)}
                        className={`py-3 px-2 transition cursor-pointer ${
                          active
                            ? "bg-amber-500 text-zinc-950 font-black shadow-inner"
                            : "hover:bg-amber-500/10 opacity-75 hover:opacity-100"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>

                {/* 如果选中【赛程一览 (对阵表 & 受赏一覧)】 (对应你的草图2 第1页 + 决赛PDF第2页) */}
                {selectedRound === "赛程一览" ? (
                  <div className="space-y-8">
                    {/* 1. 晋级对阵表 (Bracket 树状概览) */}
                    <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8`}>
                      <div className={`flex flex-wrap justify-between items-center pb-4 mb-6 border-b ${theme.border}`}>
                        <div>
                          <span className="text-xs font-mono text-amber-600 font-bold block">
                            TOURNAMENT BRACKET / トーナメント表
                          </span>
                          <h3 className="text-xl md:text-2xl font-black">
                            {selectedYear} {selectedTournament} 决胜轮晋级对阵一览
                          </h3>
                        </div>
                        <span className="text-xs font-mono opacity-60">点击上方 1回戦~決勝 可查看各球场详细局分</span>
                      </div>

                      {/* 男子组四强至决赛晋级图 */}
                      <div className="mb-8">
                        <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 mb-3 uppercase tracking-wider">
                          ■ 男子決勝トーナメント (FINAL 4 BRACKET)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="space-y-3">
                            <div className={`p-3.5 border-l-4 border-l-sky-500 border ${theme.border}`}>
                              <div className="flex justify-between text-sm">
                                <span>駿台学園 <small className="opacity-60">(東京)</small></span>
                                <span className="font-mono">2</span>
                              </div>
                              <div className="flex justify-between text-sm font-black text-amber-600 mt-1">
                                <span>清風 <small className="opacity-60">(大阪)</small></span>
                                <span className="font-mono">3</span>
                              </div>
                            </div>
                            <div className={`p-3.5 border-l-4 border-l-sky-500 border ${theme.border}`}>
                              <div className="flex justify-between text-sm">
                                <span>雄物川 <small className="opacity-60">(秋田)</small></span>
                                <span className="font-mono">0</span>
                              </div>
                              <div className="flex justify-between text-sm font-black text-amber-600 mt-1">
                                <span>東山 <small className="opacity-60">(京都)</small></span>
                                <span className="font-mono">3</span>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 border-2 border-amber-500/60 text-center rounded-sm`}>
                            <div className="text-[11px] font-mono opacity-60 mb-1">男子決勝 (FINAL)</div>
                            <div className="text-base font-bold">清風 (大阪) 0 — 3 東山 (京都)</div>
                            <div className="text-xs font-mono opacity-75 mt-1">21-25, 19-25, 17-25</div>
                          </div>

                          <div className={`p-5 ${theme.accentBg} text-center rounded-sm`}>
                            <div className="text-xs font-mono opacity-80">🏆 2026 男子優勝</div>
                            <div className="text-2xl font-black tracking-tight mt-1">東山 (京都)</div>
                            <div className="text-[11px] font-mono opacity-75 mt-0.5">ひがしやま (6年ぶり2回目)</div>
                          </div>
                        </div>
                      </div>

                      {/* 女子组四强至决赛晋级图 */}
                      <div>
                        <div className="text-xs font-mono font-bold text-rose-500 mb-3 uppercase tracking-wider">
                          ■ 女子決勝トーナメント (FINAL 4 BRACKET)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="space-y-3">
                            <div className={`p-3.5 border-l-4 border-l-rose-400 border ${theme.border}`}>
                              <div className="flex justify-between text-sm font-black text-amber-600">
                                <span>金蘭会 <small className="opacity-60">(大阪)</small></span>
                                <span className="font-mono">3</span>
                              </div>
                              <div className="flex justify-between text-sm mt-1">
                                <span>東九州龍谷 <small className="opacity-60">(大分)</small></span>
                                <span className="font-mono">2</span>
                              </div>
                            </div>
                            <div className={`p-3.5 border-l-4 border-l-rose-400 border ${theme.border}`}>
                              <div className="flex justify-between text-sm">
                                <span>大阪国際 <small className="opacity-60">(大阪)</small></span>
                                <span className="font-mono">0</span>
                              </div>
                              <div className="flex justify-between text-sm font-black text-amber-600 mt-1">
                                <span>就実 <small className="opacity-60">(岡山)</small></span>
                                <span className="font-mono">3</span>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 border-2 border-amber-500/60 text-center rounded-sm`}>
                            <div className="text-[11px] font-mono opacity-60 mb-1">女子決勝 (FINAL)</div>
                            <div className="text-base font-bold">金蘭会 (大阪) 3 — 1 就実 (岡山)</div>
                            <div className="text-xs font-mono opacity-75 mt-1">25-20, 29-27, 20-25, 28-26</div>
                          </div>

                          <div className={`p-5 ${theme.accentBg} text-center rounded-sm`}>
                            <div className="text-xs font-mono opacity-80">🏆 2026 女子優勝</div>
                            <div className="text-2xl font-black tracking-tight mt-1">金蘭会 (大阪)</div>
                            <div className="text-[11px] font-mono opacity-75 mt-0.5">きんらんかい</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. 第78回 全日本高等学校选手权大会 受赏一覧 (完全录入你给的 78-决 PDF 第2页) */}
                    <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8`}>
                      <h3 className={`text-lg md:text-xl font-black pb-3 mb-6 border-b ${theme.border}`}>
                        🏅 JVA第78回全日本バレーボール高等学校選手権大会 受賞一覧
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                        {/* 男子受赏 */}
                        <div className="space-y-3">
                          <div className="font-black text-sky-600 dark:text-sky-400 border-b border-sky-500/30 pb-1">
                            ■ 男子表彰 (MEN AWARDS)
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">男子優勝</span>
                            <span className="font-bold">東山 (京都)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">男子準優勝</span>
                            <span className="font-bold">清風 (大阪)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">男子3位</span>
                            <span className="font-bold">雄物川 (秋田) ｜ 駿台学園 (東京)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">最優秀選手賞 (MVP)</span>
                            <span className="font-bold text-amber-600">岩田 怜緯 (いわた れい · 東山)</span>
                          </div>
                          <div className="py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70 block mb-1">優秀選手賞</span>
                            <span className="font-mono text-xs leading-relaxed">
                              岩田 怜緯 (東山)、齋藤 航 (東山)、尾崎 亮太 (清風)、西村 海司 (清風)、佐々木 悠成 (雄物川)、堀内 晴翔 (駿台学園)
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="opacity-70">ベストリベロ賞 (最佳自由人)</span>
                            <span className="font-bold">辻本 侑央 (東山)</span>
                          </div>
                        </div>

                        {/* 女子受赏 */}
                        <div className="space-y-3">
                          <div className="font-black text-rose-500 border-b border-rose-500/30 pb-1">
                            ■ 女子表彰 (WOMEN AWARDS)
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">女子優勝</span>
                            <span className="font-bold">金蘭会 (大阪)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">女子準優勝</span>
                            <span className="font-bold">就実 (岡山)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">女子3位</span>
                            <span className="font-bold">東九州龍谷 (大分) ｜ 大阪国際 (大阪)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70">最優秀選手賞 (MVP)</span>
                            <span className="font-bold text-amber-600">馬場 柚希 (ばば ゆずき · 金蘭会)</span>
                          </div>
                          <div className="py-1.5 border-b border-zinc-300/40 dark:border-zinc-800">
                            <span className="opacity-70 block mb-1">優秀選手賞</span>
                            <span className="font-mono text-xs leading-relaxed">
                              馬場 柚希 (金蘭会)、徳元 菜々美 (金蘭会)、比留間 美晴 (就実)、仙波 こころ (就実)、藤崎 愛梨 (東九州龍谷)、磯邊 萌心 (大阪国際)
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="opacity-70">ベストリベロ賞 (最佳自由人)</span>
                            <span className="font-bold">岡 日和 (金蘭会)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==================== 1回戦 ~ 決勝：春高官网风格 4 球场 (A~Dコート) 矩阵卡片 ==================== */
                  <div className="space-y-8">
                    {Object.keys(groupedSlots).length > 0 ? (
                      Object.entries(groupedSlots).map(([slotTitle, slotMatches]) => (
                        <div key={slotTitle} className="space-y-4">
                          {/* 日期与时间段黑底横幅 (复刻官网 2026年1月5日(月) / 10時00分) */}
                          <div className={`px-4 py-2.5 ${theme.accentBg} font-mono text-xs md:text-sm font-bold flex justify-between items-center rounded-xs`}>
                            <span>🗓️ {slotTitle}</span>
                            <span>{selectedRound}</span>
                          </div>

                          {/* 球场网格：1~3回战 & 8强 采用 2x2 或 4列 A~Dコート 卡片 */}
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
                                  className={`border ${theme.border} ${theme.cardBg} flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition border-b-4 ${
                                    isMen ? "border-b-sky-500" : "border-b-rose-400"
                                  }`}
                                >
                                  {/* 顶部：Aコート / Bコート 标识 */}
                                  <div className={`py-2 px-3 border-b ${theme.border} text-center text-xs font-mono opacity-65 flex justify-between items-center`}>
                                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs ${isMen ? "bg-sky-500/20 text-sky-600 dark:text-sky-300" : "bg-rose-400/20 text-rose-500"}`}>
                                      {isMen ? "男子" : "女子"}
                                    </span>
                                    <span className="font-bold">{m.court}</span>
                                    <span className="text-[10px]">{m.year}</span>
                                  </div>

                                  {/* 中部：主队 × 客队 & 大比分 + 局分纵向排列 */}
                                  <div className="p-4 flex-1 flex flex-col justify-between">
                                    {/* 队名与都道府县 */}
                                    <div className="grid grid-cols-7 items-start text-center gap-1 mb-3">
                                      <div className="col-span-3">
                                        <div className="text-[10px] font-mono text-amber-600 truncate">{m.home_hira}</div>
                                        <div className="font-black text-sm md:text-base leading-tight">{m.home_team}</div>
                                        <div className="text-xs opacity-60 mt-0.5">({m.home_pref})</div>
                                      </div>

                                      <div className={`col-span-1 text-xl font-light self-center ${isMen ? "text-sky-500" : "text-rose-400"}`}>
                                        ✕
                                      </div>

                                      <div className="col-span-3">
                                        <div className="text-[10px] font-mono text-amber-600 truncate">{m.away_hira}</div>
                                        <div className="font-black text-sm md:text-base leading-tight">{m.away_team}</div>
                                        <div className="text-xs opacity-60 mt-0.5">({m.away_pref})</div>
                                      </div>
                                    </div>

                                    {/* 巨型琥珀色大比分 + 中间各局小分 */}
                                    <div className="grid grid-cols-7 items-center text-center my-2">
                                      <div className={`col-span-2 text-4xl md:text-5xl font-black font-mono ${m.home_sets > m.away_sets ? "text-amber-500" : "opacity-40"}`}>
                                        {m.home_sets}
                                      </div>

                                      <div className="col-span-3 space-y-0.5 font-mono text-xs md:text-sm">
                                        {(m.sets || []).map((s: string, idx: number) => {
                                          const parts = s.split("-").map((x) => parseInt(x.trim(), 10));
                                          const homeWin = parts[0] > parts[1];
                                          return (
                                            <div key={idx} className="flex justify-center gap-1">
                                              <span className={homeWin ? "font-black" : "opacity-60"}>{parts[0]}</span>
                                              <span className="opacity-40">-</span>
                                              <span className={!homeWin ? "font-black" : "opacity-60"}>{parts[1]}</span>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      <div className={`col-span-2 text-4xl md:text-5xl font-black font-mono ${m.away_sets > m.home_sets ? "text-amber-500" : "opacity-40"}`}>
                                        {m.away_sets}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 底部状态条 */}
                                  <div className={`py-1.5 px-3 border-t ${theme.border} text-center text-[11px] font-mono opacity-50 bg-zinc-500/5`}>
                                    公式記録 · ARCHIVED
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-12 border ${theme.border} ${theme.cardBg} text-center space-y-3`}>
                        <p className="text-sm opacity-70">
                          当前所选轮次（{selectedYear} · {selectedTournament} · {selectedRound}）暂无比赛卡片。
                        </p>
                        <button
                          onClick={() => setSelectedRound("決勝")}
                          className={`px-4 py-2 text-xs font-bold ${theme.accentBg} rounded-sm cursor-pointer`}
                        >
                          跳转查看「決勝」战报 →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* ---------- 学校列表视图 (都道府县联动) ---------- */
              <div className="space-y-6">
                <div className={`flex items-center overflow-x-auto border ${theme.border} ${theme.cardBg} px-4 py-3 text-sm font-bold no-scrollbar`}>
                  {currentRegions.map((reg, idx) => (
                    <React.Fragment key={reg}>
                      {idx > 0 && <span className="opacity-30 mx-3 font-light">|</span>}
                      <button
                        onClick={() => setSelectedRegion(reg)}
                        className={`px-3 py-1 rounded-full transition whitespace-nowrap ${
                          selectedRegion === reg ? theme.accentBg : "hover:opacity-70"
                        }`}
                      >
                        {reg}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                <div className={`border ${theme.border} ${theme.cardBg} p-6 md:p-8`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`border-l-2 border-l-sky-500 pl-5 space-y-3`}>
                      <div className="text-sm font-black font-mono text-sky-600 dark:text-sky-400 mb-4">
                        MEN / 男子部 ({selectedRegion})
                      </div>
                      {menTeams.map((school) => (
                        <div
                          key={school.id}
                          onClick={() => setActiveSchool(school)}
                          className={`py-3 px-4 border-b ${theme.border} cursor-pointer hover:bg-amber-500/10 transition flex justify-between items-center group`}
                        >
                          <div>
                            <div className="text-[11px] font-mono text-amber-600">{school.name_hira}</div>
                            <div className="font-bold text-base group-hover:text-amber-600">{getName(school)}</div>
                            <div className="text-xs opacity-60 mt-0.5">{school.desc}</div>
                          </div>
                          <span className="text-xs font-mono opacity-40 group-hover:opacity-100">→</span>
                        </div>
                      ))}
                    </div>

                    <div className={`border-l-2 border-l-rose-400 pl-5 space-y-3`}>
                      <div className="text-sm font-black font-mono text-rose-500 mb-4">
                        WOMEN / 女子部 ({selectedRegion})
                      </div>
                      {womenTeams.length > 0 ? (
                        womenTeams.map((school) => (
                          <div
                            key={school.id}
                            onClick={() => setActiveSchool(school)}
                            className={`py-3 px-4 border-b ${theme.border} cursor-pointer hover:bg-amber-500/10 transition flex justify-between items-center group`}
                          >
                            <div>
                              <div className="text-[11px] font-mono text-amber-600">{school.name_hira}</div>
                              <div className="font-bold text-base group-hover:text-amber-600">{getName(school)}</div>
                              <div className="text-xs opacity-60 mt-0.5">{school.desc}</div>
                            </div>
                            <span className="text-xs font-mono opacity-40 group-hover:opacity-100">→</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs opacity-50 py-4">可切换至“东京”或“大阪”查看女子代表校。</div>
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