import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

// ─── BOARD DATA ───────────────────────────────────────────────────────────────
const CELLS = [
  { id: 0, row: 10, col: 10, corner: true, name: "GO", type: "go", icon: "★" },
  {
    id: 1,
    row: 10,
    col: 9,
    name: "Mediterranean",
    type: "property",
    color: "#92400e",
  },
  { id: 2, row: 10, col: 8, name: "Comm Chest", type: "chest", icon: "📦" },
  {
    id: 3,
    row: 10,
    col: 7,
    name: "Baltic Ave",
    type: "property",
    color: "#92400e",
  },
  { id: 4, row: 10, col: 6, name: "Income Tax", type: "tax", icon: "💸" },
  { id: 5, row: 10, col: 5, name: "Reading RR", type: "railroad", icon: "🚂" },
  {
    id: 6,
    row: 10,
    col: 4,
    name: "Oriental Ave",
    type: "property",
    color: "#0369a1",
  },
  { id: 7, row: 10, col: 3, name: "Chance", type: "chance", icon: "?" },
  {
    id: 8,
    row: 10,
    col: 2,
    name: "Vermont Ave",
    type: "property",
    color: "#0369a1",
  },
  {
    id: 9,
    row: 10,
    col: 1,
    name: "Connecticut",
    type: "property",
    color: "#0369a1",
  },
  {
    id: 10,
    row: 10,
    col: 0,
    corner: true,
    name: "Jail",
    type: "jail",
    icon: "⚖️",
  },
  {
    id: 11,
    row: 9,
    col: 0,
    name: "St Charles",
    type: "property",
    color: "#be185d",
  },
  { id: 12, row: 8, col: 0, name: "Electric Co", type: "utility", icon: "⚡" },
  {
    id: 13,
    row: 7,
    col: 0,
    name: "States Ave",
    type: "property",
    color: "#be185d",
  },
  {
    id: 14,
    row: 6,
    col: 0,
    name: "Virginia Ave",
    type: "property",
    color: "#be185d",
  },
  { id: 15, row: 5, col: 0, name: "Penn RR", type: "railroad", icon: "🚂" },
  {
    id: 16,
    row: 4,
    col: 0,
    name: "St James",
    type: "property",
    color: "#c2410c",
  },
  { id: 17, row: 3, col: 0, name: "Comm Chest", type: "chest", icon: "📦" },
  {
    id: 18,
    row: 2,
    col: 0,
    name: "Tennessee",
    type: "property",
    color: "#c2410c",
  },
  {
    id: 19,
    row: 1,
    col: 0,
    name: "New York Ave",
    type: "property",
    color: "#c2410c",
  },
  {
    id: 20,
    row: 0,
    col: 0,
    corner: true,
    name: "Free Parking",
    type: "freeparking",
    icon: "🅿",
  },
  {
    id: 21,
    row: 0,
    col: 1,
    name: "Kentucky Ave",
    type: "property",
    color: "#b91c1c",
  },
  { id: 22, row: 0, col: 2, name: "Chance", type: "chance", icon: "?" },
  {
    id: 23,
    row: 0,
    col: 3,
    name: "Indiana Ave",
    type: "property",
    color: "#b91c1c",
  },
  {
    id: 24,
    row: 0,
    col: 4,
    name: "Illinois Ave",
    type: "property",
    color: "#b91c1c",
  },
  { id: 25, row: 0, col: 5, name: "B&O RR", type: "railroad", icon: "🚂" },
  {
    id: 26,
    row: 0,
    col: 6,
    name: "Atlantic Ave",
    type: "property",
    color: "#a16207",
  },
  {
    id: 27,
    row: 0,
    col: 7,
    name: "Ventnor Ave",
    type: "property",
    color: "#a16207",
  },
  { id: 28, row: 0, col: 8, name: "Water Works", type: "utility", icon: "💧" },
  {
    id: 29,
    row: 0,
    col: 9,
    name: "Marvin Gdns",
    type: "property",
    color: "#a16207",
  },
  {
    id: 30,
    row: 0,
    col: 10,
    corner: true,
    name: "Go To Jail",
    type: "gotojail",
    icon: "🚔",
  },
  {
    id: 31,
    row: 1,
    col: 10,
    name: "Pacific Ave",
    type: "property",
    color: "#15803d",
  },
  {
    id: 32,
    row: 2,
    col: 10,
    name: "N Carolina",
    type: "property",
    color: "#15803d",
  },
  { id: 33, row: 3, col: 10, name: "Comm Chest", type: "chest", icon: "📦" },
  {
    id: 34,
    row: 4,
    col: 10,
    name: "Penn Ave",
    type: "property",
    color: "#15803d",
  },
  { id: 35, row: 5, col: 10, name: "Short Line", type: "railroad", icon: "🚂" },
  { id: 36, row: 6, col: 10, name: "Chance", type: "chance", icon: "?" },
  {
    id: 37,
    row: 7,
    col: 10,
    name: "Park Place",
    type: "property",
    color: "#1d4ed8",
  },
  { id: 38, row: 8, col: 10, name: "Luxury Tax", type: "tax", icon: "💸" },
  {
    id: 39,
    row: 9,
    col: 10,
    name: "Boardwalk",
    type: "property",
    color: "#1d4ed8",
  },
];

