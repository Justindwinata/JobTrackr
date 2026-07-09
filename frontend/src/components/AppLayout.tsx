import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import BrandLogo from "./BrandLogo";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Discover Jobs", to: "/discover" },
  { label: "Saved Opportunities", to: "/saved" },
  { label: "Application Tracker", to: "/tracker" },
  { label: "Reports", to: "/reports" },
];

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-frame">
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
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={isMenuOpen ? "nav-links nav-links-open" : "nav-links"}>
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="footer-shell">
          <BrandLogo compact />
          <p>
            JobTrackr generates safe job search links and prepares a manual
            application tracking workflow. No scraping, no fake listings.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;

