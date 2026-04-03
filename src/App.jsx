import { useState, useEffect } from "react";

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
const C = {
  parchment:    "#F5F0E8",   // primary background (warmer than prototype)
  parchmentAlt: "#EDE8DC",   // alternate section background
  warmBlack:    "#1A1814",   // hero + loop background
  ink:          "#1C1C1A",   // primary text
  sienna:       "#B5541B",   // accent
  sage:         "#5C6B5A",   // secondary / labels
  rule:         "#D9D0C0",   // dividers
  surface:      "#EDE8DC",   // card surface
  warmBrown:    "#3D2B1A",   // pull quote text
  compOpen:     "#EAE4D8",   // open comp card content bg
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background-color: ${C.parchment};
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      rgba(180,165,140,0.12) 27px,
      rgba(180,165,140,0.12) 28px
    );
    color: ${C.ink};
    font-family: 'Lora', serif;
  }

  /* Paper grain overlay */
  .grain {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat; background-size: 200px 200px;
  }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .revealed { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.parchment}; }
  ::-webkit-scrollbar-thumb { background: ${C.rule}; border-radius: 2px; }

  /* Links */
  a { color: ${C.sienna}; text-decoration: underline; text-underline-offset: 3px; }
  a:hover { opacity: 0.75; }

  /* Nav link hover — underline slides in from left */
  .nav-link {
    position: relative;
    text-decoration: none !important;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${C.sienna};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }
  .nav-link:hover { color: ${C.sienna} !important; opacity: 1 !important; }
  .nav-link:hover::after { transform: scaleX(1); }

  /* Feedback button arrow nudge */
  .feedback-arrow { display: inline-block; transition: transform 0.2s ease; }
  .feedback-btn:hover .feedback-arrow { transform: translateX(4px); }

  /* Responsive */
  @media (max-width: 700px) {
    .desktop-nav { display: none !important; }
    .mobile-menu-btn { display: block !important; }
    .comp-open-content { padding: 0 16px 16px !important; }
  }
  @media (min-width: 820px) {
    .two-col { grid-template-columns: 3fr 2fr !important; }
  }
`;

// ─── SCROLL REVEAL HOOK ──────────────────────────────────────────────────────
// Content is always rendered (blur-overlay approach) so .reveal elements are
// always in the DOM on mount. Simple [] deps — no unlocked workaround needed.
function useScrollReveal() {
  useEffect(() => {
    const apply = () => {
      const els = document.querySelectorAll(".reveal");
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
        { threshold: 0.04, rootMargin: "0px 0px -20px 0px" }
      );
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          el.classList.add("revealed");
        } else {
          obs.observe(el);
        }
      });
      return obs;
    };

    if (window.__epObs) { window.__epObs.disconnect(); window.__epObs = null; }
    window.__epObs = apply();

    return () => {
      if (window.__epObs) { window.__epObs.disconnect(); window.__epObs = null; }
    };
  }, []);
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ active }) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "story",  label: "The Story"  },
    { id: "place",  label: "The Place"  },
    { id: "market", label: "The Market" },
    { id: "comps",  label: "The Comps"  },
    { id: "vision", label: "The Vision" },
    { id: "team",   label: "The Team"   },
    { id: "library", label: "The Library" },
    { id: "loop",    label: "The Field"  },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: C.parchment, borderBottom: `1px solid ${C.rule}`,
      opacity: visible ? 1 : 0, pointerEvents: visible ? "all" : "none",
      transition: "opacity 0.4s ease",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 52,
      }}>
        {/* Masthead — left side */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: C.ink }}>
            Estes Park
          </span>
          <span style={{ width: 1, height: 18, background: C.rule, margin: "0 14px", display: "inline-block", flexShrink: 0 }} />
          <span style={{
            fontSize: 10, letterSpacing: "0.1em", color: "rgba(28,28,26,0.38)",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400, whiteSpace: "nowrap",
          }}>
            Grand Prairie, Texas · April 2026
          </span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: "flex", gap: 26, alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} className="nav-link" style={{
              fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              fontWeight: active === l.id ? 600 : 400,
              color: active === l.id ? C.sienna : C.ink,
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.2s",
            }}>{l.label}</a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}
          className="mobile-menu-btn">
          <div style={{ width: 22, height: 1.5, background: C.ink, marginBottom: 5 }} />
          <div style={{ width: 22, height: 1.5, background: C.ink, marginBottom: 5 }} />
          <div style={{ width: 22, height: 1.5, background: C.ink }} />
        </button>
      </div>

      {menuOpen && (
        <div style={{
          background: C.parchment, borderTop: `1px solid ${C.rule}`,
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setMenuOpen(false)} style={{
              fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase",
              color: C.ink, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh", background: C.warmBlack,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 24px", position: "relative", overflow: "hidden",
    }}>
      {/* Hero photo layer — Mountain Creek Lake feel */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/sand-valley-clubhouse.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center 45%",
        filter: "sepia(8%) contrast(96%) brightness(72%)",
        transform: `translateY(${scrollY * 0.35}px)`,
        willChange: "transform",
      }} />
      {/* Photographic vignette — drifts slightly slower than scroll */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.42) 100%)",
        pointerEvents: "none",
        transform: `translateY(${scrollY * 0.12}px)`,
      }} />
      {/* Warm sienna whisper — drifts at its own rate */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 55% 40%, rgba(181,84,27,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
        transform: `translateY(${scrollY * 0.08}px)`,
      }} />

      {/* Hero content — parallax: moves at 30% of scroll speed */}
      <div style={{
        maxWidth: 700, textAlign: "center", position: "relative", zIndex: 1,
        transform: `translateY(${scrollY * 0.28}px)`,
        willChange: "transform",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.26em",
          textTransform: "uppercase", color: C.sienna, marginBottom: 44, fontWeight: 600,
        }}>
          Estes Park &nbsp;·&nbsp; Grand Prairie, Texas &nbsp;·&nbsp; 1,200 Acres
        </p>

        {/* Field report headline — slightly smaller, more elegant */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 4.2vw, 54px)",
          fontWeight: 400, color: C.parchment, lineHeight: 1.22, marginBottom: 28,
          letterSpacing: "-0.01em", fontVariantLigatures: "common-ligatures",
        }}>
          This could be someone's very first impression of what golf is all about. It could be what makes them fall in love with it forever.
        </h1>

        {/* 60px sienna rule */}
        <div style={{ width: 60, height: 1, background: C.sienna, margin: "0 auto 28px" }} />

        <p style={{
          fontFamily: "'Lora', serif", fontStyle: "italic",
          fontSize: "clamp(14px, 1.8vw, 19px)",
          color: "rgba(245,240,232,0.58)", lineHeight: 1.8, marginBottom: 52,
        }}>
          Grand Prairie, Texas. 1,200 acres on Joe Pool Lake.<br />
          One window to make something permanent.
        </p>

        <a href="#story" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", color: C.sienna, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600,
        }}>
          Begin reading &nbsp;↓
        </a>
      </div>

      {/* Site coordinates — bottom-left, field survey stamp */}
      <p style={{
        position: "absolute", bottom: 32, left: 32,
        fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em",
        color: "rgba(245,240,232,0.28)", fontWeight: 400,
      }}>
        32°44′N &nbsp; 97°00′W
      </p>

      {/* Date stamp — bottom-right */}
      <p style={{
        position: "absolute", bottom: 32, right: 32,
        fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "rgba(245,240,232,0.28)",
      }}>
        Charrette Review &nbsp;·&nbsp; April 2026
      </p>
    </section>
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────
// Chapter-opening: 40px divider → 20px space → left-bordered label
function SectionLabel({ number, label, dark = false }) {
  return (
    <div className="reveal" style={{ marginBottom: 24 }}>
      <div style={{ width: 40, height: 1, background: C.rule, marginBottom: 20 }} />
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em",
        textTransform: "uppercase", fontWeight: 600,
        color: dark ? "rgba(245,240,232,0.45)" : C.sage,
        borderLeft: `2px solid ${C.sienna}`, paddingLeft: 12,
        display: "inline-block",
      }}>
        {number} &nbsp;—&nbsp; {label}
      </p>
    </div>
  );
}

// ─── RULE ────────────────────────────────────────────────────────────────────
function Rule({ dark = false }) {
  return <div style={{ height: 1, background: dark ? "rgba(245,240,232,0.08)" : C.rule, margin: "36px 0" }} />;
}

// ─── PULL QUOTE ──────────────────────────────────────────────────────────────
function PullQuote({ children, dark = false }) {
  return (
    <div className="reveal reveal-delay-2" style={{ marginTop: 44, marginBottom: 44, position: "relative" }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(72px, 11vw, 110px)",
        lineHeight: 0.75,
        color: dark ? "rgba(245,240,232,0.15)" : C.sienna,
        opacity: dark ? 1 : 0.22,
        display: "block",
        marginBottom: -8,
        userSelect: "none",
        letterSpacing: "-0.02em",
      }}>&ldquo;</span>
      <p style={{
        fontFamily: "'Playfair Display', serif", fontStyle: "italic",
        fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.55,
        color: dark ? "rgba(245,240,232,0.82)" : C.warmBrown,
        fontWeight: 400, fontVariantLigatures: "common-ligatures",
      }}>{children}</p>
    </div>
  );
}

// ─── IMAGE DIVIDER ────────────────────────────────────────────────────────────
// Full-bleed photo break between sections. Fixed bg = natural parallax on desktop.
function ImageDivider({ src, height = "40vh", position = "center" }) {
  return (
    <div style={{
      width: "100%",
      height,
      backgroundImage: `url(${src})`,
      backgroundSize: "cover",
      backgroundPosition: position,
      backgroundAttachment: "fixed",
      filter: "sepia(6%) contrast(96%) brightness(98%)",
      position: "relative",
      zIndex: 1,
    }} />
  );
}

// ─── SECTION IMAGE ────────────────────────────────────────────────────────────
// Inline photo for use in right column of TwoCol layouts.
function SectionImage({ src, position = "center", mb = 24 }) {
  return (
    <div className="reveal reveal-delay-1" style={{
      width: "100%",
      aspectRatio: "4 / 3",
      backgroundImage: `url(${src})`,
      backgroundSize: "cover",
      backgroundPosition: position,
      filter: "sepia(6%) contrast(96%) brightness(98%)",
      marginBottom: mb,
    }} />
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
// Field note style: large sienna number, 40px pencil underline, no border/bg
function StatCard({ stat, label, sub, dark = false }) {
  return (
    <div className="reveal reveal-delay-3" style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(32px, 4vw, 48px)",
        fontWeight: 700, color: C.sienna, lineHeight: 1,
        fontVariantLigatures: "common-ligatures",
      }}>{stat}</p>
      <div style={{ width: 40, height: 1, background: C.sienna, marginTop: 10, marginBottom: 10, opacity: 0.55 }} />
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em",
        textTransform: "uppercase", color: dark ? "rgba(245,240,232,0.7)" : C.ink, fontWeight: 500,
      }}>{label}</p>
      {sub && (
        <p style={{
          fontFamily: "'Lora', serif", fontSize: 13,
          color: dark ? "rgba(245,240,232,0.45)" : "rgba(28,28,26,0.52)",
          marginTop: 5, fontStyle: "italic", lineHeight: 1.6,
        }}>{sub}</p>
      )}
    </div>
  );
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function SectionWrapper({ id, children, alt = false, dark = false }) {
  const bg = dark ? C.warmBlack : (alt ? C.parchmentAlt : C.parchment);
  return (
    <section id={id} style={{
      position: "relative", zIndex: 1,
      padding: "88px 24px",
      background: bg,
      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : C.rule}`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

