import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000; // 2 seconds loading
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setVisible(false), 400); // short delay after reaching 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const unmountTimeout = setTimeout(() => setMounted(false), 600);
      return () => clearTimeout(unmountTimeout);
    }
    return undefined;
  }, [visible]);

  // Lock scrolling while loading screen is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    // Cleanup function to ensure scrolling is restored if component unmounts unexpectedly
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`loading-screen${visible ? "" : " hidden"}`}>
      <div className="loading-circle-container">
        <svg className="loading-svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--clr-accent)" />
              <stop offset="50%" stopColor="var(--clr-secondary)" />
              <stop offset="100%" stopColor="#ffaa00" />
            </linearGradient>
          </defs>
          {/* Background Track with tick marks */}
          <circle 
            cx="50" cy="50" r="40" 
            className="loading-circle-track" 
          />
          {/* Progress Ring */}
          <circle 
            cx="50" cy="50" r="40" 
            className="loading-circle-progress"
            style={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
          />
        </svg>
        <div className="loading-text-container">
          <div className="loading-percentage">{progress}%</div>
          <div className="loading-status">
            {progress < 100 ? "Initializing..." : "Synchronized"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
