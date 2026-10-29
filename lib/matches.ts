import { createSupabaseClient } from "@/lib/supabase";

export type Team = {
  id: string;
  name: string;
  name_hiragana: string | null;
  prefecture: string | null;
  logo_url: string | null;
};

export type Tournament = {
  id: string;
  name: string;
  season: string | null;
  category: string | null;
  gender: string | null;
  start_date: string | null;
  end_date: string | null;
};

export type Player = {
  id: string;
  name: string;
  name_hiragana: string | null;
  current_team_id: string | null;
};

export type MatchPlayerStat = {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string | null;
  total_points: number | null;
  spike_points: number | null;
  serve_points: number | null;
  block_points: number | null;
  spike_attempts: number | null;
  is_starter: boolean | null;
  player: Player | null;
};

export type SetScore = {
  setNumber: number;
  home: number;
  away: number;
};

export type MatchRow = {
  id: string;
  match_date: string | null;
  status: string | null;
  venue: string | null;
  round_name: string | null;
  set_scores: unknown;
  tournament: Tournament | Tournament[] | null;
  home_team: Team | Team[] | null;
  away_team: Team | Team[] | null;
  match_player_stats: MatchPlayerStat[] | null;
};

export type MatchView = {
  id: string;
  matchDate: string | null;
  status: string | null;
  venue: string | null;
  roundName: string | null;
  tournament: Tournament | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  setScores: SetScore[];
  homeSets: number;
  awaySets: number;
  stats: MatchPlayerStat[];
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pickNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = asNumber(record[key]);
    if (value !== null) return value;
  }
  return null;
}

export function parseSetScores(raw: unknown): SetScore[] {
  if (!raw) return [];

  if (typeof raw === "string") {
    try {
      return parseSetScores(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  if (Array.isArray(raw)) {
    return raw.flatMap((item, index) => {
      if (Array.isArray(item) && item.length >= 2) {
        const home = asNumber(item[0]);
        const away = asNumber(item[1]);
        if (home === null || away === null) return [];
        return [{ setNumber: index + 1, home, away }];
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const home = pickNumber(record, [
          "home",
          "home_score",
          "homeScore",
          "home_points",
          "home_team",
        ]);
        const away = pickNumber(record, [
          "away",
          "away_score",
          "awayScore",
          "away_points",
          "away_team",
        ]);
        const setNumber =
          pickNumber(record, ["set_number", "setNumber", "set", "n"]) ??
          index + 1;
        if (home === null || away === null) return [];
        return [{ setNumber, home, away }];
      }

      return [];
    });
  }

  if (typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const homeList = record.home ?? record.home_scores ?? record.homeScores;
    const awayList = record.away ?? record.away_scores ?? record.awayScores;
    if (Array.isArray(homeList) && Array.isArray(awayList)) {
      return homeList.flatMap((homeValue, index) => {
        const home = asNumber(homeValue);
        const away = asNumber(awayList[index]);
        if (home === null || away === null) return [];
        return [{ setNumber: index + 1, home, away }];
      });
    }
  }

  return [];
}

function setsWon(scores: SetScore[]): { home: number; away: number } {
  return scores.reduce(
    (acc, set) => {
      if (set.home > set.away) acc.home += 1;
      else if (set.away > set.home) acc.away += 1;
      return acc;
    },
    { home: 0, away: 0 },
  );
}

function toMatchView(row: MatchRow): MatchView {
  const setScores = parseSetScores(row.set_scores).sort(
    (a, b) => a.setNumber - b.setNumber,
  );
  const won = setsWon(setScores);

  return {
    id: row.id,
    matchDate: row.match_date,
    status: row.status,
    venue: row.venue,
    roundName: row.round_name,
    tournament: one(row.tournament),
    homeTeam: one(row.home_team),
    awayTeam: one(row.away_team),
    setScores,
    homeSets: won.home,
    awaySets: won.away,
    stats: row.match_player_stats ?? [],
  };
}

function mentions(team: Team | null, keyword: string): boolean {
  if (!team) return false;
  return `${team.name}${team.name_hiragana ?? ""}`.includes(keyword);
}

export function pickFeaturedMatch(matches: MatchView[]): MatchView | null {
  if (matches.length === 0) return null;

  const sundaiHigashiyama = matches.find((match) => {
    const pair =
      (mentions(match.homeTeam, "骏台") && mentions(match.awayTeam, "东山")) ||
      (mentions(match.homeTeam, "东山") && mentions(match.awayTeam, "骏台")) ||
      (mentions(match.homeTeam, "駿台") && mentions(match.awayTeam, "東山")) ||
      (mentions(match.homeTeam, "東山") && mentions(match.awayTeam, "駿台"));
    return pair;
  });

  return sundaiHigashiyama ?? matches[0];
}

export async function getMatches(): Promise<MatchView[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      id,
      match_date,
      status,
      venue,
      round_name,
      set_scores,
      tournament:tournaments (
        id,
        name,
        season,
        category,
        gender,
        start_date,
        end_date
      ),
      home_team:teams!home_team_id (
        id,
        name,
        name_hiragana,
        prefecture,
        logo_url
      ),
      away_team:teams!away_team_id (
        id,
        name,
        name_hiragana,
        prefecture,
        logo_url
      ),
      match_player_stats (
        id,
        match_id,
        player_id,
        team_id,
        total_points,
        spike_points,
        serve_points,
        block_points,
        spike_attempts,
        is_starter,
        player:players (
          id,
          name,
          name_hiragana,
          current_team_id
        )
      )
    `,
    )
    .order("match_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as MatchRow[]).map(toMatchView);
}
