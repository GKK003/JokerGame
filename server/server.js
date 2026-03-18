const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.get("/", (req, res) => res.send("Monopoly server OK"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ─── BOARD ───────────────────────────────────────────────────────────────────
const BOARD = [
  { id: 0, name: "GO", type: "go" },
  {
    id: 1,
    name: "Mediterranean Ave",
    type: "property",
    color: "brown",
    price: 60,
    mortgage: 30,
    houseCost: 50,
    rent: [2, 10, 30, 90, 160, 250],
  },
  { id: 2, name: "Community Chest", type: "chest" },
  {
    id: 3,
    name: "Baltic Ave",
    type: "property",
    color: "brown",
    price: 60,
    mortgage: 30,
    houseCost: 50,
    rent: [4, 20, 60, 180, 320, 450],
  },
  { id: 4, name: "Income Tax", type: "tax", amount: 200 },
  {
    id: 5,
    name: "Reading Railroad",
    type: "railroad",
    price: 200,
    mortgage: 100,
  },
  {
    id: 6,
    name: "Oriental Ave",
    type: "property",
    color: "lightblue",
    price: 100,
    mortgage: 50,
    houseCost: 50,
    rent: [6, 30, 90, 270, 400, 550],
  },
  { id: 7, name: "Chance", type: "chance" },
  {
    id: 8,
    name: "Vermont Ave",
    type: "property",
    color: "lightblue",
    price: 100,
    mortgage: 50,
    houseCost: 50,
    rent: [6, 30, 90, 270, 400, 550],
  },
  {
    id: 9,
    name: "Connecticut Ave",
    type: "property",
    color: "lightblue",
    price: 120,
    mortgage: 60,
    houseCost: 50,
    rent: [8, 40, 100, 300, 450, 600],
  },
  { id: 10, name: "Jail / Visiting", type: "jail" },
  {
    id: 11,
    name: "St. Charles Place",
    type: "property",
    color: "pink",
    price: 140,
    mortgage: 70,
    houseCost: 100,
    rent: [10, 50, 150, 450, 625, 750],
  },
  {
    id: 12,
    name: "Electric Company",
    type: "utility",
    price: 150,
    mortgage: 75,
  },
  {
    id: 13,
    name: "States Ave",
    type: "property",
    color: "pink",
    price: 140,
    mortgage: 70,
    houseCost: 100,
    rent: [10, 50, 150, 450, 625, 750],
  },
  {
    id: 14,
    name: "Virginia Ave",
    type: "property",
    color: "pink",
    price: 160,
    mortgage: 80,
    houseCost: 100,
    rent: [12, 60, 180, 500, 700, 900],
  },
  {
    id: 15,
    name: "Pennsylvania RR",
    type: "railroad",
    price: 200,
    mortgage: 100,
  },
  {
    id: 16,
    name: "St. James Place",
    type: "property",
    color: "orange",
    price: 180,
    mortgage: 90,
    houseCost: 100,
    rent: [14, 70, 200, 550, 750, 950],
  },
  { id: 17, name: "Community Chest", type: "chest" },
  {
    id: 18,
    name: "Tennessee Ave",
    type: "property",
    color: "orange",
    price: 180,
    mortgage: 90,
    houseCost: 100,
    rent: [14, 70, 200, 550, 750, 950],
  },
  {
    id: 19,
    name: "New York Ave",
    type: "property",
    color: "orange",
    price: 200,
    mortgage: 100,
    houseCost: 100,
    rent: [16, 80, 220, 600, 800, 1000],
  },
  { id: 20, name: "Free Parking", type: "freeparking" },
  {
    id: 21,
    name: "Kentucky Ave",
    type: "property",
    color: "red",
    price: 220,
    mortgage: 110,
    houseCost: 150,
    rent: [18, 90, 250, 700, 875, 1050],
  },
  { id: 22, name: "Chance", type: "chance" },
  {
    id: 23,
    name: "Indiana Ave",
    type: "property",
    color: "red",
    price: 220,
    mortgage: 110,
    houseCost: 150,
    rent: [18, 90, 250, 700, 875, 1050],
  },
  {
    id: 24,
    name: "Illinois Ave",
    type: "property",
    color: "red",
    price: 240,
    mortgage: 120,
    houseCost: 150,
    rent: [20, 100, 300, 750, 925, 1100],
  },
  { id: 25, name: "B&O Railroad", type: "railroad", price: 200, mortgage: 100 },
  {
    id: 26,
    name: "Atlantic Ave",
    type: "property",
    color: "yellow",
    price: 260,
    mortgage: 130,
    houseCost: 150,
    rent: [22, 110, 330, 800, 975, 1150],
  },
  {
    id: 27,
    name: "Ventnor Ave",
    type: "property",
    color: "yellow",
    price: 260,
    mortgage: 130,
    houseCost: 150,
    rent: [22, 110, 330, 800, 975, 1150],
  },
  { id: 28, name: "Water Works", type: "utility", price: 150, mortgage: 75 },
  {
    id: 29,
    name: "Marvin Gardens",
    type: "property",
    color: "yellow",
    price: 280,
    mortgage: 140,
    houseCost: 150,
    rent: [24, 120, 360, 850, 1025, 1200],
  },
  { id: 30, name: "Go To Jail", type: "gotojail" },
  {
    id: 31,
    name: "Pacific Ave",
    type: "property",
    color: "green",
    price: 300,
    mortgage: 150,
    houseCost: 200,
    rent: [26, 130, 390, 900, 1100, 1275],
  },
  {
    id: 32,
    name: "North Carolina",
    type: "property",
    color: "green",
    price: 300,
    mortgage: 150,
    houseCost: 200,
    rent: [26, 130, 390, 900, 1100, 1275],
  },
  { id: 33, name: "Community Chest", type: "chest" },
  {
    id: 34,
    name: "Pennsylvania Ave",
    type: "property",
    color: "green",
    price: 320,
    mortgage: 160,
    houseCost: 200,
    rent: [28, 150, 450, 1000, 1200, 1400],
  },
  {
    id: 35,
    name: "Short Line RR",
    type: "railroad",
    price: 200,
    mortgage: 100,
  },
  { id: 36, name: "Chance", type: "chance" },
  {
    id: 37,
    name: "Park Place",
    type: "property",
    color: "darkblue",
    price: 350,
    mortgage: 175,
    houseCost: 200,
    rent: [35, 175, 500, 1100, 1300, 1500],
  },
  { id: 38, name: "Luxury Tax", type: "tax", amount: 100 },
  {
    id: 39,
    name: "Boardwalk",
    type: "property",
    color: "darkblue",
    price: 400,
    mortgage: 200,
    houseCost: 200,
    rent: [50, 200, 600, 1400, 1700, 2000],
  },
];

const COLOR_GROUPS = {
  brown: ["1", "3"],
  lightblue: ["6", "8", "9"],
  pink: ["11", "13", "14"],
  orange: ["16", "18", "19"],
  red: ["21", "23", "24"],
  yellow: ["26", "27", "29"],
  green: ["31", "32", "34"],
  darkblue: ["37", "39"],
};
const RAILROADS = [5, 15, 25, 35];
const UTILITIES = [12, 28];

// ─── CARDS ───────────────────────────────────────────────────────────────────
const CHANCE_CARDS = [
  { text: "Advance to GO. Collect $200.", action: "advance", target: 0 },
  { text: "Advance to Illinois Ave.", action: "advance", target: 24 },
  { text: "Advance to St. Charles Place.", action: "advance", target: 11 },
  { text: "Advance to nearest Railroad.", action: "nearestRR" },
  { text: "Advance to nearest Utility.", action: "nearestUtil" },
  { text: "Bank pays you dividend of $50.", action: "collect", amount: 50 },
  { text: "Get Out of Jail Free.", action: "jailFree" },
  { text: "Go Back 3 Spaces.", action: "moveBack", amount: 3 },
  { text: "Go to Jail.", action: "jail" },
  {
    text: "Make repairs: $25/house, $100/hotel.",
    action: "repairs",
    house: 25,
    hotel: 100,
  },
  { text: "Pay poor tax of $15.", action: "pay", amount: 15 },
  { text: "Advance to Reading Railroad.", action: "advance", target: 5 },
  { text: "Advance to Boardwalk.", action: "advance", target: 39 },
  { text: "Chairman: pay each player $50.", action: "payEach", amount: 50 },
  {
    text: "Building loan matures. Collect $150.",
    action: "collect",
    amount: 150,
  },
  { text: "Speeding fine $15.", action: "pay", amount: 15 },
];
const CHEST_CARDS = [
  { text: "Advance to GO. Collect $200.", action: "advance", target: 0 },
  {
    text: "Bank error in your favor. Collect $200.",
    action: "collect",
    amount: 200,
  },
  { text: "Doctor's fees. Pay $50.", action: "pay", amount: 50 },
  { text: "From sale of stock you get $50.", action: "collect", amount: 50 },
  { text: "Get Out of Jail Free.", action: "jailFree" },
  { text: "Go to Jail.", action: "jail" },
  {
    text: "Grand Opera Night. Collect $50 from each player.",
    action: "collectEach",
    amount: 50,
  },
  {
    text: "Holiday Fund matures. Receive $100.",
    action: "collect",
    amount: 100,
  },
  { text: "Income tax refund. Collect $20.", action: "collect", amount: 20 },
  {
    text: "It's your birthday! Collect $10 from each player.",
    action: "collectEach",
    amount: 10,
  },
  {
    text: "Life insurance matures. Collect $100.",
    action: "collect",
    amount: 100,
  },
  { text: "Pay hospital fees of $100.", action: "pay", amount: 100 },
  { text: "Pay school fees of $150.", action: "pay", amount: 150 },
  { text: "Receive $25 consultancy fee.", action: "collect", amount: 25 },
  {
    text: "Street repairs: $40/house, $115/hotel.",
    action: "repairs",
    house: 40,
    hotel: 115,
  },
  { text: "Won beauty contest! Collect $10.", action: "collect", amount: 10 },
  { text: "You inherit $100.", action: "collect", amount: 100 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const die = () => Math.floor(Math.random() * 6) + 1;
const nearestRR = (pos) => [5, 15, 25, 35].find((r) => r > pos) ?? 5;
const nearestUtil = (pos) => [12, 28].find((u) => u > pos) ?? 12;

function createGame(roomId) {
  return {
    roomId,
    phase: "lobby",
    players: [],
    currentPlayerIndex: 0,
    turnPhase: "roll",
    lastRoll: null,
    doublesCount: 0,
    chanceCards: shuffle(CHANCE_CARDS),
    chestCards: shuffle(CHEST_CARDS),
    properties: {},
    log: [],
    pendingCard: null,
    pendingTrade: null,
    auctionState: null,
    winner: null,
  };
}

const rooms = {};
const getRoom = (id) => rooms[id];

function addLog(g, msg) {
  g.log.push(msg);
  if (g.log.length > 80) g.log.shift();
}

function broadcast(roomId) {
  const g = getRoom(roomId);
  if (!g) return;
  io.to(roomId).emit("gameState", {
    ...g,
    chanceCards: g.chanceCards.length,
    chestCards: g.chestCards.length,
  });
}

function cp(g) {
  return g.players[g.currentPlayerIndex];
}

function nextTurn(g) {
  g.doublesCount = 0;
  g.lastRoll = null;
  g.pendingCard = null;
  g.turnPhase = "roll";
  let tries = 0;
  do {
    g.currentPlayerIndex = (g.currentPlayerIndex + 1) % g.players.length;
    tries++;
  } while (
    g.players[g.currentPlayerIndex].bankrupt &&
    tries < g.players.length
  );
  addLog(g, `🎲 ${cp(g).name}'s turn`);
}

function movePlayer(g, pid, steps) {
  const p = g.players.find((x) => x.id === pid);
  if (!p) return;
  const old = p.position;
  p.position = (p.position + steps) % 40;
  if (p.position < old) {
    p.money += 200;
    addLog(g, `${p.name} passed GO +$200`);
  }
  landOn(g, p);
}

function teleport(g, pid, target, collectGo = true) {
  const p = g.players.find((x) => x.id === pid);
  if (!p) return;
  if (collectGo && target <= p.position) {
    p.money += 200;
    addLog(g, `${p.name} passed GO +$200`);
  }
  p.position = target;
  landOn(g, p);
}

function toJail(g, p) {
  p.position = 10;
  p.inJail = true;
  p.jailTurns = 0;
  addLog(g, `🚔 ${p.name} goes to Jail!`);
  g.turnPhase = "endturn";
}

function calcRent(g, space, p, dice) {
  const prop = g.properties[space.id];
  if (!prop || !prop.owner || prop.mortgaged) return 0;
  if (prop.owner === p.id) return 0;
  if (space.type === "railroad") {
    const cnt = RAILROADS.filter(
      (id) => g.properties[id]?.owner === prop.owner,
    ).length;
    return 25 * Math.pow(2, cnt - 1);
  }
  if (space.type === "utility") {
    const cnt = UTILITIES.filter(
      (id) => g.properties[id]?.owner === prop.owner,
    ).length;
    return dice * (cnt === 2 ? 10 : 4);
  }
  const h = prop.houses || 0;
  let rent = space.rent[h];
  if (h === 0) {
    const grp = COLOR_GROUPS[space.color] || [];
    if (grp.every((id) => g.properties[id]?.owner === prop.owner)) rent *= 2;
  }
  return rent;
}

function landOn(g, p) {
  const space = BOARD[p.position];
  addLog(g, `📍 ${p.name} → ${space.name}`);
  if (space.type === "gotojail") {
    toJail(g, p);
    return;
  }
  if (
    space.type === "go" ||
    space.type === "jail" ||
    space.type === "freeparking"
  ) {
    g.turnPhase = "endturn";
    return;
  }
  if (space.type === "tax") {
    p.money -= space.amount;
    addLog(g, `${p.name} paid $${space.amount} tax`);
    if (p.money < 0) bankrupt(g, p, null);
    g.turnPhase = "endturn";
    return;
  }
  if (space.type === "chance") {
    drawCard(g, p, "chance");
    return;
  }
  if (space.type === "chest") {
    drawCard(g, p, "chest");
    return;
  }
  const prop = g.properties[space.id];
  if (!prop) {
    g.turnPhase = "buy";
    return;
  }
  if (prop.owner === p.id || prop.mortgaged) {
    g.turnPhase = "endturn";
    return;
  }
  const dice = (g.lastRoll || [0, 0]).reduce((a, b) => a + b, 0);
  const rent = calcRent(g, space, p, dice);
  const owner = g.players.find((x) => x.id === prop.owner);
  p.money -= rent;
  if (owner) owner.money += rent;
  addLog(g, `💸 ${p.name} paid $${rent} rent to ${owner?.name}`);
  if (p.money < 0) bankrupt(g, p, owner);
  g.turnPhase = "endturn";
}

function drawCard(g, p, deck) {
  const cards = deck === "chance" ? g.chanceCards : g.chestCards;
  const card = cards.shift();
  cards.push(card);
  g.pendingCard = { ...card, deck };
  addLog(g, `🃏 ${p.name}: "${card.text}"`);
  const { action } = card;
  if (action === "advance") {
    teleport(g, p.id, card.target);
    return;
  }
  if (action === "nearestRR") {
    teleport(g, p.id, nearestRR(p.position));
    return;
  }
  if (action === "nearestUtil") {
    teleport(g, p.id, nearestUtil(p.position));
    return;
  }
  if (action === "collect") {
    p.money += card.amount;
    g.turnPhase = "endturn";
    return;
  }
  if (action === "pay") {
    p.money -= card.amount;
    if (p.money < 0) bankrupt(g, p, null);
    g.turnPhase = "endturn";
    return;
  }
  if (action === "jailFree") {
    p.hasJailCard = true;
    g.turnPhase = "endturn";
    return;
  }
  if (action === "jail") {
    toJail(g, p);
    return;
  }
  if (action === "moveBack") {
    p.position = (p.position - card.amount + 40) % 40;
    landOn(g, p);
    return;
  }
  if (action === "repairs") {
    let tot = 0;
    Object.entries(g.properties).forEach(([, pr]) => {
      if (pr.owner === p.id) {
        if (pr.houses === 5) tot += card.hotel;
        else tot += pr.houses * card.house;
      }
    });
    p.money -= tot;
    addLog(g, `${p.name} paid $${tot} repairs`);
    if (p.money < 0) bankrupt(g, p, null);
    g.turnPhase = "endturn";
    return;
  }
  if (action === "payEach") {
    g.players
      .filter((x) => !x.bankrupt && x.id !== p.id)
      .forEach((x) => {
        p.money -= card.amount;
        x.money += card.amount;
      });
    g.turnPhase = "endturn";
    return;
  }
  if (action === "collectEach") {
    g.players
      .filter((x) => !x.bankrupt && x.id !== p.id)
      .forEach((x) => {
        x.money -= card.amount;
        p.money += card.amount;
      });
    g.turnPhase = "endturn";
    return;
  }
  g.turnPhase = "endturn";
}

function bankrupt(g, p, creditor) {
  p.bankrupt = true;
  addLog(g, `💀 ${p.name} is bankrupt!`);
  Object.entries(g.properties).forEach(([id, pr]) => {
    if (pr.owner === p.id) {
      if (creditor) pr.owner = creditor.id;
      else delete g.properties[id];
    }
  });
  if (creditor) creditor.money += Math.max(0, p.money);
  p.money = 0;
  const alive = g.players.filter((x) => !x.bankrupt);
  if (alive.length === 1) {
    g.phase = "ended";
    g.winner = alive[0].id;
    addLog(g, `🏆 ${alive[0].name} WINS!`);
  }
}

// ─── SOCKET ──────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("connect", socket.id);

  socket.on("joinRoom", ({ roomId, playerName, token }) => {
    if (!roomId || !playerName) {
      socket.emit("err", "Invalid data");
      return;
    }
    let g = getRoom(roomId);
    if (!g) {
      g = createGame(roomId);
      rooms[roomId] = g;
    }
    if (g.phase !== "lobby") {
      socket.emit("err", "Game already started");
      return;
    }
    if (g.players.length >= 8) {
      socket.emit("err", "Room full");
      return;
    }
    if (g.players.find((p) => p.id === socket.id)) return; // already in
    const player = {
      id: socket.id,
      name: playerName.slice(0, 20),
      token: token || "🎩",
      money: 1500,
      position: 0,
      inJail: false,
      jailTurns: 0,
      bankrupt: false,
      hasJailCard: false,
    };
    g.players.push(player);
    socket.join(roomId);
    socket.data.roomId = roomId;
    addLog(g, `${player.name} joined`);
    broadcast(roomId);
  });

  socket.on("startGame", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || g.phase !== "lobby") return;
    if (g.players[0]?.id !== socket.id) {
      socket.emit("err", "Only host can start");
      return;
    }
    if (g.players.length < 2) {
      socket.emit("err", "Need at least 2 players");
      return;
    }
    g.phase = "playing";
    addLog(g, `🎮 Game started! ${cp(g).name} goes first`);
    broadcast(roomId);
  });

  socket.on("rollDice", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || g.phase !== "playing") return;
    const p = cp(g);
    if (p.id !== socket.id || g.turnPhase !== "roll") return;
    const d1 = die(),
      d2 = die();
    g.lastRoll = [d1, d2];
    const doubles = d1 === d2;
    addLog(
      g,
      `🎲 ${p.name} rolled ${d1}+${d2}=${d1 + d2}${doubles ? " DOUBLES!" : ""}`,
    );
    if (p.inJail) {
      if (doubles) {
        p.inJail = false;
        p.jailTurns = 0;
        addLog(g, `${p.name} rolled doubles, out of jail!`);
        movePlayer(g, p.id, d1 + d2);
      } else {
        p.jailTurns++;
        if (p.jailTurns >= 3) {
          p.money -= 50;
          p.inJail = false;
          p.jailTurns = 0;
          addLog(g, `${p.name} paid $50 jail fine`);
          movePlayer(g, p.id, d1 + d2);
        } else {
          addLog(g, `${p.name} stays in jail (${p.jailTurns}/3)`);
          g.turnPhase = "endturn";
        }
      }
      broadcast(roomId);
      return;
    }
    if (doubles) {
      g.doublesCount++;
      if (g.doublesCount >= 3) {
        toJail(g, p);
        broadcast(roomId);
        return;
      }
    } else g.doublesCount = 0;
    movePlayer(g, p.id, d1 + d2);
    if (doubles && g.turnPhase === "endturn") g.turnPhase = "roll";
    broadcast(roomId);
  });

  socket.on("buyProperty", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || g.turnPhase !== "buy") return;
    const p = cp(g);
    if (p.id !== socket.id) return;
    const space = BOARD[p.position];
    if (!space?.price) return;
    if (p.money < space.price) {
      socket.emit("err", "Not enough money");
      return;
    }
    p.money -= space.price;
    g.properties[space.id] = { owner: p.id, houses: 0, mortgaged: false };
    addLog(g, `🏠 ${p.name} bought ${space.name} for $${space.price}`);
    g.turnPhase = "endturn";
    broadcast(roomId);
  });

  socket.on("declineBuy", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || g.turnPhase !== "buy") return;
    const p = cp(g);
    if (p.id !== socket.id) return;
    const space = BOARD[p.position];
    addLog(g, `${p.name} declined ${space.name} — auction!`);
    g.auctionState = {
      propertyId: space.id,
      highBid: 0,
      highBidder: null,
      bids: {},
    };
    g.turnPhase = "auction";
    broadcast(roomId);
  });

  socket.on("auctionBid", ({ roomId, amount }) => {
    const g = getRoom(roomId);
    if (!g || !g.auctionState) return;
    const player = g.players.find((p) => p.id === socket.id);
    if (!player || player.bankrupt) return;
    const bid = parseInt(amount);
    if (isNaN(bid) || bid <= g.auctionState.highBid || bid > player.money)
      return;
    g.auctionState.highBid = bid;
    g.auctionState.highBidder = player.id;
    g.auctionState.bids[player.id] = bid;
    addLog(g, `💰 ${player.name} bids $${bid}`);
    broadcast(roomId);
  });

  socket.on("auctionEnd", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || !g.auctionState) return;
    const p = cp(g);
    if (p.id !== socket.id) return;
    const { propertyId, highBidder, highBid } = g.auctionState;
    if (highBidder) {
      const winner = g.players.find((x) => x.id === highBidder);
      winner.money -= highBid;
      g.properties[propertyId] = {
        owner: winner.id,
        houses: 0,
        mortgaged: false,
      };
      addLog(
        g,
        `🔨 ${winner.name} won ${BOARD[propertyId].name} at $${highBid}`,
      );
    } else addLog(g, `No bids on ${BOARD[propertyId].name}`);
    g.auctionState = null;
    g.turnPhase = "endturn";
    broadcast(roomId);
  });

  socket.on("buildHouse", ({ roomId, propertyId }) => {
    const g = getRoom(roomId);
    if (!g) return;
    const player = g.players.find((p) => p.id === socket.id);
    if (!player) return;
    const prop = g.properties[propertyId];
    if (!prop || prop.owner !== player.id || prop.mortgaged) {
      socket.emit("err", "Cannot build here");
      return;
    }
    const space = BOARD[propertyId];
    if (!space?.houseCost) return;
    const grp = COLOR_GROUPS[space.color] || [];
    if (!grp.every((id) => g.properties[id]?.owner === player.id)) {
      socket.emit("err", "Need full color group");
      return;
    }
    if (prop.houses >= 5) {
      socket.emit("err", "Already has hotel");
      return;
    }
    const minH = Math.min(...grp.map((id) => g.properties[id]?.houses || 0));
    if (prop.houses > minH) {
      socket.emit("err", "Must build evenly");
      return;
    }
    if (player.money < space.houseCost) {
      socket.emit("err", "Not enough money");
      return;
    }
    player.money -= space.houseCost;
    prop.houses++;
    addLog(
      g,
      `🏘 ${player.name} built ${prop.houses === 5 ? "hotel" : "house"} on ${space.name}`,
    );
    broadcast(roomId);
  });

  socket.on("sellHouse", ({ roomId, propertyId }) => {
    const g = getRoom(roomId);
    if (!g) return;
    const player = g.players.find((p) => p.id === socket.id);
    if (!player) return;
    const prop = g.properties[propertyId];
    if (!prop || prop.owner !== player.id || prop.houses === 0) return;
    const space = BOARD[propertyId];
    player.money += Math.floor(space.houseCost / 2);
    prop.houses--;
    addLog(
      g,
      `${player.name} sold house on ${space.name} +$${Math.floor(space.houseCost / 2)}`,
    );
    broadcast(roomId);
  });

  socket.on("mortgage", ({ roomId, propertyId }) => {
    const g = getRoom(roomId);
    if (!g) return;
    const player = g.players.find((p) => p.id === socket.id);
    if (!player) return;
    const prop = g.properties[propertyId];
    if (!prop || prop.owner !== player.id || prop.mortgaged || prop.houses > 0)
      return;
    const space = BOARD[propertyId];
    prop.mortgaged = true;
    player.money += space.mortgage;
    addLog(g, `${player.name} mortgaged ${space.name} +$${space.mortgage}`);
    broadcast(roomId);
  });

  socket.on("unmortgage", ({ roomId, propertyId }) => {
    const g = getRoom(roomId);
    if (!g) return;
    const player = g.players.find((p) => p.id === socket.id);
    if (!player) return;
    const prop = g.properties[propertyId];
    if (!prop || prop.owner !== player.id || !prop.mortgaged) return;
    const space = BOARD[propertyId];
    const cost = Math.floor(space.mortgage * 1.1);
    if (player.money < cost) {
      socket.emit("err", "Not enough money");
      return;
    }
    player.money -= cost;
    prop.mortgaged = false;
    addLog(g, `${player.name} lifted mortgage on ${space.name} -$${cost}`);
    broadcast(roomId);
  });

  socket.on("payJailFine", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g) return;
    const p = cp(g);
    if (p.id !== socket.id || !p.inJail) return;
    p.money -= 50;
    p.inJail = false;
    p.jailTurns = 0;
    addLog(g, `${p.name} paid $50 jail fine`);
    broadcast(roomId);
  });

  socket.on("useJailCard", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g) return;
    const p = cp(g);
    if (p.id !== socket.id || !p.inJail || !p.hasJailCard) return;
    p.inJail = false;
    p.jailTurns = 0;
    p.hasJailCard = false;
    addLog(g, `${p.name} used Get Out of Jail Free`);
    broadcast(roomId);
  });

  socket.on(
    "offerTrade",
    ({
      roomId,
      toPlayerId,
      offerMoney,
      offerProperties,
      wantMoney,
      wantProperties,
    }) => {
      const g = getRoom(roomId);
      if (!g) return;
      const from = g.players.find((p) => p.id === socket.id);
      const to = g.players.find((p) => p.id === toPlayerId);
      if (!from || !to) return;
      g.pendingTrade = {
        from: from.id,
        to: to.id,
        offerMoney: offerMoney || 0,
        offerProperties: offerProperties || [],
        wantMoney: wantMoney || 0,
        wantProperties: wantProperties || [],
      };
      addLog(g, `🤝 ${from.name} offers trade to ${to.name}`);
      broadcast(roomId);
    },
  );

  socket.on("acceptTrade", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || !g.pendingTrade) return;
    if (socket.id !== g.pendingTrade.to) return;
    const t = g.pendingTrade;
    const from = g.players.find((p) => p.id === t.from);
    const to = g.players.find((p) => p.id === t.to);
    from.money -= t.offerMoney;
    to.money += t.offerMoney;
    to.money -= t.wantMoney;
    from.money += t.wantMoney;
    t.offerProperties.forEach((id) => {
      if (g.properties[id]) g.properties[id].owner = to.id;
    });
    t.wantProperties.forEach((id) => {
      if (g.properties[id]) g.properties[id].owner = from.id;
    });
    addLog(g, `✅ Trade accepted`);
    g.pendingTrade = null;
    broadcast(roomId);
  });

  socket.on("declineTrade", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || !g.pendingTrade) return;
    if (socket.id !== g.pendingTrade.to) return;
    addLog(g, `❌ Trade declined`);
    g.pendingTrade = null;
    broadcast(roomId);
  });

  socket.on("endTurn", ({ roomId }) => {
    const g = getRoom(roomId);
    if (!g || g.phase !== "playing") return;
    const p = cp(g);
    if (p.id !== socket.id) return;
    if (g.turnPhase !== "endturn" && g.turnPhase !== "buy") return;
    nextTurn(g);
    broadcast(roomId);
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const g = getRoom(roomId);
    if (!g) return;
    const p = g.players.find((x) => x.id === socket.id);
    if (p) {
      addLog(g, `${p.name} disconnected`);
      p.bankrupt = true;
    }
    broadcast(roomId);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Monopoly server on port ${PORT}`));
