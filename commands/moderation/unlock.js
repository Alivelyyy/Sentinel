const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js')

module.exports = {
    name: 'unlock',
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:cross:1317733546261217300>You must have \`Manage Channels\` permission to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) ||
            message.channel
        if (channel.manageable) {
            channel.permissionOverwrites.edit(message.guild.id, {
                SEND_MESSAGES: true,
                reason: `${message.author.tag} (${message.author.id})`
            })
            const emb = new MessageEmbed()
                .setDescription(
                    `<:tick:1317818894546898985> ${channel} has been unlocked for @everyone role`
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [emb] })
        } else {
            const embi = new MessageEmbed()
                .setDescription(
                    `<:cross:1317733546261217300>I don't have adequate permissions to unlock this channel.`
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [embi] })
        }
    }
}
