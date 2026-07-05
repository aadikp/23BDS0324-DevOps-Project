import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Globe, LayoutDashboard, Map, LogOut, LogIn, Menu, X, Sun, Moon } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/',          label: 'Discover',  icon: Globe },
    { to: '/planner',   label: 'Planner',   icon: Map   },
    ...(isAdmin ? [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }] : []),
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-md dark:shadow-glow group-hover:shadow-lg dark:group-hover:shadow-glow-lg transition-all">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Travel<span className="text-gradient">Sphere</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-xs px-3 py-2">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-xs px-4 py-2">
                <LogIn className="w-3.5 h-3.5" /> Sign in
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />{label}
              </NavLink>
            ))}
            {user
              ? <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-500 dark:text-rose-400">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              : <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-brand-600 dark:text-brand-400">
                  <LogIn className="w-4 h-4" /> Sign in
                </Link>
            }
          </div>
        )}
      </div>
    </header>
  )
}
