//jshint esversion:8
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const modlog = require("../modules/modlog");
const parse = require('parse-duration');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a user.')
    .addUserOption(option =>
			option.setName('user')
				.setDescription('The user to mute')
				.setRequired(true))
    .addStringOption(option =>
			option.setName('duration')
				.setDescription('Duration of the mute')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason for the mute')
				.setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {

    const member = interaction.options.getMember('user');
		const targetUser = member.user;
		const durationRaw = interaction.options.getString('duration');
		const duration = parse(durationRaw);
    const reason = interaction.options.getString('reason');
		const author = interaction.user;

		await member.timeout(duration, reason)
			.then(function() {
				modlog.create({
					type: "Mute",
					author,
					reason,
					targetUser,
					duration,
					interaction
				})
					.then(string => interaction.reply(string))
			})
	},
};
