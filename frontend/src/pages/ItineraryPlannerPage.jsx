import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recommendApi } from '../api/axiosClient'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles, DollarSign, Map, Thermometer, ShieldCheck,
  Loader2, AlertCircle, Star, Clock, ChevronRight, LogIn
} from 'lucide-react'

// ─── Mock results for when the API is offline ─────────────────────────────────
const MOCK_RESULTS = [
  {
    destinationId: '5', name: 'Marrakech, Morocco', countryCode: 'MA',
    description: 'Vibrant souks, spice-laden medinas, and breathtaking desert landscapes.',
    imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80',
    priorityScore: 91.5, minBudgetUsd: 600, maxBudgetUsd: 1800, avgDurationDays: 7,
  },
  {
    destinationId: '1', name: 'Bali, Indonesia', countryCode: 'ID',
    description: 'Tropical paradise with ancient temples, lush terraces, and vibrant nightlife.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    priorityScore: 78.0, minBudgetUsd: 800, maxBudgetUsd: 2500, avgDurationDays: 10,
  },
  {
    destinationId: '3', name: 'Patagonia, Argentina', countryCode: 'AR',
    description: 'Raw wilderness with towering glaciers, pristine lakes, and epic trekking.',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    priorityScore: 65.0, minBudgetUsd: 1500, maxBudgetUsd: 4000, avgDurationDays: 14,
  },
]

const TRAVEL_STYLES = [
  { id: 'adventure', label: '🧗 Adventure', desc: 'Hiking, climbing, thrill' },
  { id: 'luxury',    label: '✨ Luxury',    desc: 'Premium resorts & dining' },
  { id: 'beach',     label: '🏖️ Beach',    desc: 'Sun, sand & sea' },
  { id: 'cultural',  label: '🏛️ Cultural', desc: 'History & local life' },
  { id: 'nature',    label: '🌿 Nature',    desc: 'Wildlife & scenery' },
  { id: 'budget',    label: '💰 Budget',    desc: 'Max value for money' },
  { id: 'city',      label: '🌆 City',      desc: 'Urban exploration' },
]

const CLIMATES = [
  { id: '',          label: 'No Preference' },
  { id: 'tropical',  label: '☀️ Tropical'  },
  { id: 'temperate', label: '🌤️ Temperate' },
  { id: 'arid',      label: '🏜️ Arid'      },
  { id: 'polar',     label: '❄️ Polar'      },
]

