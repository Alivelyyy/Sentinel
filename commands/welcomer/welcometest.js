const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'welcometest',
    category: 'welcomer',
    run: async (client, message, args) => {
        if (message.guild.memberCount < 40) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | Your Server Doesn't Meet My 40 Member Criteria`
                        )
                ]
            })
        }
        const settings = await getSettingsar(message.guild)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
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
        let response = await client.util.sendPreview(settings, message.member)
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(response)
            ]
        })
    }
}
