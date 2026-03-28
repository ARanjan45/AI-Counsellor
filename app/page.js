"use client"
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";

export default function Home() {
  return (
    <div className="youmatter-root">
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Noise texture overlay */}
      <div className="noise" />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-dot" />
          YouMatter
        </div>
        <div className="nav-right">
          <a href="#features" className="nav-link">How it works</a>
          <a href="#experts" className="nav-link">Experts</a>
          <UserButton />
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-pulse" />
          AI Counsellor — Always Here
        </div>

        <h1 className="hero-title">
          A safe space<br />
          <span className="hero-title-accent">for your mind</span>
        </h1>

        <p className="hero-subtitle">
          YouMatter's AI counsellor listens without judgment,
          helps you process emotions, and guides you toward calm —
          any time, any day.
        </p>

        <div className="hero-actions">
          <Link href="/dashboard">
            <button className="btn-primary">Begin your session</button>
          </Link>
          <a href="#features" className="btn-ghost">See how it works ↓</a>
        </div>

        {/* Floating cards */}
        <div className="float-cards">
          <div className="float-card float-card-1">
            <span className="float-icon">🌙</span>
            <span>Sleep & Relaxation</span>
          </div>
          <div className="float-card float-card-2">
            <span className="float-icon">🧘</span>
            <span>Mindfulness</span>
          </div>
          <div className="float-card float-card-3">
            <span className="float-icon">💬</span>
            <span>Daily Check-in</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <p className="section-label">What we offer</p>
        <h2 className="section-title">Your wellbeing, supported</h2>

        <div className="features-grid">
          {[
            {
              icon: "🌿",
              title: "Daily Emotional Check-in",
              desc: "Start each day by naming how you feel. We listen, reflect, and help you understand yourself better."
            },
            {
              icon: "🧠",
              title: "Guided CBT & Coping",
              desc: "Gently challenge unhelpful thoughts with evidence-based Cognitive Behavioral Therapy techniques."
            },
            {
              icon: "🆘",
              title: "Crisis Support",
              desc: "When things feel too heavy, we're here — calm, grounding, and always ready to listen without judgment."
            },
            {
              icon: "🌙",
              title: "Sleep & Relaxation",
              desc: "Wind down with breathing exercises, body scans, and sleep hygiene guidance tailored to your night."
            },
            {
              icon: "📈",
              title: "Progress Tracking",
              desc: "Reflect on your journey. Celebrate small wins. Build momentum, one session at a time."
            },
            {
              icon: "🧘",
              title: "Mindfulness & Meditation",
              desc: "Ground yourself in the present with guided meditations and mindfulness practices for any moment."
            },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experts */}
      <section className="experts" id="experts">
        <p className="section-label">Your guides</p>
        <h2 className="section-title">Meet your counsellors</h2>
        <div className="experts-grid">
          {[
            { name: "Joanna", img: "/t1.png", vibe: "Warm & Nurturing" },
            { name: "Sallie", img: "/t2.png", vibe: "Calm & Professional" },
            { name: "Mathhew", img: "/t3.png", vibe: "Steady & Grounding" },
          ].map((e, i) => (
            <div className="expert-card" key={i}>
              <div className="expert-img-wrap">
                <img src={e.img} alt={e.name} className="expert-img" />
                <div className="expert-glow" />
              </div>
              <h3 className="expert-name">{e.name}</h3>
              <p className="expert-vibe">{e.vibe}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-inner">
          <h2 className="cta-title">You deserve to feel better.</h2>
          <p className="cta-sub">Start a conversation. No pressure, no judgment — just support.</p>
          <Link href="/dashboard">
            <button className="btn-primary btn-large">Talk to a counsellor now</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-logo">YouMatter</span>
        <span className="footer-copy">© 2026 · Built with care</span>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #0f1117;
          --bg2: #141820;
          --surface: rgba(255,255,255,0.04);
          --surface-hover: rgba(255,255,255,0.07);
          --border: rgba(255,255,255,0.08);
          --sage: #7eb89a;
          --sage-dim: #4a7a62;
          --lavender: #9d8ec4;
          --warm: #c9a87c;
          --text: #e8e4dd;
          --text-dim: #8a8a9a;
          --glow-sage: rgba(126,184,154,0.15);
          --glow-lavender: rgba(157,142,196,0.12);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .youmatter-root {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: orbFloat 12s ease-in-out infinite;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: var(--glow-sage);
          top: -100px; left: -100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: var(--glow-lavender);
          top: 40%; right: -100px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: rgba(201,168,124,0.08);
          bottom: 10%; left: 20%;
          animation-delay: -8s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 20px) scale(0.95); }
        }

        /* Noise */
        .noise {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.4;
        }

        /* Nav */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          background: rgba(15,17,23,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'Lora', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--sage);
          display: inline-block;
          box-shadow: 0 0 8px var(--sage);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-link {
          color: var(--text-dim);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--text); }

        /* Hero */
        .hero {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(126,184,154,0.1);
          border: 1px solid rgba(126,184,154,0.25);
          color: var(--sage);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.82rem;
          letter-spacing: 0.03em;
          margin-bottom: 32px;
          animation: fadeUp 0.8s ease both;
        }
        .badge-pulse {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--sage);
          box-shadow: 0 0 6px var(--sage);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-title {
          font-family: 'Lora', serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 24px;
          animation: fadeUp 0.8s ease 0.1s both;
        }
        .hero-title-accent {
          color: var(--sage);
          font-style: italic;
        }
        .hero-subtitle {
          max-width: 520px;
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-dim);
          margin-bottom: 48px;
          font-weight: 300;
          animation: fadeUp 0.8s ease 0.2s both;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          animation: fadeUp 0.8s ease 0.3s both;
        }
        .btn-primary {
          background: var(--sage);
          color: #0f1117;
          border: none;
          padding: 14px 32px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 0 30px rgba(126,184,154,0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(126,184,154,0.45);
          background: #8fcba8;
        }
        .btn-large { padding: 18px 48px; font-size: 1.05rem; }
        .btn-ghost {
          color: var(--text-dim);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: var(--text); }

        /* Floating cards */
        .float-cards {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .float-card {
          position: absolute;
          background: var(--surface);
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-dim);
          white-space: nowrap;
        }
        .float-icon { font-size: 1rem; }
        .float-card-1 {
          top: 25%; left: 5%;
          animation: floatA 6s ease-in-out infinite;
        }
        .float-card-2 {
          top: 35%; right: 5%;
          animation: floatB 7s ease-in-out infinite;
        }
        .float-card-3 {
          bottom: 20%; left: 8%;
          animation: floatA 8s ease-in-out infinite reverse;
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }

        /* Sections */
        .features, .experts {
          position: relative;
          z-index: 2;
          padding: 100px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sage);
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Lora', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          color: var(--text);
          margin-bottom: 56px;
        }

        /* Features grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
          animation: fadeUp 0.6s ease both;
        }
        .feature-card:hover {
          background: var(--surface-hover);
          border-color: rgba(126,184,154,0.2);
          transform: translateY(-4px);
        }
        .feature-icon { font-size: 2rem; display: block; margin-bottom: 16px; }
        .feature-title {
          font-family: 'Lora', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--text-dim);
          font-weight: 300;
        }

        /* Experts */
        .experts-grid {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .expert-card {
          text-align: center;
          transition: transform 0.3s;
        }
        .expert-card:hover { transform: translateY(-6px); }
        .expert-img-wrap {
          position: relative;
          width: 140px; height: 140px;
          margin: 0 auto 16px;
        }
        .expert-img {
          width: 140px; height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border);
        }
        .expert-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(126,184,154,0.2), transparent 70%);
          animation: pulse 3s ease infinite;
        }
        .expert-name {
          font-family: 'Lora', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }
        .expert-vibe {
          font-size: 0.82rem;
          color: var(--sage);
          letter-spacing: 0.05em;
        }

        /* CTA */
        .cta {
          position: relative;
          z-index: 2;
          padding: 80px 24px;
          text-align: center;
        }
        .cta-inner {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(126,184,154,0.08), rgba(157,142,196,0.08));
          border: 1px solid rgba(126,184,154,0.15);
          border-radius: 32px;
          padding: 72px 48px;
        }
        .cta-title {
          font-family: 'Lora', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 600;
          color: var(--text);
          margin-bottom: 16px;
        }
        .cta-sub {
          font-size: 1rem;
          color: var(--text-dim);
          margin-bottom: 40px;
          font-weight: 300;
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          border-top: 1px solid var(--border);
        }
        .footer-logo {
          font-family: 'Lora', serif;
          font-size: 1rem;
          color: var(--text-dim);
        }
        .footer-copy {
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 24px; }
          .nav-link { display: none; }
          .features, .experts { padding: 60px 24px; }
          .float-card-1, .float-card-3 { display: none; }
          .float-card-2 { right: 2%; font-size: 0.75rem; }
          .footer { padding: 20px 24px; }
          .cta-inner { padding: 48px 24px; }
          .hero-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}