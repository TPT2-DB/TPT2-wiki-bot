const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {
	name: "ready",
	once: true,
	execute(client, commands) {
		console.log("Ready!");

		const clientId = client.user.id;

		const rest = new REST({
			"version": "9",
		}).setToken(process.env.TOKEN);

		(async () => {
			try {
				if (process.env.ENV === "production") {
					const commandsArr = [];
					for (const key in commands) {
						commandsArr.push(commands[key]);
					}
					await rest.put(Routes.applicationCommands(clientId), {
						body: commandsArr,
					});
					console.log("Successfully registerd commands globally");
				} else {
					const commandsArr = [];
					for (const key in commands) {
						commandsArr.push(commands[key]);
					}
					await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), {
						body: commandsArr,
					});
					console.log("Successfully registerd commands locally");
				}
			} catch (err) {
				if (err) console.error(err);
			}
		})();
	},
};