import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import HeroParticles from "../components/HeroParticles/HeroParticles";
import Terminal from "../components/Terminal/Terminal";
import profileImage from "../assets/ishan_profile.jpg";
import hackathonImage from "../assets/hackathon.jpg";
import competitiveImage from "../assets/competitive_programming.jpg";
import SkillsPlayground from "../components/SkillsPlayground/SkillsPlayground";
import OrbitingAvatar from "../components/OrbitingAvatar/OrbitingAvatar";
import GithubCard from "../components/StatsCards/GithubCard";
import LeetCodeCard from "../components/StatsCards/LeetCodeCard";
import CodeForcesCard from "../components/StatsCards/CodeForcesCard";
import CodeChefCard from "../components/StatsCards/CodeChefCard";
import { certificatesData } from "../data/certificates";
import resumeFile from "../assets/resume.pdf";
const designationTexts = [
  "Full-Stack Developer",
  "AI & Data Science Student",
  "Competitive Programmer",
];

const skills = [
  "C++",
  "DSA",
  "SQL",
  "React",
  "Express",
];

const experiences = [
  {
    id: 1,
    role: "Cyber Security Analyst",
    subtitle: "(Virtual)",
    company: "Deloitte Australia",
    badge: "Internship / Simulation",
    date: "Jul 2025",
    desc: "Analysed web logs, investigated threats, and helped secure cloud-based services through practical cyber security workflows."
  },
  {
    id: 2,
    role: "Data Analytics Intern",
    company: "Vodafone Idea Foundation",
    badge: "AI & Data Analyst",
    date: "Nov 2024",
    desc: "Applied AI models to improve insights, run analytics pipelines, and build dashboards for stakeholder reporting."
  },
  {
    id: 3,
    role: "Student Researcher",
    company: "VIT Pune",
    badge: "Research",
    date: "Mar 2026",
    desc: "Published a paper on AI-driven data science systems and presented findings at a technical conference."
  },
  {
    id: 4,
    role: "Contributer",
    company: "SSoC 26",
    badge: "open source",
    date: "Jun-Aug 2026",
    desc: "contributing to open source projects and understanding real life projects"
  }
];

