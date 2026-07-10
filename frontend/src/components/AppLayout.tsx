import {
  BarChart3,
  BookmarkCheck,
  Compass,
  Home,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import BrandLogo from "./BrandLogo";

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Discover", to: "/discover", icon: Compass },
  { label: "Saved", to: "/saved", icon: BookmarkCheck },
  { label: "Tracker", to: "/tracker", icon: LayoutDashboard },
  { label: "Reports", to: "/reports", icon: BarChart3 },
];

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-frame">
      <a className="skip-link" href="#app-main">
        Skip to main content
      </a>
      <aside className="desktop-sidebar" aria-label="Product navigation">
        <NavLink className="sidebar-brand" to="/" aria-label="JobTrackr home">
          <BrandLogo compact />
          <span>Career Suite</span>
        </NavLink>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
              }
              key={item.to}
              to={item.to}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="badge badge-accent">Local MVP</span>
          <strong>Manual tracking only</strong>
          <p>No scraping, no imported listings, no automated applications.</p>
        </div>
      </aside>

      <div className="app-content">
        <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <NavLink
            className="brand-link"
            to="/"
            aria-label="JobTrackr home"
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandLogo />
          </NavLink>

          <button
            className="nav-toggle"
            type="button"
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            className={isMenuOpen ? "nav-links nav-links-open" : "nav-links"}
            id="mobile-navigation"
          >
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <div id="app-main" tabIndex={-1}>
        <Outlet />
      </div>

      <footer className="site-footer">
        <div className="footer-shell">
          <BrandLogo compact />
          <div className="footer-meta">
            <p>
              JobTrackr generates safe job search links and stores manually saved
              opportunities. No scraping, no fake listings.
            </p>
            <span>Built for local portfolio-grade career tracking.</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default AppLayout;
