import { useEffect, useRef, useState } from "react";

const COMMANDS = {
  help: () => [
    '<span class="term-muted">Available commands:</span>',
    '  <span class="term-accent">help</span>        Show this help message',
    '  <span class="term-accent">skills</span>      Display technical skills',
    '  <span class="term-accent">projects</span>    Show project portfolio',
    '  <span class="term-accent">experience</span>  Display work experience',
    '  <span class="term-accent">education</span>   Show education details',
    '  <span class="term-accent">contact</span>     Get contact information',
    '  <span class="term-accent">clear</span>       Clear terminal',
  ],

  skills: () => [
    "",
    '  <span class="term-accent term-bold">Frontend</span>    React, Next.js, TypeScript',
    "              Tailwind CSS, Material UI",
    "",
    '  <span class="term-accent term-bold">Backend</span>     Node.js, Express.js',
    "              REST APIs, Socket.IO",
    "",
    '  <span class="term-accent term-bold">Database</span>    MongoDB, PostgreSQL',
    "              Mongoose, GridFS",
    "",
    '  <span class="term-accent term-bold">AI/ML</span>       Groq AI, LLMs',
    "              Data Visualization, NumPy",
    "",
    '  <span class="term-accent term-bold">Tools</span>       Git, Docker, VS Code',
    "              Postman, MongoDB Atlas",
    "",
    '  <span class="term-accent term-bold">Languages</span>   JavaScript, Python, C++, SQL',
    "",
  ],

  projects: () => [
    "",
    '  <span class="term-accent term-bold">[1]</span> <span class="term-bold">Resume Analyser</span>',
    '      <span class="term-muted">AI-powered resume feedback tool</span>',
    '      <span class="term-green">Node.js, React, Groq AI</span>',
    "",
    '  <span class="term-accent term-bold">[2]</span> <span class="term-bold">WhatsApp Clone</span>',
    '      <span class="term-muted">Real-time chat with Socket.IO</span>',
    '      <span class="term-green">React, Node.js, MongoDB</span>',
    "",
    '  <span class="term-accent term-bold">[3]</span> <span class="term-bold">Airbnb Clone</span>',
    '      <span class="term-muted">Property listing REST API</span>',
    '      <span class="term-green">Node.js, Express, MongoDB</span>',
    "",
  ],

  experience: () => [
    "",
    '  <span class="term-bold">Cyber Security Analyst (Virtual)</span>',
    '  <span class="term-accent">@ Deloitte Australia</span>  <span class="term-yellow">Jul 2025</span>',
    '  <span class="term-muted">Analysed web logs, investigated breaches</span>',
    "",
    '  <span class="term-bold">Data Analytics Intern</span>',
    '  <span class="term-accent">@ Vodafone Idea Foundation</span>  <span class="term-yellow">Nov-Dec 2024</span>',
    '  <span class="term-muted">Applied LLMs to data analytics</span>',
    "",
  ],

  education: () => [
    "",
    '  <span class="term-bold">B.Tech in AI &amp; Data Science</span>',
    '  <span class="term-accent">Vishwakarma Institute of Technology, Pune</span>',
    '  <span class="term-muted">2023 - 2027</span>  |  CGPA: <span class="term-green term-bold">8.74</span>',
    "",
  ],

  contact: () => [
    "",
    '  📧  <span class="term-accent">Email</span>     ishan.kale23@vit.edu',
    '  🔗  <span class="term-accent">LinkedIn</span>  <span class="term-muted">linkedin.com/in/ishan-kale-587b3b281</span>',
    '  💻  <span class="term-accent">GitHub</span>    <span class="term-muted">github.com/IshanKale</span>',
    "",
  ],
};

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );

const Terminal = () => {
  const [lines, setLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);
  const historyIndex = useRef(-1);
  const bodyRef = useRef(null);
  const demoTimeout = useRef(null);
  const typingTimeout = useRef(null);
  const demoState = useRef({
    currentIndex: 0,
    charIndex: 0,
    deleting: false,
    active: true,
  });

  const scrollToBottom = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const appendPromptLine = (command) => {
    setLines((previous) => [
      ...previous,
      {
        id: `prompt-${previous.length}-${Date.now()}`,
        type: "prompt",
        command,
      },
    ]);
  };

  const appendOutputLines = (outputLines) => {
    setLines((previous) => [
      ...previous,
      ...outputLines.map((line, index) => ({
        id: `output-${previous.length + index}-${Date.now()}`,
        type: "output",
        html: line,
      })),
    ]);
  };

  const executeCommand = (command) => {
    const trimmed = command.trim().toLowerCase();
    if (trimmed === "") return null;
    if (trimmed === "clear") {
      setLines([]);
      return null;
    }

    if (COMMANDS[trimmed]) {
      return COMMANDS[trimmed]();
    }

    return [
      `<span class="term-red">Command not found: ${escapeHtml(trimmed)}. Type 'help' for available commands.</span>`,
    ];
  };

  const processInput = () => {
    if (!inputValue.trim()) {
      setInputValue("");
      return;
    }

    appendPromptLine(inputValue);
    setHistory((prev) => [...prev, inputValue]);
    historyIndex.current = -1;

    const output = executeCommand(inputValue);
    if (output) appendOutputLines(output);
    setInputValue("");
  };

  const stopDemo = () => {
    demoState.current.active = false;
    clearTimeout(demoTimeout.current);
    clearTimeout(typingTimeout.current);
  };

  const startDemo = () => {
    demoState.current = {
      currentIndex: 0,
      charIndex: 0,
      deleting: false,
      active: true,
    };

    const keywords = [
      "skills",
      "projects",
      "experience",
      "education",
      "contact",
    ];

    const runCommandCycle = () => {
      if (!demoState.current.active) return;
      const currentKeyword = keywords[demoState.current.currentIndex];

      if (!demoState.current.deleting) {
        const nextText = currentKeyword.slice(
          0,
          demoState.current.charIndex + 1,
        );
        setInputValue(nextText);
        demoState.current.charIndex += 1;

        if (demoState.current.charIndex === currentKeyword.length) {
          demoTimeout.current = window.setTimeout(() => {
            demoState.current.deleting = true;
            demoTimeout.current = window.setTimeout(runCommandCycle, 800);
          }, 1800);
          return;
        }

        typingTimeout.current = window.setTimeout(runCommandCycle, 100);
        return;
      }

      const nextText = currentKeyword.slice(0, demoState.current.charIndex - 1);
      setInputValue(nextText);
      demoState.current.charIndex -= 1;

      if (demoState.current.charIndex === 0) {
        demoState.current.deleting = false;
        demoState.current.currentIndex =
          (demoState.current.currentIndex + 1) % keywords.length;
        demoTimeout.current = window.setTimeout(runCommandCycle, 800);
        return;
      }

      typingTimeout.current = window.setTimeout(runCommandCycle, 60);
    };

    demoTimeout.current = window.setTimeout(runCommandCycle, 2000);
  };

  useEffect(() => {
    startDemo();
    return () => stopDemo();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      stopDemo();
      processInput();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      if (historyIndex.current === -1) {
        historyIndex.current = history.length - 1;
      } else if (historyIndex.current > 0) {
        historyIndex.current -= 1;
      }
      setInputValue(history[historyIndex.current] || "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex.current === -1) return;
      if (historyIndex.current < history.length - 1) {
        historyIndex.current += 1;
        setInputValue(history[historyIndex.current] || "");
      } else {
        historyIndex.current = -1;
        setInputValue("");
      }
    }
  };

  return (
    <div className="terminal" id="hero-terminal">
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
        </div>
        <div className="terminal-title">ishan@portfolio:~</div>
      </div>
      <div className="terminal-body" ref={bodyRef} id="terminal-body">
        <div className="terminal-output" id="terminal-output">
          {lines.map((entry) => (
            <div
              key={entry.id}
              className={
                entry.type === "prompt"
                  ? "terminal-prompt-line"
                  : "terminal-line"
              }
              dangerouslySetInnerHTML={
                entry.type === "output" ? { __html: entry.html } : undefined
              }
            >
              {entry.type === "prompt" ? (
                <>
                  <span className="terminal-prompt">visitor@ishan:~$</span>
                  <span className="command-text">{entry.command}</span>
                </>
              ) : null}
            </div>
          ))}
        </div>
        <div className="terminal-input-line">
          <span className="terminal-prompt">visitor@ishan:~$</span>
          <input
            type="text"
            className="terminal-input"
            value={inputValue}
            spellCheck="false"
            autoComplete="off"
            onChange={(event) => {
              stopDemo();
              setInputValue(event.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="terminal-cursor" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