// ─── TWO COLUMN ──────────────────────────────────────────────────────────────
function TwoCol({ left, right }) {
  return (
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 52 }}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

// ─── BODY COPY ───────────────────────────────────────────────────────────────
function Body({ children, dark = false }) {
  return (
    <p className="reveal" style={{
      fontFamily: "'Lora', serif", fontSize: "clamp(15px, 1.6vw, 17px)",
      lineHeight: 1.92, color: dark ? "rgba(245,240,232,0.78)" : C.ink, marginBottom: 22,
    }}>{children}</p>
  );
}

// ─── SUBHEAD ─────────────────────────────────────────────────────────────────
function SubHead({ children, dark = false }) {
  return (
    <h3 className="reveal" style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em",
      textTransform: "uppercase", fontWeight: 500,
      color: dark ? "rgba(245,240,232,0.45)" : C.sage,
      marginTop: 36, marginBottom: 14,
    }}>{children}</h3>
  );
}

// ─── GO DEEPER ───────────────────────────────────────────────────────────────
function GoDeeper({ links }) {
  return (
    <p className="reveal" style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 20,
      color: "rgba(28,28,26,0.5)",
    }}>
      <span style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Go Deeper →&nbsp;</span>
      {links.map((l, i) => (
        <span key={i}>
          <a href={l.url} target="_blank" rel="noopener noreferrer"
            style={{ color: C.sienna, fontSize: 12 }}>{l.label}</a>
          {i < links.length - 1 ? " · " : ""}
        </span>
      ))}
    </p>
  );
}

// ─── FEEDBACK PROMPT ─────────────────────────────────────────────────────────
function FeedbackPrompt({ question, onRespond }) {
  return (
    <div className="reveal" style={{
      marginTop: 56, padding: "28px 32px",
      background: C.parchmentAlt, borderTop: `2px solid ${C.sienna}`,
    }}>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.18em",
        textTransform: "uppercase", color: C.sage, marginBottom: 10, fontWeight: 600,
      }}>Your thinking</p>
      <p style={{
        fontFamily: "'Lora', serif", fontStyle: "italic",
        fontSize: "clamp(14px, 1.7vw, 17px)", lineHeight: 1.8,
        color: C.ink, marginBottom: 22,
      }}>{question}</p>
      <button onClick={onRespond} className="feedback-btn" style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.14em",
        textTransform: "uppercase", fontWeight: 600, color: C.sienna,
        background: "none", border: `1px solid ${C.sienna}`, padding: "10px 20px",
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 2,
        transition: "background 0.2s, color 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = C.sienna; e.currentTarget.style.color = C.parchment; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.sienna; }}
      >
        Share your thinking<span className="feedback-arrow">&nbsp;→</span>
      </button>
    </div>
  );
}

// ─── SECTION HEADLINE ────────────────────────────────────────────────────────
function SectionH2({ children, dark = false, maxWidth = 760 }) {
  return (
    <h2 className="reveal" style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(28px, 4.5vw, 54px)",
      fontWeight: 400, lineHeight: 1.18, marginBottom: 8, maxWidth,
      color: dark ? C.parchment : C.ink,
      fontVariantLigatures: "common-ligatures",
    }}>{children}</h2>
  );
}

