import { useMemo } from "react";

const HeroParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, index) => {
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 30 + 15;
      const delay = Math.random() * 20;
      const opacity = (Math.random() * 0.5 + 0.15).toFixed(2);
      const drift = (Math.random() - 0.5) * 60;
      return {
        id: `hero-particle-${index}`,
        size,
        left,
        top,
        duration,
        delay,
        opacity,
        drift,
      };
    });
  }, []);

  return (
    <div className="hero-particles" id="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            "--drift": `${particle.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroParticles;
