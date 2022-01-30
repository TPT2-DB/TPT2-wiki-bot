const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("subcommand2")
		.setDescription("Subcommand 2"),
	async execute(interaction) {
		interaction.reply({
			content: "Subcommand 2",
			ephemeral: true,
		});
	},
};