function SectionSub({ children, dark = false }) {
  return (
    <p className="reveal reveal-delay-1" style={{
      fontFamily: "'Lora', serif", fontStyle: "italic",
      fontSize: "clamp(15px, 1.9vw, 20px)",
      color: dark ? "rgba(245,240,232,0.48)" : "rgba(28,28,26,0.58)",
      marginBottom: 40, lineHeight: 1.55,
    }}>{children}</p>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — THE STORY
// ═══════════════════════════════════════════════════════════════════════════════
function StorySection({ onRespond }) {
  return (
    <SectionWrapper id="story">
      <SectionLabel number="01" label="The Story" />
      <SectionH2 maxWidth={720}>This is not a golf course.</SectionH2>
      <SectionSub>A chance to leave something indelible.</SectionSub>
      <Rule />
      <TwoCol
        left={<>
          <Body>Some projects justify themselves on paper before anyone sets foot on the land. This one is different. Stand on the site and something shifts. The story the ground is already telling runs deeper than anything a consultant could sketch on a whiteboard, and it was there long before this team arrived.</Body>
          <Body>Twelve hundred acres in Grand Prairie, Texas. Twenty minutes from one of the world's great airports. At the center of the fastest-growing major metropolitan area in the United States. On land that has been a seabed, a prairie, a Comanche hunting ground, a Mustang factory, a Navy airfield. On a peninsula crowned with elevation change that produces, if graded correctly, a 270-degree view of Mountain Creek Lake that almost no one in Dallas knows exists.</Body>
          <Body>The financial case is overwhelming. The generational case is more important. Bandon Dunes transformed a dying Oregon fishing town into one of golf's holy sites in twenty-five years. Pinehurst has compounded mythology for one hundred and thirty. What those places built, the architecture, the land ethic, the walking culture, the accumulated stories of players and caddies and moments, outlasts every pro forma ever written about them.</Body>
          <Body>This conversation is about what this project can become, not just what it can earn.</Body>
          <Body>Ask anyone who has played the great destinations what they actually remember. The answer comes back the same way every time, and it has almost nothing to do with architecture. Speed of the greens. Quality of the service. The moment they arrived and felt, immediately, that someone already knew they were coming. The building is the frame. What lasts is everything that happens inside it.</Body>
          <Body>That is the design mandate for this project. A walking round at dusk, no cart path in sight, the city invisible behind the treeline, the kind of round someone tells stories about for the rest of their time in the game. That is what gets built here.</Body>
          <Body>The design brief that came back from the first site walk set the tone for everything that followed. Keep the rooflines low, one to two stories at most, so there are no urban markers to orient by. No sense of scale that reminds you where you are. An architecture of purposeful disorientation, the kind that makes you feel, for the first time in a long time, like you've genuinely escaped.</Body>
          <Body>This is the brief. What follows is the evidence that the site, the market, the team, and the moment all point in the same direction.</Body>
          <GoDeeper links={[
            { label: "Bandon Dunes", url: "https://www.bandondunesgolf.com" },
            { label: "Pinehurst Resort", url: "https://www.pinehurst.com" },
          ]} />
        </>}
        right={<>
          <div className="reveal reveal-delay-1" style={{
            width: "100%",
            aspectRatio: "3 / 4",
            backgroundImage: "url(/father-daughter-golf.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            filter: "sepia(6%) contrast(96%) brightness(98%)",
            marginBottom: 24,
          }} />
          <PullQuote>"You ask anyone what their best golf experience was. The image they see never has anything to do with design. It always has to do with how fast the greens were, what the service was, and how they were greeted."</PullQuote>
          <StatCard stat="1,200" label="Acres" sub="Nearly double PGA Frisco's footprint" />
          <StatCard stat="20 min" label="From DFW International Airport" sub="The closest world-class golf destination to any major U.S. metro" />
          <PullQuote>"You arrive curious. You leave converted."</PullQuote>
        </>}
      />
      <FeedbackPrompt
        question="You've seen what makes an Escalante property work at the operational level. What does this project have to get right in the first 90 days of operation to earn the reputation this team is building toward?"
        onRespond={onRespond}
      />
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — THE PLACE
// ═══════════════════════════════════════════════════════════════════════════════
function PlaceSection({ onRespond }) {
  return (
    <SectionWrapper id="place" alt>
      <SectionLabel number="02" label="The Place" />
      <SectionH2>The Land Remembers</SectionH2>
      <SectionSub>1,200 acres. 100 million years. One story no one has told.</SectionSub>
      <Rule />
      <TwoCol
        left={<>
          <SubHead>One Hundred Million Years Under Water</SubHead>
          <Body>The ground beneath this site was seafloor. During the Late Cretaceous period, roughly 100 to 66 million years ago, the entire Grand Prairie corridor lay submerged beneath the Western Interior Seaway, a warm subtropical inland ocean that split North America in half, connecting the Arctic to the Gulf of Mexico. Teeming with mosasaurs, plesiosaurs, and vast colonies of microscopic algae called coccolithophores, the same organisms that built the White Cliffs of Dover. Those creatures died by the trillions, their calcium carbonate shells drifting to the seafloor and compressing over millennia into the hard white limestone formation now called the Austin Chalk.</Body>
          <Body>This matters for the resort because the Austin Chalk is the reason the land has topography at all. The formation dips eastward at 15–40 feet per mile, and where its hard western edge meets the softer Eagle Ford Shale beneath it, differential erosion has carved a prominent bluff called the White Rock Escarpment, traceable for 350 miles from south of San Antonio through Dallas to Sherman. In the Mountain Creek Lake area, this escarpment produces approximately 100 feet of relief. The "mountain" in Mountain Creek almost certainly references this feature. It is the only reason elevation change exists in an otherwise flat landscape, and it is the single most important geological asset on the property.</Body>
          <GoDeeper links={[
            { label: "TxGIO LiDAR DataHub", url: "https://data.tnris.org" },
            { label: "USGS 3DEP LidarExplorer", url: "https://apps.nationalmap.gov/lidar-explorer/" },
          ]} />

          <SubHead>Fifteen Thousand Years of Human Presence</SubHead>
          <Body>Human habitation of this prairie corridor extends to pre-Clovis times, over 15,000 years ago. The archaeological record along the Trinity River is substantial: excavations near the Texas Horse Park in Dallas County unearthed nearly 3,000 prehistoric artifacts dating from 500 to 5,000 years old. The Caddo called the Trinity River "Arkikosa." La Salle, encountering it in 1687, named it the "River of Canoes," noting heavy Indigenous watercraft use. The Wichita, Tonkawa, Comanche, and Kiowa all moved through this corridor. By 1841, the Village Creek settlements housed an estimated 10,000 inhabitants across 225 lodges.</Body>
          <Body>The Bird's Fort Treaty of 1843, signed roughly 20 miles from the present site, opened the prairie to Anglo settlement. The name "Grand Prairie" was already on maps decades before any town existed. It described the vast, treeless grassland that stunned arrivals from the wooded East.</Body>
          <GoDeeper links={[
            { label: "Texas State Historical Association", url: "https://www.tshaonline.org/handbook/entries/grand-prairie-tx" },
            { label: "Portal to Texas History", url: "https://texashistory.unt.edu" },
          ]} />

          <SubHead>From Broken Wagon to Mustang Factory</SubHead>
          <Body>The city of Grand Prairie was founded in 1863 when Alexander McRae Dechman, hauling Confederate army supplies, broke his wagon on this stretch of prairie and traded his broken wagon and ox team for a 239-acre tract originally granted to the Caruth brothers in 1850.</Body>
          <Body>The defining chapter came on September 28, 1940, when North American Aviation broke ground on a plant west of Hensley Field. The first fully air-conditioned, artificially lit aircraft production facility in the United States: 272 acres, 2.9 million square feet, 85 buildings. At peak production in April 1944, 38,500 employees working three shifts produced 728 aircraft in a single 30-day period. A U.S. production record. Never surpassed. Grand Prairie's population exploded from 1,595 in 1940 to 18,000 by 1945.</Body>
          <Body>Mountain Creek Lake was created by Dallas Power and Light in 1936 and 1937 as a cooling reservoir for a steam-electric generating plant. The dam is a rolled-earth structure 8,200 feet long and 36 feet high. At full pool it covers 2,710 acres with an average depth of just 8.5 feet. Shallow and warm, shaped by everything from naval aviation to environmental remediation.</Body>
          <GoDeeper links={[
            { label: "Texas State Historical Association — Grand Prairie", url: "https://www.tshaonline.org/handbook/entries/grand-prairie-tx" },
            { label: "Portal to Texas History", url: "https://texashistory.unt.edu" },
          ]} />

          <SubHead>What the Site Walk Established</SubHead>
          <Body>The first principle that came back from the master planning team is deceptively simple: intimate, gentle use of land. This site has room for everything. A project that tried to use all of it would ruin all of it. The more amenities packed in, the more buildings, the more things this place tries to be to different people, the faster it loses the quality that makes it worth building in the first place.</Body>
          <Body>The direction is toward space. Significant space between holes. Low buildings that sit in the landscape rather than compete with it. Siting that creates genuine disorientation, the feeling of being somewhere remote even though eight million people are thirty minutes away. The goal is to arrive here and lose your bearings in the best possible way, no obvious landmarks, no grand entrance, no scale that reminds you of the city you just left. A compass to orient yourself when you want one. The invitation to simply get lost when you don't.</Body>
          <Body>The clubhouse at the end of the round is the punctuation mark, modest in scale, built to grow over time. The golf is the headline. The land is the story. The buildings serve both without trying to upstage either.</Body>
          <GoDeeper links={[
            { label: "Destination Design", url: "https://destinationdesignllc.com" },
          ]} />

          <SubHead>The Name Question</SubHead>
          <Body>The working name "Estes Park" is borrowed from one of the most famous mountain destinations in America: a Colorado gateway town at 7,522 feet elevation, surrounded by 14,000-foot peaks, home to Rocky Mountain National Park and the hotel that inspired The Shining. Applying this name to a lakeside golf resort on Texas prairie creates immediate brand confusion.</Body>
          <Body>The great golf destinations named themselves from the land. Bandon Dunes describes sand dunes near the Oregon coast. Sand Valley names the prehistoric glacial dunes in central Wisconsin. The Fall Line references the geological escarpment between Georgia's Piedmont and Coastal Plain. The strongest names grow from something verifiably real about the site. This land offers: the White Rock Escarpment, Mountain Creek, the Austin Chalk, and the Cross Timbers. The name this project earns should be as honest and irreplaceable as the land itself.</Body>
        </>}
        right={<>
          <div className="reveal reveal-delay-1" style={{
            width: "100%", marginBottom: 24,
          }}>
            <img src="/estes-park-program.png" alt="Estes Park Site Analysis — Opportunity Diagram"
              style={{ width: "100%", display: "block", border: `1px solid ${C.rule}` }} />
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: C.sage, marginTop: 8, fontWeight: 500,
            }}>Site Analysis — Opportunity Diagram</p>
          </div>
          {/* Charrette site photos */}
          <div className="reveal reveal-delay-2" style={{ width: "100%", marginBottom: 24 }}>
            <img src="/charrette/site-photos.jpg" alt="Existing Site — Photos and Aerials"
              style={{ width: "100%", display: "block", border: `1px solid ${C.rule}` }} />
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: C.sage, marginTop: 8, fontWeight: 500,
            }}>Existing Site — Photos and Aerials</p>
          </div>
          <div className="reveal reveal-delay-3" style={{ width: "100%", marginBottom: 24 }}>
            <img src="/charrette/site-analysis.jpg" alt="Site Analysis — Opportunity Diagram (Charrette)"
              style={{ width: "100%", display: "block", border: `1px solid ${C.rule}` }} />
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: C.sage, marginTop: 8, fontWeight: 500,
            }}>Site Analysis — Charrette Opportunity Diagram</p>
          </div>
          <PullQuote>"The escarpment produces approximately 100 feet of relief. It is the only reason elevation change exists in an otherwise flat landscape. It is the single most important geological asset on the property."</PullQuote>
          <div className="reveal reveal-delay-2" style={{
            background: C.parchment, border: `1px solid ${C.rule}`,
            padding: "20px 24px", marginBottom: 8,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.16em",
              textTransform: "uppercase", color: C.sage, marginBottom: 14, fontWeight: 500,
            }}>Naming Anchors</p>
            {["White Rock Escarpment", "Austin Chalk", "Cross Timbers", "Cove Bridges", "Cuesta (Spanish for the ridgeline)"].map((name, i) => (
              <p key={i} style={{
                fontFamily: "'Lora', serif", fontSize: 14, lineHeight: 1.75, color: C.ink,
                paddingLeft: 12, borderLeft: `2px solid ${C.rule}`, marginBottom: 10,
              }}>{name}</p>
            ))}
          </div>
          <StatCard stat="100M" label="Years of geology" sub="Cretaceous seabed → Austin Chalk escarpment" />
          <StatCard stat="15,000" label="Years of human presence" sub="Pre-Clovis through present" />
          <StatCard stat="728" label="Aircraft built in 30 days" sub="April 1944. U.S. production record. Never surpassed." />
        </>}
      />
      <FeedbackPrompt
        question="Walk-in, first impression. If this site delivers on the spatial promise, low buildings, open sky, no city visible, what's the single word or phrase you'd use to describe it to someone back at the office?"
        onRespond={onRespond}
      />
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — THE MARKET
// ═══════════════════════════════════════════════════════════════════════════════
function MarketSection({ onRespond }) {
  const tableData = [
    ["15 minutes", "~1.5–2.0M", "Arlington, Irving, Duncanville, DFW Airport corridor"],
    ["30 minutes", "~4.5–5.5M", "Downtown Dallas, Fort Worth, Plano, Frisco, Southlake"],
    ["45 minutes", "~7.0–8.0M", "Essentially the entire DFW Metroplex"],
  ];
  return (
    <SectionWrapper id="market">
      <SectionLabel number="03" label="The Market" />
      <SectionH2>8.3 Million Reasons. And That's Just the Start.</SectionH2>
      <SectionSub>The population case for why this site, at this moment, is historically significant.</SectionSub>
      <Rule />
      <TwoCol
        left={<>
          <SubHead>The Scale of the Opportunity</SubHead>
          <Body>Grand Prairie sits at the geographic center of the largest population boom in modern American history. The DFW Metroplex added approximately 178,000 new residents in a single year. That is 487 people every single day. At 8.34 million people, DFW's population now exceeds that of 38 U.S. states. If it were a state, it would rank 13th nationally, sitting just behind Virginia and just ahead of Washington.</Body>
          <Body>This growth is structural, not cyclical. DFW grew through three national recessions, the dot-com bust, the 2008 financial crisis, and the pandemic. Fueled by corporate relocation, no state income tax, and a diversified economy across tech, healthcare, finance, and logistics, the metro is on track to surpass Chicago as the nation's third-largest within the decade.</Body>
          <p className="reveal" style={{ fontFamily: "'Lora', serif", fontSize: "clamp(15px, 1.6vw, 17px)", lineHeight: 1.92, color: C.ink, marginBottom: 28, fontWeight: 500, fontStyle: "italic" }}>The demand curves don't flatten here. They compound.</p>

          <div className="reveal" style={{ margin: "8px 0 28px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.sienna}` }}>
                  {["Drive Ring", "Population", "Communities"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.sage, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.rule}`, background: i % 2 === 0 ? C.parchmentAlt : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "11px 14px", color: C.ink, fontWeight: j === 0 ? 600 : 400, fontSize: j === 2 ? 12 : 13 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SubHead>The Texas Triangle Mega-Region</SubHead>
          <Body>DFW anchors the northern vertex of the Texas Triangle, a megaregion encompassing Dallas, Houston, San Antonio, and Austin that collectively houses roughly 70% of Texas's 30 million residents and generates over 75% of the state's GDP. The Triangle is projected to grow to roughly 40 million people by 2040. More than 50 Fortune 500 companies are now headquartered within it. The Austin–San Antonio corridor (another ~5.2M people) is a 3–4 hour drive. Houston (7.7M) is within a day's drive. The addressable market isn't 8.3M. It's closer to 21M.</Body>
          <GoDeeper links={[
            { label: "NCTCOG Population Projections", url: "https://www.nctcog.org" },
            { label: "Texas Demographic Center", url: "https://demographics.texas.gov" },
          ]} />

          <SubHead>The Wealth Corridor at the Door</SubHead>
          <Body>Within 30–45 minutes of this site sits one of the most concentrated suburban wealth corridors in the nation: Southlake (median household income ~$250,000; average home value $1.29M), University Park (average household income ~$389,868; average home value $2.45M), Colleyville (~$203,566), Flower Mound (~$157,737). Six DFW suburbs rank among the fastest-growing wealthy communities in the entire country. This is the consumer who buys golf memberships, books luxury tee times, and spends on resort weekends. They are all within 30 minutes.</Body>

          <SubHead>Golf's Unprecedented Moment</SubHead>
          <Body>48.1 million Americans played golf in 2025. A record high. 21 million non-golfers said they were very interested in playing on a course. That is the deepest prospect pipeline in golf history. Texas ranks #2 nationally in total golf participation with 1.89 million on-course golfers. 241,000 new Texas golfers entered the market in 2023 alone, growing at 4.5% versus 3.1% nationally. DFW has 12 Topgolf locations: 12 incubators feeding future golfers into the market.</Body>
          <GoDeeper links={[
            { label: "National Golf Foundation", url: "https://www.ngf.org" },
            { label: "Golf Industry Report 2025", url: "https://www.ngf.org/golf-industry-research/" },
          ]} />

          <SubHead>PGA Frisco Already Proved It</SubHead>
          <Body>Whether DFW can support a world-class golf resort is no longer the question. PGA Frisco answered it with a $520M public-private partnership on 660 acres: PGA of America headquarters, a 500-room Omni, two championship courses, projected $2.5 billion in economic impact over 20 years. The Omni is a convention hotel in golf clothing. Nowhere in DFW, nowhere in Texas, does a boutique, walking-only, architecturally honest destination exist where the golf is the entire point. That gap is this project's opening.</Body>
          <Body style={{ fontStyle: "italic", opacity: 0.75 }}>Compare: Estes Park | 1,200 acres | 15–30 min from DFW core | 8.3M people in drive market. Bandon Dunes | 5 courses | 4.5 hours from Portland | 2.5M people in drive market. The math isn't close.</Body>
        </>}
        right={<>
          <SectionImage src="/live-oak-tunnel.jpg" position="center 50%" />
          <StatCard stat="487" label="New residents per day" sub="DFW metro, July 2023–July 2024" />
          <StatCard stat="8.3M" label="People in the metro" sub="Larger than 38 U.S. states" />
          <StatCard stat="21M" label="Non-golfers ready to play" sub="Deepest prospect pipeline in golf history" />
          <StatCard stat="$520M" label="PGA Frisco investment" sub="Proof of concept. The boutique gap remains empty." />
          <PullQuote>"The demand curves don't flatten here. They compound."</PullQuote>
          <div className="reveal reveal-delay-3" style={{ background: C.warmBlack, padding: "24px 24px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.sienna, marginBottom: 12, fontWeight: 600 }}>The Core Golf Consumer</p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 500, color: C.parchment, lineHeight: 1.1, marginBottom: 10 }}>400,000–600,000</p>
            <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 13, color: "rgba(245,240,232,0.58)", lineHeight: 1.65 }}>Income-qualified, golf-interested households within 45 minutes. Conservatively.</p>
          </div>
        </>}
      />
      <FeedbackPrompt
        question="What would make you drive 20 minutes to play golf here instead of 20 minutes to play at your club? What would justify the premium?"
        onRespond={onRespond}
      />
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — THE COMPS
// ═══════════════════════════════════════════════════════════════════════════════
const COMPS = [
  {
    num: "01", name: "Bandon Dunes", sub: "Bandon, Oregon · Walking-Only · 6 Courses",
    img: "/comp-bandon.jpg",
    callout: "Built 4.5 hours from Portland. Needed 12,000 rounds to break even in Year 1. Got 24,000. This site sits at the center of a metro area of 8.3 million people — most within 30 minutes. The demand mathematics here are not comparable — they're 617 times more favorable.",
    teaches: [
      "Walking-only and caddie-first is not a constraint — it's a premium signal that immediately differentiates the product from every cart-path operation in the DFW market.",
      "Cottage pods command $1,100–$2,100/night and outperform central inns in both RevPAR and guest loyalty. On a free land lease, sprawl costs nothing — build the pods.",
      "The fire pit, the cigar culture, and the underground Bunker Bar are not amenities — they're the operational mechanism that extends dwell time, drives high-margin F&B, and builds the cult following.",
    ],
    numbers: "~$99M est. annual revenue · 300+ rooms dispersed as cottage pods · 800+ employees · 23,000 rounds Year 1 against a 12,000 break-even",
    docUrl: "/reports/bandon-dunes.docx",
  },
  {
    num: "02", name: "Cabot Citrus", sub: "Brooksville, Florida · 1,200 Acres · 57 Holes",
    img: "/comp-cabot.jpg",
    callout: "The social hub isn't the clubhouse — it's the food truck between the practice facility and the short course. Cabot Citrus solved the gathering problem first and let the architecture follow the people.",
    teaches: [
      "Pre-selling 2–4 bedroom cottages at $1.7M–$3M with a resort rental program funds construction before you've opened — and creates owners who are also your most loyal ambassadors.",
      "The walkable resort village positioned between the short course, the practice facility, and the casual food-and-beverage hub is where the social energy actually lives. Design the hub first.",
      "Florida vernacular — raised scissor trusses, large windows, serene indoor-outdoor living — is the language of unpretentious luxury that draws the modern golf traveler.",
    ],
    numbers: "57 holes · Cottage nightly rates from $1,250+ · Resort village anchors all foot traffic · Cabot Collection's first U.S. property",
    docUrl: "/reports/cabot-citrus.docx",
  },
  {
    num: "03", name: "PGA Frisco", sub: "Frisco, Texas · 500 Rooms · The Cautionary Tale",
    img: "/comp-frisco.jpg",
    callout: "Strong land plan. Terrible architecture. The ice cream shop, the pub, and the golf cottages are carbon copies of each other. PGA Frisco is in your backyard, and it proves that the boutique market — walking-only, architecturally distinctive, intimate — is completely empty.",
    teaches: [
      "The arrival at PGA Frisco feels like entering a corporate campus. That's not a compliment for a golf resort. The arrival at Estes Park must signal a complete departure from the world guests just left.",
      "127,000 sq ft of convention space and 13 restaurant concepts creates a one-and-done resort experience. Estes Park's intimacy is the differentiator — not something to apologize for.",
      "$315 green fees with mandatory caddies already prove DFW golfers will pay above $400 per round. The premium public market exists. The boutique product to serve it does not.",
    ],
    numbers: "$520M total investment · $315 peak green fees · 500+ rooms · DFW's only luxury golf resort — and an object lesson in how not to build one",
    docUrl: "/reports/pga-frisco.docx",
  },
  {
    num: "04", name: "Miakka Golf Club", sub: "Myakka City, Florida · 1,100 Acres · Ultra-Premium Private",
    img: "/comp-myakka.jpg",
    callout: "They moved enough earth to create 48 feet of elevation change where none existed. They imported thousands of trees. They built the landscape before they built the course. The lesson: the land is never the limit.",
    teaches: [
      "Massive earthwork, strategic tree planting, and a 40-acre lake transformed a blank Florida site into a dramatic, immersive arrival that creates emotional connection before the first tee shot.",
      "The 360-degree driving range, 12-hole par-3 course, and 2.5-acre putting green aren't amenities — they're revenue drivers that fill the hours between rounds and keep guests on property.",
      "Ten private member cabins in 4- and 8-bedroom layouts serve the high-net-worth group market better than any hotel room configuration can. Privacy drives price.",
    ],
    numbers: "1,100 acres · 48ft elevation change created from scratch · 10 private cabins · Co-designed with PGA Tour player Paul Azinger · Late 2025 opening",
    docUrl: "/reports/myakka.docx",
  },
  {
    num: "05", name: "Old Shores", sub: "Vernon, Florida · 1,400 Acres · Dream Golf 2.0",
    img: "/comp-old-shores.jpg",
    callout: "Michael Keiser Jr. looked at his father's model — remote, golf-only, buddy trips — and deliberately made it better. Old Shores is for families, non-golfers, and people who want to come back every year. Dream Golf 2.0 is the right model for Grand Prairie.",
    teaches: [
      "The walkable Scottish village hub — organic ribbon development, variable setbacks, massing variety — makes the resort feel centuries old on opening day and maximizes dwell time for non-golfers.",
      "Parents at the bar watching kids putt nearby is not an accident. It's a spatial design decision that extends dwell time by eliminating the friction that ends evenings early.",
      "The Dog Trot house — two cabins under one roof with an open-air breezeway — delivers frontier luxury at half the cost of dispersed freestanding cottages. And it's perfectly Texan.",
    ],
    numbers: "1,400 acres · Tom Doak initial course · 40ft natural elevation change · Preview play late 2026 · Grand opening fall 2027",
    docUrl: "/reports/old-shores.docx",
  },
  {
    num: "06", name: "Pebble Beach", sub: "Del Monte Forest, California · $675/Round · 492 Keys",
    img: "/comp-pebble.jpg",
    callout: "$675 per round, fully public, no membership required. The Tap Room has a server who's worked there 36 years. That server IS the institution in a way no design element can replicate. You can't buy 100 years of history — but you can design for the accumulation of it.",
    teaches: [
      "The arrival sequence — gate → forest → ocean reveal — is pure emotional architecture. Joe Pool Lake has the peninsula geography to execute an identical choreography: suppress the water, build anticipation through elevation, then deliver the lake reveal.",
      "Public golf at $675 proves that pricing permission comes from intensity of experience, not exclusivity of access. Streamsong proved it on a phosphate mine. The DFW waterfront is even more compelling.",
      "The DFW Metroplex has zero waterfront golf of any kind. 100+ public courses at $30–$120. One convention-hotel resort at $315. The gap between $120 and a premium lakeside destination is entirely unoccupied.",
    ],
    numbers: "$675/round · 78,000 rounds/year · 492 keys · Est. $400–600M annual revenue · 6 U.S. Opens · DFW equivalent: 3.32× the population at 1/13th the travel time",
    docUrl: "/reports/pebble-beach.docx",
  },
  {
    num: "07", name: "Pinehurst", sub: "Pinehurst, North Carolina · $1.25/Acre · 10 Courses",
    img: "/comp-pinehurst.jpg",
    callout: "James Tufts paid $1.25 an acre for deforested wasteland and hired Olmsted to build a city on it. You have the lease for $1 a year. The economic mechanism is identical — negligible land cost frees the capital to build something world-class.",
    teaches: [
      "The stadium finish at The Deuce — veranda overlooking the 18th green, the 'Deuce Coin' for birdies, bourbon-fueled heckling — transforms every round into public theater and traps social energy in the highest-margin space on the property.",
      "A walkable Olmsted village with concentric curved streets, street-level activation, and micro-golf adjacent to the clubhouse keeps non-golfers engaged and generating incidental spend all day.",
      "Mythological status is a verb: Pinehurst needed 6 years for national recognition and decades for majors. The compounding begins on opening day — aggressive event programming, not waiting for reputation to arrive.",
    ],
    numbers: "10 courses · USGA Anchor Site through 2047 · $60M Golf House Pinehurst · $2B+ N.C. economic impact · 'Home of American Golf'",
    docUrl: "/reports/pinehurst.docx",
  },
  {
    num: "08", name: "Rodeo Dunes", sub: "Eastern Colorado · 4,000 Acres · Dream Golf",
    img: "/comp-rodeo.webp",
    callout: "85-foot sand dunes. A showdeo arena for roping demonstrations. Coore & Crenshaw for the first course. Dream Golf built the Western vernacular precedent they've never had. This is what bold design vocabulary looks like when the land earns it.",
    teaches: [
      "Golf first, then activate lodging: Rodeo Dunes is opening with courses before full amenities, proving that great golf can sustain a resort while the hospitality layer phases in behind it.",
      "The owner-rental model — sell cabins and villas in advance, integrate them into the resort rental program — funds construction, creates a loyal owner community, and delivers residential-scale comfort from day one.",
      "Western vernacular — raw timber, corrugated metal, ranch structures — is the design language that makes a Texas lakeside resort feel honest to its landscape rather than imported from Scottsdale.",
    ],
    numbers: "4,000 acres · Dunes up to 85–100ft · Coore & Crenshaw + Jimmy Craig courses · Showdeo arena · Convenient to Denver International Airport",
    docUrl: "/reports/rodeo-dunes.docx",
  },
  {
    num: "09", name: "Streamsong", sub: "Bowling Green, Florida · 3 Top-30 Courses · Study in Contrast",
    img: "/comp-streamsong.webp",
    callout: "$375–$425 per round. No ocean, no championship history, no proximity to a major city. Streamsong proved that world-class architecture plus a dramatic natural setting equals premium pricing permission, regardless of coastline. The cautionary tale is just as valuable as the success.",
    teaches: [
      "Transforming industrial wasteland into dramatic dunes and lakeside terrain works: Streamsong went from phosphate mine to three Top-30 courses. Joe Pool Lake's terrain is already compelling — the design just needs to honor it.",
      "Multiple isolated clubhouses — one per course — create no central sense of arrival. The first human contact is at the bag drop. Estes Park must solve arrival as a primary design constraint, not an afterthought.",
      "Golf great, experience lacking. Architectural character generic, unresponsive to the place. That's the cautionary tale: great golf alone is not enough to build a lasting brand.",
    ],
    numbers: "3 courses: Doak + Coore/Crenshaw + Hanse · $375–425/round peak · 228 rooms · Sold 2023 for $160M · The Chain short course opened 2024",
    docUrl: "/reports/streamsong.docx",
  },
  {
    num: "10", name: "The Loop at The Patch", sub: "Augusta, Georgia · TGR Design · Opening April 2026",
    img: "/comp-loop.jpg",
    callout: "Tiger Woods designed a nine-hole par-3 course for $15 a round at the public course that has caddied the Masters for generations. The Loop opens April 15, 2026 — the day after the Masters. That is not a coincidence. That is a statement about who golf is for.",
    teaches: [
      "A short course at $15–30 makes golf accessible to families, juniors, and first-timers without diluting the main product — and produces the highest rounds-per-acre revenue on the property.",
      "Paired with a TGR Learning Lab and Augusta Technical College partnerships, The Loop builds a pipeline from casual player to career in the golf industry — worth studying for Grand Prairie's community strategy.",
      "Affordable pricing and community access are not in conflict with premium aspirations. Pinehurst has The Cradle at $30. Estes Park needs its own version to anchor the local market and grow the next generation of regulars.",
    ],
    numbers: "$15 local / $30 non-local · 9-hole par-3 TGR Design · Fully renovated 18-hole Tom Fazio + Beau Welling course · TGR Foundation Learning Lab planned 2028",
    docUrl: "/reports/loop-at-the-patch.docx",
  },
  {
    num: "11", name: "The Stadium Finish", sub: "TPC Sawgrass · Pinehurst No. 2 · Pebble Beach 18th",
    img: "/comp-stadium.jpg",
    callout: "In traditional golf, the round ends quietly: a final putt, a handshake, a walk to the parking lot. A stadium finish flips that script — and funnels the emotional peak of the round directly into the highest-margin space on the property.",
    teaches: [
      "Both courses at Estes Park finishing in a shared coliseum-style amphitheater generates the Golden Hour economy — the post-round window when F&B spend is highest, loyalty is cemented, and strangers become regulars.",
      "Spectatorship turns individual rounds into collective memory. 'Remember when everyone on the veranda cheered your birdie?' That story is the reason guests come back and bring their group.",
      "The stadium finish doesn't need to be loud or commercial — it can be elegant and natural, with subtle grading and comfortable sightlines that feel organic to the land. The mechanism is intimacy, not spectacle.",
    ],
    numbers: "Model precedents: TPC Sawgrass · Pinehurst No. 2 Deuce · Pebble Beach 18th · The Golden Hour captures the highest F&B margin of the day",
    docUrl: "/reports/stadium-finish.docx",
  },
  {
    num: "12", name: "Whistling Straights", sub: "Kohler, Wisconsin · 2021 Ryder Cup · The American Club",
    img: "/comp-whistling.jpg",
    callout: "Pete Dye moved 13,000 tons of rock to fake an Irish links on a flat Wisconsin lakeshore. The Ryder Cup generated $135M in economic impact. But the most important precedent isn't the course — it's The American Club, the central inn that is the social heart of the entire experience.",
    teaches: [
      "A distinctive, high-service central inn creates the brand even when located a short distance from the golf. Guests decompress at The American Club after their rounds — it's where the stories get told and the loyalty gets built.",
      "Walking-only on the Straits Course signals premium and preserves the links experience. The Irish Course plays with carts. The differentiation between formats is itself a product strategy.",
      "The Farmhouse restaurant's sightlines to the dramatic 18th hole prove that dining with a view of finishing golf is not a perk — it's the entire architecture of the post-round experience.",
    ],
    numbers: "2021 Ryder Cup: $135M economic impact · PGA Championships 2004, 2010, 2015 · The American Club: Forbes Five-Star lodging · Walking-only Straits Course",
    docUrl: "/reports/whistling-straights.docx",
  },
];

function CompCard({ comp }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="reveal" style={{
      borderLeft: `3px solid ${C.sienna}`,
      marginBottom: 4,
      background: C.parchment,
      overflow: "hidden",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.06)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          padding: "22px 28px", cursor: "pointer",
          display: "flex", alignItems: "flex-start", gap: 18,
        }}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em",
          color: C.sienna, fontWeight: 600, flexShrink: 0, marginTop: 5,
        }}>→ {comp.num}</span>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(17px, 2.2vw, 23px)",
            fontWeight: 500, fontStyle: "italic",
            color: C.ink, marginBottom: 4,
            fontVariantLigatures: "common-ligatures",
          }}>{comp.name}</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.1em", color: C.sage, textTransform: "uppercase" }}>{comp.sub}</p>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: C.sienna, flexShrink: 0, marginTop: 2 }}>{open ? "−" : "+"}</span>
      </button>

      {/* Folder-open content — max-height transition */}
      <div style={{
        maxHeight: open ? "2400px" : "0",
        overflow: "hidden",
        transition: "max-height 0.35s ease",
        background: C.compOpen,
      }}>
        {/* Case study image */}
        {comp.img && (
          <div style={{
            width: "100%", height: "220px", overflow: "hidden",
          }}>
            <img
              src={comp.img}
              alt={comp.name}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: "sepia(8%) contrast(95%) brightness(97%)",
                display: "block",
              }}
            />
          </div>
        )}
        <div className="comp-open-content" style={{ padding: "20px 28px 28px 66px" }}>
          <blockquote style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: "clamp(14px, 1.8vw, 18px)", lineHeight: 1.68,
            color: C.warmBrown, borderTop: `1px solid ${C.rule}`,
            paddingTop: 20, marginBottom: 20,
            fontVariantLigatures: "common-ligatures",
          }}>
            "{comp.callout}"
          </blockquote>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sage, marginBottom: 12, fontWeight: 500 }}>What It Teaches</p>
          <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 20 }}>
            {comp.teaches.map((t, i) => (
              <li key={i} style={{
                fontFamily: "'Lora', serif", fontSize: 14, lineHeight: 1.8,
                color: C.ink, paddingLeft: 14, borderLeft: `2px solid ${C.rule}`, marginBottom: 10,
              }}>{t}</li>
            ))}
          </ul>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(28,28,26,0.55)", marginBottom: 18, lineHeight: 1.6 }}>{comp.numbers}</p>
          {comp.docUrl && (
            <a
              href={comp.docUrl}
              download
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.sienna, textDecoration: "none", fontWeight: 600,
                borderBottom: `1px solid ${C.sienna}`, paddingBottom: 2,
              }}
            >
              <span style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Go Deeper →&nbsp;</span>
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "0.02em" }}>Download Full Report</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function CompsSection({ onRespond }) {
  return (
    <SectionWrapper id="comps" alt>
      <SectionLabel number="04" label="The Comps" />
      <SectionH2>{"It's Been Done Before..."}<br />{"Just Never In A Place Like This."}</SectionH2>
      <SectionSub>Twelve precedents — drawn directly from the charrette boards — that prove what's possible, and what each one teaches this project.</SectionSub>
      <Rule />
      <Body>The great golf destinations weren't acts of faith. They were acts of studied conviction — developers and architects who looked at what had worked elsewhere, understood exactly why it worked, and built something rooted in those principles but honest to their own land. Each of these twelve precedents was chosen because it speaks directly to a decision on the table for this site. Expand any card to read the intelligence. Download the full report to go deeper.</Body>
      <Body>What follows are the eight most relevant precedents for this project. Not for imitation. For ammunition.</Body>
      <div style={{ marginTop: 36 }}>
        {COMPS.map(c => <CompCard key={c.num} comp={c} />)}
      </div>
      <FeedbackPrompt
        question="Which of these precedents resonates most with what you want this project to become? What does this site have that none of them had?"
        onRespond={onRespond}
      />
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — THE VISION (Post-Charrette)
// ═══════════════════════════════════════════════════════════════════════════════
function VisionSection({ onRespond }) {
  const bigIdeas = [
    {
      num: "01",
      title: "Lost and Found",
      text: "You cross the bridge and the city disappears. Every building sits low. Every roofline stays below the tree canopy. There are no landmarks to orient yourself by and that is the point. Twenty minutes from downtown Dallas, you cannot tell where you are. The peninsula becomes its own world: quiet, open, surrounded by water on nearly every side. The feeling of being lost is not a failure of wayfinding. It is the product. It is what makes someone who lives fifteen minutes away feel like they traveled somewhere worth remembering.",
    },
    {
      num: "02",
      title: "Golf Rules",
      text: "This is a golf property. Not a resort that happens to have golf. Not an entertainment district with courses attached. Every dollar, every square foot, every design decision serves the game first. Two championship courses. A world-class practice facility. An academy. A short course. A par-three park. The crescendo moves from accessible to aspirational: beginners on The Patch, serious players on the range, everyone finishing in the stadium. Accommodations exist to support the golf, not the other way around. Food and beverage exist to fuel and celebrate the round, not to compete with it. When someone asks what this place is, the answer fits in two words: golf rules.",
    },
    {
      num: "03",
      title: "Member for a Day",
      text: "This is not a private club. It is not a corporate resort. It is something rarer: a public destination that feels like you belong here. The stadium finish puts strangers in the same conversation. The inn puts you in the clubhouse where the action is, not in an isolated room a shuttle ride away. The starter shacks have personality. The caretaker's cottage knows your name. Every touchpoint is designed so that a first-time visitor feels the same warmth and ownership that a founding member would. The experience is inclusive without being cheap, intimate without being exclusive. You came for the golf. You come back for the feeling.",
    },
  ];

  const zones = [
    {
      num: "01",
      title: "The Arrival",
      img: "/charrette/sketch-image-caretaker.jpg",
      caption: "The Caretaker's Cottage",
      text: "The first face-to-face moment matters more than anything we design. The caretaker's cottage is not a gate. It is a small, intimate building where guests are welcomed by name, oriented to the property, and sent on their way with the story already beginning. There is no barrier, no credential check, no formal security presence. There is a person in a comfortable room who knows you are coming and is glad you arrived. Beyond it, The Patch and a potential waterfront dining district establish the project's public face. This is the zone that says: we are about golf, and everyone is welcome.",
    },
    {
      num: "02",
      title: "The Village",
      img: "/charrette/sketch-image-village.jpg",
      caption: "The Village — Aerial View",
      text: "The village is where the property comes alive. Positioned on high ground above the floodplain, it clusters the functions that generate daily energy: a circular practice facility roughly 300 yards across, two short game areas, and a pair of starter shacks that double as halfway houses for returning nines. One serves burgers and beer. The other serves tacos and margaritas. The difference is intentional. Two distinct personalities, two reasons to come back tomorrow. Flanking the practice area are an academy with six teaching bays and simulators, a future wellness center, and an admin building with a rooftop gathering space we are calling The Perch. The entire village can begin with two buildings and grow as the market responds. Phase 1 builds only what is necessary.",
    },
    {
      num: "03",
      title: "The Heart of the Course",
      img: "/charrette/sketch-image-inn.jpg",
      caption: "The Clubhouse & Inn",
      text: "The clubhouse sits where the spine meets the water. Entering from above, guests look through the building and see 180 degrees of Joe Pool Lake. Below, two eighteenth greens converge in a natural amphitheater. This is the stadium finish: the moment the round becomes a shared event. The 19th hole, locker rooms, pro shop, merchandise, and cart staging all consolidate here. Everything a golfer needs before and after the round lives under one roof. Phase 1 programs approximately 22,000 square feet with eight sleeping rooms tucked into the lower level. Not hotel suites. Simple rooms: two beds, a mini-fridge, a place to hang clothes. The presence of overnight guests keeps the property alive after dark, tests accommodation demand, and signals to early visitors what this place will become.",
    },
  ];

  return (
    <SectionWrapper id="vision">
      <SectionLabel number="05" label="The Vision" />
      <SectionH2>The Land Told Us What to Build</SectionH2>
      <SectionSub>Three days of collaborative work. One direction.</SectionSub>
      <Rule />
      <Body>Every design decision at Estes Park flows from a single conviction that emerged across three days of collaborative work: the land comes first. We are not imposing a resort on 1,200 acres. We are revealing what the peninsula already wants to be — a place where water, light, and open space do the work that buildings cannot.</Body>
      <Body>The charrette brought together Escalante Golf, OCM, Destination Design, Work Architecture, and the City of Grand Prairie to test three program options against the physical reality of the site. Through site walks, precedent analysis, and intensive design sessions, the team converged on a preferred direction. What follows is the product of that convergence: not a finished plan, but a framework built on shared convictions and grounded in what we heard, what we saw, and what we believe the market is ready for.</Body>

      {/* The Big Ideas */}
      <div style={{ marginTop: 48 }}>
        <SubHead>The Big Ideas</SubHead>
        {bigIdeas.map((idea, i) => (
          <div key={i} className="reveal" style={{
            borderLeft: `3px solid ${C.sienna}`,
            padding: "24px 28px",
            marginBottom: 4,
            background: i % 2 === 0 ? C.parchmentAlt : C.parchment,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                letterSpacing: "0.12em", color: C.sienna, fontWeight: 600,
              }}>{idea.num}</span>
              <h4 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 400, fontStyle: "italic", color: C.ink,
                fontVariantLigatures: "common-ligatures",
              }}>{idea.title}</h4>
            </div>
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(14px, 1.5vw, 16px)",
              lineHeight: 1.92, color: C.ink,
            }}>{idea.text}</p>
          </div>
        ))}
      </div>

      {/* Conceptual Master Plan — full width */}
      <div className="reveal" style={{ marginTop: 48, marginBottom: 48 }}>
        <div style={{ borderTop: `2px solid ${C.sienna}`, paddingTop: 16 }}>
          <img src="/charrette/master-plan.jpg" alt="Conceptual Master Plan"
            style={{ width: "100%", display: "block" }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: C.sage, marginTop: 10, fontWeight: 500,
          }}>Conceptual Master Plan — Charrette Chosen Direction</p>
        </div>
      </div>

      {/* Key Areas */}
      <SubHead>Three Zones. One Journey.</SubHead>
      <Body>The conceptual master plan follows a simple organizing principle: concentrate energy at two nodes, protect open space everywhere else. Three distinct zones emerge from the peninsula's natural organization, each serving a different role in the guest journey. Arrival occurs near the road. The village holds the middle ground. The clubhouse commands the high point above the water. Everything orients toward the lake and the finishing holes that bring you home.</Body>

      {/* Zone breakdowns */}
      {zones.map((zone, i) => (
        <div key={i} style={{ marginTop: 48 }}>
          <TwoCol
            left={<>
              <div className="reveal" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: C.sienna, fontWeight: 600, marginBottom: 8,
              }}>Zone {zone.num}</div>
              <h3 className="reveal" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 400, color: C.ink, marginBottom: 20,
                fontVariantLigatures: "common-ligatures",
              }}>{zone.title}</h3>
              <Body>{zone.text}</Body>
            </>}
            right={<>
              <div className="reveal reveal-delay-2" style={{ width: "100%" }}>
                <img src={zone.img} alt={zone.caption}
                  style={{ width: "100%", display: "block", border: `1px solid ${C.rule}` }} />
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: C.sage, marginTop: 8, fontWeight: 500,
                }}>{zone.caption}</p>
              </div>
            </>}
          />
        </div>
      ))}

      {/* Spirit of the Place */}
      <div className="reveal" style={{ marginTop: 56 }}>
        <div style={{ borderTop: `2px solid ${C.sienna}`, paddingTop: 16 }}>
          <img src="/charrette/spirit-of-place.jpg" alt="The Spirit of the Place"
            style={{ width: "100%", display: "block" }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: C.sage, marginTop: 10, fontWeight: 500,
          }}>The Spirit of the Place — Design Character + Material Palette</p>
        </div>
      </div>

      <PullQuote>"You arrive curious. You leave converted."</PullQuote>

      {/* Charrette PDF Download */}
      <div className="reveal" style={{
        marginTop: 48, marginBottom: 48, textAlign: "center",
      }}>
        <div style={{
          borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`,
          padding: "32px 24px",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: C.sage, marginBottom: 14, fontWeight: 500,
          }}>Full Charrette Document</p>
          <a
            href="/charrette/estes-park-charrette-review.pdf"
            download
            style={{
              display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.parchment,
              background: C.sienna,
              padding: "14px 36px",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Download Charrette Review (PDF)</a>
          <p style={{
            fontFamily: "'Lora', serif", fontStyle: "italic",
            fontSize: 13, color: C.sage, marginTop: 14, opacity: 0.7,
          }}>20 pages · April 2026</p>
        </div>
      </div>

      <FeedbackPrompt
        question="Having seen the direction — the Big Ideas, the zones, the master plan — what conviction came out of these three days that you think we haven't captured yet?"
        onRespond={onRespond}
      />
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — THE TEAM
// ═══════════════════════════════════════════════════════════════════════════════
const TEAM = [
  {
    name: "Escalante Golf", role: "Golf Operator", org: "Boutique Golf Management",
    bio: "Escalante Golf is the most distinctive boutique golf operator in America, a portfolio spanning 17 states that runs from Top 100 World-ranked private clubs and walking-only pure golf experiences to full-scale resort operations. Every Escalante property carries a singular promise: no compromise on operational control, brand authority, or architectural conviction. The DFW market has been waiting for the flagship this region deserves. This is the project that delivers it.",
    link: { label: "escalantegolf.com", url: "https://www.escalantegolf.com" },
  },
  {
    name: "OCM Golf", role: "Golf Course Design + Build", org: "Ogilvy · Cocking · Mead",
    bio: "Design. Build. Keep. OCM is the only firm in golf architecture that designs, builds, and maintains its own work, from first concept through construction, grow-in, and ongoing agronomic consultation. Led by Geoff Ogilvy, Mike Cocking, and Ashley Mead, the firm's philosophy was cultivated in the sands of the Melbourne Sandbelt: architecture that makes the journey to every hole an experience worth remembering. Their first U.S. project was Shady Oaks in Fort Worth. A direct precedent for this work.",
    link: { label: "ocm.golf", url: "https://www.ocm.golf" },
  },
  {
    name: "Destination Design", role: "Master Planner", org: "Resort + Golf Master Planning",
    bio: "Destination Design is the spatial intelligence layer of this project. The firm's principal brings rare breadth to the table: master planner, landscape architect, golf course expert, and the person this team looks to for vision and coordination when the ground truth has to align with the big idea. With deep experience planning golf resorts for Escalante and other premier operators, Destination Design's first site read set the foundational principle: intimate, gentle use of land. Space between the holes. Low rooflines that erase the horizon. Buildings that let you get lost in the landscape rather than anchor you to it. How it feels to move through the resort, arrive at it, disappear into it, that work begins here.",
  },
  {
    name: "Work Architecture", role: "Planning + Strategy Lead", org: "Planning + Strategy",
    bio: "Work Architecture is the strategic and planning intelligence layer for this project. The firm works at the intersection of cities and developers, helping both sides see exactly what a project could be before a single dollar goes toward figuring it out the hard way. For Estes Park, that means originating the site intelligence, building the charrette framework, assembling the operator and design team, framing the community benefit argument for the city, and leading the process that turns raw potential into a fundable, buildable vision.",
    link: { label: "wrkarc.com", url: "https://wrkarc.com" },
  },
];

function TeamSection({ onRespond }) {
  return (
    <SectionWrapper id="team">
      <SectionLabel number="06" label="The Team" />
      <SectionH2>The People Who Make This Real</SectionH2>
      <SectionSub>Each firm at this table brings something no one else can. This is the team that makes it real.</SectionSub>
      <Rule />

      {/* City of Grand Prairie — intro context, not a card */}
      <div className="reveal" style={{
        borderLeft: `3px solid ${C.sienna}`,
        paddingLeft: 24, marginBottom: 36,
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.sage, marginBottom: 8, fontWeight: 500 }}>The City</p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 500, color: C.ink, marginBottom: 10, fontVariantLigatures: "common-ligatures" }}>City of Grand Prairie</p>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 14, lineHeight: 1.92, color: C.ink, maxWidth: 780 }}>
          Grand Prairie has never waited to be discovered. It built its own future. From the 728 aircraft produced in 30 days at North American Aviation in 1944, to the $165M EpicCentral entertainment district, to the Goodland annexation bringing 50,000 new residents to the city's western edge — this is a city that knows how to execute at scale. It holds an AAA S&P bond rating, ranked #2 nationally in permitting efficiency in 2025, and a $327M general obligation bond on the May 2026 ballot. Grand Prairie is not a pass-through suburb. It is a destination city in the making. This project is the next chapter.
        </p>
        <p style={{ marginTop: 12 }}>
          <a href="https://www.gptx.org" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.sienna }}>
            gptx.org →
          </a>
        </p>
      </div>

      {/* Team cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 3 }}>
        {TEAM.map((member, i) => (
          <div key={i} className="reveal" style={{
            background: i % 2 === 0 ? C.parchment : C.parchmentAlt,
            padding: "28px 28px 24px",
            borderTop: `3px solid ${i === 0 ? C.sienna : C.rule}`,
          }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.sage, marginBottom: 10, fontWeight: 500 }}>{member.role}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 500, color: C.ink, marginBottom: 4, fontVariantLigatures: "common-ligatures" }}>{member.name}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.sienna, marginBottom: 18, letterSpacing: "0.04em" }}>{member.org}</p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 14, lineHeight: 1.92, color: C.ink }}>{member.bio}</p>
            {member.link && (
              <p style={{ marginTop: 16 }}>
                <a href={member.link.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.sienna }}>
                  {member.link.label} →
                </a>
              </p>
            )}
          </div>
        ))}

        {/* Ghost cards — future collaborators */}
        {[1, 2].map((n) => (
          <div key={`ghost-${n}`} className="reveal" style={{
            background: "transparent",
            padding: "28px 28px 24px",
            borderTop: `1px dashed ${C.rule}`,
            border: `1px dashed ${C.rule}`,
            opacity: 0.45,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
            minHeight: 180,
          }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.sage, marginBottom: 10, fontWeight: 500 }}>Future Collaborator</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, fontStyle: "italic", color: C.ink, opacity: 0.5 }}>Who else belongs at this table?</p>
          </div>
        ))}
      </div>

      <FeedbackPrompt
        question="Who else belongs at this table? What expertise or perspective is missing from this team that would make the project stronger?"
        onRespond={onRespond}
      />
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — THE LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
const LIBRARY = [
  {
    type: "Case Study",
    title: "Bandon Dunes",
    sub: "Strategic Intelligence Brief",
    desc: "The foundational case study for destination golf in an unlikely location. Documents the phased capital model, walking-only positioning decision, and community benefit framework that transformed a dying Oregon fishing town into golf's most storied destination. The risk-adjusted comparison to Estes Park's 8.3M-person market is central to this project's financial argument.",
    file: "/case-study-bandon-dunes.docx",
  },
  {
    type: "Case Study",
    title: "Pinehurst",
    sub: "Golf Resort Case Study",
    desc: "130 years of compounding mythology, traced from $1.25-per-acre deforested land to National Historic Landmark. Examines village-first design philosophy, distributed lodging model, and the long-term stewardship strategy that has produced U.S. Opens booked through 2047. The long-game argument for why design vision compounds over decades.",
    file: "/case-study-pinehurst.docx",
  },
  {
    type: "Case Study",
    title: "Pebble Beach",
    sub: "Strategic Intelligence for a Texas Lakeside Resort",
    desc: "Custom brief applying Pebble Beach's coastline-as-defining-asset model to Estes Park's lakefront site. Examines how a water-adjacent setting creates irreplaceable views, photographic identity, and membership premium. Mountain Creek Lake is this project's Pacific Ocean — the borrowed view that no competitor can replicate.",
    file: "/case-study-pebble-beach.docx",
  },
  {
    type: "Case Study",
    title: "Old Shores",
    sub: "Case Study Brief",
    desc: "Deep dive on a lesser-known but highly instructive resort development case. Examines how a regional market, committed ownership, and a single-architect identity created a destination with outsized influence relative to its size. Directly applicable to the boutique-first, expand-later model proposed for this site.",
    file: "/case-study-old-shores.docx",
  },
  {
    type: "Report",
    title: "Golf Destination Deep Dive",
    sub: "Market Intelligence Report",
    desc: "Comprehensive analysis of the modern destination golf market: demand drivers, price point architecture, membership model variants, and the pipeline of upcoming supply. Positions Estes Park within the national landscape and identifies the specific market gap — walking-only, architecturally pure, Texas-authentic — that no current or announced development occupies.",
    file: "/report-golf-destination-deep-dive.docx",
  },
  {
    type: "Report",
    title: "Competitive Intelligence Brief",
    sub: "Golf Resort Competitive Analysis",
    desc: "Head-to-head analysis of every relevant competitor in the DFW and Texas market, including announced projects, pricing, programming, and operator affiliations. Documents the white space this project occupies and the specific differentiators that insulate it from competitive pressure. Required reading before any conversation about market positioning.",
    file: "/report-competitive-intelligence.docx",
  },
  {
    type: "Report",
    title: "Golf Resort Case Study Brief",
    sub: "Structural Intelligence Report",
    desc: "Examines the structural components shared by every successful destination golf resort — capital stack, phasing discipline, programming architecture, operator selection criteria, and community benefit frameworks. Functions as the operating manual for how great projects get built. Every recommendation in this portal traces back to principles documented here.",
    file: "/report-golf-resort-case-study.docx",
  },
  {
    type: "Research",
    title: "The Joe Pool Lake Area in Grand Prairie",
    sub: "Site History and Context Research",
    desc: "Primary research document tracing the complete history of the Joe Pool Lake corridor — geological formation, Indigenous habitation, Spanish land grants, Confederate-era founding, North American Aviation's WWII production record, and Mountain Creek Lake's creation as a power plant cooling reservoir. The intelligence behind the 'The Place' section of this portal.",
    file: "/research-joe-pool-lake-history.docx",
  },
];

