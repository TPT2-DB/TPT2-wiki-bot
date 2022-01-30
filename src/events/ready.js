const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, guildId, env } = require("../../config");

module.exports = {
	name: "ready",
	once: true,
	execute(client, commands) {
		console.log("Ready!");

		client.user.setActivity("TPT2s wiki", { type: "WATCHING" });

		const clientId = client.user.id;

		const rest = new REST({
			"version": "9",
		}).setToken(token);

		(async () => {
			try {
				if (env === "production") {
					const commandsArr = [];
					for (const key in commands) {
						commandsArr.push(commands[key]);
					}
					await rest.put(Routes.applicationCommands(clientId), {
						body: commandsArr,
					});
					console.log("Successfully registered commands globally");
				} else {
					const commandsArr = [];
					for (const key in commands) {
						commandsArr.push(commands[key]);
					}
					await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
						body: commandsArr,
					});
					console.log("Successfully registered commands locally");
				}
			} catch (err) {
				if (err) console.error(err);
			}
		})();
	},
};