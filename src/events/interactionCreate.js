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

		try {
			await command.execute(interaction);
		} catch (err) {
			if (err) console.error(err);

			await interaction.reply({
				content: "An error occurred",
				ephemeral: true,
			});
		}
	},
};