function LibraryCard({ item }) {
  const [open, setOpen] = useState(false);
  const typeColor = item.type === "Case Study" ? C.sienna : item.type === "Report" ? C.sage : "#7A6A52";
  return (
    <div className="reveal" style={{
      borderLeft: `3px solid ${typeColor}`,
      marginBottom: 4,
      background: C.parchment,
      overflow: "hidden",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.06)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          padding: "20px 28px", cursor: "pointer",
          display: "flex", alignItems: "flex-start", gap: 18,
        }}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.12em",
          color: typeColor, fontWeight: 600, flexShrink: 0, marginTop: 6,
          textTransform: "uppercase", minWidth: 72,
        }}>{item.type}</span>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(16px, 2vw, 21px)",
            fontWeight: 500, fontStyle: "italic",
            color: C.ink, marginBottom: 3,
          }}>{item.title}</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.1em", color: C.sage, textTransform: "uppercase" }}>{item.sub}</p>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: C.sienna, flexShrink: 0, marginTop: 2 }}>{open ? "−" : "+"}</span>
      </button>
      <div style={{
        maxHeight: open ? "800px" : "0",
        overflow: "hidden",
        transition: "max-height 0.25s ease",
        background: C.compOpen,
      }}>
        <div style={{ padding: "0 28px 28px 66px" }}>
          <p style={{
            fontFamily: "'Lora', serif", fontSize: "clamp(14px, 1.6vw, 16px)",
            lineHeight: 1.82, color: C.ink,
            borderTop: `1px solid ${C.rule}`, paddingTop: 18, marginBottom: 20,
          }}>{item.desc}</p>
          <a
            href={item.file}
            download
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase",
              fontWeight: 600, color: C.sienna,
              border: `1px solid ${C.sienna}`, padding: "9px 18px",
              textDecoration: "none", transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.sienna; e.currentTarget.style.color = C.parchment; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.sienna; }}
          >
            Download document →
          </a>
        </div>
      </div>
    </div>
  );
}

