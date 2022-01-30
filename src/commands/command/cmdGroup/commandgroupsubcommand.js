const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("commandgroupsubcommand")
		.setDescription("Commandgroup subcommand"),
	async execute(interaction) {
		interaction.reply({
			content: "Commandgroup subcommand",
			ephemeral: true,
		});
	},
};