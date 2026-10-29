'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

type Lang = 'zh' | 'ja' | 'en'
type ThemeKey = 'blue' | 'crimson' | 'amber' | 'emerald'

const THEMES: Record<ThemeKey, {
  name: Record<Lang, string>;
  dot: string;
  accentText: string;
  accentBg: string;
  pillActive: string;
  badge: string;
  gradientText: string;
}> = {
  blue: {
    name: { zh: '深海蓝', ja: 'オーシャンブルー', en: 'Ocean Blue' },
    dot: 'bg-blue-500',
    accentText: 'text-blue-400',
    accentBg: 'bg-blue-600 hover:bg-blue-500',
    pillActive: 'bg-blue-600/20 text-blue-300 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    gradientText: 'from-blue-400 via-indigo-400 to-purple-400'
  },
  crimson: {
    name: { zh: '春高樱红', ja: 'はるこうサクラ', en: 'Haruko Rose' },
    dot: 'bg-rose-500',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-600 hover:bg-rose-500',
    pillActive: 'bg-rose-600/20 text-rose-300 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    gradientText: 'from-rose-400 via-pink-400 to-orange-400'
  },
  amber: {
    name: { zh: '跃网金橙', ja: 'サンバースト', en: 'Volley Gold' },
    dot: 'bg-amber-500',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-600 hover:bg-amber-500',
    pillActive: 'bg-amber-600/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    gradientText: 'from-amber-300 via-orange-400 to-red-400'
  },
  emerald: {
    name: { zh: '赛场翠绿', ja: 'コートグリーン', en: 'Court Green' },
    dot: 'bg-emerald-500',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-600 hover:bg-emerald-500',
    pillActive: 'bg-emerald-600/20 text-emerald-300 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    gradientText: 'from-emerald-400 via-teal-400 to-cyan-400'
  }
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('zh')
  const [themeKey, setThemeKey] = useState<ThemeKey>('blue')
  const theme = THEMES[themeKey]

  // 状态管理
  const [mainTab, setMainTab] = useState<string>('高校')
  const [subView, setSubView] = useState<'matches' | 'players' | 'teams'>('matches')
  
  // 筛选器状态
  const [globalSearch, setGlobalSearch] = useState('')
  const [playerSearch, setPlayerSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MEN' | 'WOMEN'>('ALL')
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL')
  const [matchTourFilter, setMatchTourFilter] = useState<string>('ALL')

  const [matches, setMatches] = useState<any[]>([])
  const [tournaments, setTournaments] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeMatch, setActiveMatch] = useState<any | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    const { data: matchesData } = await supabase.from('matches').select('*, tournaments(*), home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), match_player_stats(*, players(*))').order('match_date', { ascending: false })
    const { data: tourData } = await supabase.from('tournaments').select('*')
    const { data: teamsData } = await supabase.from('teams').select('*')
    const { data: playersData } = await supabase.from('players').select('*, teams(*)')

    if (matchesData) setMatches(matchesData)
    if (tourData) setTournaments(tourData)
    if (teamsData) setTeams(teamsData)
    if (playersData) setPlayers(playersData)
    setLoading(false)
  }

  const getName = (item: any) => item ? (lang === 'ja' ? (item.name_ja || item.name_zh) : lang === 'en' ? (item.name_en || item.name_zh) : item.name_zh) : ''
  const getIntro = (item: any) => item ? (lang === 'ja' ? (item.intro_ja || item.intro_zh) : lang === 'en' ? (item.intro_en || item.intro_zh) : item.intro_zh) : ''

  const handleMainTab = (tab: string) => {
    setMainTab(tab)
    setSubView('matches')
    setSelectedRegion('ALL')
    setMatchTourFilter('ALL')
  }

  // 性别判定逻辑（根据队名或轮次带"女"字）
  const isWomen = (str: string) => str?.includes('女') || str?.includes('女子')
  const checkGender = (teamName: string, round: string = '') => {
    if (genderFilter === 'ALL') return true
    const isW = isWomen(teamName) || isWomen(round)
    return genderFilter === 'WOMEN' ? isW : !isW
  }

  const isHierarchyTab = ['高校', '大学', '职业俱乐部'].includes(mainTab)
  
  // 动态文案：根据大板块变动名称
  const teamTabLabel = mainTab === '职业俱乐部' ? '俱乐部档案' : '学校档案'

  // --- 数据过滤逻辑 ---

  // 1. 赛事战报 (Matches) 过滤：使用 赛事类别(春高/IH) + 男女子筛选 + 全局搜索
  const availableTours = Array.from(new Set(matches.filter(m => m.tournaments?.main_category === mainTab).map(m => m.tournaments?.sub_category).filter(Boolean)))
  
  const displayedMatches = matches
    .filter(m => m.tournaments?.main_category === mainTab)
    .filter(m => matchTourFilter === 'ALL' || m.tournaments?.sub_category === matchTourFilter)
    .filter(m => checkGender(m.home_team?.name_zh, m.round_name))
    .filter(m => !globalSearch || getName(m.home_team).toLowerCase().includes(globalSearch.toLowerCase()) || getName(m.away_team).toLowerCase().includes(globalSearch.toLowerCase()) || m.tournaments?.sub_category?.includes(globalSearch))

  // 2. 选手数据 (Players) 过滤：使用 选手搜索 + A-Z字母排序 + 全局搜索
  const displayedPlayers = players
    .filter(p => p.teams?.main_category === mainTab)
    .filter(p => checkGender(p.teams?.name_zh))
    .filter(p => !playerSearch || getName(p).toLowerCase().includes(playerSearch.toLowerCase()) || p.name_hiragana?.includes(playerSearch))
    .filter(p => !globalSearch || getName(p).toLowerCase().includes(globalSearch.toLowerCase()) || getName(p.teams).toLowerCase().includes(globalSearch.toLowerCase()))
    .sort((a, b) => (a.name_en || '').localeCompare(b.name_en || '')) // 核心：强制 A-Z 排序

  // 3. 学校/俱乐部档案 (Teams) 过滤：使用 地区筛选 + 全局搜索
  const rawRegions = Array.from(new Set(teams.filter(t => t.main_category === mainTab).map(t => t.region).filter(Boolean)))
  const sortedRegions = ['东京', '京都', '熊本', '神奈川'].filter(r => rawRegions.includes(r)).concat(rawRegions.filter(r => !['东京', '京都', '熊本', '神奈川'].includes(r)))
  
  const displayedTeams = teams
    .filter(t => t.main_category === mainTab)
    .filter(t => checkGender(t.name_zh))
    .filter(t => selectedRegion === 'ALL' || t.region === selectedRegion)
    .filter(t => !globalSearch || getName(t).toLowerCase().includes(globalSearch.toLowerCase()) || getIntro(t).toLowerCase().includes(globalSearch.toLowerCase()))

  return (
    <main className="min-h-screen bg-[#07090e] text-gray-100 font-sans pb-20">
      {/* 顶部全局导航栏 */}
      <div className="border-b border-gray-800/80 bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="cursor-pointer" onClick={() => handleMainTab('首页')}>
              <div className="flex items-center gap-3">
                <h1 className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent tracking-tight`}>
                  VolleyHub
                </h1>
                <span className={`text-[10px] font-bold uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                  Global Pro
                </span>
              </div>
            </div>

            {/* 右侧控制区：全局搜索 + 语言/主题 */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* 页面全局搜索框 */}
              <input 
                type="text" 
                placeholder="全局搜索 (选手/学校/赛事)..." 
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-full px-4 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all w-52 placeholder-gray-500"
              />
              
              <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 text-xs font-bold">
                {(['zh', 'ja', 'en'] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 rounded-lg transition-all ${lang === l ? `${theme.accentBg} text-white` : 'text-gray-400 hover:text-white'}`}>
                    {l === 'zh' ? '中' : l === 'ja' ? '日' : 'EN'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1.5 hidden sm:flex">
                {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                  <button key={k} onClick={() => setThemeKey(k)} className={`w-4 h-4 rounded-full ${THEMES[k].dot} transition-transform ${themeKey === k ? 'scale-125 ring-2 ring-white' : 'opacity-50'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* 一级导航 */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            {['首页', '高校', '大学', '职业俱乐部', '其他赛事', '论坛'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleMainTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${mainTab === tab ? theme.pillActive : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:bg-gray-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        {isHierarchyTab && (
          <div className="bg-[#0d121c] border border-gray-800/90 rounded-2xl p-5 mb-8 shadow-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-5 pb-4 border-b border-gray-800/70">
              
              {/* 二级导航：赛事战报 | 选手数据 | 学校/俱乐部档案 */}
              <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
                {[
                  { id: 'matches', label: '赛事战报' },
                  { id: 'players', label: '选手数据' },
                  { id: 'teams', label: teamTabLabel }
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSubView(v.id as any)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${subView === v.id ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              
              {/* 男女组别筛选 (仅在赛事和选手视图中显示) */}
              {(subView === 'matches' || subView === 'players') && (
                <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 text-xs font-bold">
                  {[
                    { id: 'ALL', label: '混合组别' },
                    { id: 'MEN', label: '男子' },
                    { id: 'WOMEN', label: '女子' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGenderFilter(g.id as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${genderFilter === g.id ? `${theme.accentBg} text-white` : 'text-gray-400 hover:text-white'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 动态控制区：根据 subView 展示不同的筛选器 */}
            
            {/* 视图 1：赛事战报 -> 展示【大赛类别筛选 (春高/IH)】 */}
            {subView === 'matches' && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-16">赛事项目</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  <button onClick={() => setMatchTourFilter('ALL')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${matchTourFilter === 'ALL' ? theme.pillActive : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-200'}`}>
                    全部赛事
                  </button>
                  {availableTours.map((tour) => (
                    <button key={tour} onClick={() => setMatchTourFilter(tour)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${matchTourFilter === tour ? theme.pillActive : 'bg-gray-900 text-gray-300 border-gray-800'}`}>
                      {tour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 视图 2：选手数据 -> 展示【专属搜索框 + A-Z提示】 */}
            {subView === 'players' && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-16">选手检索</span>
                <div className="flex items-center gap-4 flex-1">
                  <input 
                    type="text" 
                    placeholder="输入选手姓名或平假名搜索..." 
                    value={playerSearch}
                    onChange={e => setPlayerSearch(e.target.value)}
                    className="bg-gray-950 border border-gray-700 rounded-lg px-4 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-64 placeholder-gray-600"
                  />
                  <span className="text-[11px] text-gray-500">※ 选手列表已自动按罗马音 / A-Z 首字母排序</span>
                </div>
              </div>
            )}

            {/* 视图 3：学校/俱乐部档案 -> 展示【地区/学联筛选】 */}
            {subView === 'teams' && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-16">地区分布</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  <button onClick={() => setSelectedRegion('ALL')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedRegion === 'ALL' ? theme.pillActive : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-200'}`}>
                    全部地区
                  </button>
                  {sortedRegions.map((region) => (
                    <button key={region} onClick={() => setSelectedRegion(region)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedRegion === region ? theme.pillActive : 'bg-gray-900 text-gray-300 border-gray-800'}`}>
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-20 animate-pulse">数据同步中...</div>
        ) : (
          <div>
            {subView === 'matches' && (
              <div className="grid gap-6 md:grid-cols-2">
                {displayedMatches.length === 0 ? <div className="text-gray-500 text-sm">当前分类暂无赛事数据</div> : displayedMatches.map(match => {
                  const isHomeWin = match.home_score > match.away_score
                  return (
                    <div key={match.id} onClick={() => setActiveMatch(match)} className="cursor-pointer bg-gray-900/90 border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-lg ${theme.badge}`}>
                          {match.tournaments?.sub_category} · {match.round_name}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{match.match_date}</span>
                      </div>
                      <div className="flex justify-between items-center my-5">
                        <div className="text-center flex-1">
                          <div className="text-[10px] text-indigo-300/80 h-4">{match.home_team?.name_hiragana}</div>
                          <div className={`text-lg font-black ${isHomeWin ? 'text-white' : 'text-gray-400'}`}>{getName(match.home_team)}</div>
                        </div>
                        <div className="px-4 text-3xl font-black font-mono">
                          <span className={isHomeWin ? theme.accentText : 'text-gray-500'}>{match.home_score}</span>
                          <span className="text-gray-700 mx-1.5">:</span>
                          <span className={!isHomeWin ? theme.accentText : 'text-gray-500'}>{match.away_score}</span>
                        </div>
                        <div className="text-center flex-1">
                          <div className="text-[10px] text-indigo-300/80 h-4">{match.away_team?.name_hiragana}</div>
                          <div className={`text-lg font-black ${!isHomeWin ? 'text-white' : 'text-gray-400'}`}>{getName(match.away_team)}</div>
                        </div>
                      </div>
                      <div className="text-center text-xs font-mono text-gray-400 bg-gray-950 py-2 rounded-xl border border-gray-800/80">局分: {match.set_scores}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {subView === 'players' && (
              <div className="grid gap-4 md:grid-cols-3">
                {displayedPlayers.length === 0 ? <div className="text-gray-500 text-sm">未检索到相关选手</div> : displayedPlayers.map(p => (
                  <div key={p.id} className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono text-gray-400">#{p.jersey_number} · {p.height_cm}cm</span>
                        <span className={`text-[11px] font-bold ${theme.accentText}`}>{p.position}</span>
                      </div>
                      <div className="text-[10px] text-indigo-300/80 mt-1">{p.name_hiragana}</div>
                      <div className="text-base font-black text-white">{getName(p)}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{p.name_en?.toUpperCase()}</div>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-800/80 flex justify-between items-center">
                      <span>{getName(p.teams)}</span>
                      <span className="text-amber-300/90">{p.grade_or_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {subView === 'teams' && (
              <div className="grid gap-4 md:grid-cols-2">
                {displayedTeams.length === 0 ? <div className="text-gray-500 text-sm">未检索到相关档案</div> : displayedTeams.map(team => (
                  <div key={team.id} className="bg-gradient-to-br from-gray-900 to-gray-900/40 border border-gray-800 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-indigo-300/90 font-medium">{team.name_hiragana}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>{team.region}</span>
                    </div>
                    <h4 className="text-xl font-black text-white mb-2">{getName(team)}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{getIntro(team)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 单场首发详情弹窗 (保持不变) */}
      {activeMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setActiveMatch(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-5">
              <div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${theme.badge}`}>
                  {activeMatch.tournaments?.sub_category} · {activeMatch.round_name}
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  {getName(activeMatch.home_team)} vs {getName(activeMatch.away_team)}
                </h3>
              </div>
              <button onClick={() => setActiveMatch(null)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg">关闭</button>
            </div>
            <div className="mb-6">
              <h4 className={`text-xs font-black uppercase tracking-wider mb-3 ${theme.accentText}`}>🌟 本场阵容</h4>
              <div className="space-y-2">
                {activeMatch.match_player_stats?.map((stat: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-gray-950/80 border border-gray-800/70 px-4 py-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">#{stat.players?.jersey_number}</span>
                      <span className="font-bold text-white text-sm">{getName(stat.players)}</span>
                      <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{stat.players?.position}</span>
                      {!stat.is_starter && <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">替补</span>}
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold border ${theme.badge}`}>{stat.points}分</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}