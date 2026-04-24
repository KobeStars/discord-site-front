# 🎮 NexusHub — Site Web connecté à Discord

Base propre d'un site web avec intégration Discord OAuth2 + Bot API.

---

## 📁 Structure des fichiers

```
discord-site/
├── index.html       → Page principale du site
├── callback.html    → Page de retour après OAuth2 Discord
├── style.css        → Styles (thème sombre, design premium)
├── app.js           → Logique OAuth2, API Discord, rendu
├── config.js        → ⚠️ VOS PARAMÈTRES ICI (Client ID, Guild ID…)
└── README.md        → Ce fichier
```

---

## 🚀 Mise en place

### 1. Créer une application Discord

1. Rendez-vous sur [discord.com/developers/applications](https://discord.com/developers/applications)
2. Cliquez **New Application** → donnez un nom
3. Copiez le **Client ID** → collez dans `config.js`
4. Allez dans **OAuth2** → ajoutez votre URL de redirect :
   - En local : `http://localhost:5500/callback.html`
   - En prod : `https://votre-domaine.com/callback.html`

### 2. Configurer `config.js`

```js
CLIENT_ID: "123456789012345678",  // Votre Client ID
GUILD_ID: "987654321098765432",   // L'ID de votre serveur Discord
REDIRECT_URI: "http://localhost:5500/callback.html",
USE_MOCK_DATA: false,             // false en production
API_BASE_URL: "http://localhost:3000/api",
```

### 3. Lancer le site

```bash
# Avec VS Code Live Server, ou :
npx serve .
# Puis ouvrir http://localhost:5500
```

---

## 🤖 Backend Bot Discord (optionnel)

Pour récupérer les membres en ligne et les stats du serveur, vous avez besoin d'un bot Discord avec un backend.

### Backend Express.js minimal

```bash
npm install express discord.js cors
```

```js
// server.js
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const GUILD_ID = "VOTRE_GUILD_ID";

client.once("ready", () => {
  console.log(`Bot connecté : ${client.user.tag}`);
});

// Route : informations du serveur
app.get("/api/server", async (req, res) => {
  const guild = await client.guilds.fetch(GUILD_ID);
  res.json({
    name: guild.name,
    description: guild.description,
    icon: guild.icon,
    member_count: guild.memberCount,
    approximate_presence_count: guild.approximatePresenceCount,
    channels: guild.channels.cache.size,
  });
});

// Route : membres en ligne
app.get("/api/members", async (req, res) => {
  const guild = await client.guilds.fetch(GUILD_ID);
  const members = await guild.members.fetch({ withPresences: true });
  
  const online = members
    .filter(m => !m.user.bot)
    .map(m => ({
      id: m.user.id,
      username: m.user.username,
      avatar: m.user.avatar,
      status: m.presence?.status ?? "offline",
      topRole: m.roles.highest.name !== "@everyone" ? m.roles.highest.name : null,
    }))
    .slice(0, 20);

  res.json(online);
});

app.listen(3000, () => console.log("API lancée sur http://localhost:3000"));

client.login("VOTRE_BOT_TOKEN");
```

### Token du bot

1. Dans votre app Discord → **Bot** → **Reset Token** → copiez le token
2. Activez les **Privileged Intents** : `Server Members Intent` + `Presence Intent`
3. Lancez : `node server.js`

---

## 🔐 Sécurité

- Ne committez **jamais** votre bot token dans Git (`.gitignore`)
- Utilisez des variables d'environnement : `process.env.BOT_TOKEN`
- En production, activez HTTPS sur votre backend

---

## 🎨 Personnalisation

- **Couleurs** : Variables CSS dans `style.css` (`:root`)
- **Nom du site** : `SITE_NAME` dans `config.js`
- **Données mock** : Modifiez `MOCK_SERVER` et `MOCK_MEMBERS` dans `app.js`

---

## 📚 Ressources

- [Discord Developer Portal](https://discord.com/developers)
- [Discord.js Documentation](https://discord.js.org)
- [Discord OAuth2 Guide](https://discord.com/developers/docs/topics/oauth2)
