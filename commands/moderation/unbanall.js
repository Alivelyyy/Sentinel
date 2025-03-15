const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'unbanall',
    aliases: ['uall'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | You must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | I must have \`Ban Members\` permissions to execute this command.`
                        )
                ]
            })
        }
        let isown = message.author.id == message.guild.ownerId
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        message.guild.bans.fetch().then((bans) => {
            if (bans.size == 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:cross:1317733546261217300> | There is no one banned in this server.`
                            )
                    ]
                })
            } else {
                let i = 0
                bans.forEach((ban) => {
                    message.guild.members.unban(ban.user.id)
                    i++
                })
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:tick:1317818894546898985> | Successfully *Unbanned* \`${i}\` users from the server.`
                            )
                    ]
                })
            }
        })
    }
}
