import React, { useEffect, useRef, useState } from "react";
import { useApp } from '../../context/AppContext';
import "./LandingPage.css";

const ASCII_CHARS = "@#8&o:*. ";

const PATHS = [
  {
    number: "01",
    title: "APTITUDE",
    description:
      "Sharpen logical thinking, quantitative ability and problem solving.",
    symbol: "◉",
  },
  {
    number: "02",
    title: "CODING",
    description:
      "Practice programming, DSA and real placement problems.",
    symbol: "</>",
  },
  {
    number: "03",
    title: "INTERVIEW",
    description:
      "Prepare for technical, HR and communication rounds.",
    symbol: "◌",
  },
  {
    number: "04",
    title: "GUIDANCE",
    description:
      "Get personalized roadmaps based on your goals and progress.",
    symbol: "↗",
  },
];

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();
  const pageRef = useRef<HTMLElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseNearHand, setMouseNearHand] = useState(false);
  const [mouse, setMouse] = useState({
    x: -1000,
    y: -1000,
  });

  /* ------------------------------------------------ */
  /* SCROLL PROGRESS */
  /* ------------------------------------------------ */

  useEffect(() => {
    const updateScroll = () => {
      if (!pageRef.current) return;

      const rect = pageRef.current.getBoundingClientRect();

      const maxScroll =
        pageRef.current.offsetHeight -
        window.innerHeight;

      const progress = Math.min(
        1,
        Math.max(
          0,
          -rect.top / Math.max(maxScroll, 1)
        )
      );

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    updateScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        updateScroll
      );
    };
  }, []);

  /* ------------------------------------------------ */
  /* CURSOR */
  /* ------------------------------------------------ */

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!handRef.current) return;

      const rect =
        handRef.current.getBoundingClientRect();

      const x =
        event.clientX -
        (rect.left + rect.width / 2);

      const y =
        event.clientY -
        (rect.top + rect.height / 2);

      const distance = Math.sqrt(
        x * x + y * y
      );

      const radius =
        Math.max(rect.width, rect.height) *
        0.58;

      setMouseNearHand(distance < radius);

      setMouse({
        x:
          event.clientX -
          rect.left,
        y:
          event.clientY -
          rect.top,
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  /* ------------------------------------------------ */
  /* ASCII CANVAS */
  /* ------------------------------------------------ */

  useEffect(() => {
    const canvas = canvasRef.current;
    const hand = handRef.current;

    if (!canvas || !hand) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let width = 1;
    let height = 1;

    const resize = () => {
      const rect =
        hand.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    resize();

    const observer =
      new ResizeObserver(resize);

    observer.observe(hand);

    const render = (time: number) => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      if (mouseNearHand) {
        const cell = Math.max(
          5,
          Math.min(
            10,
            width / 65
          )
        );

        ctx.font =
          `${cell}px "Courier New", monospace`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (
          let y = 0;
          y < height;
          y += cell
        ) {
          for (
            let x = 0;
            x < width;
            x += cell
          ) {
            const dx =
              x - mouse.x;

            const dy =
              y - mouse.y;

            const distance =
              Math.sqrt(
                dx * dx +
                dy * dy
              );

            const influence =
              Math.max(
                0,
                1 -
                  distance / 260
              );

            const wave =
              Math.sin(
                x * 0.045 +
                y * 0.025 +
                time * 0.004
              ) *
                0.5 +
              0.5;

            const noise =
              Math.sin(
                x * 0.11 +
                y * 0.08 +
                time * 0.006
              ) *
                0.5 +
              0.5;

            if (
              wave >
                0.42 + noise * 0.25
            ) {
              const index =
                Math.floor(
                  wave *
                    (ASCII_CHARS.length - 1)
                );

              const char =
                ASCII_CHARS[
                  Math.max(
                    0,
                    Math.min(
                      ASCII_CHARS.length -
                        1,
                      index
                    )
                  )
                ];

              const distortionX =
                Math.sin(
                  time * 0.005 +
                    y * 0.03
                ) *
                influence *
                16;

              const distortionY =
                Math.cos(
                  time * 0.004 +
                    x * 0.025
                ) *
                influence *
                12;

              const opacity =
                0.15 +
                influence *
                  0.8;

              ctx.fillStyle =
                `rgba(98,126,49,${opacity})`;

              ctx.fillText(
                char,
                x +
                  distortionX,
                y +
                  distortionY
              );
            }
          }
        }
      }

      animationFrame =
        requestAnimationFrame(
          render
        );
    };

    animationFrame =
      requestAnimationFrame(
        render
      );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      observer.disconnect();
    };
  }, [mouseNearHand, mouse]);

  /* ------------------------------------------------ */
  /* HERO MOTION */
  /* ------------------------------------------------ */

  const heroScale =
    1 -
    Math.min(
      scrollProgress * 0.1,
      0.1
    );

  const heroOpacity =
    Math.max(
      0,
      1 -
        scrollProgress * 2.2
    );

  const handTranslate =
    scrollProgress * -260;

  const handRotate =
    scrollProgress * -13;

  /* ------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------ */

  return (
    <main
      ref={pageRef}
      className="careeros-page"
    >

      {/* ========================================== */}
      {/* NAVIGATION */}
      {/* ========================================== */}

      <nav className="career-nav">

        <div className="career-brand">

          <img src="/assets/logo.jpg" alt="CareerOS Logo" style={{ height: '38px', borderRadius: '8px' }} />

          <span>
            CAREEROS
          </span>

        </div>

        <div className="nav-links">

          <button>
            ABOUT
          </button>

          <button>
            HOW IT WORKS
          </button>

          <button>
            FEATURES
          </button>

          <button className="nav-login" onClick={() => navigate('/login')}>
            LOGIN
            <span>→</span>
          </button>

        </div>

      </nav>


      {/* ========================================== */}
      {/* HERO */}
      {/* ========================================== */}

      <section className="hero">

        <div className="hero-grid" />

        <div
          className="hero-content"
          style={{
            transform:
              `scale(${heroScale})`,
            opacity:
              heroOpacity,
          }}
        >

          <div className="hero-label">

            <span>
              // CAREER OS
            </span>

            <span>
              STUDENT CAREER SYSTEM
            </span>

          </div>

          <h1>

            YOUR CAREER

            <br />

            <span>
              SHOULDN'T
            </span>

            <br />

            BE A GUESS.

          </h1>

          <p className="hero-description">

            One intelligent platform to
            learn, practice, prepare and
            move closer to your first
            opportunity.

          </p>

          <button className="primary-button" onClick={() => navigate('/login')}>

            ENTER CAREEROS

            <span>
              ↗
            </span>

          </button>

          <div className="hero-meta">

            <div className="meta-line">
              <span />
              10K+ STUDENTS
            </div>

            <div className="meta-line">
              <span />
              BUILD 2026
            </div>

          </div>

        </div>


        {/* ====================================== */}
        {/* HAND */}
        {/* ====================================== */}

        <div
          ref={handRef}
          className={`hand-wrapper ${
            mouseNearHand
              ? "hand-active"
              : ""
          }`}
          style={{
            transform:
              `
              translate3d(
                ${handTranslate}px,
                0,
                0
              )
              rotate(${handRotate}deg)
              `,
          }}
        >

          <img
            src="/assets/careeros-hand.jpg"
            alt=""
            className="hand-image"
          />

          <canvas
            ref={canvasRef}
            className="ascii-canvas"
          />

          <div className="hand-light" />

        </div>


        {/* COORDINATES */}

        <div className="coordinates">

          13°04' N
          <br />
          80°17' E

        </div>


        {/* SCROLL */}

        <div className="scroll-hint">

          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="scroll-arrow">
            ↓
          </div>

        </div>

      </section>


      {/* ========================================== */}
      {/* TRANSITION */}
      {/* ========================================== */}

      <section className="transition-section">

        <div className="transition-noise">

          {Array.from({
            length: 45,
          }).map(
            (_, index) => (
              <span
                key={index}
                style={{
                  left:
                    `${Math.random() * 100}%`,
                  top:
                    `${Math.random() * 100}%`,
                  animationDelay:
                    `${Math.random() * 3}s`,
                }}
              >
                {index % 2
                  ? "+"
                  : "."}
              </span>
            )
          )}

        </div>

        <div className="transition-content">

          <div className="terminal-label">
            / CAREEROS_INIT
          </div>

          <div className="loading-bar">

            <div />

          </div>

          <h2>

            FROM

            <br />

            CONFUSION

            <br />

            TO

            <br />

            <span>
              DIRECTION.
            </span>

          </h2>

          <div className="transition-list">

            <div>
              &gt; BUILDING CLARITY.
            </div>

            <div>
              &gt; BUILDING SKILLS.
            </div>

            <div>
              &gt; BUILDING YOU.
            </div>

          </div>

        </div>

      </section>


      {/* ========================================== */}
      {/* PATH SECTION */}
      {/* ========================================== */}

      <section className="path-section">

        <div className="path-background" />

        <div className="path-top">

          <span>
            &gt; SYSTEM READY
          </span>

          <span>
            04 MODULES AVAILABLE
          </span>

        </div>

        <div className="path-heading">

          <div className="terminal-label">
            / CAREEROS_MODULES
          </div>

          <h2>
            CHOOSE
            <br />
            YOUR PATH.
          </h2>

        </div>

        <div className="path-grid">

          {PATHS.map(
            (path) => (

              <article
                className="path-card"
                key={path.number}
              >

                <div className="card-number">
                  {path.number}
                </div>

                <div className="card-symbol">
                  {path.symbol}
                </div>

                <h3>
                  {path.title}
                </h3>

                <p>
                  {path.description}
                </p>

                <div className="card-arrow">
                  →
                </div>

              </article>

            )
          )}

        </div>

      </section>


      {/* ========================================== */}
      {/* FINAL CTA */}
      {/* ========================================== */}

      <section className="final-section">

        <div className="final-grid" />

        <div className="final-left">

          <div className="terminal-label">
            // CAREEROS_OS
          </div>

          <div className="version">
            VERSION 1.0.0
          </div>

          <div className="system-ready">
            &gt; ALL SYSTEMS OPERATIONAL
          </div>

        </div>

        <div className="final-center">

          <div className="terminal-label">
            / INITIALIZE
          </div>

          <h2>

            READY TO

            <br />

            START YOUR

            <br />

            <span>
              JOURNEY?
            </span>

          </h2>

          <button className="system-button" onClick={() => navigate('/login')}>

            ENTER THE SYSTEM

            <span>
              →
            </span>

          </button>

        </div>

        <div className="final-box">

          <div>
            &gt; ONE LOGIN.
          </div>

          <div>
            &gt; ENDLESS POSSIBILITIES.
          </div>

          <div>
            &gt; YOUR FUTURE.
          </div>

        </div>

        <footer>

          <span>
            © 2026 CAREEROS
          </span>

          <span>
            CAREEROS_OS /
            BUILDING FUTURES
          </span>

          <span>
            VIT CHENNAI
          </span>

        </footer>

      </section>

    </main>
  );
};
