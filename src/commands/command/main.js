const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("command")
		.setDescription("This is a command"),
	async execute(interaction) {
		interaction.reply({
			content: "Command",
			ephemeral: true,
		});
	},
};