import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ─── DESIGN TOKENS (stessa palette dell'app) ─────────────────
const C = {
  bg: "#f8f9fa",
  surface: "#ffffff",
  border: "#e9ecef",
  accent: "#212529",
  text: "#212529",
  textMuted: "#6c757d",
  textDim: "#adb5bd",
  success: "#198754",
  successSoft: "rgba(25,135,84,0.1)",
  danger: "#dc3545",
  dangerSoft: "rgba(220,53,69,0.1)",
  accentSoft: "rgba(33,37,41,0.06)",
};

const GIORNI = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const GIORNI_FULL = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

const DIPS = [
  { id: 1, nome: "Marco E.", ruolo: "Pizzaiolo", col: "#495057" },
  { id: 2, nome: "Sara R.",  ruolo: "Sala",      col: "#198754" },
  { id: 3, nome: "Luigi F.", ruolo: "Sala",      col: "#0d6efd" },
  { id: 4, nome: "Anna D.",  ruolo: "Cassa",     col: "#6f42c1" },
  { id: 5, nome: "Ciro M.", ruolo: "Pizzaiolo", col: "#fd7e14" },
];

const FASCE = [
  { id: "f1", nome: "Pranzo", inizio: "11:00", fine: "15:00", min: 2 },
  { id: "f2", nome: "Cena",   inizio: "18:00", fine: "23:00", min: 3 },
];

const TURNI_VUOTI = {
  0: { f1: [], f2: [] }, 1: { f1: [], f2: [] },
  2: { f1: [], f2: [] }, 3: { f1: [], f2: [] },
  4: { f1: [], f2: [] }, 5: { f1: [], f2: [] },
  6: { f1: [], f2: [] },
};

const TURNI_PIENI = {
  0: { f1: [1, 2], f2: [1, 2, 5] },
  1: { f1: [3, 4], f2: [1, 3, 5] },
  2: { f1: [2],    f2: [2, 5] },
  3: { f1: [1, 2], f2: [1, 2, 3] },
  4: { f1: [3, 4], f2: [1, 2, 3, 4, 5] },
  5: { f1: [2, 3], f2: [2, 3, 4, 5] },
  6: { f1: [1, 2], f2: [1, 2, 5] },
};

// ─── ATOMS ───────────────────────────────────────────────────
function Avatar({ d, size = 28 }) {
  const ini = d.nome.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `${d.col}18`, border: `2px solid ${d.col}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, color: d.col, fontWeight: 700,
    }}>{ini}</div>
  );
}

function Pill({ children, color = C.accent, soft = false }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px",
      borderRadius: 20, fontSize: 16, fontWeight: 700,
      background: soft ? `${color}18` : color,
      color: soft ? color : "#fff",
      border: soft ? `1px solid ${color}30` : "none",
    }}>{children}</span>
  );
}

// ─── PHONE FRAME ─────────────────────────────────────────────
function PhoneFrame({ children, opacity = 1 }) {
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* glow background */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        borderRadius: "50%", background: "rgba(33,37,41,0.15)",
        filter: "blur(80px)", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
      }} />

      <div style={{
        width: 520, height: 1040, borderRadius: 56,
        background: C.bg, overflow: "hidden", position: "relative",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 12px #1a1a2e, 0 0 0 14px #333",
        opacity,
      }}>
        {/* status bar */}
        <div style={{
          padding: "20px 28px 8px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          background: C.bg,
        }}>
          <div style={{ fontSize: 18, color: C.textMuted, fontWeight: 700 }}>9:41</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 20,
            fontWeight: 700, color: C.accent,
          }}>TurniLab</div>
          <div style={{ fontSize: 18, color: C.textMuted }}>●●●</div>
        </div>

        {/* content */}
        <div style={{ padding: "16px 20px 80px", overflowY: "hidden", height: "100%" }}>
          {children}
        </div>

        {/* bottom nav */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: C.surface, borderTop: `1px solid ${C.border}`,
          display: "flex", padding: "12px 0 20px",
        }}>
          {[
            { icon: "▦", label: "Home", active: true },
            { icon: "◫", label: "Cal", active: false },
            { icon: "⊡", label: "Template", active: false },
            { icon: "◉", label: "Staff", active: false },
            { icon: "⊞", label: "Turni", active: false },
          ].map((n) => (
            <div key={n.label} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 22, color: n.active ? C.accent : C.textDim }}>{n.icon}</span>
              <span style={{
                fontSize: 13, textTransform: "uppercase",
                color: n.active ? C.accent : C.textMuted,
                fontWeight: n.active ? 700 : 500,
              }}>{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 1: Dashboard vuota (0–90f = 0–3s) ─────────────────
function Scene1Dashboard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const alertScale = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  return (
    <PhoneFrame>
      {/* header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 34, fontFamily: "Georgia,serif", fontWeight: 700 }}>
          Questa settimana
        </div>
        <div style={{ fontSize: 18, color: C.textMuted, marginTop: 6 }}>
          Lunedì 9 giugno
        </div>
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, opacity: cardOpacity }}>
        {[
          { val: "5", label: "Staff", col: C.accent },
          { val: "0", label: "Turni", col: C.textMuted },
          { val: "7", label: "Alert", col: C.danger },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1, background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "14px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: s.col, fontFamily: "Georgia,serif" }}>{s.val}</div>
            <div style={{ fontSize: 15, color: C.textMuted, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* alert strip */}
      <div style={{
        background: C.dangerSoft, border: `1px solid ${C.danger}30`,
        borderRadius: 14, padding: "14px 16px", marginBottom: 16,
        opacity: cardOpacity,
        transform: `scale(${alertScale})`,
      }}>
        <div style={{ fontSize: 18, color: C.danger, fontWeight: 700, marginBottom: 8 }}>
          ⚠ Copertura insufficiente
        </div>
        {["Lunedì", "Martedì", "Mercoledì"].map((g) => (
          <div key={g} style={{ fontSize: 16, color: C.text, marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
            <span>· {g}</span>
            <span style={{ color: C.danger, fontWeight: 700 }}>0/2 Operatori</span>
          </div>
        ))}
      </div>

      {/* days list — vuoti */}
      {GIORNI.slice(0, 3).map((g, gi) => (
        <div key={gi} style={{
          background: C.surface, border: `1px solid ${C.danger}40`,
          borderRadius: 14, padding: "12px 16px", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 14,
          opacity: cardOpacity,
        }}>
          <div style={{ textAlign: "center", minWidth: 38 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{g}</div>
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>{gi + 9}</div>
          </div>
          <div style={{ flex: 1 }}>
            {FASCE.map((f) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: C.textMuted, minWidth: 50, fontWeight: 600 }}>{f.nome}</span>
                <span style={{ fontSize: 14, color: C.danger }}>— Nessuno</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </PhoneFrame>
  );
}

// ─── SCENE 2: Click su "Applica template" (90–180f = 3–6s) ───
function Scene2Click() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btnScale = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const ripple = interpolate(frame, [15, 60], [0, 1], { extrapolateRight: "clamp" });
  const rippleScale = interpolate(frame, [15, 60], [0.5, 2.5], { extrapolateRight: "clamp" });
  const fingerY = interpolate(frame, [0, 20, 40, 90], [200, 0, 0, -300], { extrapolateRight: "clamp" });
  const fingerOpacity = interpolate(frame, [0, 10, 70, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <PhoneFrame>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 34, fontFamily: "Georgia,serif", fontWeight: 700 }}>Questa settimana</div>
      </div>

      {/* template banner con pulsante */}
      <div style={{
        background: C.accentSoft, border: `1px solid ${C.accent}20`,
        borderRadius: 14, padding: "18px 16px", marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, marginBottom: 6 }}>
          Template settimanale
        </div>
        <div style={{ fontSize: 15, color: C.textMuted, marginBottom: 16 }}>
          Applica lo schema fisso a questa settimana
        </div>

        {/* ripple effect */}
        {frame > 15 && (
          <div style={{
            position: "absolute", left: "50%", top: "75%",
            width: 200, height: 200,
            transform: `translate(-50%,-50%) scale(${rippleScale})`,
            borderRadius: "50%",
            background: `rgba(33,37,41,${0.15 * (1 - ripple)})`,
            pointerEvents: "none",
          }} />
        )}

        <div style={{
          background: C.accent, color: "#fff", borderRadius: 10,
          padding: "14px 24px", textAlign: "center",
          fontSize: 18, fontWeight: 700,
          transform: `scale(${frame < 20 ? btnScale : frame < 50 ? 0.95 : 1})`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          ↺ Applica template
        </div>
      </div>

      {/* finger cursor */}
      <div style={{
        position: "absolute",
        left: "50%", top: "55%",
        transform: `translate(-50%, ${fingerY}px)`,
        opacity: fingerOpacity,
        fontSize: 64,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        zIndex: 99,
      }}>👆</div>
    </PhoneFrame>
  );
}

// ─── SCENE 3: Turni che si compilano (180–360f = 6–12s) ──────
function Scene3Risultato() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ogni giorno appare con delay progressivo
  const giorniVisibili = Math.min(7, Math.floor(frame / 20) + 1);

  return (
    <PhoneFrame>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 30, fontFamily: "Georgia,serif", fontWeight: 700 }}>Questa settimana</div>
      </div>

      {/* stats aggiornate */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {[
          { val: "5", label: "Staff", col: C.accent },
          { val: "26", label: "Turni", col: C.success },
          { val: "0", label: "Alert", col: C.textMuted },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1, background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "12px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.col, fontFamily: "Georgia,serif" }}>{s.val}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* giorni che appaiono uno per uno */}
      {GIORNI.slice(0, Math.min(giorniVisibili, 5)).map((g, gi) => {
        const cardSpring = spring({
          frame: frame - gi * 20,
          fps,
          config: { damping: 14, stiffness: 180 },
        });
        const pres1 = (TURNI_PIENI[gi]?.f1 || []).map((id) => DIPS.find((d) => d.id === id)).filter(Boolean);
        const pres2 = (TURNI_PIENI[gi]?.f2 || []).map((id) => DIPS.find((d) => d.id === id)).filter(Boolean);
        const ok1 = pres1.length >= FASCE[0].min;
        const ok2 = pres2.length >= FASCE[1].min;

        return (
          <div key={gi} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "12px 16px", marginBottom: 8,
            display: "flex", alignItems: "flex-start", gap: 14,
            transform: `translateY(${(1 - cardSpring) * 30}px)`,
            opacity: cardSpring,
          }}>
            <div style={{ textAlign: "center", minWidth: 38 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{g}</div>
              <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{gi + 9}</div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { fascia: FASCE[0], pres: pres1, ok: ok1 },
                { fascia: FASCE[1], pres: pres2, ok: ok2 },
              ].map(({ fascia, pres, ok }) => (
                <div key={fascia.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: C.textMuted, minWidth: 48, fontWeight: 600 }}>{fascia.nome}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {pres.slice(0, 4).map((d) => <Avatar key={d.id} d={d} size={24} />)}
                  </div>
                  <Pill color={ok ? C.success : C.danger} soft>{pres.length}/{fascia.min}</Pill>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </PhoneFrame>
  );
}

// ─── SCENE 4: CTA finale (360–450f = 12–15s) ─────────────────
function Scene4CTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleY = interpolate(frame, [10, 40], [20, 0], { extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 30, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity,
    }}>
      {/* glow */}
      <div style={{
        position: "absolute", width: 500, height: 500,
        borderRadius: "50%", background: "rgba(255,255,255,0.04)",
        filter: "blur(60px)",
      }} />

      <div style={{
        transform: `scale(${titleScale})`,
        fontSize: 52, fontFamily: "Georgia,serif", fontWeight: 700,
        color: "#fff", textAlign: "center", lineHeight: 1.2, marginBottom: 24,
        padding: "0 60px",
      }}>
        Smetti di gestire i turni su WhatsApp.
      </div>

      <div style={{
        fontSize: 28, color: "rgba(255,255,255,0.7)", textAlign: "center",
        lineHeight: 1.5, padding: "0 80px", marginBottom: 60,
        transform: `translateY(${subtitleY}px)`,
        opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Un clic. Turni della settimana pronti. Zero errori di copertura.
      </div>

      <div style={{
        background: "#fff", color: C.accent,
        borderRadius: 20, padding: "22px 60px",
        fontSize: 28, fontWeight: 700,
        transform: `scale(${ctaScale})`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Prova gratis →
      </div>

      <div style={{
        marginTop: 24, fontSize: 22, color: "rgba(255,255,255,0.5)",
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        app.urbandigitallab.com
      </div>
    </AbsoluteFill>
  );
}

// ─── TEXT OVERLAY (appare sopra ogni scena) ───────────────────
function TextOverlay() {
  const frame = useCurrentFrame();

  const overlays = [
    { start: 5,  end: 85,  text: "La settimana è iniziata.\nNessun turno assegnato. 😅" },
    { start: 95, end: 175, text: "Un clic su\n\"Applica Template\"..." },
    { start: 185, end: 355, text: "✅ Turni compilati\nin automatico." },
  ];

  return (
    <>
      {overlays.map((o, i) => {
        const visible = frame >= o.start && frame <= o.end;
        const fadeIn = interpolate(frame, [o.start, o.start + 12], [0, 1], { extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [o.end - 12, o.end], [1, 0], { extrapolateRight: "clamp" });
        if (!visible) return null;
        return (
          <div key={i} style={{
            position: "absolute", bottom: 180, left: 0, right: 0,
            display: "flex", justifyContent: "center",
            opacity: Math.min(fadeIn, fadeOut),
            zIndex: 50,
          }}>
            <div style={{
              background: "rgba(0,0,0,0.75)", borderRadius: 20,
              padding: "18px 32px", maxWidth: 800,
              fontSize: 32, fontWeight: 700, color: "#fff",
              textAlign: "center", lineHeight: 1.4,
              backdropFilter: "blur(8px)",
              whiteSpace: "pre-line",
            }}>
              {o.text}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ─── ROOT COMPOSITION ─────────────────────────────────────────
export const TurniLabVideo = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <Scene1Dashboard />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <Scene2Click />
      </Sequence>

      <Sequence from={180} durationInFrames={180}>
        <Scene3Risultato />
      </Sequence>

      <Sequence from={360} durationInFrames={90}>
        <Scene4CTA />
      </Sequence>

      {/* overlay testo su tutte le scene tranne CTA */}
      <Sequence from={0} durationInFrames={360}>
        <TextOverlay />
      </Sequence>
    </AbsoluteFill>
  );
};
