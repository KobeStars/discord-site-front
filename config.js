/**
 * =====================================================
 *   CONFIGURATION — DISCORD SITE
 *   Remplissez ces valeurs avant de lancer le site.
 * =====================================================
 */

const CONFIG = {
  // ---------------------------------------------------
  // 1. APPLICATION DISCORD
  //    → https://discord.com/developers/applications
  // ---------------------------------------------------
  CLIENT_ID: "1497334686253322270",
  REDIRECT_URI: "http://localhost:5500/callback.html",
  // L'URL de redirection après login Discord
  // Doit être ajoutée dans : Applications → OAuth2 → Redirects
  REDIRECT_URI: window.location.origin + "/callback.html",

  // Permissions demandées à l'utilisateur
  SCOPES: ["identify", "guilds", "guilds.members.read"],

  // ---------------------------------------------------
  // 2. SERVEUR DISCORD
  //    → L'ID de votre serveur (clic droit → Copier l'ID)
  // ---------------------------------------------------
  GUILD_ID: "1432820555073061109",

  // ---------------------------------------------------
  // 3. BACKEND / BOT (optionnel)
  //    Si vous avez une API backend avec votre bot Discord
  //    pour récupérer les membres, canaux, etc.
  // ---------------------------------------------------
  API_BASE_URL: "http://localhost:3000/api",

  // ---------------------------------------------------
  // 4. OPTIONS D'AFFICHAGE
  // ---------------------------------------------------
  SITE_NAME: "NexusHub",
  SERVER_DESCRIPTION: "Bienvenue sur notre communauté Discord !",
  MAX_MEMBERS_DISPLAY: 20,

  // Pour demo sans backend : activer les données fictives
  USE_MOCK_DATA: false, // Mettre false en production
};

// Ne pas modifier en dessous
window.DISCORD_CONFIG = CONFIG;
