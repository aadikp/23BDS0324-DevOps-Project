import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import {
  Globe, Users, TrendingUp, Activity, Package,
  DollarSign, ShieldCheck, Eye, Edit2, Trash2,
  Plus, RefreshCw, AlertTriangle
} from 'lucide-react'

// ─── Mock analytics data ──────────────────────────────────────────────────────
const TRAFFIC_DATA = [
  { time: '00:00', requests: 42, errors: 2 },
  { time: '03:00', requests: 18, errors: 0 },
  { time: '06:00', requests: 67, errors: 3 },
  { time: '09:00', requests: 189, errors: 8 },
  { time: '12:00', requests: 312, errors: 12 },
  { time: '15:00', requests: 278, errors: 9 },
  { time: '18:00', requests: 401, errors: 15 },
  { time: '21:00', requests: 234, errors: 6 },
  { time: '23:59', requests: 98, errors: 3 },
]

const BOOKING_DATA = [
  { month: 'Jan', bookings: 340, revenue: 68000 },
  { month: 'Feb', bookings: 290, revenue: 52000 },
  { month: 'Mar', bookings: 480, revenue: 96000 },
  { month: 'Apr', bookings: 520, revenue: 104000 },
  { month: 'May', bookings: 610, revenue: 128000 },
  { month: 'Jun', bookings: 780, revenue: 168000 },
]

const STYLE_PIE = [
  { name: 'Adventure', value: 28, color: '#f59e0b' },
  { name: 'Luxury',    value: 22, color: '#2a9fff' },
  { name: 'Cultural',  value: 18, color: '#a78bfa' },
  { name: 'Nature',    value: 16, color: '#10b981' },
  { name: 'Beach',     value: 10, color: '#06b6d4' },
  { name: 'Budget',    value:  6, color: '#f97316' },
]

const MOCK_PACKAGES = [
  { id: '1', name: 'Bali, Indonesia',      styles: ['adventure','nature'],  price: '$800–$2,500',  status: 'active',   bookings: 234 },
  { id: '2', name: 'Santorini, Greece',    styles: ['luxury','beach'],      price: '$2,000–$6,000',status: 'active',   bookings: 189 },
  { id: '3', name: 'Patagonia, Argentina', styles: ['adventure','nature'],  price: '$1,500–$4,000',status: 'active',   bookings: 112 },
  { id: '4', name: 'Kyoto, Japan',         styles: ['cultural','city'],     price: '$1,800–$5,000',status: 'active',   bookings: 98  },
  { id: '5', name: 'Marrakech, Morocco',   styles: ['cultural','budget'],   price: '$600–$1,800',  status: 'inactive', bookings: 76  },
  { id: '6', name: 'Iceland',              styles: ['adventure','nature'],  price: '$2,500–$7,000',status: 'active',   bookings: 67  },
]

