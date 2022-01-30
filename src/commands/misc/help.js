const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const dataTypes = {
	3: "String",
	4: "Integer",
	5: "Boolean",
	6: "User",
	7: "Channel",
	8: "Role",
	9: "Mentionable",
	10: "Number",
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get help"),
	// option added in bot.js
	category: "misc",
	async execute(interaction) {
		const commandOption = interaction.options.getString("command");

		if (commandOption) {
			const command = interaction.client.commands[commandOption];

			const options = [];
			console.log(command.data.options);
			let def = "";
			for (const option of command.data.options) {
				let s = "";
				let desc = command.data.description;
				let name = command.data.name;
				console.log(option);
				if (!option.type) {
					s += ` ${option.name}`;
					desc = option.description;
					name = ` ${option.name}`;

					for (const subOption of option.options) {
						if (!subOption.type) {
							s += ` ${subOption.name}`;
							desc = subOption.description;
							name = ` ${option.name}`;

							for (const subSubOption of subOption.options) {
								s += ` <${subSubOption.name}: ${dataTypes[subSubOption.type]}>${subSubOption.required ? "?" : ""}`;
							}
						} else {
							s += ` <${subOption.name}: ${dataTypes[subOption.type]}>${subOption.required ? "?" : ""}`;
						}
					}
				} else {
					def += ` <${option.name}: ${dataTypes[option.type]}>${option.required ? "" : "?"}`;
				}
				if (s) {
					options.push({
						description: desc,
						info: s,
						name: name,
					});
				}
			}

			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("Help")
				.setDescription(`Showing help for \`${commandOption}\`\n\n**Permissions**\n\`${command.permission ? command.permissions.join(", ") : "Everyone"}\`\n**Options**`)
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" });
			if (def) {
				embed.addField(commandOption, `${command.data.description}\n\`/${commandOption}${def}\``);
			}

			if (!options.length) {
				embed.addField(commandOption, `${command.data.description}\n\`/${commandOption}\``, true);
			}

			for (const option of options) {
				embed.addField(option.name, `${option.description}\n\`/${commandOption}${option.info}\``, true);
			}

			interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		} else {
			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("Help")
				.setDescription("Use `/help <commandName>` to get more information about a specific command")
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" });

			const categories = {};

			for (const commandName of Object.keys(interaction.client.commands)) {
				const command = interaction.client.commands[commandName];
				if (!Object.keys(categories).includes(command.category)) {
					categories[command.category] = "";
				}

				categories[command.category] += `**${command.data.name}**\n${command.data.description}\n\`/${command.data.name}\`\n\n`;
			}

			for (const categoryName of Object.keys(categories)) {
				embed.addField(categoryName, categories[categoryName], true);
			}

			interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};