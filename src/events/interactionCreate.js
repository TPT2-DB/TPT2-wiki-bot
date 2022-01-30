const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands[interaction.commandName];

		if (!command) return;

		let subcommandName = "";
		let subcommandGroupName = "";

		try {
			subcommandGroupName = interaction.options.getSubcommandGroup();
		} catch (err) {
			subcommandGroupName = "";
		}

		try {
			subcommandName = interaction.options.getSubcommand();
		} catch (err) {
			subcommandName = "";
		}

		if (subcommandGroupName && subcommandName) {
			const subcommand = interaction.client.subCommandGroups[interaction.commandName][subcommandGroupName][subcommandName];

			try {
				await subcommand.execute(interaction);
			} catch (err) {
				if (err) console.error(err);

				await interaction.reply({
					content: "An error occurred",
					ephemeral: true,
				});
			}
			return;
		} else if (subcommandName) {
			const subcommand = interaction.client.subCommands[interaction.commandName][subcommandName];
			try {
				await subcommand.execute(interaction);
			} catch (err) {
				if (err) console.error(err);

				await interaction.reply({
					content: "An error occurred",
					ephemeral: true,
				});
			}
			return;
		}

		let hasPermission = true;
		for (const permission of command.permissions || []) {
			if (!(interaction.memberPermissions.has(permission))) {
				hasPermission = false;
			}
		}
		if (interaction.memberPermissions.has("ADMINISTRATOR")) {
			hasPermission = true;
		}

		if (!hasPermission) {
			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("❌ | Missing Permission")
				.setDescription("You don't have the right permission to execute that command.")
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" })
				.addField("Needed permission:", `\`${command.permissions.join(", ")}\``);

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			if (err) console.error(err);

			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("❌ | Error")
				.setDescription("An error occurred while running the command")
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" });

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};