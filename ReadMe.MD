
# Sentinel - Advanced Discord Security & Management Bot

<div align="center">

![Sentinel Bot](https://img.shields.io/badge/Discord-Bot-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-v13-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A powerful, feature-rich Discord bot focused on server security, moderation, and management.**

[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=1335264559128383570&permissions=8&scope=bot) • [Support Server](https://discord.gg/eTneECMw4D) • [Replit](https://replit.com/@aliveisalive200/Sentinel)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Commands](#-commands)
- [Usage Examples](#-usage-examples)
- [Premium Features](#-premium-features)
- [Support](#-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛡️ Security & Anti-Nuke
- **Advanced Anti-Nuke Protection** - Prevent malicious actions like mass bans, kicks, and channel deletions
- **Beast Mode** - Enhanced security mode for maximum protection
- **Whitelist System** - Manage trusted users and roles
- **Extra Owner** - Assign additional server owners with special permissions
- **Auto-Moderation** - Automated content filtering and spam protection

### 👮 Moderation Tools
- **User Management** - Ban, kick, mute, and manage members
- **Channel Control** - Lock, hide, unlock channels
- **Role Management** - Add/remove roles, manage permissions
- **Message Moderation** - Purge messages, snipe deleted content
- **Media Channels** - Restrict channels to media-only content

### 🎉 Welcomer & Auto-Role
- **Custom Welcome Messages** - Personalized greeting messages
- **Welcome Channel** - Dedicated channel for new members
- **Auto-Role** - Automatically assign roles to new members
- **Welcome Test** - Preview your welcome messages

### 📝 Logging System
- **Comprehensive Logs** - Track all server activities
- **Channel Logs** - Monitor channel creation, deletion, and updates
- **Member Logs** - Track joins, leaves, and member updates
- **Message Logs** - Record message edits and deletions
- **Moderation Logs** - Keep track of all moderation actions
- **Role Logs** - Monitor role changes
- **Voice Logs** - Track voice channel activities

### 🎫 Ticket System
- **Support Tickets** - Create and manage support tickets
- **Custom Categories** - Organize tickets by category
- **Staff Management** - Assign staff to handle tickets

### 🎭 Reaction Roles
- **Interactive Role Assignment** - Let users choose their roles via reactions
- **Custom Emojis** - Use custom emojis for role selection

### 🎤 Voice Management
- **Join to Create** - Dynamic temporary voice channels
- **Voice Control** - Mute, deafen, kick, and move users
- **Voice Roles** - Assign roles based on voice channel activity
- **Bulk Actions** - Perform actions on all users in a voice channel

### 🎨 Custom Roles
- **Role Creation** - Create custom roles with specific names
- **Role Requirements** - Set requirement roles for custom roles
- **Special Roles** - Dedicated roles for girls, guests, VIPs, and officials

### 🤖 Auto-Responder
- **Custom Responses** - Set up automatic responses to keywords
- **Flexible Triggers** - Multiple trigger words per response

### 🎁 Giveaways
- **Giveaway System** - Host giveaways in your server
- **Time-Based** - Set duration for giveaways
- **Winner Selection** - Automatic random winner selection

### 🎮 Fun & Utility
- **8Ball** - Ask the magic 8-ball questions
- **Coin Flip** - Flip a coin
- **AFK System** - Set AFK status with custom messages
- **Avatar & Banner** - View user and server avatars/banners
- **Server Stats** - View detailed server statistics
- **Calculator** - Perform calculations in Discord

---

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) database
- Discord Bot Token ([Create one here](https://discord.com/developers/applications))

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alivelyyy/Sentinel.git
   cd Sentinel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   - Edit `config.json` with your credentials:
   ```json
   {
       "TOKEN": "YOUR_BOT_TOKEN",
       "MONGO_DB": "YOUR_MONGODB_URI",
       "cooldown": true,
       "owner": ["YOUR_DISCORD_ID"],
       "admin": ["YOUR_DISCORD_ID"],
       "np": ["YOUR_DISCORD_ID"],
       "invite": "YOUR_SUPPORT_SERVER_INVITE"
   }
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

### Replit Setup

1. **Fork the Repl**
   - Visit [Sentinel on Replit](https://replit.com/@aliveisalive200/Sentinel)
   - Click "Fork Repl"

2. **Configure Secrets**
   - Add your bot token and MongoDB URI in the Secrets tab
   - Update `config.json` with your Discord IDs

3. **Run the bot**
   - Click the "Run" button
   - The bot will automatically install dependencies and start

---

## ⚙️ Configuration

### Config.json Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `TOKEN` | Your Discord bot token | ✅ |
| `MONGO_DB` | MongoDB connection URI | ✅ |
| `cooldown` | Enable command cooldowns | ✅ |
| `owner` | Array of bot owner Discord IDs | ✅ |
| `admin` | Array of bot admin Discord IDs | ✅ |
| `np` | No prefix users (array of Discord IDs) | ✅ |
| `invite` | Support server invite link | ❌ |

---

## 📚 Commands

### Security Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `antinuke` | Configure anti-nuke settings | `&antinuke enable/disable` |
| `beastmode` | Toggle enhanced security mode | `&beastmode enable/disable` |
| `whitelist` | Add users to whitelist | `&whitelist add <user>` |
| `unwhitelist` | Remove users from whitelist | `&unwhitelist <user>` |
| `whitelisted` | View whitelisted users | `&whitelisted` |
| `extraowner` | Manage extra owners | `&extraowner add/remove <user>` |

### Moderation Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `ban` | Ban a member | `&ban <member> [reason]` |
| `kick` | Kick a member | `&kick <member> [reason]` |
| `mute` | Mute a member | `&mute <member> [duration] [reason]` |
| `unmute` | Unmute a member | `&unmute <member>` |
| `purge` | Delete messages | `&purge <amount>` |
| `lock` | Lock a channel | `&lock [channel]` |
| `unlock` | Unlock a channel | `&unlock [channel]` |
| `hide` | Hide a channel | `&hide [channel]` |
| `unhide` | Unhide a channel | `&unhide [channel]` |
| `nick` | Change nickname | `&nick <member> <nickname>` |

### Logging Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `autologs` | Setup auto-logging | `&autologs` |
| `channellog` | Set channel log channel | `&channellog <channel>` |
| `memberlog` | Set member log channel | `&memberlog <channel>` |
| `messagelog` | Set message log channel | `&messagelog <channel>` |
| `modlog` | Set moderation log channel | `&modlog <channel>` |
| `rolelog` | Set role log channel | `&rolelog <channel>` |
| `vclogs` | Set voice log channel | `&vclogs <channel>` |
| `showlogs` | View current log settings | `&showlogs` |
| `resetlogs` | Reset all logs | `&resetlogs` |

### Welcomer Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `welcome` | Configure welcome system | `&welcome enable/disable` |
| `welcomechannel` | Set welcome channel | `&welcomechannel <channel>` |
| `welcomemessage` | Set welcome message | `&welcomemessage <message>` |
| `welcometest` | Test welcome message | `&welcometest` |
| `autorole` | Configure auto-role | `&autorole add/remove <role>` |

### Voice Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `j2csetup` | Setup join to create | `&j2csetup` |
| `vcmute` | Mute user in VC | `&vcmute <member>` |
| `vcmuteall` | Mute all in VC | `&vcmuteall` |
| `vckick` | Kick user from VC | `&vckick <member>` |
| `vcmove` | Move user to another VC | `&vcmove <member> <channel>` |
| `vcrole` | Configure VC roles | `&vcrole setup` |

### Utility Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `help` | View all commands | `&help [command]` |
| `ping` | Check bot latency | `&ping` |
| `stats` | View bot statistics | `&stats` |
| `serverinfo` | View server information | `&serverinfo` |
| `userinfo` | View user information | `&userinfo [user]` |
| `avatar` | View user avatar | `&avatar [user]` |
| `banner` | View user banner | `&banner [user]` |

*Default prefix: `&` (customizable per server)*

---

## 💡 Usage Examples

### Setting Up Anti-Nuke Protection
```
&antinuke enable
&whitelist add @TrustedMod
&beastmode enable
```

### Configuring Welcome System
```
&welcome enable
&welcomechannel #welcome
&welcomemessage Welcome {user} to {server}! We now have {members} members!
&autorole add @Member
```

### Setting Up Logging
```
&autologs
# or manually:
&channellog #channel-logs
&memberlog #member-logs
&modlog #mod-logs
```

---

## 👑 Premium Features

Premium features are available for select servers. Contact the bot owner for premium access.

- Enhanced anti-nuke protection
- Priority support
- Custom features and configurations
- Faster response times

---

## 🆘 Support

Need help? Join our support server!

- **Support Server**: [Join Here](https://discord.gg/eTneECMw4D)
- **Report Issues**: Create an issue on GitHub
- **Feature Requests**: Suggest features in our support server

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Developed with 💖 by Alive**

- Discord: Join our [support server](https://discord.gg/eTneECMw4D)
- GitHub: [@Alivelyyy](https://github.com/Alivelyyy)

---

## 🙏 Acknowledgments

- Built with [Discord.js v13](https://discord.js.org/)
- Database: [MongoDB](https://www.mongodb.com/)
- Hosted on [Replit](https://replit.com/)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for the Discord community

</div>