const BOARD_PRICES = {
  1: 60,
  3: 60,
  6: 100,
  8: 100,
  9: 120,
  11: 140,
  13: 140,
  14: 160,
  16: 180,
  18: 180,
  19: 200,
  21: 220,
  23: 220,
  24: 240,
  26: 260,
  27: 260,
  29: 280,
  31: 300,
  32: 300,
  34: 320,
  37: 350,
  39: 400,
  5: 200,
  15: 200,
  25: 200,
  35: 200,
  12: 150,
  28: 150,
};

const TOKENS = ["🎩", "🚂", "🐕", "👢", "🎲", "🚗", "⚓", "🏆"];
const PCOLORS = [
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];

const $ = (n) => `$${Number(n || 0).toLocaleString()}`;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#0f1117",
    color: "#fff",
    fontFamily: "'Inter',system-ui,sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    background: "#161b27",
    borderBottom: "1px solid #1e2535",
    padding: "0 20px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  logoText: { fontWeight: 800, fontSize: 18, letterSpacing: 1, color: "#fff" },
  badge: {
    background: "#1e2535",
    fontSize: 11,
    padding: "2px 10px",
    borderRadius: 20,
    color: "#6b7280",
    fontWeight: 600,
  },
  main: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },
  board_wrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    overflow: "auto",
    background: "#0f1117",
    minWidth: 0,
  },
  sidebar: {
    width: 300,
    minWidth: 260,
    maxWidth: 340,
    background: "#161b27",
    borderLeft: "1px solid #1e2535",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sideScroll: { flex: 1, overflowY: "auto", overflowX: "hidden" },
  section: { padding: "14px 16px", borderBottom: "1px solid #1e2535" },
  sLabel: {
    color: "#374151",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 8,
  },
  card: {
    background: "#0f1117",
    border: "1px solid #1e2535",
    borderRadius: 12,
    padding: 14,
  },
  input: {
    width: "100%",
    background: "#0f1117",
    border: "1px solid #1e2535",
    borderRadius: 9,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  btn: (bg = "#374151", full = true) => ({
    width: full ? "100%" : "auto",
    background: bg,
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  }),
  greenBtn: {
    width: "100%",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    border: "none",
    padding: "13px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    letterSpacing: 1,
  },
  disabledBtn: {
    width: "100%",
    background: "#1e2535",
    color: "#4b5563",
    border: "none",
    padding: "13px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "not-allowed",
    letterSpacing: 1,
  },
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [game, setGame] = useState(null);
  const [myId, setMyId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("🎩");
  const [err, setErr] = useState("");
  const [bidAmt, setBidAmt] = useState("");
  const [showTrade, setShowTrade] = useState(false);
  const [trade, setTrade] = useState({
    to: "",
    offerMoney: 0,
    wantMoney: 0,
    offerProps: [],
    wantProps: [],
  });
  const [sideTab, setSideTab] = useState("actions"); // actions | players | log
  const logRef = useRef(null);

  useEffect(() => {
    const s = io(SERVER_URL, { transports: ["websocket", "polling"] });
    s.on("connect", () => {
      setConnected(true);
      setMyId(s.id);
    });
    s.on("disconnect", () => setConnected(false));
    s.on("gameState", (g) => setGame(g));
    s.on("err", (m) => {
      setErr(m);
      setTimeout(() => setErr(""), 3000);
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [game?.log]);

  const emit = useCallback(
    (ev, data = {}) => socket?.emit(ev, { roomId, ...data }),
    [socket, roomId],
  );

  if (!connected) return <Splash />;
  if (!game || game.phase === "lobby")
    return (
      <Lobby
        roomId={roomId}
        setRoomId={setRoomId}
        name={name}
        setName={setName}
        token={token}
        setToken={setToken}
        game={game}
        myId={myId}
        err={err}
        onJoin={() => emit("joinRoom", { playerName: name, token })}
        onStart={() => emit("startGame")}
      />
    );
  if (game.phase === "ended") {
    const w = game.players.find((p) => p.id === game.winner);
    return <WinScreen winner={w} />;
  }

  const me = game.players.find((p) => p.id === myId);
  const cp = game.players[game.currentPlayerIndex];
  const isMyTurn = cp?.id === myId;
  const myProps = Object.entries(game.properties || {}).filter(
    ([, p]) => p.owner === myId,
  );

  return (
    <div style={S.app}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <div style={S.logoBox}>🎩</div>
          <span style={S.logoText}>MONOPOLY</span>
          <span style={S.badge}>ONLINE</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ ...S.badge, color: "#9ca3af" }}>
            Room: <b style={{ color: "#fff" }}>{roomId}</b>
          </div>
          {me && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#1e2535",
                padding: "5px 12px",
                borderRadius: 20,
              }}
            >
              <span style={{ fontSize: 16 }}>{me.token}</span>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{me.name}</span>
              <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13 }}>
                {$(me.money)}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* ERROR TOAST */}
      {err && (
        <div
          style={{
            position: "fixed",
            top: 66,
            right: 16,
            background: "#ef4444",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 10,
            zIndex: 999,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
          }}
        >
          ⚠ {err}
        </div>
      )}

      <div style={S.main}>
        {/* BOARD */}
        <div style={S.board_wrap}>
          <Board game={game} myId={myId} />
        </div>

        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          {/* Turn banner */}
          <div
            style={{
              background: isMyTurn
                ? "linear-gradient(135deg,#052e16,#064e3b)"
                : "#1a2035",
              padding: "14px 16px",
              borderBottom: "1px solid #1e2535",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#374151",
                marginBottom: 8,
              }}
            >
              CURRENT TURN
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "#0f1117",
                  border: `2px solid ${isMyTurn ? "#22c55e" : "#1e2535"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {cp?.token}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cp?.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isMyTurn ? "#22c55e" : "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {isMyTurn ? "✦ Your turn!" : "Waiting..."}
                </div>
              </div>
              {game.lastRoll && (
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  <DieComp v={game.lastRoll[0]} />
                  <DieComp v={game.lastRoll[1]} />
                </div>
              )}
            </div>
            {game.pendingCard && (
              <div
                style={{
                  marginTop: 10,
                  background: "rgba(0,0,0,0.35)",
                  borderRadius: 9,
                  padding: "9px 12px",
                  border: "1px solid #2d3748",
                }}
              >
                <div
                  style={{
                    color:
                      game.pendingCard.deck === "chance"
                        ? "#fbbf24"
                        : "#60a5fa",
                    fontSize: 10,
                    fontWeight: 700,
                    marginBottom: 3,
                  }}
                >
                  {game.pendingCard.deck === "chance"
                    ? "🃏 CHANCE"
                    : "📦 COMMUNITY CHEST"}
                </div>
                <div
                  style={{ color: "#e2e8f0", fontSize: 12, lineHeight: 1.5 }}
                >
                  {game.pendingCard.text}
                </div>
              </div>
            )}
          </div>

          {/* Pending trade */}
          {game.pendingTrade?.to === myId && (
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #1e2535",
                flexShrink: 0,
              }}
            >
              <TradeReview
                trade={game.pendingTrade}
                players={game.players}
                onAccept={() => emit("acceptTrade")}
                onDecline={() => emit("declineTrade")}
              />
            </div>
          )}

          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #1e2535",
              flexShrink: 0,
            }}
          >
            {[
              ["actions", "⚡ Actions"],
              ["players", "👥 Players"],
              ["log", "📋 Log"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSideTab(k)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background: sideTab === k ? "#0f1117" : "transparent",
                  color: sideTab === k ? "#22c55e" : "#4b5563",
                  borderBottom:
                    sideTab === k
                      ? "2px solid #22c55e"
                      : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={S.sideScroll}>
            {/* ACTIONS TAB */}
            {sideTab === "actions" && (
              <div style={S.section}>
                {isMyTurn ? (
                  <Actions
                    game={game}
                    me={me}
                    emit={emit}
                    bidAmt={bidAmt}
                    setBidAmt={setBidAmt}
                    showTrade={showTrade}
                    setShowTrade={setShowTrade}
                    trade={trade}
                    setTrade={setTrade}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: "#4b5563",
                      fontSize: 13,
                    }}
                  >
                    Waiting for {cp?.name}...
                  </div>
                )}
                {/* My properties always visible */}
                {myProps.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={S.sLabel}>MY PROPERTIES</div>
                    <MyProps props={myProps} isMyTurn={isMyTurn} emit={emit} />
                  </div>
                )}
              </div>
            )}

            {/* PLAYERS TAB */}
            {sideTab === "players" && (
              <div style={S.section}>
                {game.players.map((p, i) => (
                  <PlayerRow
                    key={p.id}
                    p={p}
                    isMe={p.id === myId}
                    isCurrent={p.id === cp?.id}
                    color={PCOLORS[i % PCOLORS.length]}
                    propCount={
                      Object.values(game.properties || {}).filter(
                        (x) => x.owner === p.id,
                      ).length
                    }
                  />
                ))}
              </div>
            )}

            {/* LOG TAB */}
            {sideTab === "log" && (
              <div
                style={{
                  ...S.section,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div ref={logRef} style={{ maxHeight: 400, overflowY: "auto" }}>
                  {(game.log || [])
                    .slice()
                    .reverse()
                    .map((l, i) => (
                      <div
                        key={i}
                        style={{
                          color: "#6b7280",
                          fontSize: 11,
                          padding: "4px 0",
                          borderBottom: "1px solid #111827",
                          lineHeight: 1.5,
                        }}
                      >
                        {l}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── BOARD ────────────────────────────────────────────────────────────────────
function Board({ game, myId }) {
  const { players, properties } = game;
  const ref = useRef(null);
  const [size, setSize] = useState(560);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize(Math.max(260, Math.min(width - 8, height - 8, 640)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const C = Math.round(size * 0.122),
    S2 = Math.round((size - C * 2) / 9);
  const TOTAL = C * 2 + S2 * 9;

  const byCell = {};
  players.forEach((p) => {
    if (!byCell[p.position]) byCell[p.position] = [];
    byCell[p.position].push(p);
  });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: TOTAL,
          height: TOTAL,
          flexShrink: 0,
          border: "2px solid #1e2535",
          borderRadius: 8,
          boxShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 0 1px #0f1117",
          background: "#0d1520",
          overflow: "hidden",
        }}
      >
        {CELLS.map((cell) => {
          const isC = !!cell.corner;
          const w = isC ? C : S2,
            h = isC ? C : S2;
          const left =
            cell.col === 0
              ? 0
              : cell.col === 10
                ? TOTAL - C
                : C + (cell.col - 1) * S2;
          const top =
            cell.row === 0
              ? 0
              : cell.row === 10
                ? TOTAL - C
                : C + (cell.row - 1) * S2;
          const prop = properties?.[cell.id];
          const ownerIdx = prop?.owner
            ? players.findIndex((p) => p.id === prop.owner)
            : -1;
          const here = byCell[cell.id] || [];
          const barH = Math.max(8, Math.round(h * 0.19));
          const fs = Math.max(5, Math.round(TOTAL * 0.013));

          return (
            <div
              key={cell.id}
              style={{
                position: "absolute",
                left,
                top,
                width: w,
                height: h,
                border: "1px solid #1e2535",
                background: isC ? "#111827" : "#13192a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                overflow: "hidden",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              {/* Color bar */}
              {cell.color && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: barH,
                    background: cell.color,
                    opacity: prop?.mortgaged ? 0.2 : 0.9,
                  }}
                />
              )}

              {/* Owner glow dot */}
              {ownerIdx >= 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: cell.color ? barH + 2 : 2,
                    right: 2,
                    width: Math.max(5, Math.round(w * 0.13)),
                    height: Math.max(5, Math.round(w * 0.13)),
                    borderRadius: "50%",
                    background: PCOLORS[ownerIdx % PCOLORS.length],
                    boxShadow: `0 0 5px ${PCOLORS[ownerIdx % PCOLORS.length]}`,
                  }}
                />
              )}

              {/* Houses/hotel */}
              {prop?.houses > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: cell.color ? barH + 1 : 2,
                    left: 1,
                    fontSize: Math.max(6, Math.round(w * 0.16)),
                    lineHeight: 1,
                  }}
                >
                  {prop.houses === 5 ? "🏨" : "🏠".repeat(prop.houses)}
                </div>
              )}

              {/* Corner icon */}
              {isC && (
                <div
                  style={{
                    fontSize: Math.round(C * 0.32),
                    marginBottom: 4,
                    color: "#e2e8f0",
                  }}
                >
                  {cell.icon}
                </div>
              )}

              {/* Name */}
              <div
                style={{
                  fontSize: fs,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  padding: "1px 2px",
                  marginTop: cell.color ? barH + 1 : isC ? 0 : 2,
                  color: isC ? "#d1d5db" : "#6b7280",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {cell.name}
              </div>

              {/* Price */}
              {BOARD_PRICES[cell.id] && !isC && (
                <div
                  style={{
                    fontSize: Math.max(5, fs - 1),
                    color: "#374151",
                    marginBottom: 2,
                  }}
                >
                  ${BOARD_PRICES[cell.id]}
                </div>
              )}

              {/* Players */}
              {here.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 1,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 0,
                  }}
                >
                  {here.map((p) => (
                    <span
                      key={p.id}
                      style={{
                        fontSize: Math.max(10, Math.round(w * 0.28)),
                        filter: p.inJail ? "grayscale(1) opacity(0.4)" : "none",
                        textShadow: `0 0 6px ${PCOLORS[players.findIndex((x) => x.id === p.id) % PCOLORS.length]}`,
                      }}
                    >
                      {p.token}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* CENTER */}
        <div
          style={{
            position: "absolute",
            left: C,
            top: C,
            width: TOTAL - C * 2,
            height: TOTAL - C * 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "linear-gradient(135deg,#0a0f1a,#111827)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: Math.round(TOTAL * 0.055),
              fontWeight: 800,
              color: "#22c55e",
              letterSpacing: Math.round(TOTAL * 0.006),
              transform: "rotate(-35deg)",
              textShadow: "0 0 30px rgba(34,197,94,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            MONOPOLY
          </div>
          <div
            style={{
              fontSize: Math.max(7, Math.round(TOTAL * 0.012)),
              color: "#1f2937",
              letterSpacing: Math.round(TOTAL * 0.005),
              transform: "rotate(-35deg)",
              marginTop: -2,
              whiteSpace: "nowrap",
            }}
          >
            PROPERTY TRADING GAME
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DIE ─────────────────────────────────────────────────────────────────────
function DieComp({ v }) {
  const f = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  return (
    <div
      style={{
        width: 30,
        height: 30,
        background: "#fff",
        borderRadius: 7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        color: "#111",
      }}
    >
      {f[v] || v}
    </div>
  );
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
function Actions({
  game,
  me,
  emit,
  bidAmt,
  setBidAmt,
  showTrade,
  setShowTrade,
  trade,
  setTrade,
}) {
  const { turnPhase, auctionState } = game;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {turnPhase === "roll" &&
        (me?.inJail ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div
              style={{
                color: "#fb923c",
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 12px",
                background: "rgba(251,146,60,0.1)",
                borderRadius: 8,
                border: "1px solid rgba(251,146,60,0.2)",
              }}
            >
              🔒 In Jail — Turn {(me.jailTurns || 0) + 1}/3
            </div>
            <Btn onClick={() => emit("rollDice")} bg="#3b82f6">
              Roll for Doubles
            </Btn>
            <Btn onClick={() => emit("payJailFine")} bg="#ef4444">
              Pay $50 Fine
            </Btn>
            {me.hasJailCard && (
              <Btn onClick={() => emit("useJailCard")} bg="#8b5cf6">
                Use Jail Free Card
              </Btn>
            )}
          </div>
        ) : (
          <Btn onClick={() => emit("rollDice")} bg="#22c55e" big>
            🎲 ROLL DICE
          </Btn>
        ))}

      {turnPhase === "buy" &&
        (() => {
          const cell = CELLS[me?.position];
          const price = BOARD_PRICES[me?.position];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div
                style={{
                  background: "#0f1117",
                  border: "1px solid #1e2535",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div
                  style={{ color: "#9ca3af", fontSize: 11, marginBottom: 4 }}
                >
                  LAND ON
                </div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>
                  {cell?.name}
                </div>
                {price && (
                  <div
                    style={{
                      color: "#22c55e",
                      fontSize: 13,
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    Price: ${price}
                  </div>
                )}
              </div>
              <Btn onClick={() => emit("buyProperty")} bg="#22c55e" big>
                ✅ Buy Property
              </Btn>
              <Btn onClick={() => emit("declineBuy")} bg="#4b5563">
                🔨 Auction
              </Btn>
            </div>
          );
        })()}

      {turnPhase === "auction" && auctionState && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <div
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700 }}>
              🔨 AUCTION
            </div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {CELLS[auctionState.propertyId]?.name}
            </div>
            <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 3 }}>
              High bid:{" "}
              <b style={{ color: "#fff" }}>{$(auctionState.highBid)}</b>
            </div>
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <input
              type="number"
              value={bidAmt}
              onChange={(e) => setBidAmt(e.target.value)}
              placeholder="Your bid $"
              style={{
                flex: 1,
                background: "#0f1117",
                border: "1px solid #374151",
                borderRadius: 9,
                padding: "9px 12px",
                color: "#fff",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              onClick={() => emit("auctionBid", { amount: +bidAmt })}
              style={{
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "9px 16px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Bid
            </button>
          </div>
          <Btn onClick={() => emit("auctionEnd")} bg="#374151">
            End Auction
          </Btn>
        </div>
      )}

      {(turnPhase === "endturn" || turnPhase === "buy") && (
        <Btn onClick={() => setShowTrade(!showTrade)} bg="#6366f1">
          🤝 Offer Trade
        </Btn>
      )}

      {showTrade && (
        <TradeUI
          me={game.players.find((p) => p.id)}
          players={game.players}
          properties={game.properties}
          state={trade}
          setState={setTrade}
          onSend={() => {
            emit("offerTrade", {
              toPlayerId: trade.to,
              offerMoney: trade.offerMoney,
              offerProperties: trade.offerProps,
              wantMoney: trade.wantMoney,
              wantProperties: trade.wantProps,
            });
            setShowTrade(false);
          }}
          onClose={() => setShowTrade(false)}
        />
      )}

      {turnPhase === "endturn" && (
        <Btn onClick={() => emit("endTurn")} bg="#1f2937">
          ⏭ End Turn
        </Btn>
      )}
    </div>
  );
}

// ─── MY PROPS ─────────────────────────────────────────────────────────────────
function MyProps({ props, isMyTurn, emit }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {props.map(([id, prop]) => {
        const cell = CELLS.find((c) => c.id === +id);
        if (!cell) return null;
        return (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 9px",
              background: "#0f1117",
              borderRadius: 8,
              border: "1px solid #1e2535",
            }}
          >
            {cell.color && (
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: cell.color,
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                color: prop.mortgaged ? "#374151" : "#d1d5db",
                fontSize: 12,
                flex: 1,
                textDecoration: prop.mortgaged ? "line-through" : "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {cell.name}
            </span>
            {prop.houses > 0 && (
              <span style={{ fontSize: 10, flexShrink: 0 }}>
                {prop.houses === 5 ? "🏨" : `🏠×${prop.houses}`}
              </span>
            )}
            {isMyTurn && (
              <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                {!prop.mortgaged &&
                  prop.houses === 0 &&
                  cell.type === "property" && (
                    <Tiny
                      onClick={() => emit("mortgage", { propertyId: +id })}
                      bg="#f97316"
                    >
                      M
                    </Tiny>
                  )}
                {prop.mortgaged && (
                  <Tiny
                    onClick={() => emit("unmortgage", { propertyId: +id })}
                    bg="#3b82f6"
                  >
                    UM
                  </Tiny>
                )}
                {!prop.mortgaged && cell.color && (
                  <Tiny
                    onClick={() => emit("buildHouse", { propertyId: +id })}
                    bg="#22c55e"
                  >
                    +
                  </Tiny>
                )}
                {prop.houses > 0 && (
                  <Tiny
                    onClick={() => emit("sellHouse", { propertyId: +id })}
                    bg="#ef4444"
                  >
                    −
                  </Tiny>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PLAYER ROW ───────────────────────────────────────────────────────────────
function PlayerRow({ p, isMe, isCurrent, color, propCount }) {
  const cell = CELLS.find((c) => c.id === p.position);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px",
        marginBottom: 6,
        borderRadius: 10,
        background: isCurrent
          ? "rgba(34,197,94,0.07)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isCurrent ? "rgba(34,197,94,0.2)" : isMe ? "rgba(255,255,255,0.05)" : "transparent"}`,
        opacity: p.bankrupt ? 0.3 : 1,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: color + "18",
          border: `2px solid ${isCurrent ? color : "#1e2535"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {p.token}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 100,
            }}
          >
            {p.name}
          </span>
          {isMe && (
            <span
              style={{
                color: "#22c55e",
                fontSize: 9,
                fontWeight: 700,
                background: "rgba(34,197,94,0.1)",
                padding: "1px 6px",
                borderRadius: 10,
                flexShrink: 0,
              }}
            >
              YOU
            </span>
          )}
          {p.inJail && (
            <span style={{ color: "#fb923c", fontSize: 10 }}>🔒</span>
          )}
        </div>
        <div
          style={{
            color: "#4b5563",
            fontSize: 11,
            marginTop: 1,
            whiteSpace: "nowrap",
          }}
        >
          {cell?.name} ·{" "}
          <span style={{ color: "#22c55e", fontWeight: 700 }}>
            {$(p.money)}
          </span>
        </div>
      </div>
      <div
        style={{
          color: "#374151",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {propCount}🏠
      </div>
    </div>
  );
}

// ─── TRADE UI ─────────────────────────────────────────────────────────────────
function TradeUI({
  players = [],
  properties = {},
  state,
  setState,
  onSend,
  onClose,
}) {
  const me = players.find((p) => p); // will be fixed below
  const others = players.filter((p) => !p.bankrupt);
  const myId = state.myId;
  const myProps = Object.entries(properties).filter(
    ([, p]) => p.owner === myId,
  );
  const theirProps = state.to
    ? Object.entries(properties).filter(([, p]) => p.owner === state.to)
    : [];
  const toggle = (id, arr, key) =>
    setState((s) => ({
      ...s,
      [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    }));

  return (
    <div
      style={{
        background: "#0f1117",
        border: "1px solid #312e81",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ color: "#818cf8", fontSize: 12, fontWeight: 700 }}>
          🤝 TRADE OFFER
        </span>
        <button
          onClick={onClose}
          style={{
            color: "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      <select
        value={state.to}
        onChange={(e) => setState((s) => ({ ...s, to: e.target.value }))}
        style={{
          width: "100%",
          background: "#161b27",
          border: "1px solid #312e81",
          borderRadius: 8,
          padding: "8px 10px",
          color: "#fff",
          fontSize: 13,
          marginBottom: 10,
          outline: "none",
        }}
      >
        <option value="">— Select player —</option>
        {others.map((p) => (
          <option key={p.id} value={p.id}>
            {p.token} {p.name}
          </option>
        ))}
      </select>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          [
            "YOU OFFER",
            state.offerMoney,
            "offerMoney",
            myProps,
            state.offerProps,
            "offerProps",
          ],
          [
            "YOU WANT",
            state.wantMoney,
            "wantMoney",
            theirProps,
            state.wantProps,
            "wantProps",
          ],
        ].map(([label, money, moneyKey, props, checked, propsKey]) => (
          <div key={label}>
            <div
              style={{
                color: "#818cf8",
                fontSize: 10,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {label}
            </div>
            <input
              type="number"
              min={0}
              value={money}
              onChange={(e) =>
                setState((s) => ({ ...s, [moneyKey]: +e.target.value }))
              }
              placeholder="$"
              style={{
                width: "100%",
                background: "#161b27",
                border: "1px solid #1e2535",
                borderRadius: 6,
                padding: "5px 8px",
                color: "#fff",
                fontSize: 12,
                marginBottom: 6,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {props.map(([id]) => {
              const c = CELLS.find((x) => x.id === +id);
              return (
                <label
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 0",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked.includes(id)}
                    onChange={() => toggle(id, checked, propsKey)}
                    style={{ accentColor: "#6366f1" }}
                  />
                  {c?.color && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: c.color,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: "#d1d5db",
                      fontSize: 11,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c?.name}
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <button
        onClick={onSend}
        disabled={!state.to}
        style={{
          marginTop: 10,
          width: "100%",
          background: state.to ? "#6366f1" : "#1e2535",
          color: state.to ? "#fff" : "#4b5563",
          border: "none",
          padding: "10px",
          borderRadius: 9,
          fontWeight: 700,
          cursor: state.to ? "pointer" : "not-allowed",
          fontSize: 13,
        }}
      >
        Send Offer
      </button>
    </div>
  );
}

function TradeReview({ trade, players, onAccept, onDecline }) {
  const from = players.find((p) => p.id === trade.from);
  return (
    <div
      style={{
        background: "rgba(99,102,241,0.08)",
        border: "1px solid #4f46e5",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          color: "#818cf8",
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        🤝 Trade from <b>{from?.name}</b>
      </div>
      <div style={{ color: "#d1d5db", fontSize: 12, marginBottom: 3 }}>
        Offers: {$(trade.offerMoney)} + {trade.offerProperties?.length} props
      </div>
      <div style={{ color: "#d1d5db", fontSize: 12, marginBottom: 12 }}>
        Wants: {$(trade.wantMoney)} + {trade.wantProperties?.length} props
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onAccept}
          style={{
            flex: 1,
            background: "#22c55e",
            color: "#fff",
            border: "none",
            padding: 9,
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          style={{
            flex: 1,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: 9,
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
        }}
      >
        🎩
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 26,
          color: "#fff",
          letterSpacing: 2,
        }}
      >
        MONOPOLY ONLINE
      </div>
      <div style={{ color: "#4b5563", fontSize: 14 }}>
        Connecting to server...
      </div>
    </div>
  );
}

// ─── LOBBY ────────────────────────────────────────────────────────────────────
function Lobby({
  roomId,
  setRoomId,
  name,
  setName,
  token,
  setToken,
  game,
  myId,
  onJoin,
  onStart,
  err,
}) {
  const joined = game?.players?.some((p) => p.id === myId);
  const isHost = game?.players?.[0]?.id === myId;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      {/* bg glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(34,197,94,0.07),transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(99,102,241,0.06),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 70,
              height: 70,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 14px",
              boxShadow: "0 0 40px rgba(34,197,94,0.3)",
            }}
          >
            🎩
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 34,
              color: "#fff",
              letterSpacing: 2,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            MONOPOLY
          </div>
          <div
            style={{
              color: "#22c55e",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 4,
              marginTop: 4,
            }}
          >
            ONLINE MULTIPLAYER
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#161b27",
            border: "1px solid #1e2535",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          {err && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                borderRadius: 9,
                padding: "10px 14px",
                marginBottom: 14,
                fontSize: 13,
              }}
            >
              {err}
            </div>
          )}

          <LobbyField
            label="ROOM ID"
            value={roomId}
            onChange={setRoomId}
            placeholder="Enter room code"
          />
          <LobbyField
            label="YOUR NAME"
            value={name}
            onChange={setName}
            placeholder="Your nickname"
          />

          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                color: "#4b5563",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              CHOOSE YOUR TOKEN
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TOKENS.map((t) => (
                <button
                  key={t}
                  onClick={() => setToken(t)}
                  style={{
                    width: 42,
                    height: 42,
                    fontSize: 20,
                    borderRadius: 10,
                    border: `2px solid ${token === t ? "#22c55e" : "#1e2535"}`,
                    background: token === t ? "rgba(34,197,94,0.1)" : "#0f1117",
                    cursor: "pointer",
                    transform: token === t ? "scale(1.12)" : "scale(1)",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {!joined && (
            <button
              onClick={onJoin}
              disabled={!roomId || !name}
              style={!roomId || !name ? S.disabledBtn : S.greenBtn}
            >
              JOIN ROOM
            </button>
          )}

          {game?.players?.length > 0 && (
            <div
              style={{
                marginTop: 18,
                background: "#0f1117",
                borderRadius: 12,
                padding: 14,
                border: "1px solid #1e2535",
              }}
            >
              <div
                style={{
                  color: "#374151",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                IN ROOM · {game.players.length}/8
              </div>
              {game.players.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 0",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: PCOLORS[i % PCOLORS.length] + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {p.token}
                  </div>
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13,
                      flex: 1,
                    }}
                  >
                    {p.name}
                  </span>
                  {p.id === myId && (
                    <span
                      style={{
                        color: "#22c55e",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      YOU
                    </span>
                  )}
                  {i === 0 && p.id !== myId && (
                    <span
                      style={{
                        color: "#fbbf24",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      HOST
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {joined && isHost && game.players.length >= 2 && (
            <button onClick={onStart} style={{ ...S.greenBtn, marginTop: 16 }}>
              ▶ START GAME
            </button>
          )}
          {joined && isHost && game.players.length < 2 && (
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#4b5563",
                fontSize: 13,
                padding: 10,
              }}
            >
              ⏳ Waiting for more players...
            </div>
          )}
          {joined && !isHost && (
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#4b5563",
                fontSize: 13,
                padding: 10,
              }}
            >
              ⏳ Waiting for host to start...
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            color: "#1f2937",
            fontSize: 12,
          }}
        >
          Share the Room ID with friends to play together
        </div>
      </div>
    </div>
  );
}

function LobbyField({ label, value, onChange, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          color: "#4b5563",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          marginBottom: 7,
        }}
      >
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...S.input,
          borderColor: focus ? "#22c55e" : "#1e2535",
          transition: "border-color 0.15s",
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
}

// ─── WIN SCREEN ───────────────────────────────────────────────────────────────
function WinScreen({ winner }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ fontSize: 80 }}>🏆</div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 38,
          color: "#fbbf24",
          letterSpacing: 2,
        }}
      >
        {winner?.name || "Someone"} Wins!
      </div>
      <div style={{ fontSize: 48 }}>{winner?.token}</div>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 8,
          ...S.greenBtn,
          width: "auto",
          padding: "14px 40px",
          fontSize: 16,
          borderRadius: 14,
        }}
      >
        PLAY AGAIN
      </button>
    </div>
  );
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, bg = "#374151", big = false }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        background: bg,
        color: "#fff",
        border: "none",
        padding: big ? "13px 16px" : "10px 16px",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: big ? 15 : 13,
        cursor: "pointer",
        letterSpacing: big ? 1 : 0,
        opacity: hover ? 1 : 0.88,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function Tiny({ children, onClick, bg }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        width: 20,
        height: 20,
        borderRadius: 5,
        fontSize: 10,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
