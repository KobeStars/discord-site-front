/**
 * =====================================================
 *   APP.JS — Logique principale Discord Site
 * =====================================================
 */

// ====================================================
// DISCORD AUTH (OAuth2 PKCE)
// ====================================================

function initiateLogin() {
  const cfg = window.DISCORD_CONFIG;
  const state = crypto.randomUUID();
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: cfg.CLIENT_ID,
    redirect_uri: cfg.REDIRECT_URI,
    response_type: "token", // Implicit flow (client-side)
    scope: cfg.SCOPES.join(" "),
    state,
  });

  window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
}

function logout() {
  sessionStorage.clear();
  localStorage.removeItem("discord_token");
  renderLoggedOut();
  showToast("👋 Déconnexion réussie");
}

function getToken() {
  return localStorage.getItem("discord_token");
}

function saveToken(token) {
  localStorage.setItem("discord_token", token);
}

// ====================================================
// DISCORD API CALLS
// ====================================================

async function discordFetch(endpoint, token) {
  const res = await fetch(`https://discord.com/api/v10${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Discord API ${res.status}: ${endpoint}`);
  return res.json();
}

async function fetchCurrentUser(token) {
  return discordFetch("/users/@me", token);
}

async function fetchUserGuilds(token) {
  return discordFetch("/users/@me/guilds", token);
}

// ====================================================
// DONNÉES MOCK (demo sans backend)
// ====================================================

const MOCK_SERVER = {
  name: "NexusHub Community",
  description:
    "Le serveur Discord de la communauté NexusHub. Un espace pour discuter, partager et créer ensemble.",
  icon: null,
  member_count: 1247,
  approximate_presence_count: 84,
  channels: 18,
};

const MOCK_MEMBERS = [
  {
    id: "1",
    username: "Aurelius",
    discriminator: "0",
    status: "online",
    avatar: null,
    topRole: "Admin",
  },
  {
    id: "2",
    username: "Solène",
    discriminator: "0",
    status: "online",
    avatar: null,
    topRole: "Modérateur",
  },
  {
    id: "3",
    username: "KaiZen",
    discriminator: "0",
    status: "idle",
    avatar: null,
    topRole: "Membre",
  },
  {
    id: "4",
    username: "d4rkbird",
    discriminator: "0",
    status: "dnd",
    avatar: null,
    topRole: "Membre",
  },
  {
    id: "5",
    username: "Mariette",
    discriminator: "0",
    status: "online",
    avatar: null,
    topRole: "Vétéran",
  },
  {
    id: "6",
    username: "Spectral",
    discriminator: "0",
    status: "online",
    avatar: null,
    topRole: "Modérateur",
  },
  {
    id: "7",
    username: "Yuna_dev",
    discriminator: "0",
    status: "idle",
    avatar: null,
    topRole: "Membre",
  },
  {
    id: "8",
    username: "nv0id",
    discriminator: "0",
    status: "offline",
    avatar: null,
    topRole: "Membre",
  },
];

// ====================================================
// RENDER — SERVER INFO
// ====================================================

function renderServerCard(data) {
  const card = document.getElementById("server-card");
  const icon = data.icon
    ? `<img src="https://cdn.discordapp.com/icons/${window.DISCORD_CONFIG.GUILD_ID}/${data.icon}.png?size=128" 
         alt="${data.name}" style="width:80px;height:80px;border-radius:50%;">`
    : `<span style="font-size:3rem">🏰</span>`;

  card.innerHTML = `
    <div class="server-info">
      <div class="server-banner">${icon}</div>
      <div class="server-details">
        <div class="server-name">${data.name}</div>
        <div class="server-desc">${data.description || "Aucune description."}</div>
        <div class="server-meta">
          <span class="meta-badge">
            <span class="dot"></span>
            ${data.approximate_presence_count ?? data.online ?? "?"} en ligne
          </span>
          <span class="meta-badge">👥 ${(data.member_count ?? data.members ?? "?").toLocaleString()} membres</span>
          <span class="meta-badge">📡 ${data.channels ?? "?"} salons</span>
        </div>
      </div>
    </div>
  `;

  // Mise à jour des stats hero
  animateNumber("stat-members", data.member_count ?? data.members ?? 0);
  animateNumber(
    "stat-online",
    data.approximate_presence_count ?? data.online ?? 0,
  );
  animateNumber("stat-channels", data.channels ?? 0);
}

// ====================================================
// RENDER — MEMBRES
// ====================================================

function renderMembers(members) {
  const grid = document.getElementById("members-grid");
  const displayed = members.slice(0, window.DISCORD_CONFIG.MAX_MEMBERS_DISPLAY);

  grid.innerHTML = displayed
    .map((m) => {
      const initial = (m.username || "?")[0].toUpperCase();
      const avatarHtml = m.avatar
        ? `<img src="https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.png?size=64" alt="${m.username}">`
        : `<div class="member-avatar-placeholder">${initial}</div>`;

      return `
      <div class="member-card">
        <div class="member-avatar">
          ${avatarHtml}
          <span class="status-dot ${m.status}"></span>
        </div>
        <div class="member-name">${m.username}</div>
        ${m.topRole ? `<span class="member-role">${m.topRole}</span>` : ""}
      </div>
    `;
    })
    .join("");
}

