import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { destinationsApi } from '../api/axiosClient'
import {
  Globe, MapPin, Clock, ShieldCheck, DollarSign,
  Search, Star, ArrowRight, Sparkles, ChevronDown
} from 'lucide-react'

// ─── Mock data (used when API is not yet connected) ───────────────────────────
const MOCK_DESTINATIONS = [
  {
    id: '1', name: 'Bali, Indonesia',   countryCode: 'ID',
    description: 'Tropical paradise with ancient temples, lush terraces, and vibrant nightlife.',
    travelStyles: ['adventure', 'nature', 'cultural'],
    minBudgetUsd: 800,  maxBudgetUsd: 2500, avgDurationDays: 10,
    climateType: 'tropical', safetyRating: 8, active: true,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  },
  {
    id: '2', name: 'Santorini, Greece', countryCode: 'GR',
    description: 'Iconic blue-domed churches, dramatic caldera views, and world-class sunsets.',
    travelStyles: ['luxury', 'beach', 'cultural'],
    minBudgetUsd: 2000, maxBudgetUsd: 6000, avgDurationDays: 7,
    climateType: 'temperate', safetyRating: 9, active: true,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
  },
  {
    id: '3', name: 'Patagonia, Argentina', countryCode: 'AR',
    description: 'Raw wilderness with towering glaciers, pristine lakes, and epic trekking.',
    travelStyles: ['adventure', 'nature'],
    minBudgetUsd: 1500, maxBudgetUsd: 4000, avgDurationDays: 14,
    climateType: 'temperate', safetyRating: 7, active: true,
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
  },
  {
    id: '4', name: 'Kyoto, Japan',       countryCode: 'JP',
    description: 'Timeless temples, geisha districts, and cherry blossoms – Japan\'s cultural soul.',
    travelStyles: ['cultural', 'city'],
    minBudgetUsd: 1800, maxBudgetUsd: 5000, avgDurationDays: 9,
    climateType: 'temperate', safetyRating: 10, active: true,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  },
  {
    id: '5', name: 'Marrakech, Morocco', countryCode: 'MA',
    description: 'Vibrant souks, spice-laden medinas, and breathtaking desert landscapes.',
    travelStyles: ['cultural', 'budget', 'adventure'],
    minBudgetUsd: 600,  maxBudgetUsd: 1800, avgDurationDays: 7,
    climateType: 'arid', safetyRating: 7, active: true,
    imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80',
  },
  {
    id: '6', name: 'Iceland',            countryCode: 'IS',
    description: 'Northern Lights, volcanic landscapes, geysers, and midnight sun adventures.',
    travelStyles: ['adventure', 'nature'],
    minBudgetUsd: 2500, maxBudgetUsd: 7000, avgDurationDays: 8,
    climateType: 'polar', safetyRating: 10, active: true,
    imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&q=80',
  },
]

const STYLE_COLORS = {
  adventure: 'badge-amber', luxury: 'badge-blue', beach: 'badge-green',
  cultural: 'badge-rose', nature: 'badge-green', budget: 'badge-amber', city: 'badge-blue',
}

// ─── DestinationCard ──────────────────────────────────────────────────────────
function DestinationCard({ dest }) {
  return (
    <article className="card-hover overflow-hidden group animate-slide-up">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-semibold">{dest.safetyRating}/10</span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-brand-300" />
          <span className="text-sm font-semibold text-white">{dest.name}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{dest.description}</p>

        {/* Style tags */}
        <div className="flex flex-wrap gap-1.5">
          {dest.travelStyles.map(s => (
            <span key={s} className={STYLE_COLORS[s] ?? 'badge-blue'}>
              {s}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-border text-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <DollarSign className="w-3.5 h-3.5 text-brand-400" />
            <span>${dest.minBudgetUsd.toLocaleString()} – ${dest.maxBudgetUsd.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>{dest.avgDurationDays} days</span>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 badge-blue mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Travel Recommendations
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
          Discover Your Next
          <span className="block text-gradient">Perfect Adventure</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          TravelSphere matches your budget and travel style to handpicked destinations
          worldwide. Smart itineraries, zero stress.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/planner" className="btn-primary text-base px-8 py-4">
            <Sparkles className="w-5 h-5" />
            Plan My Trip
          </Link>
          <a href="#destinations" className="btn-ghost text-base px-8 py-4">
            Browse Destinations
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[['500+','Destinations'],['95%','Match Rate'],['4.9★','Avg Rating']].map(([val,lbl])=>(
            <div key={lbl} className="text-center">
              <div className="text-2xl font-bold text-white font-display">{val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-slate-500" />
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DiscoveryPage() {
  const [destinations, setDestinations] = useState(MOCK_DESTINATIONS)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDests = async () => {
      setLoading(true)
      try {
        const { data } = await destinationsApi.getAll()
        if (data?.length) setDestinations(data)
      } catch {
        // Fall back to mock data silently
      } finally {
        setLoading(false)
      }
    }
    fetchDests()
  }, [])

  const STYLES = ['all', 'adventure', 'luxury', 'beach', 'cultural', 'nature', 'budget', 'city']

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || d.travelStyles.includes(filter)
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Destinations section */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">
              {filtered.length} package{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="destination-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Style filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STYLES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                filter === s
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : 'bg-surface-card text-slate-400 border border-surface-border hover:border-brand-500 hover:text-brand-400'
              }`}
            >
              {s === 'all' ? '✦ All' : s}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-surface-card" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(dest => <DestinationCard key={dest.id} dest={dest} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No destinations match your search.</p>
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-16 card p-8 md:p-12 text-center bg-brand-gradient shadow-glow-lg">
          <Star className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Get Personalised Recommendations
          </h3>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Tell us your budget and travel style – our AI engine ranks the best matches for you instantly.
          </p>
          <Link to="/planner" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-blue-50 transition-all">
            Start Planning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
