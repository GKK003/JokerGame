import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "https://jokergame-1.onrender.com"; // ← replace with your Render URL

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CELLS = [
  {
    id: 0,
    row: 10,
    col: 10,
    corner: true,
    name: "GO",
    type: "go",
    icon: "★",
    bg: "#1a472a",
  },
  {
    id: 1,
    row: 10,
    col: 9,
    name: "Mediterranean",
    type: "property",
    color: "#92400e",
  },
  { id: 2, row: 10, col: 8, name: "Comm. Chest", type: "chest", icon: "📦" },
  {
    id: 3,
    row: 10,
    col: 7,
    name: "Baltic Ave",
    type: "property",
    color: "#92400e",
  },
  { id: 4, row: 10, col: 6, name: "Income Tax", type: "tax", icon: "💸" },
  { id: 5, row: 10, col: 5, name: "Reading RR", type: "railroad", icon: "✈️" },
  {
    id: 6,
    row: 10,
    col: 4,
    name: "Oriental Ave",
    type: "property",
    color: "#0e7490",
  },
  { id: 7, row: 10, col: 3, name: "Chance", type: "chance", icon: "?" },
  {
    id: 8,
    row: 10,
    col: 2,
    name: "Vermont Ave",
    type: "property",
    color: "#0e7490",
  },
  {
    id: 9,
    row: 10,
    col: 1,
    name: "Connecticut",
    type: "property",
    color: "#0e7490",
  },
  {
    id: 10,
    row: 10,
    col: 0,
    corner: true,
    name: "Prison",
    type: "jail",
    icon: "☠",
    bg: "#1e1b4b",
  },
  {
    id: 11,
    row: 9,
    col: 0,
    name: "St. Charles",
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
  { id: 15, row: 5, col: 0, name: "Penn RR", type: "railroad", icon: "✈️" },
  {
    id: 16,
    row: 4,
    col: 0,
    name: "St. James",
    type: "property",
    color: "#c2410c",
  },
  { id: 17, row: 3, col: 0, name: "Comm. Chest", type: "chest", icon: "📦" },
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
    name: "New York",
    type: "property",
    color: "#c2410c",
  },
  {
    id: 20,
    row: 0,
    col: 0,
    corner: true,
    name: "Vacation",
    type: "freeparking",
    icon: "🌴",
    bg: "#064e3b",
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
  { id: 25, row: 0, col: 5, name: "B&O RR", type: "railroad", icon: "✈️" },
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
  { id: 28, row: 0, col: 8, name: "Water Co", type: "utility", icon: "💧" },
  {
    id: 29,
    row: 0,
    col: 9,
    name: "Marvin Gardens",
    type: "property",
    color: "#a16207",
  },
  {
    id: 30,
    row: 0,
    col: 10,
    corner: true,
    name: "Go to Prison",
    type: "gotojail",
    icon: "🚔",
    bg: "#4c1d95",
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
    name: "N. Carolina",
    type: "property",
    color: "#15803d",
  },
  { id: 33, row: 3, col: 10, name: "Comm. Chest", type: "chest", icon: "📦" },
  {
    id: 34,
    row: 4,
    col: 10,
    name: "Penn Ave",
    type: "property",
    color: "#15803d",
  },
  { id: 35, row: 5, col: 10, name: "Short Line", type: "railroad", icon: "✈️" },
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

const PRICES = {
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

const $m = (n) => `$${Number(n || 0).toLocaleString()}`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [socket, setSocket] = useState(null);
  const [conn, setConn] = useState(false);
  const [game, setGame] = useState(null);
  const [myId, setMyId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("🎩");
  const [err, setErr] = useState("");
  const [bidAmt, setBid] = useState("");
  const [showTrade, setTrade] = useState(false);
  const [tf, setTF] = useState({
    to: "",
    offerM: 0,
    wantM: 0,
    offerP: [],
    wantP: [],
  });
  const [chat, setChat] = useState([]);
  const [chatMsg, setChatMsg] = useState("");
  const logRef = useRef(null);

  useEffect(() => {
    const s = io(SERVER_URL, { transports: ["websocket", "polling"] });
    s.on("connect", () => {
      setConn(true);
      setMyId(s.id);
    });
    s.on("disconnect", () => setConn(false));
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

  if (!conn) return <Splash />;
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

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChat((c) => [
      ...c,
      { name: me?.name || "?", msg: chatMsg, token: me?.token },
    ]);
    setChatMsg("");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#13111a",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Inter',system-ui,sans-serif",
        color: "#fff",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── TOP NAV ── */}
      <nav
        style={{
          height: 52,
          background: "#1a1625",
          borderBottom: "1px solid #2d2640",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🎩
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 17,
              color: "#fff",
              letterSpacing: 1,
            }}
          >
            MONOPOLY
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
              background: "#2d2640",
              padding: "2px 8px",
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            ONLINE
          </span>
        </div>
        <div style={{ flex: 1 }} />
        {/* room url box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#2d2640",
            borderRadius: 10,
            padding: "6px 12px",
            fontSize: 13,
          }}
        >
          <span style={{ color: "#9ca3af" }}>Room:</span>
          <span style={{ color: "#a78bfa", fontWeight: 700, letterSpacing: 1 }}>
            {roomId}
          </span>
          <button
            onClick={() => navigator.clipboard?.writeText(roomId)}
            style={{
              background: "#3d3550",
              border: "none",
              color: "#a78bfa",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Copy
          </button>
        </div>
        {me && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#2d2640",
              borderRadius: 10,
              padding: "6px 12px",
            }}
          >
            <span style={{ fontSize: 18 }}>{me.token}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>
                {me.name}
              </div>
              <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>
                {$m(me.money)}
              </div>
            </div>
          </div>
        )}
        {err && (
          <div
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ⚠ {err}
          </div>
        )}
      </nav>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* ── LEFT SIDEBAR ── */}
        <div
          style={{
            width: 260,
            background: "#1a1625",
            borderRight: "1px solid #2d2640",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Players */}
          <div
            style={{
              padding: "14px 14px 10px",
              borderBottom: "1px solid #2d2640",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              PLAYERS · {game.players.length}
            </div>
            {game.players.map((p, i) => (
              <PlayerCard
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

          {/* Chat */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 14px 6px",
                borderBottom: "1px solid #2d2640",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: 2,
                }}
              >
                CHAT
              </div>
            </div>
            <div
              ref={logRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* game log */}
              {(game.log || []).map((l, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    lineHeight: 1.5,
                    padding: "2px 0",
                  }}
                >
                  {l}
                </div>
              ))}
              {/* chat messages */}
              {chat.map((c, i) => (
                <div
                  key={"c" + i}
                  style={{
                    fontSize: 12,
                    color: "#d1d5db",
                    background: "#2d2640",
                    borderRadius: 8,
                    padding: "5px 8px",
                    marginTop: 2,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#a78bfa" }}>
                    {c.token} {c.name}:{" "}
                  </span>
                  {c.msg}
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "8px 14px",
                borderTop: "1px solid #2d2640",
                display: "flex",
                gap: 6,
              }}
            >
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Say something..."
                style={{
                  flex: 1,
                  background: "#2d2640",
                  border: "1px solid #3d3550",
                  borderRadius: 8,
                  padding: "7px 10px",
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <button
                onClick={sendChat}
                style={{
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* ── CENTER: BOARD ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#13111a",
            overflow: "hidden",
            position: "relative",
            padding: 8,
          }}
        >
          <Board
            game={game}
            myId={myId}
            isMyTurn={isMyTurn}
            emit={emit}
            bidAmt={bidAmt}
            setBid={setBid}
          />
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div
          style={{
            width: 280,
            background: "#1a1625",
            borderLeft: "1px solid #2d2640",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {/* Current turn */}
          <div
            style={{
              padding: "14px",
              borderBottom: "1px solid #2d2640",
              background: isMyTurn
                ? "linear-gradient(135deg,#052e16,#064e3b)"
                : "#1a1625",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              CURRENT TURN
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "#2d2640",
                  border: `2px solid ${isMyTurn ? "#22c55e" : "#3d3550"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {cp?.token}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
                  {cp?.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isMyTurn ? "#22c55e" : "#6b7280",
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  {isMyTurn ? "✦ Your turn!" : "Waiting..."}
                </div>
                <div
                  style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}
                >
                  {$m(cp?.money)}
                </div>
              </div>
            </div>
          </div>

          {/* Card drawn */}
          {game.pendingCard && (
            <div
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid #2d2640",
                background: "rgba(124,58,237,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color:
                    game.pendingCard.deck === "chance" ? "#fbbf24" : "#60a5fa",
                  letterSpacing: 2,
                  marginBottom: 5,
                }}
              >
                {game.pendingCard.deck === "chance"
                  ? "🃏 CHANCE"
                  : "📦 COMMUNITY CHEST"}
              </div>
              <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5 }}>
                {game.pendingCard.text}
              </div>
            </div>
          )}

          {/* Pending trade */}
          {game.pendingTrade?.to === myId && (
            <div
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid #2d2640",
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

          {/* Actions */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
            {isMyTurn ? (
              <Actions
                game={game}
                me={me}
                emit={emit}
                bidAmt={bidAmt}
                setBid={setBid}
                showTrade={showTrade}
                setTrade={setTrade}
                tf={tf}
                setTF={setTF}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "#4b5563",
                  fontSize: 13,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                Waiting for {cp?.name}...
              </div>
            )}

            {/* My properties */}
            {myProps.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  MY PROPERTIES
                </div>
                <MyProps props={myProps} isMyTurn={isMyTurn} emit={emit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOARD ────────────────────────────────────────────────────────────────────
function Board({ game, myId, isMyTurn, emit, bidAmt, setBid }) {
  const { players, properties, turnPhase, lastRoll, phase } = game;
  const wrapRef = useRef(null);
  const [size, setSize] = useState(620);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => {
      const { width, height } = e[0].contentRect;
      setSize(Math.floor(Math.min(width, height) - 16));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cp = game.players[game.currentPlayerIndex];
  const me = players.find((p) => p.id === myId);

  // board math
  const CORNER = Math.round(size * 0.13);
  const CELL = Math.round((size - CORNER * 2) / 9);
  const TOTAL = CORNER * 2 + CELL * 9;

  const byCell = {};
  players.forEach((p) => {
    if (!byCell[p.position]) byCell[p.position] = [];
    byCell[p.position].push(p);
  });

  return (
    <div
      ref={wrapRef}
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
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 0 0 3px #2d2640, 0 0 80px rgba(0,0,0,0.9)",
        }}
      >
        {/* CELLS */}
        {CELLS.map((cell) => {
          const isC = !!cell.corner;
          const w = isC ? CORNER : CELL,
            h = isC ? CORNER : CELL;
          const left =
            cell.col === 0
              ? 0
              : cell.col === 10
                ? TOTAL - CORNER
                : CORNER + (cell.col - 1) * CELL;
          const top =
            cell.row === 0
              ? 0
              : cell.row === 10
                ? TOTAL - CORNER
                : CORNER + (cell.row - 1) * CELL;
          const prop = properties?.[cell.id];
          const ownerIdx = prop?.owner
            ? players.findIndex((p) => p.id === prop.owner)
            : -1;
          const here = byCell[cell.id] || [];

          // determine rotation for side cells
          let rotate = "";
          if (!isC) {
            if (cell.col === 0) rotate = "rotate(90deg)";
            else if (cell.col === 10) rotate = "rotate(-90deg)";
            else if (cell.row === 0) rotate = "rotate(180deg)";
          }

          const barH = Math.max(10, Math.round(h * 0.22));
          const fs = Math.max(7, Math.round(TOTAL * 0.0115));
          const pricefs = Math.max(6, Math.round(TOTAL * 0.01));

          // cell bg color
          const cellBg =
            cell.bg ||
            (cell.type === "property"
              ? "#1e1b2e"
              : cell.type === "railroad" || cell.type === "utility"
                ? "#1a2035"
                : cell.type === "chance"
                  ? "#2d1b4e"
                  : cell.type === "chest"
                    ? "#1a2a3a"
                    : cell.type === "tax"
                      ? "#2a1a1a"
                      : "#1e1b2e");

          return (
            <div
              key={cell.id}
              style={{
                position: "absolute",
                left,
                top,
                width: w,
                height: h,
                background: cellBg,
                border: "1px solid #2d2640",
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
                    ...(cell.row === 10
                      ? { bottom: 0, left: 0, right: 0, height: barH }
                      : cell.row === 0
                        ? { top: 0, left: 0, right: 0, height: barH }
                        : cell.col === 0
                          ? { top: 0, bottom: 0, right: 0, width: barH }
                          : { top: 0, bottom: 0, left: 0, width: barH }),
                    background: cell.color,
                    opacity: prop?.mortgaged ? 0.25 : 1,
                    borderRadius: 2,
                  }}
                />
              )}

              {/* Owner dot */}
              {ownerIdx >= 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    width: Math.max(6, Math.round(w * 0.12)),
                    height: Math.max(6, Math.round(w * 0.12)),
                    borderRadius: "50%",
                    background: PCOLORS[ownerIdx % PCOLORS.length],
                    boxShadow: `0 0 6px ${PCOLORS[ownerIdx % PCOLORS.length]}`,
                    zIndex: 2,
                  }}
                />
              )}

              {/* Houses/hotel */}
              {prop?.houses > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3,
                    fontSize: Math.max(8, Math.round(w * 0.16)),
                    zIndex: 2,
                    lineHeight: 1,
                  }}
                >
                  {prop.houses === 5 ? "🏨" : "🏠".repeat(prop.houses)}
                </div>
              )}

              {/* CORNER cells */}
              {isC && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    padding: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: Math.round(CORNER * 0.3),
                      lineHeight: 1,
                      color: "#fff",
                    }}
                  >
                    {cell.icon}
                  </div>
                  <div
                    style={{
                      fontSize: Math.round(CORNER * 0.1),
                      fontWeight: 700,
                      color: "#e2e8f0",
                      marginTop: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {cell.name}
                  </div>
                </div>
              )}

              {/* NON-CORNER cells */}
              {!isC && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    padding: 2,
                    transform: rotate,
                    paddingTop: cell.color
                      ? cell.row === 0
                        ? barH + 2
                        : 4
                      : 4,
                    paddingBottom: cell.color
                      ? cell.row === 10
                        ? barH + 2
                        : 4
                      : 4,
                    paddingLeft: cell.color
                      ? cell.col === 0
                        ? barH + 2
                        : 2
                      : 2,
                    paddingRight: cell.color
                      ? cell.col === 10
                        ? barH + 2
                        : 2
                      : 2,
                  }}
                >
                  {/* special icon */}
                  {cell.icon && !cell.color && (
                    <div
                      style={{
                        fontSize: Math.round(CELL * 0.3),
                        lineHeight: 1,
                        marginBottom: 2,
                      }}
                    >
                      {cell.icon}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: fs,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: "#c4b5fd",
                      maxHeight: h * 0.55,
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                  >
                    {cell.name}
                  </div>
                  {PRICES[cell.id] && (
                    <div
                      style={{
                        fontSize: pricefs,
                        color: "#7c3aed",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      {PRICES[cell.id]}$
                    </div>
                  )}
                </div>
              )}

              {/* Player tokens */}
              {here.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: isC ? 4 : 2,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    zIndex: 5,
                  }}
                >
                  {here.map((p) => (
                    <span
                      key={p.id}
                      style={{
                        fontSize: Math.max(12, Math.round(w * 0.3)),
                        filter: p.inJail ? "grayscale(1) opacity(0.4)" : "none",
                        textShadow: `0 0 8px ${PCOLORS[players.findIndex((x) => x.id === p.id) % PCOLORS.length]}, 0 2px 4px rgba(0,0,0,0.8)`,
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

        {/* ── BOARD CENTER ── */}
        <div
          style={{
            position: "absolute",
            left: CORNER,
            top: CORNER,
            width: TOTAL - CORNER * 2,
            height: TOTAL - CORNER * 2,
            background: "linear-gradient(135deg,#0d0b14,#13111a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* MONOPOLY text */}
          <div
            style={{
              fontWeight: 800,
              fontSize: Math.round(TOTAL * 0.042),
              color: "#7c3aed",
              letterSpacing: Math.round(TOTAL * 0.005),
              textShadow: "0 0 40px rgba(124,58,237,0.5)",
              transform: "rotate(-35deg)",
              whiteSpace: "nowrap",
              position: "absolute",
              opacity: 0.15,
              pointerEvents: "none",
            }}
          >
            MONOPOLY
          </div>

          {/* DICE — big and prominent */}
          <div
            style={{
              display: "flex",
              gap: Math.round(TOTAL * 0.025),
              zIndex: 2,
            }}
          >
            {(game.lastRoll || [null, null]).map((v, i) => (
              <BigDie key={i} value={v} rolling={false} />
            ))}
          </div>

          {/* Action button in center */}
          {isMyTurn && game.turnPhase === "roll" && (
            <button
              onClick={() => emit("rollDice")}
              style={{
                background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
                color: "#fff",
                border: "none",
                borderRadius: Math.round(TOTAL * 0.018),
                padding: `${Math.round(TOTAL * 0.018)}px ${Math.round(TOTAL * 0.045)}px`,
                fontSize: Math.round(TOTAL * 0.025),
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: 1,
                boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
                zIndex: 3,
                whiteSpace: "nowrap",
              }}
            >
              🎲 ROLL DICE
            </button>
          )}

          {isMyTurn && game.turnPhase === "buy" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  color: "#a78bfa",
                  fontSize: Math.round(TOTAL * 0.02),
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Buy{" "}
                {CELLS[game.players.find((p) => p.id === myId)?.position]?.name}
                ?
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => emit("buyProperty")}
                  style={{
                    background: "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: `${Math.round(TOTAL * 0.014)}px ${Math.round(TOTAL * 0.03)}px`,
                    fontSize: Math.round(TOTAL * 0.02),
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✅ Buy
                </button>
                <button
                  onClick={() => emit("declineBuy")}
                  style={{
                    background: "#4b5563",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: `${Math.round(TOTAL * 0.014)}px ${Math.round(TOTAL * 0.03)}px`,
                    fontSize: Math.round(TOTAL * 0.02),
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🔨 Auction
                </button>
              </div>
            </div>
          )}

          {isMyTurn && game.turnPhase === "auction" && game.auctionState && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
                zIndex: 3,
                background: "rgba(0,0,0,0.7)",
                borderRadius: 12,
                padding: 16,
                border: "1px solid #7c3aed",
              }}
            >
              <div
                style={{
                  color: "#fbbf24",
                  fontWeight: 700,
                  fontSize: Math.round(TOTAL * 0.02),
                }}
              >
                🔨 Auction: {CELLS[game.auctionState.propertyId]?.name}
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: Math.round(TOTAL * 0.018),
                }}
              >
                High bid:{" "}
                <b style={{ color: "#fff" }}>{$m(game.auctionState.highBid)}</b>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  value={bidAmt}
                  onChange={(e) => setBid(e.target.value)}
                  placeholder="$"
                  style={{
                    width: 80,
                    background: "#1e1b2e",
                    border: "1px solid #7c3aed",
                    borderRadius: 8,
                    padding: "7px 10px",
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                    textAlign: "center",
                  }}
                />
                <button
                  onClick={() => emit("auctionBid", { amount: +bidAmt })}
                  style={{
                    background: "#7c3aed",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Bid
                </button>
                <button
                  onClick={() => emit("auctionEnd")}
                  style={{
                    background: "#374151",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  End
                </button>
              </div>
            </div>
          )}

          {isMyTurn && game.turnPhase === "endturn" && (
            <button
              onClick={() => emit("endTurn")}
              style={{
                background: "#2d2640",
                color: "#a78bfa",
                border: "1px solid #7c3aed",
                borderRadius: Math.round(TOTAL * 0.015),
                padding: `${Math.round(TOTAL * 0.014)}px ${Math.round(TOTAL * 0.035)}px`,
                fontSize: Math.round(TOTAL * 0.022),
                fontWeight: 700,
                cursor: "pointer",
                zIndex: 3,
              }}
            >
              ⏭ End Turn
            </button>
          )}

          {!isMyTurn && game.phase === "playing" && (
            <div
              style={{
                color: "#4b5563",
                fontSize: Math.round(TOTAL * 0.02),
                textAlign: "center",
                zIndex: 2,
              }}
            >
              {
                game.players.find(
                  (p) => p.id === game.players[game.currentPlayerIndex]?.id,
                )?.name
              }
              's turn
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BIG DIE ─────────────────────────────────────────────────────────────────
function BigDie({ value }) {
  const faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const sz = 72;
  return (
    <div
      style={{
        width: sz,
        height: sz,
        background: "#fff",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 52,
        color: "#111",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.8)",
        border: "2px solid #e5e7eb",
        transition: "transform 0.15s",
      }}
    >
      {value ? faces[value] || value : "⬜"}
    </div>
  );
}

// ─── ACTIONS SIDEBAR ─────────────────────────────────────────────────────────
function Actions({
  game,
  me,
  emit,
  bidAmt,
  setBid,
  showTrade,
  setTrade,
  tf,
  setTF,
}) {
  const { turnPhase } = game;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {turnPhase === "roll" && me?.inJail && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <div
            style={{
              background: "rgba(251,146,60,0.1)",
              border: "1px solid rgba(251,146,60,0.3)",
              borderRadius: 10,
              padding: "10px 12px",
              color: "#fb923c",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            🔒 In Jail — Turn {(me.jailTurns || 0) + 1}/3
          </div>
          <SBtn onClick={() => emit("payJailFine")} bg="#ef4444">
            Pay $50 Fine
          </SBtn>
          {me.hasJailCard && (
            <SBtn onClick={() => emit("useJailCard")} bg="#8b5cf6">
              Use Jail Free Card
            </SBtn>
          )}
        </div>
      )}

      {(turnPhase === "endturn" || turnPhase === "buy") && (
        <SBtn onClick={() => setTrade(!showTrade)} bg="#7c3aed">
          🤝 Offer Trade
        </SBtn>
      )}
      {showTrade && (
        <TradeUI
          me={me}
          players={game.players}
          properties={game.properties}
          state={tf}
          setState={setTF}
          onSend={() => {
            emit("offerTrade", {
              toPlayerId: tf.to,
              offerMoney: tf.offerM,
              offerProperties: tf.offerP,
              wantMoney: tf.wantM,
              wantProperties: tf.wantP,
            });
            setTrade(false);
          }}
          onClose={() => setTrade(false)}
        />
      )}
      {me?.inJail && turnPhase === "roll" && me.hasJailCard && (
        <SBtn onClick={() => emit("useJailCard")} bg="#8b5cf6">
          🃏 Use Jail Free
        </SBtn>
      )}
    </div>
  );
}

// ─── MY PROPERTIES ────────────────────────────────────────────────────────────
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
              padding: "7px 10px",
              background: "#2d2640",
              borderRadius: 9,
              border: "1px solid #3d3550",
            }}
          >
            {cell.color && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: cell.color,
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                color: prop.mortgaged ? "#4b5563" : "#d1d5db",
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
              <span style={{ fontSize: 10 }}>
                {prop.houses === 5 ? "🏨" : `🏠×${prop.houses}`}
              </span>
            )}
            {isMyTurn && (
              <div style={{ display: "flex", gap: 3 }}>
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

// ─── PLAYER CARD ─────────────────────────────────────────────────────────────
function PlayerCard({ p, isMe, isCurrent, color, propCount }) {
  const cell = CELLS.find((c) => c.id === p.position);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        marginBottom: 6,
        borderRadius: 10,
        background: isCurrent
          ? "rgba(124,58,237,0.12)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isCurrent ? "#7c3aed" : isMe ? "#3d3550" : "transparent"}`,
        opacity: p.bankrupt ? 0.3 : 1,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: color + "20",
          border: `2px solid ${isCurrent ? color : "#2d2640"}`,
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
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
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
                fontSize: 9,
                fontWeight: 700,
                color: "#22c55e",
                background: "rgba(34,197,94,0.1)",
                padding: "1px 6px",
                borderRadius: 8,
              }}
            >
              YOU
            </span>
          )}
          {p.inJail && (
            <span style={{ fontSize: 10, color: "#fb923c" }}>🔒</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
          {cell?.name}
        </div>
        <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700 }}>
          {$m(p.money)}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#4b5563",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {propCount}🏠
      </div>
    </div>
  );
}

// ─── TRADE ───────────────────────────────────────────────────────────────────
function TradeUI({
  me,
  players,
  properties,
  state,
  setState,
  onSend,
  onClose,
}) {
  const others = players.filter((p) => p.id !== me?.id && !p.bankrupt);
  const myProps = Object.entries(properties || {}).filter(
    ([, p]) => p.owner === me?.id,
  );
  const theirProps = state.to
    ? Object.entries(properties || {}).filter(([, p]) => p.owner === state.to)
    : [];
  const toggle = (id, arr, key) =>
    setState((s) => ({
      ...s,
      [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    }));

  return (
    <div
      style={{
        background: "#1e1b2e",
        border: "1px solid #7c3aed",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700 }}>
          🤝 TRADE OFFER
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 18,
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
          background: "#2d2640",
          border: "1px solid #7c3aed",
          borderRadius: 8,
          padding: "8px",
          color: "#fff",
          fontSize: 12,
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
          ["OFFER", state.offerM, "offerM", myProps, state.offerP, "offerP"],
          ["WANT", state.wantM, "wantM", theirProps, state.wantP, "wantP"],
        ].map(([lbl, money, mkey, props, checked, pkey]) => (
          <div key={lbl}>
            <div
              style={{
                color: "#a78bfa",
                fontSize: 10,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {lbl}
            </div>
            <input
              type="number"
              min={0}
              value={money}
              onChange={(e) =>
                setState((s) => ({ ...s, [mkey]: +e.target.value }))
              }
              placeholder="$"
              style={{
                width: "100%",
                background: "#2d2640",
                border: "1px solid #3d3550",
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
                    onChange={() => toggle(id, checked, pkey)}
                    style={{ accentColor: "#7c3aed" }}
                  />
                  {c?.color && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: c.color,
                      }}
                    />
                  )}
                  <span style={{ color: "#d1d5db", fontSize: 11 }}>
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
          background: state.to ? "#7c3aed" : "#2d2640",
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
        background: "rgba(124,58,237,0.1)",
        border: "1px solid #7c3aed",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          color: "#a78bfa",
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        🤝 Trade from <b>{from?.name}</b>
      </div>
      <div style={{ color: "#d1d5db", fontSize: 12, marginBottom: 3 }}>
        Offers: {$m(trade.offerMoney)} + {trade.offerProperties?.length || 0}{" "}
        props
      </div>
      <div style={{ color: "#d1d5db", fontSize: 12, marginBottom: 12 }}>
        Wants: {$m(trade.wantMoney)} + {trade.wantProperties?.length || 0} props
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

// ─── LOBBY ───────────────────────────────────────────────────────────────────
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
        background: "#13111a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter',system-ui,sans-serif",
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
          top: "-20%",
          left: "30%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(124,58,237,0.08),transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "20%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(34,197,94,0.05),transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 76,
              height: 76,
              background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 16px",
              boxShadow: "0 0 50px rgba(124,58,237,0.4)",
            }}
          >
            🎩
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 36,
              color: "#fff",
              letterSpacing: 2,
            }}
          >
            MONOPOLY
          </div>
          <div
            style={{
              color: "#7c3aed",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 4,
              marginTop: 4,
            }}
          >
            ONLINE MULTIPLAYER
          </div>
        </div>

        <div
          style={{
            background: "#1a1625",
            border: "1px solid #2d2640",
            borderRadius: 20,
            padding: 30,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
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

          <LField
            label="ROOM ID"
            value={roomId}
            onChange={setRoomId}
            placeholder="Enter room code"
          />
          <LField
            label="YOUR NAME"
            value={name}
            onChange={setName}
            placeholder="Your nickname"
          />

          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                color: "#4b5563",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              CHOOSE TOKEN
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TOKENS.map((t) => (
                <button
                  key={t}
                  onClick={() => setToken(t)}
                  style={{
                    width: 44,
                    height: 44,
                    fontSize: 22,
                    borderRadius: 11,
                    border: `2px solid ${token === t ? "#7c3aed" : "#2d2640"}`,
                    background:
                      token === t ? "rgba(124,58,237,0.15)" : "#13111a",
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
              style={{
                width: "100%",
                background:
                  !roomId || !name
                    ? "#2d2640"
                    : "linear-gradient(135deg,#7c3aed,#5b21b6)",
                color: !roomId || !name ? "#4b5563" : "#fff",
                border: "none",
                padding: "14px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                cursor: !roomId || !name ? "not-allowed" : "pointer",
                letterSpacing: 1,
              }}
            >
              JOIN ROOM
            </button>
          )}

          {game?.players?.length > 0 && (
            <div
              style={{
                marginTop: 20,
                background: "#13111a",
                borderRadius: 12,
                padding: 14,
                border: "1px solid #2d2640",
              }}
            >
              <div
                style={{
                  color: "#4b5563",
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
                    padding: "8px 0",
                    borderBottom: "1px solid #1e1b2e",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: PCOLORS[i % PCOLORS.length] + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {p.token}
                  </div>
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 14,
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
            <button
              onClick={onStart}
              style={{
                width: "100%",
                marginTop: 16,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              ▶ START GAME
            </button>
          )}
          {joined && isHost && game.players.length < 2 && (
            <div
              style={{
                marginTop: 14,
                textAlign: "center",
                color: "#4b5563",
                fontSize: 13,
              }}
            >
              ⏳ Waiting for more players...
            </div>
          )}
          {joined && !isHost && (
            <div
              style={{
                marginTop: 14,
                textAlign: "center",
                color: "#4b5563",
                fontSize: 13,
              }}
            >
              ⏳ Waiting for host to start...
            </div>
          )}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            color: "#2d2640",
            fontSize: 12,
          }}
        >
          Share the Room ID with friends to play together
        </div>
      </div>
    </div>
  );
}

function LField({ label, value, onChange, placeholder }) {
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
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          background: "#13111a",
          border: `1px solid ${focus ? "#7c3aed" : "#2d2640"}`,
          borderRadius: 10,
          padding: "11px 14px",
          color: "#fff",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

function Splash() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#13111a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
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
      <div style={{ color: "#4b5563", fontSize: 14 }}>Connecting...</div>
    </div>
  );
}

function WinScreen({ winner }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#13111a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
        fontFamily: "system-ui",
      }}
    >
      <div style={{ fontSize: 80 }}>🏆</div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 40,
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
          background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
          color: "#fff",
          border: "none",
          padding: "14px 40px",
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        PLAY AGAIN
      </button>
    </div>
  );
}

function SBtn({ children, onClick, bg = "#374151" }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: bg,
        color: "#fff",
        border: "none",
        padding: "11px 16px",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
        width: 22,
        height: 22,
        borderRadius: 6,
        fontSize: 11,
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