// ─── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }) {
  const pct = Math.min(Math.round(score), 100)
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-brand-500' : 'bg-amber-500'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-white w-10 text-right">{pct}</span>
    </div>
  )
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ result, rank }) {
  return (
    <article className="card-hover p-0 overflow-hidden flex flex-col sm:flex-row animate-slide-up">
      {/* Image */}
      <div className="relative sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden">
        <img src={result.imageUrl} alt={result.name}
          className="w-full h-full object-cover"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/60 sm:block hidden" />
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shadow-glow">
          #{rank}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-3">
        <div>
          <h3 className="font-display font-bold text-white text-lg">{result.name}</h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{result.description}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Match Score</span>
            <Star className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <ScoreBar score={result.priorityScore} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-brand-400" />
            ${result.minBudgetUsd.toLocaleString()} – ${result.maxBudgetUsd.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            {result.avgDurationDays} days
          </span>
        </div>
      </div>
    </article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ItineraryPlannerPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    budgetUsd: '',
    travelStyles: [],
    climateType: '',
    minSafetyRating: 0,
    limit: 5,
  })
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [usedMock, setUsedMock] = useState(false)

  const toggleStyle = (id) => {
    setForm(f => ({
      ...f,
      travelStyles: f.travelStyles.includes(id)
        ? f.travelStyles.filter(s => s !== id)
        : [...f.travelStyles, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.budgetUsd || form.travelStyles.length === 0) {
      setError('Please enter your budget and select at least one travel style.')
      return
    }
    setError(null)
    setLoading(true)
    setResults(null)
    setUsedMock(false)

    try {
      const payload = {
        ...form,
        budgetUsd: parseFloat(form.budgetUsd),
        minSafetyRating: parseInt(form.minSafetyRating, 10),
        limit: parseInt(form.limit, 10),
      }
      const { data } = await recommendApi.get(payload)
      setResults(data)
    } catch (err) {
      if (err.response?.status === 401) {
        // Show login prompt
        setError('Please sign in to get personalised recommendations.')
      } else {
        // Use mock results for demo
        setResults(MOCK_RESULTS)
        setUsedMock(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 badge-blue mb-4">
            <Sparkles className="w-3.5 h-3.5" />Smart Itinerary Planner
          </div>
          <h1 className="section-title text-4xl md:text-5xl">
            Find Your Perfect Trip
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto mt-2">
            Tell us your preferences and our engine scores every destination
            across budget, travel style, climate, and safety.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ─── Form panel ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 space-y-6 sticky top-24">
            <h2 className="font-display font-bold text-white text-xl">Your Preferences</h2>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1 text-brand-400" />
                Budget (USD per person)
              </label>
              <input id="budget" type="number" min="1" placeholder="e.g. 2000"
                value={form.budgetUsd}
                onChange={e => setForm(f => ({ ...f, budgetUsd: e.target.value }))}
                className="input" required
              />
            </div>

            {/* Travel styles */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <Map className="inline w-4 h-4 mr-1 text-brand-400" />
                Travel Style <span className="text-slate-500">(pick at least one)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRAVEL_STYLES.map(({ id, label }) => (
                  <button key={id} type="button" onClick={() => toggleStyle(id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                      form.travelStyles.includes(id)
                        ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-glow'
                        : 'bg-surface border-surface-border text-slate-400 hover:border-brand-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Climate */}
            <div>
              <label htmlFor="climate" className="block text-sm font-medium text-slate-300 mb-2">
                <Thermometer className="inline w-4 h-4 mr-1 text-brand-400" />
                Preferred Climate
              </label>
              <select id="climate" value={form.climateType}
                onChange={e => setForm(f => ({ ...f, climateType: e.target.value }))}
                className="input"
              >
                {CLIMATES.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            {/* Safety */}
            <div>
              <label htmlFor="safety" className="block text-sm font-medium text-slate-300 mb-2">
                <ShieldCheck className="inline w-4 h-4 mr-1 text-brand-400" />
                Min Safety Rating: <span className="text-brand-300 font-semibold">{form.minSafetyRating}</span>
              </label>
              <input id="safety" type="range" min="0" max="10" step="1"
                value={form.minSafetyRating}
                onChange={e => setForm(f => ({ ...f, minSafetyRating: e.target.value }))}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>0</span><span>5</span><span>10</span>
              </div>
            </div>

            {/* Number of results */}
            <div>
              <label htmlFor="limit" className="block text-sm font-medium text-slate-300 mb-2">
                Results to show: <span className="text-brand-300 font-semibold">{form.limit}</span>
              </label>
              <input id="limit" type="range" min="1" max="10" step="1"
                value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                className="w-full accent-brand-500"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!user && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Sign in for live results. Demo mode uses sample data.</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating…</>
                : <><Sparkles className="w-4 h-4" /> Get Recommendations</>
              }
            </button>
          </form>

          {/* ─── Results panel ───────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">
            {!results && !loading && (
              <div className="card p-12 text-center text-slate-500 h-64 flex flex-col items-center justify-center gap-4">
                <Sparkles className="w-12 h-12 opacity-20" />
                <p>Fill in your preferences and click <strong className="text-slate-400">Get Recommendations</strong></p>
              </div>
            )}

            {loading && (
              <div className="card p-12 text-center h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-brand-400" />
                <p className="text-slate-400">Scoring destinations for you…</p>
              </div>
            )}

            {results && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-white text-xl">
                    Top {results.length} Matches
                  </h2>
                  {usedMock && (
                    <span className="badge-amber text-xs">Demo data (API offline)</span>
                  )}
                </div>
                {results.map((r, i) => (
                  <ResultCard key={r.destinationId} result={r} rank={i + 1} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
