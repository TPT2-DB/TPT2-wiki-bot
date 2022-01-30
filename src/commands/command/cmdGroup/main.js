const { SlashCommandSubcommandGroupBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandSubcommandGroupBuilder()
		.setName("cmdgroup")
		.setDescription("This is a command group"),
};