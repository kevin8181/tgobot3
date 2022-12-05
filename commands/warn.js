//jshint esversion:8
const { SlashCommandBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const modlog = require("../modlog");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns a user.')
    .addUserOption(option =>
		option.setName('user')
			.setDescription('The user to warn')
			.setRequired(true))
    .addStringOption(option =>
		option.setName('reason')
			.setDescription('Reason for the warn')
			.setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
		const author = interaction.user;

    interaction.reply(`:warning: Warned ${targetUser.toString()} with reason ${inlineCode(reason)}.`);
		modlog.create({
			type: "Warn",
			author,
			reason,
			targetUser,
			interaction,
		});

	},
};