const ExperienceCard = ({ id, role, subtitle, company, badge, date, desc, isLeft, isTimelineInView, index, isExpanded, onToggle }) => {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const entryDelay = 0.6 + index * 0.5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isMobile ? 30 : (isLeft ? -35 : 35) }}
      animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
      transition={{ 
        layout: { duration: 0.35, ease: "easeInOut" },
        opacity: { duration: 0.8, ease: "easeOut", delay: isTimelineInView ? entryDelay : 0 },
        x: { duration: 0.8, ease: "easeOut", delay: isTimelineInView ? entryDelay : 0 }
      }}
      className={`timeline-card ${isExpanded ? "expanded" : "collapsed"}`}
      onClick={() => !isExpanded && onToggle()}
      style={{ borderRadius: isExpanded ? "16px" : "30px" }}
    >
      {/* Capsule View: height and opacity animated smoothly inline */}
      <motion.div
        animate={{ 
          opacity: isExpanded ? 0 : 1,
          height: isExpanded ? 0 : "auto"
        }}
        transition={{ 
          opacity: { duration: isExpanded ? 0.05 : 0.2, delay: isExpanded ? 0 : 0.25 },
          height: { duration: 0.35, ease: "easeInOut" }
        }}
        style={{ overflow: "hidden", pointerEvents: isExpanded ? "none" : "auto" }}
        className="capsule-view"
      >
        {(isLeft && !isMobile) && (
          <span className="capsule-icon">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        )}
        <span className="capsule-date">{date}</span>
        <span className="capsule-divider">|</span>
        <span className="capsule-role">{role}</span>
        {!(isLeft && !isMobile) && (
          <span className="capsule-icon">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        )}
      </motion.div>

      {/* Expanded View: height and opacity animated smoothly inline */}
      <motion.div
        animate={{ 
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0
        }}
        transition={{ 
          opacity: { duration: isExpanded ? 0.2 : 0.05, delay: isExpanded ? 0.3 : 0 },
          height: { duration: 0.35, ease: "easeInOut" }
        }}
        style={{ overflow: "hidden", pointerEvents: isExpanded ? "auto" : "none" }}
        className="expanded-view"
      >
        <button
          className={`close-btn ${(isLeft && !isMobile) ? "left-side" : "right-side"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label="Close details"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h3>
          {role} {subtitle && <span>{subtitle}</span>}
        </h3>
        <h4>{company}</h4>
        <div className="timeline-meta">
          <span className="badge badge-year">{badge}</span>
          <span>{date}</span>
        </div>
        <p>{desc}</p>
      </motion.div>
    </motion.div>
  );
};

const Home = () => {
  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "" });
  const [expandedExpId, setExpandedExpId] = useState(null);
  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.15 });
  const [typingText, setTypingText] = useState("");
  const [submitText, setSubmitText] = useState("Send message");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const typingState = useRef({ index: 0, char: 0, deleting: false });

  const certsScrollRef = useRef(null);

  const scrollCertsLeft = () => {
    if (certsScrollRef.current) {
      certsScrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollCertsRight = () => {
    if (certsScrollRef.current) {
      certsScrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const scrollToSection = (hash) => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "/");
    }
  };

  useEffect(() => {
    const heroSteps = [
      { selector: ".hero-badge", delay: 0 },
      { selector: ".hero-name", delay: 200 },
      { selector: ".hero-designation", delay: 400 },
      { selector: ".hero-intro", delay: 600 },
      { selector: ".hero-cta", delay: 800 },
      { selector: ".hero-socials", delay: 1000 },
      { selector: ".hero-right", delay: 400 },
      { selector: ".hero-scroll-indicator", delay: 1200 },
    ];

    const timers = heroSteps.map(({ selector, delay }) =>
      window.setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) element.classList.add("visible");
      }, delay + 100),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .timeline-observer",
    );
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const achievementsSection = document.getElementById("achievements");
    if (!achievementsSection) return undefined;

    const animateCounters = (container) => {
      container.querySelectorAll(".stat-number").forEach((counter) => {
        const target = Number(counter.dataset.target) || 0;
        const duration = 2000;
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = `${Math.floor(eased * target)}+`;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            counter.textContent = `${target}+`;
          }
        };

        window.requestAnimationFrame(step);
      });
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(achievementsSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".project-card");
    const listeners = [];

    cards.forEach((card) => {
      const handleMouseMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x - rect.width / 2) / rect.width) * 15;
        const rotateX = ((rect.height / 2 - y) / rect.height) * 15;
        card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;

        // Glow effect
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        card.style.setProperty("--glow-x", `${glowX}%`);
        card.style.setProperty("--glow-y", `${glowY}%`);
      };

      const handleMouseLeave = () => {
        card.style.transform =
          "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
        card.style.transition = "transform 0.5s ease";
      };

      const handleMouseEnter = () => {
        card.style.transition = "transform 0.1s ease";
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      card.addEventListener("mouseenter", handleMouseEnter);

      listeners.push({
        card,
        handleMouseMove,
        handleMouseLeave,
        handleMouseEnter,
      });
    });

    return () => {
      listeners.forEach(
        ({ card, handleMouseMove, handleMouseLeave, handleMouseEnter }) => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
          card.removeEventListener("mouseenter", handleMouseEnter);
        },
      );
    };
  }, []);

  useEffect(() => {
    let timeoutId;
    const tick = () => {
      const state = typingState.current;
      const currentText = designationTexts[state.index];

      if (!state.deleting) {
        setTypingText(currentText.slice(0, state.char + 1));
        state.char += 1;

        if (state.char === currentText.length) {
          state.deleting = true;
          timeoutId = window.setTimeout(tick, 1800);
          return;
        }

        timeoutId = window.setTimeout(tick, 80);
      } else {
        setTypingText(currentText.slice(0, state.char - 1));
        state.char -= 1;

        if (state.char === 0) {
          state.deleting = false;
          state.index = (state.index + 1) % designationTexts.length;
          timeoutId = window.setTimeout(tick, 800);
          return;
        }

        timeoutId = window.setTimeout(tick, 40);
      }
    };

    timeoutId = window.setTimeout(tick, 2800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const openLightbox = (src, alt) => {
    setLightbox({ open: true, src, alt });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ open: false, src: "", alt: "" });
    document.body.style.overflow = "";
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.name.value || "";
    const email = form.email.value || "";
    const subject = form.subject.value || "";
    const message = form.message.value || "";

    setSubmitText("Sending...");
    setSubmitDisabled(true);

    try {
      // NOTE: Replace YOUR_WEB3FORMS_ACCESS_KEY with your actual access key from web3forms.com
      // For now, it will fallback to mailto if the access key is the placeholder
      const accessKey = "YOUR_WEB3FORMS_ACCESS_KEY";
      
      if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailto = `mailto:ishan.kale23@vit.edu?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        setSubmitText("Message Opened ✓");
        form.reset();
      } else {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,
            name,
            email,
            subject,
            message,
          }),
        });
        
        const result = await response.json();
        if (result.success) {
          setSubmitText("Message Sent ✓");
          form.reset();
        } else {
          setSubmitText("Failed to send");
        }
      }
    } catch (error) {
      setSubmitText("Error occurred");
    }

    window.setTimeout(() => {
      setSubmitText("Send message");
      setSubmitDisabled(false);
    }, 3000);
  };

  return (
    <>
      <section className="hero" id="landing">
        <HeroParticles />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="hero-badge-dot" /> Available for opportunities
              </div>
              <h1 className="hero-name">
                Hi, I'm <span className="gradient-text">Ishan Kale</span>
              </h1>
              <p className="hero-designation">
                <span className="typing-text">{typingText}</span>
                <span className="typing-cursor">|</span>
              </p>
              <p className="hero-intro">
                I build full-stack web applications — from real-time chat
                systems to AI-powered tools — using Node.js, React, and MongoDB.
                Competitive programmer with 1600+ LeetCode rating. Always
                shipping something real.
              </p>
              <div className="hero-cta">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => scrollToSection("#projects")}
                >
                  View My Work
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => scrollToSection("#contact")}
                >
                  Get In Touch
                </button>
              </div>
              <div className="hero-socials">
                <a
                  href="https://github.com/IshanKale"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                  aria-label="GitHub"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/ishan-kale-587b3b281/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                  aria-label="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="mailto:ishan.kale23@vit.edu"
                  className="social-icon"
                  aria-label="Email"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="20"
                    height="20"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="hero-right">
              <Terminal />
            </div>
          </div>
          <div className="hero-scroll-indicator">
            <span>Scroll Down</span>
            <div className="scroll-line" />
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container">
          <div className="section-heading reveal">
            <h2>About Me</h2>
            <p className="section-subtitle">Who I am and what drives me</p>
          </div>
          <div className="about-top-grid">
            <div className="about-avatar-col reveal-left">
              <OrbitingAvatar imageSrc={profileImage} />
            </div>
            <div className="about-text-col reveal-right">
              <p>
                Full-Stack Developer skilled in MERN Stack and Python, passionate about building scalable web applications and AI-powered solutions. Currently exploring Machine Learning, Deep Learning, and contributing to open-source projects through SSoC'26.
              </p>
              <div style={{ marginTop: "28px" }}>
                <a 
                  href={resumeFile} 
                  download="Ishan_Kale_Resume.pdf" 
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Resume
                </a>
              </div>
            </div>
          </div>
          
          <div className="about-cards-grid reveal">
            <GithubCard username="IshanKale" />
            <LeetCodeCard username="IshanKale" />
            <CodeChefCard username="ishankale" />
            <CodeForcesCard username="IshanKale" />
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="container">
          <div className="section-heading reveal">
            <h2>Work Experience</h2>
            <p className="section-subtitle">
              Professional roles and industry exposure
            </p>
          </div>
          <div ref={timelineRef} className={`timeline timeline-observer ${isTimelineInView ? "active" : ""}`}>
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              return (
                <article key={exp.id} className="timeline-item">
                  <span className="timeline-dot" />
                  <ExperienceCard
                    {...exp}
                    index={index}
                    isLeft={isLeft}
                    isTimelineInView={isTimelineInView}
                    isExpanded={expandedExpId === exp.id}
                    onToggle={() => setExpandedExpId(expandedExpId === exp.id ? null : exp.id)}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="education">
        <div className="container">
          <div className="section-heading reveal">
            <h2>Education</h2>
            <p className="section-subtitle">
              Academic foundation and ongoing learning
            </p>
          </div>
          <div className="education-grid reveal-right">
            <article className="education-card">
              <div className="education-icon">🎓</div>
              <h3>B.Tech in AI & Data Science</h3>
              <div className="edu-meta">
                Vishwakarma Institute of Technology, Pune
              </div>
              <p>2023 - 2027 · CGPA 8.78</p>
            </article>
            <article className="education-card">
              <div className="education-icon">📚</div>
              <h3>Online Courses</h3>
              <div className="edu-meta">
                AI, web security, data visualization
              </div>
              <p>
                Continuous study of modern frameworks, cloud services, and
                machine learning tools.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="container">
          <div className="section-heading reveal">
            <h2>Projects</h2>
            <p className="section-subtitle">
              Selected work and product experiments
            </p>
          </div>
          <div className="projects-grid reveal">
            <article className="project-card">
              <span className="project-badge">Web</span>
              <span className="project-type">Full stack</span>
              <h3>E-Commerce Platform</h3>
              <p>
                A robust, fully functional e-commerce web application featuring
                product listings, a shopping cart, and seamless user flows.
              </p>
              <div className="project-footer">
                <span>React · Node.js · Express · MongoDB</span>
              </div>
              <div className="project-links">
                <a
                  href="https://github.com/IshanKale/e-commerce"
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://e-commerce-smoky-sigma.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                >
                  Live Demo ↗
                </a>
              </div>
            </article>
            <article className="project-card">
              <span className="project-badge">AI</span>
              <span className="project-type">Full stack</span>
              <h3>Resume Analyser</h3>
              <p>
                AI-powered resume feedback tool that helps candidates prepare
                for interviews and refine their profiles.
              </p>
              <div className="project-footer">
                <span>React · Node.js · Groq AI</span>
              </div>
              <div className="project-links">
                <a
                  href="https://github.com/IshanKale/resume-analyser"
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://github.com/IshanKale/resume-analyser"
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                >
                  Live Demo ↗
                </a>
              </div>
            </article>
            <a
              href="https://github.com/IshanKale"
              target="_blank"
              rel="noreferrer"
              className="project-card"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--clr-accent)" }}>
                More Projects ↗
              </h3>
              <p style={{ margin: 0 }}>
                Explore the rest of my open-source work and experiments on GitHub.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section id="skills">
        <SkillsPlayground />
      </section>

      <section id="certifications">
        <div className="container">
          <div className="section-heading reveal">
            <h2>Premium <span className="gradient-text">Certificates</span></h2>
            <p className="section-subtitle">
              Hover each certificate to reveal its details.
            </p>
          </div>
          <div className="carousel-wrapper reveal-right">
            <button className="carousel-arrow left" onClick={scrollCertsLeft}>
              &#10094;
            </button>
            <div className="certifications-grid" ref={certsScrollRef}>
              {certificatesData.map((cert) => (
                <button
                  key={cert.id}
                  type="button"
                  className="cert-card lightbox-trigger"
                  onClick={() => openLightbox(cert.image, cert.imageAlt)}
                >
                  <div className="cert-paper">
                    <h4>CERTIFICATE</h4>
                    <img src={cert.image} alt={cert.imageAlt} />
                  </div>
                  <div className="cert-envelope">
                    <h3>{cert.title}</h3>
                    <span className="cert-provider">{cert.provider}</span>
                    <div className="cert-date">{cert.date}</div>
                    <div className="cert-view-btn">View ↗</div>
                  </div>
                </button>
              ))}
            </div>
            <button className="carousel-arrow right" onClick={scrollCertsRight}>
              &#10095;
            </button>
          </div>
        </div>
      </section>

      <section id="achievements">
        <div className="container">
          <div className="section-heading reveal">
            <h2>Achievements</h2>
            <p className="section-subtitle">
              Milestones from hackathons and competitions
            </p>
          </div>
          <div className="stats-row reveal-left">
            <div className="stat-item">
              <span className="stat-number" data-target="25">
                0
              </span>
              <p className="stat-label">Hackathon hours</p>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-target="18">
                0
              </span>
              <p className="stat-label">Projects shipped</p>
            </div>
          </div>
          <div className="achievements-grid reveal-right">
            <article className="achievement-card">
              <div className="achievement-image">
                <img src={hackathonImage} alt="Hackathon" />
              </div>
              <div className="achievement-content">
                <h3>Hackathon finalist</h3>
                <p>
                  build an parquet file analyser with visuals.
                </p>
              </div>
            </article>

            <article className="achievement-card">
              <div className="achievement-image">
                <img src={competitiveImage} alt="Competitive programming" />
              </div>
              <div className="achievement-content">
                <h3>Competitive programming</h3>
                <p>
                  Ranked top percentile in several national coding contests.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <div className="section-heading reveal">
            <h2>Contact</h2>
            <p className="section-subtitle">
              Let's collaborate on your next product or idea
            </p>
          </div>
          <div className="contact-grid reveal-right">
            <div className="contact-info-panel reveal-left">
              <h3>Get in touch</h3>
              <p>
                Reach out for project inquiries, contract work, or mentorship
                discussions.
              </p>
              <div className="contact-info-row">
                <div className="contact-info-icon">📧</div>
                <div className="contact-info-text">
                  <h4>Email</h4>
                  <p><a href="mailto:ishan.kale23@vit.edu" className="contact-link">ishan.kale23@vit.edu</a></p>
                </div>
              </div>
              <div className="contact-info-row">
                <div className="contact-info-icon">🔗</div>
                <div className="contact-info-text">
                  <h4>LinkedIn</h4>
                  <p><a href="https://linkedin.com/in/ishan-kale-587b3b281" target="_blank" rel="noreferrer" className="contact-link">linkedin.com/in/ishan-kale-587b3b281</a></p>
                </div>
              </div>
              <div className="contact-info-row">
                <div className="contact-info-icon">💻</div>
                <div className="contact-info-text">
                  <h4>GitHub</h4>
                  <p><a href="https://github.com/IshanKale" target="_blank" rel="noreferrer" className="contact-link">github.com/IshanKale</a></p>
                </div>
              </div>
            </div>
            <form
              className="contact-form-card reveal-left"
              onSubmit={handleContactSubmit}
            >
              <div className="form-group">
                <input type="text" name="name" placeholder=" " required />
                <label>Name</label>
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder=" " required />
                <label>Email</label>
              </div>
              <div className="form-group">
                <input type="text" name="subject" placeholder=" " required />
                <label>Subject</label>
              </div>
              <div className="form-group">
                <textarea name="message" placeholder=" " rows="5" required />
                <label>Message</label>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-send"
                disabled={submitDisabled}
              >
                {submitText}
              </button>
            </form>
          </div>
        </div>
      </section>

      {lightbox.open && (
        <div className="lightbox-overlay active" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={lightbox.src} alt={lightbox.alt} />
            <button
              type="button"
              className="lightbox-close"
              onClick={closeLightbox}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
