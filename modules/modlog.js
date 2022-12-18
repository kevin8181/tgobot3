//jshint esversion:8
const { Client, Collection, Events, GatewayIntentBits, AuditLogEvent, REST, Routes, inlineCode, EmbedBuilder } = require('discord.js');
const humanizeDuration = require("humanize-duration");

const appealsURL = process.env.APPEALS_URL;

async function post(log, modlogChannel) { //posts a log object to the modlog channel, returns the message object

  const embed = new EmbedBuilder()
    .setColor("137c5a")
    .setDescription(string(log, true))
    .setAuthor({name: log.author.username, iconURL: log.author.displayAvatarURL()});

  return await modlogChannel.send({ embeds: [embed] });

}

class ModLog {
  constructor(raw, client) {
    this.type = raw.type;
    this.author = raw.author;
    this.reason = raw.reason;
    this.targetUser = raw.targetUser;
    this.duration = raw.duration;
    this.slowmodeInterval = raw.slowmodeInterval;
    this.targetChannel = raw.targetChannel;
    this.bulkDeleteNumber = raw.bulkDeleteNumber;

    //save log to db
    //then

    //post log to modlog channel
    post(raw, client.channels.fetch(process.env.MODLOG_CHANNEL_ID));

    //get message object returned from post and save to db

    //dm target user if applicable
    if ("targetUser" in raw) {
      client.users.send(raw.targetUser, string(raw, true) + "\nFor appeals: https://forms.gle/4jWKXXXjWPhp9GbW6");
    }
  }
  get string(includeReason) {
    let string;

    let humanDuration;
    if ("duration" in this) {
      humanDuration = humanizeDuration(this.duration);
    }

    if (this.type === "Warn") {
      string = `<:warn:1049224507598061628> Warned ${this.targetUser}`;
    }
    else if (log.type === "Slowmode") {
      string = `<:slowmode:1049227157156671508> Set slowmode to ${humanizeDuration(this.slowmodeInterval)} in ${this.targetChannel}`;
    }
    else if (this.type === "Bulk Delete") {
      string = `<:delete:1049226132622409749> Bulk deleted ${this.bulkDeleteNumber} messages in ${this.targetChannel}`;
    }
    else if (this.type === "Mute") {
      string = `<:timeout:1049257820882747432> Muted ${this.targetUser} for ${humanDuration}`;
    }
    else if (this.type === "Unmute") {
      string = `<:timeout:1049257820882747432> Unmuted ${this.targetUser}`;
    }
    else if (this.type === "Ban") {
      string = `<:ban:1049256901562609684> Banned ${this.targetUser}`;
    }
    else if (this.type === "Unban") {
      string = `<:ban:1049256901562609684> Unbanned ${this.targetUser}`;
    }

    if (includeReason == true) {
      string += ` with reason ${inlineCode(this.reason)}.`;
    }
    else {
      string += '.';
    }

    return string;
  }
}

module.exports = {
  ModLog
};

// {
//   type: string,
//   author: userObj,
//   reason: string,
//   targetUser: userObj,
//   duration: int(ms),
//   slowmodeInterval: int,
//   targetChannel: channelObj,
//   bulkDeleteNumber: int,
//   interaction: interaction
// };
