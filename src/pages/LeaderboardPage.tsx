import { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Search,
  Loader2,
  Users,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import { getLeaderboard, formatDuration, type LeaderboardEntry } from '@/lib/supabase';
import Reveal from '@/components/Reveal';
import PageHero from '@/components/pageHero';
import { useInView } from '@/hooks/useInView';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(false);
    const data = await getLeaderboard(50);
    if (data.length === 0) {
      setError(true);
    }
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.clinic_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showPodium = !loading && !searchQuery && entries.length > 0;

  return (
    <div>
      <PageHero
        icon={Trophy}
        title="Leaderboard"
        description="Top performers in the World Diabetes Day clinical challenge. Rankings are based on the number of correct answers, with ties broken by the total time taken."
      />

      <section className="container-max py-12 lg:py-16">
        {showPodium && <Podium entries={entries.slice(0, 3)} />}

        <Reveal direction="up">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="group relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300 pointer-events-none transition-colors group-focus-within:text-gold-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or clinic..."
                className="input-field pl-12"
              />
            </div>
            <button onClick={fetchLeaderboard} disabled={loading} className="btn-secondary disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-3" />
            <p className="text-ink-400 text-sm">Loading leaderboard...</p>
          </div>
        ) : error && entries.length === 0 ? (
          <Reveal direction="scale">
            <div className="card p-12 text-center">
              <div className="relative w-16 h-16 mx-auto mb-5 animate-float">
                <div className="w-full h-full rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-center">
                  <Users className="w-8 h-8 text-ink-300" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">No Submissions Yet</h3>
              <p className="text-ink-400 text-sm max-w-md mx-auto">
                Be the first to complete the challenge and appear on the leaderboard!
                Head to the Challenge page to get started.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal direction="up">
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-300 bg-cream-50/80">
                      {['Rank', 'Name', 'Clinic', 'Score', 'Time', 'Date'].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-[11px] font-semibold text-ink-400 uppercase tracking-[0.14em] ${
                            h === 'Score' || h === 'Time' || h === 'Date' ? 'text-center' : 'text-left'
                          } ${h === 'Clinic' || h === 'Date' ? 'hidden sm:table-cell' : ''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, i) => (
                      <tr
                        key={entry.id}
                        className={`border-b border-cream-200 last:border-0 transition-colors duration-200 hover:bg-cream-50 animate-stagger-in ${
                          entry.rank <= 3 ? 'bg-gold-50/50' : ''
                        }`}
                        style={{ animationDelay: `${i * 45}ms` }}
                      >
                        <td className="px-5 py-4">
                          <RankBadge rank={entry.rank} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-cream-100 border border-gold-200 flex items-center justify-center flex-shrink-0">
                              <span className="font-serif text-sm font-semibold text-ink-700">
                                {entry.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-ink-900">{entry.full_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className="text-sm text-ink-500 max-w-xs block truncate">{entry.clinic_address}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-sm font-semibold text-ink-900 tabular-nums">
                              {entry.score}
                              <span className="text-ink-300 font-normal"> / {entry.total_questions}</span>
                            </span>
                            <span className="w-16 h-1 rounded-full bg-cream-200 overflow-hidden">
                              <span
                                className="block h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 origin-left animate-grow-x"
                                style={{
                                  width: `${entry.total_questions ? (entry.score / entry.total_questions) * 100 : 0}%`,
                                  animationDelay: `${300 + i * 45}ms`,
                                }}
                              />
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="text-sm font-medium text-ink-700 tabular-nums">
                            {formatDuration(entry.time_taken_ms)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center hidden sm:table-cell">
                          <span className="text-sm text-ink-400">
                            {new Date(entry.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEntries.length === 0 && searchQuery && (
                <div className="p-10 text-center">
                  <p className="text-sm text-ink-400">No participants found matching "{searchQuery}".</p>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {!loading && !error && entries.length > 0 && (
          <p className="text-center text-xs text-ink-400 mt-5">
            Showing {filteredEntries.length} of {entries.length} participants
          </p>
        )}
      </section>
    </div>
  );
}

/* ---------- Rank badge for the table ---------- */

const rankIcons: Record<number, { icon: LucideIcon; color: string }> = {
  1: { icon: Trophy, color: 'text-gold-300' },
  2: { icon: Medal, color: 'text-ink-100' },
  3: { icon: Award, color: 'text-gold-500' },
};

function RankBadge({ rank }: { rank: number }) {
  const top = rankIcons[rank];
  if (top) {
    const Icon = top.icon;
    return (
      <div className="w-9 h-9 rounded-full bg-ink-900 flex items-center justify-center shadow-soft">
        <Icon className={`w-4 h-4 ${top.color}`} />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center">
      <span className="font-serif text-sm font-semibold text-ink-500">{rank}</span>
    </div>
  );
}

/* ---------- Podium for the top 3 (rises when scrolled into view) ---------- */

const podiumStyle: Record<number, { height: string; block: string; delay: number; avatar: string }> = {
  1: { height: 'h-36 sm:h-44', block: 'bg-ink-900', delay: 500, avatar: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl border-gold-400' },
  2: { height: 'h-28 sm:h-32', block: 'bg-ink-700', delay: 250, avatar: 'w-14 h-14 text-xl border-ink-200' },
  3: { height: 'h-20 sm:h-24', block: 'bg-ink-600', delay: 0, avatar: 'w-14 h-14 text-xl border-gold-600' },
};

function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  // visual order: 2nd, 1st, 3rd
  const ordered = [entries[1], entries[0], entries[2]].filter(Boolean) as LeaderboardEntry[];

  return (
    <div ref={ref} className="flex items-end justify-center gap-3 sm:gap-5 max-w-3xl mx-auto mb-14">
      {ordered.map((entry) => {
        const s = podiumStyle[entry.rank] ?? podiumStyle[3];
        const Icon = rankIcons[entry.rank]?.icon ?? Award;
        return (
          <div key={entry.id} className="flex-1 max-w-[13rem] flex flex-col items-center min-w-0">
            {/* person */}
            <div
              className={`flex flex-col items-center text-center w-full px-1 mb-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${s.delay + 500}ms` }}
            >
              {entry.rank === 1 && <Trophy className="w-6 h-6 text-gold-500 mb-2 animate-float" />}
              <div
                className={`${s.avatar} rounded-full bg-white border-2 shadow-lift flex items-center justify-center font-serif font-semibold text-ink-800 mb-3`}
              >
                {entry.full_name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-ink-900 truncate w-full">{entry.full_name}</p>
              <p className="text-xs text-ink-400 truncate w-full">{entry.clinic_address}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold-50 border border-gold-200 text-xs font-semibold text-gold-800 tabular-nums">
                  {entry.score} / {entry.total_questions}
                </span>
                {entry.time_taken_ms != null && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800 tabular-nums">
                    {formatDuration(entry.time_taken_ms)}
                  </span>
                )}
              </div>
            </div>

            {/* block */}
            <div
              className={`relative w-full ${s.height} ${s.block} rounded-t-2xl overflow-hidden origin-bottom transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                inView ? 'scale-y-100' : 'scale-y-0'
              }`}
              style={{ transitionDelay: `${s.delay}ms` }}
            >
              <div aria-hidden className="absolute inset-0 dot-grid-light" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
              <div className="relative h-full flex flex-col items-center justify-center gap-1">
                <Icon className={`w-5 h-5 ${rankIcons[entry.rank]?.color ?? 'text-gold-500'}`} />
                <span className="font-serif italic text-3xl sm:text-4xl text-cream-50">{entry.rank}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}