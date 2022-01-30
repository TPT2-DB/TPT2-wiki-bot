const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("uptime")
		.setDescription("Get info about how long the bot has been up for"),
	category: "misc",
	async execute(interaction) {
		let totalSeconds = (interaction.client.uptime / 1000);
		const days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds % 60);

		const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

		const embed = new MessageEmbed()
			.setColor("2F3136")
			.setTitle("Uptime")
			.setDescription(uptime)
			.setTimestamp()
			.setFooter({ text: "Use /help to get help" });

		interaction.reply({ embeds: [embed] });
	},
};