const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'wlisted',
    aliases: ['wlist', 'whitelisted'],
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 40) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | **Your Server Doesn't Meet My 40 Member Criteria**`
                        )
                ]
            })
        }
        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | **Only the server owner or an extra owner with a higher role than mine is authorized to execute this command.**`
                        )
                ]
            })
        }
        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            )
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:cross:1317733546261217300> | **Only the server owner or extra owner with a higher role than mine can execute this command.**






`
                )
            return message.channel.send({ embeds: [higherole] })
        }

        const antinuke = await client.db.get(`${message.guild.id}_antinuke`)
        if (!antinuke) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | **Seems that antinuke module is not enabled in this server.**`
                        )
                ]
            })
        } else {
            await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
                if (!data) {
                    await client.db.set(`${message.guild.id}_wl`, {
                        whitelisted: []
                    })
                    let users = data.whitelisted
                    let i
                    for (i = 0; i < users.length; i++) {
                        let data2 = await client.db?.get(
                            `${message.guild.id}_${users[i]}_wl`
                        )
                        if (data2) {
                            client.db?.delete(
                                `${message.guild.id}_${users[i]}_wl`
                            )
                        }
                    }
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<:cross:1317733546261217300> | **Please again run this command as the database was earlier not assigned.**`
                                )
                        ]
                    })
                } else {
                    const users = data.whitelisted
                    const mentions = []
                    if (users.length !== 0) {
                        users.forEach((userId) =>
                            mentions.push(
                                `<:stolen_emoji:1245702815737843772> <@${userId}> (${userId})`
                            )
                        )
                        const whitelisted = new MessageEmbed()
                            .setColor(client.color)
                            .setTitle(`__**Whitelisted Users**__`)
                            .setDescription(mentions.join('\n'))
                        message.channel.send({ embeds: [whitelisted] })
                    } else {
                        message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `<:cross:1317733546261217300> | **There are no whitelisted members in this server.**`
                                    )
                            ]
                        })
                    }
                }
            })
        }
    }
}