function LibrarySection() {
  const caseStudies = LIBRARY.filter(d => d.type === "Case Study");
  const reports = LIBRARY.filter(d => d.type === "Report" || d.type === "Research");
  return (
    <SectionWrapper id="library" alt>
      <SectionLabel number="07" label="The Library" />
      <SectionH2>The Intelligence Behind the Argument</SectionH2>
      <SectionSub>Eight documents. Every claim in this portal traces back to one of them.</SectionSub>
      <Rule />
      <Body>The analysis on these pages didn't come from intuition. It came from primary research, competitive intelligence, and case study work built specifically for this project. These documents are the foundation — the full arguments, the numbers, the precedents, and the strategic logic that informs every recommendation in this portal.</Body>
      <Body>They are available to every participant in this charrette. Download what you need. Share what is relevant. Push back where you disagree. That is the point.</Body>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))", gap: 40, marginTop: 44 }}>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase", color: C.sage, fontWeight: 600, marginBottom: 16,
            borderBottom: `1px solid ${C.rule}`, paddingBottom: 10,
          }}>Case Studies</p>
          {caseStudies.map((item, i) => <LibraryCard key={i} item={item} />)}
        </div>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase", color: C.sage, fontWeight: 600, marginBottom: 16,
            borderBottom: `1px solid ${C.rule}`, paddingBottom: 10,
          }}>Reports + Research</p>
          {reports.map((item, i) => <LibraryCard key={i} item={item} />)}
        </div>
      </div>

      <div className="reveal" style={{
        marginTop: 52, padding: "28px 32px",
        background: C.warmBlack, borderTop: `2px solid ${C.sienna}`,
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20,
      }}>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase", color: C.sienna, marginBottom: 8, fontWeight: 600,
          }}>Need a document not listed here?</p>
          <p style={{
            fontFamily: "'Lora', serif", fontStyle: "italic",
            fontSize: "clamp(13px, 1.5vw, 16px)", lineHeight: 1.75,
            color: "rgba(245,240,232,0.58)",
          }}>Additional research, financial models, and site data are available from the project team.</p>
        </div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.14em",
          textTransform: "uppercase", fontWeight: 600, color: C.sienna,
          border: `1px solid ${C.sienna}`, padding: "10px 20px",
          whiteSpace: "nowrap",
        }}>Contact the project team for materials</span>
      </div>
    </SectionWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — THE LOOP
