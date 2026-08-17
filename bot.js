const bedrock = require("bedrock-protocol");

const HOST = process.env.MC_HOST || "rexointernational.aternos.me";
const PORT = Number(process.env.MC_PORT || 24387);
const USERNAME = process.env.BOT_USERNAME || "RexoAFKBot";

let client;
let reconnectTimer;

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function connect() {
  log(`Connecting to ${HOST}:${PORT}...`);

  client = bedrock.createClient({
    host: HOST,
    port: PORT,
    username: USERNAME,
    offline: true
  });

  client.on("join", () => {
    log("✅ Bot joined the Bedrock server!");
  });

  client.on("spawn", () => {
    log("🟢 Bot spawned.");
  });

  client.on("disconnect", (packet) => {
    log(`🔌 Disconnected: ${JSON.stringify(packet)}`);
    reconnect();
  });

  client.on("error", (error) => {
    log(`❌ Error: ${error.message}`);
  });

  client.on("close", () => {
    log("Connection closed.");
    reconnect();
  });
}

function reconnect() {
  if (reconnectTimer) return;

  log("🔄 Reconnecting in 15 seconds...");

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;

    try {
      if (client) client.close();
    } catch {}

    connect();
  }, 15000);
}

connect();

process.on("SIGINT", () => {
  log("Stopping bot...");

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  if (client) {
    try {
      client.close();
    } catch {}
  }

  process.exit(0);
});

process.on("SIGTERM", () => {
  log("Stopping bot...");

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  if (client) {
    try {
      client.close();
    } catch {}
  }

  process.exit(0);
});