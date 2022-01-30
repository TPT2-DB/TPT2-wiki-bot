const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bot")
		.setDescription("Get info about me"),
	category: "misc",
	async execute(interaction) {
		interaction.reply({
			content: "Command",
			ephemeral: true,
		});
	},
};