// ─── Shared chart theme ────────────────────────────────────────────────────────
const CHART_THEME = {
  gridColor: '#334155',
  textColor: '#94a3b8',
  tooltipBg: '#1e293b',
  tooltipBorder: '#334155',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-card">
      <p className="text-slate-300 font-medium mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 999
            ? `$${(p.value/1000).toFixed(0)}k` : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colors = {
    brand:   'bg-brand-500/20 text-brand-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber:   'bg-amber-500/20 text-amber-400',
    rose:    'bg-rose-500/20 text-rose-400',
  }
  return (
    <div className="stat-card animate-fade-in">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold font-display text-white">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Package row ──────────────────────────────────────────────────────────────
function PackageRow({ pkg, onToggle, onDelete }) {
  return (
    <tr className="border-b border-surface-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3">
        <span className="font-medium text-slate-200 text-sm">{pkg.name}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {pkg.styles.map(s => (
            <span key={s} className="badge badge-blue text-xs capitalize">{s}</span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-400 text-sm">{pkg.price}</td>
      <td className="px-4 py-3 text-slate-400 text-sm">{pkg.bookings}</td>
      <td className="px-4 py-3">
        <button onClick={() => onToggle(pkg.id)}
          className={`badge text-xs cursor-pointer transition-all ${
            pkg.status === 'active' ? 'badge-green' : 'badge-rose'
          }`}
        >
          {pkg.status}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button title="View" className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
            <Eye className="w-4 h-4" />
          </button>
          <button title="Edit" className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
          <button title="Delete" onClick={() => onDelete(pkg.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [packages, setPackages] = useState(MOCK_PACKAGES)
  const [activeTab, setActiveTab] = useState('overview')

  const toggleStatus = (id) => {
    setPackages(ps => ps.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ))
  }

  const deletePackage = (id) => {
    setPackages(ps => ps.filter(p => p.id !== id))
  }

  const tabs = ['overview', 'packages', 'traffic']

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="section-title mb-1">Admin Dashboard</h1>
            <p className="section-subtitle">TravelSphere platform analytics &amp; management</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 badge-green text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Online
            </span>
            <button className="btn-ghost text-xs px-3 py-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-card border border-surface-border rounded-xl mb-8 w-fit">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === t
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ─────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Package}    label="Active Packages"   value={packages.filter(p=>p.status==='active').length}  sub="2 inactive"     color="brand"   />
              <StatCard icon={Users}      label="Total Bookings"    value="2,156"   sub="+18% this month"  color="emerald" />
              <StatCard icon={DollarSign} label="Revenue (USD)"     value="$616k"   sub="June projection"  color="amber"   />
              <StatCard icon={TrendingUp} label="Avg Match Score"   value="78.4"    sub="Out of 100"       color="rose"    />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bookings + Revenue */}
              <div className="lg:col-span-2 card p-6">
                <h2 className="font-display font-bold text-white mb-4">Monthly Bookings &amp; Revenue</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={BOOKING_DATA} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                    <XAxis dataKey="month" tick={{ fill: CHART_THEME.textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fill: CHART_THEME.textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: CHART_THEME.textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: CHART_THEME.textColor, fontSize: 12 }} />
                    <Bar yAxisId="left"  dataKey="bookings" name="Bookings" fill="#2a9fff" radius={[4,4,0,0]} />
                    <Bar yAxisId="right" dataKey="revenue"  name="Revenue $" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Travel style distribution */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-white mb-4">Travel Style Demand</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={STYLE_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="value">
                      {STYLE_PIE.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} contentStyle={{ background: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {STYLE_PIE.map(s => (
                    <div key={s.name} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                      {s.name} ({s.value}%)
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue trend */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-white mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={BOOKING_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2a9fff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2a9fff" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                  <XAxis dataKey="month" tick={{ fill: CHART_THEME.textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_THEME.textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue $" stroke="#2a9fff" fill="url(#revGrad)" strokeWidth={2} dot={{ fill: '#2a9fff', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ─── PACKAGES ─────────────────────────────────────────────── */}
        {activeTab === 'packages' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-white text-xl">
                Travel Packages ({packages.length})
              </h2>
              <button className="btn-primary text-sm px-4 py-2">
                <Plus className="w-4 h-4" /> Add Package
              </button>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border bg-surface">
                      {['Destination','Travel Style','Budget Range','Bookings','Status','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map(pkg => (
                      <PackageRow key={pkg.id} pkg={pkg} onToggle={toggleStatus} onDelete={deletePackage} />
                    ))}
                  </tbody>
                </table>
              </div>
              {packages.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No packages. Add one to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TRAFFIC ──────────────────────────────────────────────── */}
        {activeTab === 'traffic' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Activity}     label="Requests Today"   value="1,739"  sub="vs 1,540 yesterday" color="brand"   />
              <StatCard icon={AlertTriangle} label="Error Rate"      value="2.9%"   sub="58 errors"          color="rose"    />
              <StatCard icon={Globe}         label="Uptime"          value="99.97%" sub="Last 30 days"       color="emerald" />
              <StatCard icon={ShieldCheck}   label="Auth Failures"  value="12"     sub="In last 24 h"       color="amber"   />
            </div>

            {/* Request/error chart */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-white mb-4">API Traffic – Last 24 Hours</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={TRAFFIC_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                  <XAxis dataKey="time" tick={{ fill: CHART_THEME.textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_THEME.textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: CHART_THEME.textColor, fontSize: 12 }} />
                  <Line type="monotone" dataKey="requests" name="Requests" stroke="#2a9fff" strokeWidth={2.5}
                    dot={{ fill: '#2a9fff', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="errors" name="Errors" stroke="#f43f5e" strokeWidth={2}
                    dot={{ fill: '#f43f5e', r: 3 }} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic heat info */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Peak Hour',       value: '18:00 – 19:00', sub: '401 req/h', color: 'brand' },
                { label: 'Avg Response',    value: '142 ms',         sub: 'p95: 380 ms', color: 'emerald' },
                { label: 'Active Sessions', value: '87',             sub: 'right now',   color: 'amber' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="card p-5 text-center">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-3xl font-bold font-display text-white`}>{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
