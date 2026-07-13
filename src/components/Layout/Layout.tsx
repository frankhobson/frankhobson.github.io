import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowUp, Settings } from "lucide-react";
import styles from "./Layout.module.css";

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const location = useLocation();

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Track scroll position for styles and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if running locally
  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168."),
    );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.wrapper}>
      {/* Navigation Header */}
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${location.pathname === "/" ? styles.homeHeader : ""}`}
      >
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.logo}>
            FRANK HOBSON
          </NavLink>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/work"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Work
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/travel"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Travel
            </NavLink>
            <NavLink
              to="/volunteering"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Volunteering
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.drawerOpen : ""}`}
      >
        <nav className={styles.mobileDrawerNav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.activeMobileLink : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.activeMobileLink : ""}`
            }
          >
            Work
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.activeMobileLink : ""}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/travel"
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.activeMobileLink : ""}`
            }
          >
            Travel
          </NavLink>
          <NavLink
            to="/volunteering"
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.activeMobileLink : ""}`
            }
          >
            Volunteering
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.footerText}>
            &copy; {new Date().getFullYear()} Frank Hobson. All rights reserved.
          </p>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/fhobson4"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/frank-hobson-835426275/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              LinkedIn
            </a>
            <a href="mailto:frankhob18@gmail.com" className={styles.footerLink}>
              Email
            </a>
            {isLocalhost && (
              <NavLink
                to="/admin"
                className={styles.footerLink}
                title="Admin Dashboard"
                aria-label="Admin Dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginLeft: "4px",
                }}
              >
                <Settings size={16} />
              </NavLink>
            )}
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        className={`${styles.scrollTop} ${showScrollTop ? styles.scrollTopVisible : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};
export default Layout;
