const CONFIG = {
  CLIENT_ID: "1497334686253322270",
  REDIRECT_URI: window.location.origin + "/callback.html",
  SCOPES: ["identify", "guilds", "guilds.members.read"],
  GUILD_ID: "1432820555073061109",
  API_BASE_URL: "https://discord-site-production.up.railway.app/api",
  SITE_NAME: "NexusHub",
  SERVER_DESCRIPTION: "Bienvenue sur notre communauté Discord !",
  MAX_MEMBERS_DISPLAY: 20,
  USE_MOCK_DATA: false,
};

window.DISCORD_CONFIG = CONFIG;
