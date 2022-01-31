const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("search")
		.setDescription("Search on the wiki")
		.addStringOption(option =>
			option
				.setName("term")
				.setDescription("Your search term")
				.setRequired(true),
		),
	category: "wiki",
	async execute(interaction) {
		const searchTerm = interaction.options.getString("term");

		const url = `https://tpt2.fandom.com/api/api.php?action=query&list=search&srsearch=${searchTerm}&utf8=&format=json`;
		const response = await axios.get(url);

		const data = response.data;

		if (!data.query.search.length) {
			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("Search")
				.setDescription("No results found")
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" });

			await interaction.reply({ embeds: [embed] });
		} else {
			const defaultURL = "https://tpt2.fandom.com/wiki/";

			const options = [];
			let description = "Select an item in the dropdown\n\n";

			data.query.search.forEach(article => {
				options.push({
					label: article.title,
					description: "View this article",
					value: article.title,
				});
				description += `● [${article.title.replace("(", "").replace(")", "")}](${defaultURL + encodeURI(article.title)})\n`;
			});

			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId("searchSelect")
						.setPlaceholder("Nothing selected")
						.addOptions(options),
				);

			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("Search")
				.setDescription(description)
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" });

			const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

			interaction.client.once("interactionCreate", async dropdownInteraction => {
				if (!dropdownInteraction.isSelectMenu() || dropdownInteraction.message.id !== message.id || dropdownInteraction.customId !== "searchSelect") { return; }
				const selected = dropdownInteraction.values[0];
				const articleUrl = encodeURI(`https://tpt2.fandom.com/api/v1/Articles/Details?&titles=${selected}&abstract=500&width=400&height=400`);
				const articleResponse = await axios.get(articleUrl);
				const articleData = articleResponse.data;
				console.log(articleData);

				const article = articleData.items[Object.keys(articleData.items)[0]];

				if (!article) {
					const errorEmbed = new MessageEmbed()
						.setColor("2F3136")
						.setTitle("Error!")
						.setDescription("Error while getting the article, or the article dosnt exist!")
						.setTimestamp()
						.setFooter({ text: "Use /help to get help" });

					await interaction.editReply({ embeds: [errorEmbed], components: [] })
					return;
				}

				const articleEmbed = new MessageEmbed()
					.setColor("2F3136")
					.setTitle(article.title)
					.setURL(articleData.basepath + article.url)
					.setThumbnail(article.thumbnail)
					.setDescription(article.abstract + `[...](${articleData.basepath + article.url})\n\nRead the full article [here](${articleData.basepath + article.url})`)
					.setTimestamp()
					.setFooter({ text: "Use /help to get help" });

				await interaction.editReply({ embeds: [articleEmbed], components: [] });
			});
		}
	},
};