// ═══════════════════════════════════════════════════════════════════════════════
function LoopSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", section: "The Story", response: "", attribution: "yes",
  });

  const prompts = [
    { section: "The Story",    q: "What has to be true about Day 1 operations for this project to earn the reputation it's being built toward?" },
    { section: "The Place",    q: "What does this site have — or not have — that should shape decisions that haven't been made yet?" },
    { section: "The Market",   q: "The DFW market case is made. What's the one thing a DFW golfer expects that would need to be exceeded — not just met — to drive real word-of-mouth?" },
    { section: "The Comps",    q: "Which of the twelve comparables in this portal is closest to what this project should actually become? What does it do that we should steal?" },
    { section: "The Team",     q: "Who else belongs at this table before the design phase begins?" },
    { section: "Something Else", q: "What's the thing this team got wrong, or hasn't asked yet, that you'd be thinking about if this were your project?" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://formspree.io/f/xaqlygol", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
      });
    } catch (_) {}
    setSubmitted(true);
  };

  const field = {
    width: "100%", padding: "12px 14px",
    background: "#2A2420",
    border: "1px solid rgba(248,240,225,0.14)",
    fontFamily: "'Lora', serif", fontSize: 15,
    color: "rgba(245,240,232,0.82)",
    outline: "none", borderRadius: 0,
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "rgba(245,240,232,0.42)",
    display: "block", marginBottom: 8, fontWeight: 500,
  };

  return (
    <section id="loop" style={{
      position: "relative", zIndex: 1,
      padding: "88px 24px",
      background: C.warmBlack,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel number="08" label="The Field" dark />

        {/* Largest type on the page — closing statement */}
        <h2 className="reveal" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(30px, 5vw, 66px)",
          fontWeight: 400, lineHeight: 1.16, marginBottom: 8, maxWidth: 820,
          color: C.parchment, fontVariantLigatures: "common-ligatures",
        }}>
          You Weren't in the Room.<br />You Should Be in This Conversation.
        </h2>
        <p className="reveal reveal-delay-1" style={{
          fontFamily: "'Lora', serif", fontStyle: "italic",
          fontSize: "clamp(15px, 1.9vw, 20px)",
          color: "rgba(245,240,232,0.45)", marginBottom: 40, lineHeight: 1.55,
        }}>
          The charrette happened. Now the people who know Escalante deepest get their say.
        </p>
        <Rule dark />
        <TwoCol
          left={<>
            <Body dark>The charrette team spent two days on this site, with this concept, with this operator. What came out of it is captured in everything you just read. The vision is sharper, the spatial logic is established, the team is assembled, and the case is built.</Body>
            <Body dark>The one thing the transcript can't capture is yours.</Body>
            <Body dark>You know Escalante's properties from the inside. You know what works operationally, where the gaps show up, what a guest says when they've had an experience that actually earned their loyalty. That knowledge doesn't live in any charrette notes. It lives in the people reading this right now.</Body>
            <Body dark>This is a direct request for your thinking. What the team got right. What they missed. What you'd push back on. What precedent, from inside the portfolio or outside it, should be shaping decisions that haven't been locked in yet. What you send here routes directly to the project team and gets worked into the next version of this document.</Body>

            {submitted ? (
              <div className="reveal" style={{
                padding: "40px", marginTop: 36, textAlign: "center",
                border: `1px solid rgba(181,84,27,0.35)`,
              }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  color: C.parchment, marginBottom: 12,
                  fontVariantLigatures: "common-ligatures",
                }}>
                  Your thinking is now part of the project.
                </p>
                <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 15, color: "rgba(245,240,232,0.45)" }}>Thank you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: 36 }}>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Your name (optional)</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={field} placeholder="Name"
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Which section are you responding to?</label>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    style={{ ...field, cursor: "pointer" }}
                  >
                    {prompts.map(p => <option key={p.section} value={p.section}>{p.section}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Your thinking</label>
                  <textarea
                    value={formData.response}
                    onChange={e => setFormData({ ...formData, response: e.target.value })}
                    rows={7} required
                    style={{ ...field, resize: "vertical", lineHeight: 1.78 }}
                    placeholder="What do you know that isn't here yet..."
                  />
                </div>
                <div style={{ marginBottom: 32 }}>
                  <label style={labelStyle}>May we quote you?</label>
                  <select
                    value={formData.attribution}
                    onChange={e => setFormData({ ...formData, attribution: e.target.value })}
                    style={{ ...field, cursor: "pointer" }}
                  >
                    <option value="yes">Yes, you may quote me</option>
                    <option value="anonymous">Quote me anonymously</option>
                    <option value="no">Don't quote me</option>
                  </select>
                </div>
                <button type="submit" style={{
                  width: "100%", padding: "20px",
                  background: C.sienna, border: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  fontWeight: 600, color: C.parchment, cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.target.style.opacity = 0.85}
                  onMouseLeave={e => e.target.style.opacity = 1}
                >
                  Send to the project team →
                </button>
              </form>
            )}
          </>}
          right={<>
            <div className="reveal reveal-delay-2" style={{
              border: "1px solid rgba(245,240,232,0.1)", padding: "24px",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "rgba(245,240,232,0.35)",
                marginBottom: 20, fontWeight: 500,
              }}>Questions worth answering</p>
              {prompts.map((p, i) => (
                <div key={i} style={{
                  marginBottom: 20, paddingBottom: 20,
                  borderBottom: i < prompts.length - 1 ? "1px solid rgba(245,240,232,0.07)" : "none",
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.sienna, marginBottom: 8, fontWeight: 600 }}>{p.section}</p>
                  <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.68, color: "rgba(245,240,232,0.6)" }}>{p.q}</p>
                </div>
              ))}
            </div>
          </>}
        />
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const logos = [
    { src: "/logo-gp.png",                 alt: "City of Grand Prairie" },
    { src: "/logo-escalante.png",           alt: "Escalante Golf" },
    { src: "/logo-ocm.png",                 alt: "OCM Golf" },
    { src: "/logo-destination-design.png",  alt: "Destination Design" },
    { src: "/logo-work.png",                alt: "Work Architecture" },
  ];
  return (
    <footer style={{
      background: C.warmBlack, padding: "48px 24px 40px",
      borderTop: "1px solid rgba(245,240,232,0.06)",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Logo strip */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", alignItems: "center",
          gap: "32px 48px", marginBottom: 40,
          paddingBottom: 36,
          borderBottom: "1px solid rgba(245,240,232,0.07)",
        }}>
          {logos.map(({ src, alt }) => (
            <img
              key={alt} src={src} alt={alt}
              style={{
                height: 22, width: "auto",
                filter: "brightness(0) invert(1)",
                opacity: 0.28,
                objectFit: "contain",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.parchment, fontWeight: 400, fontVariantLigatures: "common-ligatures" }}>Estes Park</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.1em", color: "rgba(245,240,232,0.28)", textTransform: "uppercase" }}>Work Architecture · Version 3.1 · April 2026</p>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(245,240,232,0.28)", letterSpacing: "0.04em" }}>wrkarc.com</span>
        </div>
        <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 12, color: "rgba(245,240,232,0.22)", lineHeight: 1.75 }}>
          This portal was built by Work Architecture as a living intelligence document for the Estes Park design charrette, April 1, 2026. It will be updated as the project evolves.
        </p>
      </div>
    </footer>
  );
}

