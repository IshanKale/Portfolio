import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { 
  SiCplusplus, SiJavascript, SiHtml5, SiPython, 
  SiEjs, SiExpress, SiFastapi, SiJsonwebtokens, SiNodedotjs, 
  SiNodemon, SiReact, SiRedux, SiSocketdotio, SiVite, 
  SiMysql, SiMongodb, SiNumpy, SiPandas, SiGithub, SiGit
} from "react-icons/si";
import { FaChartBar, FaCss3 } from "react-icons/fa";
import "./SkillsPlayground.css";

const SKILLS_DATA = [
  { id: "cpp", label: "C++", bg: "#00599C", color: "#ffffff", Icon: SiCplusplus },
  { id: "css3", label: "CSS3", bg: "#1572B6", color: "#ffffff", Icon: FaCss3 },
  { id: "javascript", label: "JS", bg: "#F7DF1E", color: "#000000", Icon: SiJavascript },
  { id: "html5", label: "HTML5", bg: "#E34F26", color: "#ffffff", Icon: SiHtml5 },
  { id: "python", label: "Python", bg: "#306998", color: "#FFD43B", Icon: SiPython },
  { id: "ejs", label: "EJS", bg: "#B4CA65", color: "#000000", Icon: SiEjs },
  { id: "express", label: "Express", bg: "#111111", color: "#ffffff", Icon: SiExpress },
  { id: "fastapi", label: "FastAPI", bg: "#009688", color: "#ffffff", Icon: SiFastapi },
  { id: "jwt", label: "JWT", bg: "#111111", color: "#FF00FF", Icon: SiJsonwebtokens },
  { id: "nodejs", label: "Node.js", bg: "#339933", color: "#ffffff", Icon: SiNodedotjs },
  { id: "nodemon", label: "Nodemon", bg: "#76D04B", color: "#000000", Icon: SiNodemon },
  { id: "react", label: "React", bg: "#00d8ff", color: "#ffffff", Icon: SiReact },
  { id: "redux", label: "Redux", bg: "#764ABC", color: "#ffffff", Icon: SiRedux },
  { id: "socketio", label: "Socket.io", bg: "#111111", color: "#ffffff", Icon: SiSocketdotio },
  { id: "vite", label: "Vite", bg: "#646CFF", color: "#ffffff", Icon: SiVite },
  { id: "mysql", label: "MySQL", bg: "#4479A1", color: "#ffffff", Icon: SiMysql },
  { id: "mongodb", label: "MongoDB", bg: "#47A248", color: "#ffffff", Icon: SiMongodb },
  { id: "matplotlib", label: "Matplotlib", bg: "#11557c", color: "#ffffff", Icon: FaChartBar },
  { id: "numpy", label: "NumPy", bg: "#013243", color: "#4d77cf", Icon: SiNumpy },
  { id: "pandas", label: "Pandas", bg: "#150458", color: "#ffffff", Icon: SiPandas },
  { id: "github", label: "GitHub", bg: "#181717", color: "#ffffff", Icon: SiGithub },
  { id: "git", label: "Git", bg: "#F05032", color: "#ffffff", Icon: SiGit }
];

const SkillsPlayground = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const blockRefs = useRef({});
  
  // Detect mobile viewport size to scale down boxes and optimize physics
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    let width = sceneRef.current.clientWidth || 800;
    let height = sceneRef.current.clientHeight || 500;

    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // CPU Optimization for Mobile
    if (isMobile) {
      engine.positionIterations = 3; // Default is 6. Lowering it reduces collision calculations
      engine.velocityIterations = 3; // Default is 4. Lowering it reduces velocity updates
    }

    const wallOptions = { isStatic: true, render: { visible: false }, friction: 0.2 };
    const ground = Matter.Bodies.rectangle(width / 2, height + 100, width * 3, 200, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-100, height / 2, 200, height * 3, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 100, height / 2, 200, height * 3, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -500, width * 3, 200, wallOptions);

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

    const boxSize = isMobile ? 60 : 100;
    const chamferRadius = isMobile ? 12 : 20;

    const bodies = SKILLS_DATA.map((skill) => {
      const safeWidth = Math.max(width, boxSize * 3); 
      const x = (Math.random() * (safeWidth - boxSize * 2)) + boxSize;
      const y = -boxSize - (Math.random() * 300);

      const body = Matter.Bodies.rectangle(x, y, boxSize, boxSize, {
        restitution: 0.5,
        friction: 0.1,
        density: 0.005,
        label: skill.id,
        chamfer: { radius: chamferRadius }
      });

      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      return body;
    });

    Matter.World.add(world, bodies);

    // Attach mouse directly to the React container
    const mouse = Matter.Mouse.create(sceneRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Matter.World.add(world, mouseConstraint);

    // Custom animation loop
    let animationFrameId;
    let isVisible = true;

    const update = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }
      
      Matter.Engine.update(engine, 1000 / 60);

      bodies.forEach((body) => {
        const id = body.label;
        const domElement = blockRefs.current[id];
        
        if (domElement) {
          const halfSize = boxSize / 2;
          const x = body.position.x - halfSize; 
          const y = body.position.y - halfSize;
          const angle = body.angle;
          domElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };
    update();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (sceneRef.current) {
      visibilityObserver.observe(sceneRef.current);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth === 0 || newHeight === 0) continue;

        Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 100 });
        Matter.Body.setPosition(rightWall, { x: newWidth + 100, y: newHeight / 2 });
        Matter.Body.setPosition(ceiling, { x: newWidth / 2, y: -500 });
      }
    });

    resizeObserver.observe(sceneRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [isMobile]);

  return (
    <section className="skills-playground-section" id="skills">
      <div className="skills-playground-container">
        <div className="playground-header reveal">
          <h2>
            Skills <span className="highlight">Playground</span>
          </h2>
          <p>Drag, throw, and watch them bounce!</p>
        </div>
        
        <div className="playground-area reveal" ref={sceneRef}>
          {SKILLS_DATA.map((skill) => (
            <div
              key={`skill-${isMobile ? 'm' : 'd'}-${skill.id}`}
              id={`skill-block-${skill.id}`}
              ref={(el) => (blockRefs.current[skill.id] = el)}
              className={isMobile ? "skill-block skill-block-mobile" : "skill-block"}
              style={{
                width: isMobile ? '60px' : '100px',
                height: isMobile ? '60px' : '100px',
                backgroundColor: skill.bg,
                color: skill.color,
                border: skill.id === 'solana' || skill.id === 'nextjs' || skill.id === 'supabase' ? '1px solid rgba(255,255,255,0.15)' : 'none'
              }}
            >
              <div className="skill-icon">
                <skill.Icon size={isMobile ? 24 : 42} />
              </div>
              <span className="skill-name">{skill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsPlayground;
