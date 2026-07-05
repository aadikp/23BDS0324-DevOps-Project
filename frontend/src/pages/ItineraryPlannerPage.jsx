import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recommendApi } from '../api/axiosClient'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles, DollarSign, Map, Thermometer, ShieldCheck,
  Loader2, AlertCircle, Star, Clock, LogIn, Heart, Compass
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
  const [currentPct, setCurrentPct] = useState(0);
  const pct = Math.min(Math.round(score), 100)
  
  useEffect(() => {
    // Animate the bar filling up after component mounts
    const timeout = setTimeout(() => setCurrentPct(pct), 100);
    return () => clearTimeout(timeout);
  }, [pct]);

  const color = currentPct >= 80 ? 'bg-emerald-500' : currentPct >= 60 ? 'bg-brand-500' : 'bg-amber-500'
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-surface-dark-border rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${currentPct}%` }} 
        />
      </div>
      <span className="text-sm font-bold text-slate-700 dark:text-white w-10 text-right">{currentPct}</span>
    </div>
  )
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ result, rank }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <article className="card-hover p-0 overflow-hidden flex flex-col sm:flex-row animate-slide-up group">
      {/* Image */}
      <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
        <img src={result.imageUrl} alt={result.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-dark/40 sm:block hidden pointer-events-none" />
        
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-sm font-bold text-white shadow-md z-10">
          #{rank}
        </div>

        {/* Save Button */}
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 p-2 rounded-full glass hover:bg-white/90 dark:hover:bg-zinc-900/90 transition-all z-10"
          aria-label="Save destination"
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-700 dark:text-white'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-xl">{result.name}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">{result.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Match Score</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <ScoreBar score={result.priorityScore} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-surface-dark-border">
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign className="w-4 h-4 text-brand-500" />
              ${result.minBudgetUsd.toLocaleString()} – ${result.maxBudgetUsd.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-brand-500" />
              {result.avgDurationDays} days
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function ResultCardSkeleton() {
  return (
    <article className="card p-0 flex flex-col sm:flex-row animate-pulse">
      <div className="sm:w-56 h-48 sm:h-auto shrink-0 bg-slate-200 dark:bg-surface-dark-border" />
      <div className="flex-1 p-5 sm:p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-surface-dark-border rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-surface-dark-border rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-surface-dark-border rounded w-5/6" />
        </div>
        <div className="pt-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-slate-200 dark:bg-surface-dark-border rounded w-20" />
            <div className="h-3 bg-slate-200 dark:bg-surface-dark-border rounded w-4" />
          </div>
          <div className="h-2 bg-slate-200 dark:bg-surface-dark-border rounded w-full" />
        </div>
        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-surface-dark-border">
          <div className="h-4 bg-slate-200 dark:bg-surface-dark-border rounded w-24" />
          <div className="h-4 bg-slate-200 dark:bg-surface-dark-border rounded w-20" />
        </div>
      </div>
    </article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ItineraryPlannerPage() {
  const { user } = useAuth()

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
        setError('Please sign in to get personalised recommendations.')
      } else {
        const apiError = err.response?.data?.message || err.message;
        setError(`API Error: ${apiError}`);
        setResults(MOCK_RESULTS)
        setUsedMock(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 badge-blue mb-5">
            <Sparkles className="w-4 h-4" /> Smart Itinerary Planner
          </div>
          <h1 className="section-title">
            Find Your Perfect Trip
          </h1>
          <p className="section-subtitle mt-3">
            Tell us your preferences and our engine scores every destination
            across budget, travel style, climate, and safety.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* ─── Form panel ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-5 xl:col-span-4 card p-6 sm:p-8 space-y-8 sticky top-24">
            <h2 className="font-display font-bold text-slate-900 dark:text-white text-2xl mb-2">Preferences</h2>

            {/* Budget */}
            <div className="space-y-3">
              <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                <DollarSign className="inline w-4 h-4 mr-1 text-brand-500 -mt-0.5" />
                Budget (USD per person)
              </label>
              <input id="budget" type="number" min="1" placeholder="e.g. 2000"
                value={form.budgetUsd}
                onChange={e => setForm(f => ({ ...f, budgetUsd: e.target.value }))}
                className="input" required
              />
            </div>

            {/* Travel styles */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Map className="inline w-4 h-4 mr-1 text-brand-500 -mt-0.5" />
                Travel Style <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(pick at least one)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map(({ id, label }) => {
                  const isSelected = form.travelStyles.includes(id);
                  return (
                    <button key={id} type="button" onClick={() => toggleStyle(id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        isSelected
                          ? 'bg-brand-50 text-brand-700 border-brand-200 shadow-sm dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30 dark:shadow-glow'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:bg-slate-50 dark:bg-surface-dark dark:border-surface-dark-border dark:text-slate-400 dark:hover:border-brand-700 dark:hover:bg-surface-dark-card'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Climate */}
            <div className="space-y-3">
              <label htmlFor="climate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Thermometer className="inline w-4 h-4 mr-1 text-brand-500 -mt-0.5" />
                Preferred Climate
              </label>
              <select id="climate" value={form.climateType}
                onChange={e => setForm(f => ({ ...f, climateType: e.target.value }))}
                className="input cursor-pointer"
              >
                {CLIMATES.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            {/* Safety */}
            <div className="space-y-4">
              <label htmlFor="safety" className="block flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span>
                  <ShieldCheck className="inline w-4 h-4 mr-1 text-brand-500 -mt-0.5" />
                  Min Safety Rating
                </span>
                <span className="bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 px-2 py-0.5 rounded text-xs">{form.minSafetyRating}/10</span>
              </label>
              <input id="safety" type="range" min="0" max="10" step="1"
                value={form.minSafetyRating}
                onChange={e => setForm(f => ({ ...f, minSafetyRating: e.target.value }))}
              />
            </div>

            {/* Number of results */}
            <div className="space-y-4">
              <label htmlFor="limit" className="block flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span>Results to show</span>
                <span className="bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 px-2 py-0.5 rounded text-xs">{form.limit}</span>
              </label>
              <input id="limit" type="range" min="1" max="10" step="1"
                value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 rounded-xl dark:text-rose-400 text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{error}</span>
              </div>
            )}

            {!user && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 rounded-xl dark:text-amber-300 text-sm">
                <LogIn className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">Sign in for live results. Demo mode uses sample data.</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Preferences…</>
                : <><Sparkles className="w-5 h-5" /> Get Recommendations</>
              }
            </button>
          </form>

          {/* ─── Results panel ───────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {!results && !loading && (
              <div className="card p-12 text-center h-[600px] flex flex-col items-center justify-center gap-6 animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-dark-border flex items-center justify-center mb-2">
                  <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="font-display text-xl font-bold text-slate-800 dark:text-slate-200">Where to next?</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Fill in your preferences on the left and let our AI find your perfect destination.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                <ResultCardSkeleton />
                <ResultCardSkeleton />
                <ResultCardSkeleton />
              </div>
            )}

            {results && !loading && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-bold text-slate-900 dark:text-white text-2xl">
                    Top {results.length} Matches
                  </h2>
                  {usedMock && (
                    <span className="badge-amber">Demo data (API offline)</span>
                  )}
                </div>
                
                <div className="space-y-6">
                  {results.map((r, i) => (
                    <ResultCard key={r.destinationId} result={r} rank={i + 1} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
