const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'leavemessagech',
    category: 'welcomer',
    run: async (client, message, args) => {
        // Ensure the server has more than 5 members before proceeding
        if (message.guild.memberCount < 5) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Your Server Doesn't Meet My 5 Member Criteria`
                        )
                ]
            })
        }

        // Get the current settings for auto-role
        const settings = await getSettingsar(message.guild)

        // Ensure the user has Administrator permission
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

        // Ensure the user has a higher role than the bot or is the server owner
        let isown = message.author.id == message.guild.ownerId
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }

        // Get the mentioned channel or a channel by ID
        let channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0])

        // If no valid channel was mentioned, send an error message
        if (!channel) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You didn't mention a channel to set as the leave message channel.`
                        )
                ]
            })
        }

        // Set the channel where the leave message will be sent
        let response = await client.util.setChannel(settings, channel, 'leave')

        // Send confirmation message
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(response)
            ]
        })
    }
}
