import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Search,
  Trash2,
  Loader2,
  Users,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  Lock,
  ListChecks,
  HelpCircle,
  Download,
  Plus,
  Save,
  RotateCcw,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import {
  supabase,
  signInAdmin,
  signOutAdmin,
  getCurrentSession,
  getAllSubmissions,
  deleteSubmission,
  resetLeaderboard,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  setQuestionInChallenge,
  CHALLENGE_QUESTION_COUNT,
  exportToCSV,
  type Submission,
  type ChallengeQuestionData,
  type ChallengeQuestionInput,
} from '@/lib/supabase';

type AdminSection = 'leaderboard' | 'question';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getCurrentSession();
      setAuthed(!!session);
      setCheckingAuth(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setAuthed(!!session);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-ink-400 animate-spin mb-3" />
        <p className="text-ink-400 text-sm">Checking access...</p>
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={async () => { await signOutAdmin(); setAuthed(false); }} />;
}

// ---- Login Screen ----

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await signInAdmin(email, password);
    setLoading(false);
    if (success) {
      onSuccess();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="container-max py-12 lg:py-20">
      <div className="max-w-md mx-auto animate-reveal-scale">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <span className="absolute inset-0 rounded-2xl border border-gold-400 animate-pulse-ring" />
            <div className="relative w-full h-full rounded-2xl bg-ink-900 flex items-center justify-center shadow-lift">
              <Lock className="w-8 h-8 text-gold-300" strokeWidth={1.75} />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink-900 mb-3">
            Admin Login
          </h1>
          <p className="text-ink-600">
            Sign in to manage the World Diabetes Day challenge and leaderboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="input-label">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300 pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clinic.com"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="input-label">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300 pointer-events-none" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---- Dashboard ----

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<AdminSection>('leaderboard');

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-cream-300/70">
        <div aria-hidden className="absolute inset-0 dot-grid mask-fade-b opacity-70 pointer-events-none" />
        <div className="container-max relative py-8 lg:py-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-ink-900 flex items-center justify-center shadow-lift">
                <Shield className="w-5 h-5 text-gold-300" strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-ink-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-ink-400">Manage challenge and leaderboard</p>
              </div>
            </div>
            <button onClick={onLogout} className="btn-secondary">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </section>

      <div className="container-max py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <SidebarButton
                active={section === 'leaderboard'}
                onClick={() => setSection('leaderboard')}
                icon={ListChecks}
                label="Leaderboard"
              />
              <SidebarButton
                active={section === 'question'}
                onClick={() => setSection('question')}
                icon={HelpCircle}
                label="Challenge Question"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {section === 'leaderboard' && <LeaderboardSection />}
            {section === 'question' && <QuestionSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
        active
          ? 'bg-ink-900 text-cream-50 shadow-lift'
          : 'bg-white/80 text-ink-600 border border-cream-300 hover:border-gold-400 hover:text-ink-900 hover:translate-x-0.5'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-gold-300' : ''}`} strokeWidth={2} />
      {label}
    </button>
  );
}

// ---- Leaderboard Section ----

function LeaderboardSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [actionError, setActionError] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const data = await getAllSubmissions();
    setSubmissions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setActionError(false);
    const success = await deleteSubmission(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (success) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } else {
      setActionError(true);
    }
  };

  const handleReset = async () => {
    setActionError(false);
    const success = await resetLeaderboard();
    setConfirmReset(false);
    if (success) {
      setSubmissions([]);
    } else {
      setActionError(true);
    }
  };

  const filtered = submissions.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clinic_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCorrect = submissions.filter((s) => s.score === s.total_questions).length;
  const avgScore =
    submissions.length > 0
      ? Math.round((submissions.reduce((a, s) => a + s.score, 0) / submissions.length) * 100) / 100
      : 0;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card card-hover p-5">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-gold-600" />
            <span className="text-xs text-ink-400 font-semibold uppercase tracking-wider">Total</span>
          </div>
          <div className="font-serif text-3xl font-semibold text-ink-900 tabular-nums">{submissions.length}</div>
        </div>
        <div className="card card-hover p-5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-gold-600" />
            <span className="text-xs text-ink-400 font-semibold uppercase tracking-wider">Correct</span>
          </div>
          <div className="font-serif text-3xl font-semibold text-ink-900 tabular-nums">{totalCorrect}</div>
        </div>
        <div className="card card-hover p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-gold-600" />
            <span className="text-xs text-ink-400 font-semibold uppercase tracking-wider">Avg Score</span>
          </div>
          <div className="font-serif text-3xl font-semibold text-ink-900 tabular-nums">{avgScore}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, clinic..."
            className="input-field pl-11"
          />
        </div>
        <button
          onClick={() => exportToCSV(submissions)}
          disabled={submissions.length === 0}
          className="btn-secondary disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="btn-secondary disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {actionError && (
        <div className="card p-3 mb-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Action failed. Please try again.
          </p>
        </div>
      )}

      {/* Reset bar */}
      {submissions.length > 0 && (
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs text-ink-400">
            Showing {filtered.length} of {submissions.length} entries
          </span>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-600">Clear all entries?</span>
              <button onClick={() => setConfirmReset(false)} className="btn-ghost text-sm">
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Confirm Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Leaderboard
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-ink-400 animate-spin mb-3" />
          <p className="text-ink-400 text-sm">Loading submissions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-ink-300 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-semibold text-ink-900 mb-2">
            No Submissions Found
          </h3>
          <p className="text-ink-400 text-sm max-w-md mx-auto">
            {searchQuery
              ? 'No submissions match your search.'
              : 'No participants have completed the challenge yet.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-cream-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wide hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-ink-500 uppercase tracking-wide">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-ink-100 hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-ink-700">
                            {s.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-ink-900">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-ink-600">
                          <Mail className="w-3 h-3 text-ink-300" />
                          <span className="truncate max-w-[180px]">{s.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-ink-600">
                          <Phone className="w-3 h-3 text-ink-300" />
                          <span>{s.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-ink-600">
                          <MapPin className="w-3 h-3 text-ink-300" />
                          <span className="truncate max-w-[180px]">{s.clinic_address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.score === s.total_questions
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {s.score === s.total_questions ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {s.score}/{s.total_questions}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-ink-400">
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                      <div className="text-xs text-ink-300">
                        {new Date(s.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {confirmDeleteId === s.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn-ghost text-xs px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            disabled={deletingId === s.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {deletingId === s.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(s.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Question Section ----

function QuestionSection() {
  const [questions, setQuestions] = useState<ChallengeQuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const data = await getAllQuestions();
    setQuestions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleToggleChallenge = async (id: string, included: boolean) => {
    setActionError(false);
    const success = await setQuestionInChallenge(id, included);
    if (success) {
      fetchQuestions();
    } else {
      setActionError(true);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError(false);
    const success = await deleteQuestion(id);
    if (success) {
      fetchQuestions();
    } else {
      setActionError(true);
    }
  };

  const challengeCount = questions.filter((q) => q.is_active).length;

  if (showForm || editingId) {
    const editing = editingId ? questions.find((q) => q.id === editingId) : null;
    return (
      <QuestionForm
        existing={editing || null}
        onCancel={() => { setShowForm(false); setEditingId(null); }}
        onSaved={() => { setShowForm(false); setEditingId(null); fetchQuestions(); }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink-900">Challenge Questions</h2>
          <p className={`text-sm mt-1 ${challengeCount === CHALLENGE_QUESTION_COUNT ? 'text-ink-500' : 'text-red-600'}`}>
            {challengeCount} of {CHALLENGE_QUESTION_COUNT} questions in the challenge
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Question
        </button>
      </div>

      {actionError && (
        <div className="card p-3 mb-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Action failed. Please try again.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-ink-400 animate-spin mb-3" />
          <p className="text-ink-400 text-sm">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="card p-12 text-center">
          <HelpCircle className="w-12 h-12 text-ink-300 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-semibold text-ink-900 mb-2">
            No Questions Yet
          </h3>
          <p className="text-ink-400 text-sm mb-4">
            Create a challenge question for participants to answer.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" />
            Create Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-ink-400 uppercase tracking-wide">
                      {q.category}
                    </span>
                    {q.is_active && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        In challenge
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-900 font-medium leading-relaxed mb-3">
                    {q.question}
                  </p>
                  <div className="space-y-1">
                    {[
                      { label: 'A', text: q.option_a, idx: 0 },
                      { label: 'B', text: q.option_b, idx: 1 },
                      { label: 'C', text: q.option_c, idx: 2 },
                      { label: 'D', text: q.option_d, idx: 3 },
                    ].map((opt) => (
                      <div
                        key={opt.idx}
                        className={`flex items-center gap-2 text-xs ${
                          opt.idx === q.correct_answer
                            ? 'text-green-700 font-medium'
                            : 'text-ink-500'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          opt.idx === q.correct_answer
                            ? 'bg-green-500 text-white'
                            : 'bg-cream-100 text-ink-500'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="truncate">{opt.text}</span>
                        {opt.idx === q.correct_answer && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-ink-100">
                <button
                  onClick={() => handleToggleChallenge(q.id, !q.is_active)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-700 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors"
                >
                  {q.is_active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {q.is_active ? 'Remove from Challenge' : 'Add to Challenge'}
                </button>
                <button
                  onClick={() => setEditingId(q.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-700 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Question Form ----

function QuestionForm({
  existing,
  onCancel,
  onSaved,
}: {
  existing: ChallengeQuestionData | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ChallengeQuestionInput>({
    question: existing?.question ?? '',
    option_a: existing?.option_a ?? '',
    option_b: existing?.option_b ?? '',
    option_c: existing?.option_c ?? '',
    option_d: existing?.option_d ?? '',
    correct_answer: existing?.correct_answer ?? 0,
    explanation: existing?.explanation ?? '',
    takeaway: existing?.takeaway ?? '',
    category: existing?.category ?? 'General',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const options = [
    { key: 'option_a' as const, label: 'Option A' },
    { key: 'option_b' as const, label: 'Option B' },
    { key: 'option_c' as const, label: 'Option C' },
    { key: 'option_d' as const, label: 'Option D' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.question.trim() || !form.option_a.trim() || !form.option_b.trim() ||
        !form.option_c.trim() || !form.option_d.trim() || !form.explanation.trim() ||
        !form.takeaway.trim()) {
      setError('All fields are required.');
      return;
    }

    setSaving(true);
    let result: ChallengeQuestionData | null;
    if (existing) {
      result = await updateQuestion(existing.id, form);
    } else {
      result = await createQuestion(form);
    }
    setSaving(false);

    if (result) {
      onSaved();
    } else {
      setError(existing ? 'Failed to update question.' : 'Failed to create question.');
    }
  };

  return (
    <div>
      <button onClick={onCancel} className="btn-ghost mb-4">
        <ChevronLeft className="w-4 h-4" />
        Back to Questions
      </button>

      <div className="card p-6 lg:p-8 max-w-3xl">
        <h2 className="font-serif text-xl font-semibold text-ink-900 mb-6">
          {existing ? 'Edit Question' : 'New Challenge Question'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Question Text</label>
            <textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              rows={4}
              placeholder="Enter the clinical question..."
              className="input-field resize-y"
            />
          </div>

          <div>
            <label className="input-label">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g., Pharmacology"
              className="input-field"
            />
          </div>

          <div className="space-y-3">
            <label className="input-label">Answer Options</label>
            {options.map((opt, idx) => (
              <div key={opt.key} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, correct_answer: idx })}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                    form.correct_answer === idx
                      ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                      : 'bg-cream-100 text-ink-500 hover:bg-cream-200'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </button>
                <input
                  type="text"
                  value={form[opt.key]}
                  onChange={(e) => setForm({ ...form, [opt.key]: e.target.value })}
                  placeholder={`${opt.label} text...`}
                  className="input-field flex-1"
                />
                {form.correct_answer === idx && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
            <p className="text-xs text-ink-400">
              Click the letter circle to mark the correct answer.
            </p>
          </div>

          <div>
            <label className="input-label">Explanation</label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={3}
              placeholder="Explanation shown after answering..."
              className="input-field resize-y"
            />
          </div>

          <div>
            <label className="input-label">Takeaway</label>
            <textarea
              value={form.takeaway}
              onChange={(e) => setForm({ ...form, takeaway: e.target.value })}
              rows={3}
              placeholder="Key lesson shown under the correct answer..."
              className="input-field resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {existing ? 'Update Question' : 'Create & Add to Challenge'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