// ─── PASSWORD GATE ────────────────────────────────────────────────────────────
// Password stored in Vercel env var VITE_PORTAL_KEY — never in source code.
// Fallback is deliberately vague so it forces env setup on deploy.
const PORTAL_KEY = import.meta.env.VITE_PORTAL_KEY;

// PasswordGate is now a fixed overlay — the portal content lives underneath,
// blurred + dimmed via CSS filter. This means .reveal elements are always in
// the DOM, the scroll observer works on mount, and unlock is a visual fade-out
// rather than a conditional re-render.
function PasswordGate({ onUnlock, fading }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shake, setShake] = useState(false);

  const isValidEmail = (addr) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(addr)) return false;
    const blocked = ["mailinator.com","guerrillamail.com","tempmail.com","throwaway.email",
      "yopmail.com","sharklasers.com","guerrillamailblock.com","grr.la","discard.email",
      "trashmail.com","10minutemail.com","temp-mail.org","fakeinbox.com","maildrop.cc"];
    const domain = addr.split("@")[1].toLowerCase();
    return !blocked.includes(domain);
  };

  const attempt = () => {
    const trimmedEmail = email.trim().toLowerCase();
    // Validate email
    if (!trimmedEmail) {
      setEmailError("Please enter your email address.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setEmailError("");
    // Validate password
    if (PORTAL_KEY && pw.trim() === PORTAL_KEY.trim()) {
      fetch("https://formspree.io/f/xaqlygol", {
        method: "POST",
        body: JSON.stringify({
          _subject: "Portal Access — " + trimmedEmail,
          email: trimmedEmail,
          action: "Portal sign-in",
          timestamp: new Date().toISOString(),
        }),
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
      }).catch(() => {});
      sessionStorage.setItem("ep_unlocked", "1");
      sessionStorage.setItem("ep_email", trimmedEmail);
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const inputBase = {
    width: "100%", padding: "16px 20px",
    background: "rgba(245,240,232,0.06)",
    color: C.parchment, fontFamily: "'Lora', serif", fontSize: 18,
    outline: "none", letterSpacing: "0.06em", boxSizing: "border-box",
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 10,
    letterSpacing: "0.14em", textTransform: "uppercase",
    color: "rgba(245,240,232,0.42)", display: "block",
    marginBottom: 8, fontWeight: 500,
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-6px); }
          40%,80%  { transform: translateX(6px); }
        }
        .shake { animation: shake 0.45s ease; }
      `}</style>
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
        background: "rgba(26,24,20,0.88)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.55s ease",
        pointerEvents: fading ? "none" : "auto",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10,
          letterSpacing: "0.24em", textTransform: "uppercase",
          color: C.sienna, marginBottom: 32, fontWeight: 600,
        }}>
          Estes Park &nbsp;·&nbsp; Charrette Portal
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 38px)",
          fontWeight: 400, color: C.parchment, textAlign: "center",
          lineHeight: 1.25, marginBottom: 12, maxWidth: 520,
        }}>
          For charrette participants only.
        </h1>
        <p style={{
          fontFamily: "'Lora', serif", fontStyle: "italic",
          fontSize: 15, color: "rgba(245,240,232,0.38)",
          marginBottom: 48, textAlign: "center",
        }}>
          Enter your email and the Estes Park Charrette password to continue.
        </p>
        <div className={shake ? "shake" : ""} style={{ width: "100%", maxWidth: 360 }}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Your email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={e => e.key === "Enter" && document.getElementById("ep-pw").focus()}
              placeholder="name@company.com"
              autoFocus
              autoComplete="email"
              style={{
                ...inputBase,
                border: `1px solid ${emailError ? C.sienna : "rgba(245,240,232,0.12)"}`,
              }}
            />
            {emailError && (
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                color: C.sienna, letterSpacing: "0.12em",
                textTransform: "uppercase", marginTop: 8,
              }}>{emailError}</p>
            )}
          </div>
          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Charrette password</label>
            <input
              id="ep-pw"
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false); }}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="Enter password"
              style={{
                ...inputBase,
                border: `1px solid ${error ? C.sienna : "rgba(245,240,232,0.12)"}`,
              }}
            />
            {error && (
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                color: C.sienna, letterSpacing: "0.12em",
                textTransform: "uppercase", marginTop: 8,
              }}>
                Incorrect password. Try again.
              </p>
            )}
          </div>
          <button
            onClick={attempt}
            style={{
              width: "100%", padding: "16px",
              background: C.sienna, border: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 600, color: C.parchment, cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.target.style.opacity = 0.85}
            onMouseLeave={e => e.target.style.opacity = 1}
          >
            Enter portal →
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeSection, setActiveSection] = useState("story");
  const startsUnlocked = !PORTAL_KEY || sessionStorage.getItem("ep_unlocked") === "1";
  const [unlocked, setUnlocked] = useState(startsUnlocked);
  const [overlayFading, setOverlayFading] = useState(false);

  // Content is always in the DOM — observer works on mount with simple [] deps
  useScrollReveal();

  useEffect(() => {
    const sections = ["story", "place", "market", "comps", "vision", "team", "library", "loop"];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.25 }
    );
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Prevent scrolling while gate is showing
  useEffect(() => {
    document.body.style.overflow = unlocked ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [unlocked]);

  const handleUnlock = () => {
    setOverlayFading(true);          // start overlay fade-out
    setTimeout(() => {
      setUnlocked(true);             // lift blur from content
      setOverlayFading(false);       // reset for safety (overlay unmounts anyway)
    }, 560);
  };

  const scrollToLoop = () => document.getElementById("loop")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{globalStyles}</style>

      {/* Fixed overlay — floats above the blurred content while locked */}
      {!unlocked && (
        <PasswordGate onUnlock={handleUnlock} fading={overlayFading} />
      )}

      {/* Portal content — always rendered; blurred + dimmed until unlocked */}
      <div style={{
        filter: unlocked ? "none" : "blur(14px) brightness(0.12) saturate(0.25)",
        transition: overlayFading ? "filter 0.55s ease" : "none",
        pointerEvents: unlocked ? "auto" : "none",
        userSelect: unlocked ? "auto" : "none",
      }}>
        <div className="grain" />
        <Nav active={activeSection} />
        <Hero />
        <StorySection  onRespond={scrollToLoop} />
        <ImageDivider src="/cedar-hill-bluebonnets.jpg" position="center 55%" />
        <PlaceSection  onRespond={scrollToLoop} />
        <ImageDivider src="/texas-sunset-field.jpg" position="center 40%" />
        <MarketSection onRespond={scrollToLoop} />
        <ImageDivider src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1600&q=85" position="center 60%" />
        <CompsSection  onRespond={scrollToLoop} />
        <ImageDivider src="/charrette/masterplan-watercolor.jpg" position="center 50%" />
        <VisionSection onRespond={scrollToLoop} />
        <ImageDivider src="/sand-valley-lodge.jpg" position="center 50%" />
        <TeamSection   onRespond={scrollToLoop} />
        <ImageDivider src="/golf-cart-oaks.jpg" position="center 45%" height="36vh" />
        <LibrarySection />
        <LoopSection />
        <Footer />
      </div>
    </>
  );
}
