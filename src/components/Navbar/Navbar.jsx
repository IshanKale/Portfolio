import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", to: "#landing" },
  { label: "About", to: "#about" },
  { label: "Experience", to: "#experience" },
  { label: "Projects", to: "#projects" },
  { label: "Skills", to: "#skills" },
  { label: "Certifications", to: "#certifications" },
  { label: "Achievements", to: "#achievements" },
  { label: "Contact", to: "#contact", cta: true },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);
      
      setLastScrollY((prev) => {
        if (!menuOpen) {
          if (currentScrollY < 50) {
            setVisible(true);
          } else if (currentScrollY < prev) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
        return currentScrollY;
      });

      const documentHeight = document.body.scrollHeight - window.innerHeight;
      setProgress(
        documentHeight > 0
          ? Math.min(100, (currentScrollY / documentHeight) * 100)
          : 0,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.clientY <= 110) {
        setVisible(true);
      } else if (!menuOpen) {
        setVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnRoute = () => setMenuOpen(false);
    window.addEventListener("resize", closeOnRoute);
    return () => window.removeEventListener("resize", closeOnRoute);
  }, [menuOpen]);

  const closeMobileMenu = () => setMenuOpen(false);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMobileMenu();
  };

  return (
    <>
      <nav
        className={`navbar${scrolled ? " scrolled" : ""}${visible || menuOpen ? "" : " hidden"}${menuOpen ? " menu-open" : ""}`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => {
          if (!menuOpen) setVisible(false);
        }}
      >
      <div className="nav-progress" style={{ width: `${progress}%` }} />
      <div className="nav-inner">
        <a 
          href="#landing" 
          className="nav-logo" 
          onClick={(e) => handleNavClick(e, "#landing")}
        >
          IK
        </a>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.to}
                className={`nav-link${item.cta ? " nav-cta" : ""}`}
                onClick={(e) => handleNavClick(e, item.to)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`hamburger${menuOpen ? " active" : ""}`}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
    <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.to}
          className="nav-link"
          onClick={(e) => handleNavClick(e, item.to)}
        >
          {item.label}
        </a>
      ))}
    </div>
    <div
      className={`mobile-menu-overlay${menuOpen ? " visible" : ""}`}
      onClick={closeMobileMenu}
    />
    </>
  );
};

export default Navbar;
