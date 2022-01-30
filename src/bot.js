const { Client, Intents } = require("discord.js");
const fs = require("fs");
const dirTree = require("directory-tree");

require("dotenv").config();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
	],
});

const commandTree = {};
const commands = [];
client.commands = {};
client.subCommands = {};
client.subCommandGroups = {};

const createTree = (dir, indents, cmdName, subCmdGroup) => {
	const folders = [];
	const files = dirTree(dir, { extensions: /\.js/ });
	for (const c in files.children) {
		const child = files.children[c];

		if (indents === 0) {
			if (!child.name.includes(".")) {
				commandTree[child.name] = [];
				folders.push(child);
			} else {
				commandTree[child.name] = child.path;
			}
		} else if (indents === 1) {
			if (!child.name.includes(".")) {
				commandTree[cmdName][child.name] = [];
				folders.push(child);
			} else {
				commandTree[cmdName][child.name] = child.path;
			}
		} else if (indents === 2) {
			if (!child.name.includes(".")) {
				console.error("Cannot have multiple subcommand groups in each other");
			} else {
				commandTree[cmdName][subCmdGroup][child.name] = child.path;
			}
		}
	}
	if (indents === 0) {
		for (const folder of folders) {
			createTree(folder.path, indents + 1, folder.name, subCmdGroup);
		}
	} else if (indents === 1) {
		for (const folder of folders) {
			createTree(folder.path, indents + 1, cmdName, folder.name);
		}
	}
};

createTree("./src/commands", 0, undefined, undefined);

const createCommands = (tree) => {
	const folders = [];
	for (const childName in tree) {
		const child = tree[childName];

		if (childName.endsWith(".js")) {
			const command = require(`./${child.replace("src/", "")}`);

			client.commands[command.data.name] = command;
			commands.push(command.data.toJSON());
		} else if (!childName.includes(".")) {
			folders.push(child);
		}
	}

	for (const folder of folders) {

		const subCommands = [];
		const subFolder = folder;
		let mainCmd = undefined;
		const subGroups = {};

		for (const subChildName in subFolder) {
			const subChild = subFolder[subChildName];

			if (subChildName === "main.js") {
				const command = require(`./${subChild.replace("src/", "")}`);

				mainCmd = command;
			} else if (subChildName.endsWith(".js")) {
				const command = require(`./${subChild.replace("src/", "")}`);

				subCommands.push(command);
			} else if (!subChildName.includes(".")) {
				subGroups[subChildName] = [];
				subGroups[subChildName].subcmds = [];

				let mainSubGroupFile = undefined;

				for (const subGroupChildName in subChild) {

					const subGroupChild = subChild[subGroupChildName];

					if (subGroupChildName === "main.js") {
						const command = require(`./${subGroupChild.replace("src/", "")}`);

						mainSubGroupFile = command;
					} else if (subGroupChildName.endsWith(".js")) {
						const command = require(`./${subGroupChild.replace("src/", "")}`);

						subGroups[subChildName]["subcmds"].push(command);
					}
					subGroups[subChildName].main = mainSubGroupFile;
				}
			}
		}
		client.subCommands[mainCmd.data.name] = {};
		for (const subcmd of subCommands) {
			mainCmd.data.addSubcommand(subcmd.data);
			client.subCommands[mainCmd.data.name][subcmd.data.name] = subcmd;
		}
		client.subCommandGroups[mainCmd.data.name] = {};
		for (const subGroupName in subGroups) {
			const subGroup = subGroups[subGroupName];
			client.subCommandGroups[mainCmd.data.name][subGroup.main.data.name] = {};

			const subGroupMain = subGroup.main;

			for (const subcmd of subGroup.subcmds) {
				subGroupMain.data.addSubcommand(subcmd.data);
				client.subCommandGroups[mainCmd.data.name][subGroup.main.data.name][subcmd.data.name] = subcmd;
			}
			mainCmd.data.addSubcommandGroup(subGroupMain.data);
		}
		client.commands[mainCmd.data.name] = mainCmd;
		commands.push(mainCmd.data.toJSON());
	}
};

createCommands(commandTree);

const eventFiles = fs
	.readdirSync("./src/events")
	.filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
	} else {
		client.on(event.name, (...args) => event.execute(...args, commands));
	}
}

let cmdTreeStr = "Commands:";
for (const cmdName in client.commands) {
	const cmd = client.commands[cmdName];

	cmdTreeStr += `\n⊢ ${cmd.data.name}`;

	for (const childName in cmd.data.options) {
		const child = cmd.data.options[childName];
		cmdTreeStr += `\n  ⊢ ${child.name}`;

		for (const subChildName in child.options) {
			const subChild = child.options[subChildName];
			cmdTreeStr += `\n    ⊢ ${subChild.name}`;
		}
	}
}

console.log(cmdTreeStr);

client.login(process.env.TOKEN);