// ====================================================
// RENDER — AUTH STATE
// ====================================================

function renderLoggedIn(user) {
  const authDiv = document.getElementById("auth-status");
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`;

  authDiv.innerHTML = `
    <div class="nav-user" onclick="togglePanel()">
      <img class="nav-avatar" src="${avatarUrl}" alt="${user.username}" />
      <span class="nav-username">${user.username}</span>
      <span class="nav-online-dot"></span>
    </div>
  `;

  // Panel utilisateur
  const panel = document.getElementById("user-panel");
  const body = document.getElementById("panel-body");
  panel.style.display = "block";
  body.innerHTML = `
    <img class="panel-avatar" src="${avatarUrl}" alt="${user.username}" />
    <div>
      <div class="panel-username">${user.username}</div>
      <div class="panel-tag">${user.global_name || user.username}</div>
    </div>
  `;
}

function renderLoggedOut() {
  const authDiv = document.getElementById("auth-status");
  authDiv.innerHTML = `
    <button id="login-btn" class="btn-login" onclick="initiateLogin()">
      <svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor">
        <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.5 37.5 0 0 0 25.4.5a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 10.5 5a.2.2 0 0 0-.1.1C1.6 18.7-.9 32 .3 45.1a.2.2 0 0 0 .1.1 58.8 58.8 0 0 0 17.7 9 .2.2 0 0 0 .2-.1c1.4-1.9 2.6-3.8 3.6-5.9a.2.2 0 0 0-.1-.3 38.7 38.7 0 0 1-5.5-2.6.2.2 0 0 1 0-.4c.4-.3.7-.6 1.1-.9a.2.2 0 0 1 .2 0c11.5 5.2 24 5.2 35.3 0a.2.2 0 0 1 .2 0l1 .9a.2.2 0 0 1 0 .4 36.2 36.2 0 0 1-5.5 2.6.2.2 0 0 0-.1.3c1.1 2 2.3 4 3.6 5.9a.2.2 0 0 0 .2.1 58.7 58.7 0 0 0 17.8-9 .2.2 0 0 0 .1-.1c1.5-15.1-2.5-28.2-10.5-39.9a.2.2 0 0 0-.1-.1zM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1zm23.7 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1z"/>
      </svg>
      Connexion Discord
    </button>
  `;
  document.getElementById("user-panel").style.display = "none";
}

// ====================================================
// UTILS
// ====================================================

function togglePanel() {
  const panel = document.getElementById("user-panel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function showToast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el || !target) return;
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ====================================================
// CALLBACK — Gestion du token OAuth2
// ====================================================

function handleOAuthCallback() {
  // Si on est sur la page de callback (fragment URL)
  const hash = window.location.hash.substring(1);
  if (!hash) return false;

  const params = new URLSearchParams(hash);
  const token = params.get("access_token");
  const state = params.get("state");
  const savedState = sessionStorage.getItem("oauth_state");

  if (!token) return false;

  // Vérification du state CSRF
  if (state && savedState && state !== savedState) {
    showToast("❌ Erreur de sécurité (state mismatch)");
    return false;
  }

  sessionStorage.removeItem("oauth_state");
  saveToken(token);

  // Nettoyer le hash de l'URL
  history.replaceState(null, "", window.location.pathname);

  return token;
}

// ====================================================
// INITIALISATION
// ====================================================

async function init() {
  const cfg = window.DISCORD_CONFIG;

  // 1. Vérifier si on revient d'un callback OAuth2
  let token = handleOAuthCallback();

  // 2. Sinon, token existant ?
  if (!token) token = getToken();

  // 3. Si token trouvé, charger le profil utilisateur
  if (token) {
    try {
      const user = await fetchCurrentUser(token);
      renderLoggedIn(user);
      showToast(`✅ Connecté en tant que ${user.username}`);
    } catch (err) {
      console.warn("Token invalide ou expiré :", err);
      localStorage.removeItem("discord_token");
      renderLoggedOut();
    }
  } else {
    renderLoggedOut();
  }

  // 4. Charger les données du serveur
  if (cfg.USE_MOCK_DATA) {
    // Mode démo
    renderServerCard(MOCK_SERVER);
    renderMembers(MOCK_MEMBERS);
  } else {
    // Production : appel à votre backend/bot
    try {
      const [serverData, membersData] = await Promise.all([
        fetch(`${cfg.API_BASE_URL}/server`).then((r) => r.json()),
        fetch(`${cfg.API_BASE_URL}/members`)
          .then((r) => r.json())
          .then((d) => (Array.isArray(d) ? d : Object.values(d))),
      ]);
      renderServerCard(serverData);
      renderMembers(membersData);
    } catch (err) {
      console.error("Erreur API backend :", err);
      document.getElementById("server-card").innerHTML = `
        <div class="server-loading">
          <span>⚠️ Impossible de charger les données du serveur. Vérifiez votre backend.</span>
        </div>
      `;
    }
  }
}

// Démarrage
document.addEventListener("DOMContentLoaded", init);
