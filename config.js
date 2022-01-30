require("dotenv").config();

module.exports = {
	"token": process.env.DISCORD_BOT_TOKEN,
	"guildId": process.env.GUILD_ID,
	"env": process.env.MODE,
};