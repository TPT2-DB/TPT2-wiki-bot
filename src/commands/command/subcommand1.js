const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("subcommand1")
		.setDescription("Subcommand 1"),
	async execute(interaction) {
		interaction.reply({
			content: "Subcommand 1",
			ephemeral: true,
		});
	},
};