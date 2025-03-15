const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'leavemessage',
    aliases: ['leavemsg'],
    category: 'welcomer',
    run: async (client, message, args) => {
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
        const settings = await getSettingsar(message.guild)
        let response
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
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You have to provide the required arguments.\nOptions: \`autodel\`, \`color\`, \`description\`, \`thumbnail\`, \`title\``
                        )
                ]
            })
        }
        let option = args[0].toLowerCase()
        if (option == 'autodel') {
            let time = Math.round(args[1])
            if (!args[0] || isNaN(time)) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `You didn't provide valid seconds for auto-delete.\nFor disabling autodel: \`0\`.\nFor autodel: \`<1 - 30>\``
                            )
                    ]
                })
            }
            if (time > 30 || time < 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `You didn't provide valid seconds for auto-delete.\nFor disabling autodel: \`0\`.\nFor autodel: \`<1 - 30>\``
                            )
                    ]
                })
            }
            settings.leave.autodel = time
            settings.save()
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `Updated the leave message's auto-delete time to \`${time}s\`.`
                        )
                ]
            })
        }
        if (option == 'color') {
            let color = args[1]
            if (!color || !client.util.isHex(color)) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `You must provide a valid hex code for leave embed.`
                            )
                    ]
                })
            }
            settings.leave.embed.color = color
            settings.save()
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `Updated the embed's color configuration to \`${color}\`.`
                        )
                ]
            })
        }
        if (option == 'description') {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setTitle(`Embed Description Variables`)
                            .setDescription(
                                "`{server}` - Server Name\n`{count}` - Server Members\n`{member:name}` - Member's Username\n`{member:mention}` - Member's Mention\n`{member:id}` - Member's Id\n`{member:created_at}` - Member's Account Creation Timestamp"
                            )
                    ]
                })
            }
            let desc = args.slice(1).join(' ')
            response = await client.util.setDescription(settings, desc, 'leave')
        }
        if (option == 'thumbnail') {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `You didn't provide the status of thumbnail.\nStatus: \`on\`, \`off\``
                            )
                    ]
                })
            }
            let status = args[1].toUpperCase()
            if (!['ON', 'OFF'].includes(status)) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `You didn't provide a valid status for thumbnail.\nStatus: \`on\`, \`off\``
                            )
                    ]
                })
            }
            response = await client.util.setThumbnail(settings, status, 'leave')
        }
        if (option == 'title') {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setTitle(`Embed Title Variables`)
                            .setDescription(
                                "`{server}` - Server Name\n`{count}` - Server Members\n`{member:name}` - Member's Username"
                            )
                    ]
                })
            }
            let title = args.slice(1).join(' ')
            response = await client.util.setTitle(settings, title, 'leave')
        }
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        response
                            ? response
                            : `You have to provide the required arguments.\nOptions: \`color\`, \`description\`, \`thumbnail\`, \`title\``
                    )
            ]
        })
    }
}
