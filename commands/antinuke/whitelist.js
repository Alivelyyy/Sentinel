const {
    MessageEmbed,
    MessageSelectMenu,
    MessageButton,
    MessageActionRow
} = require('discord.js')
const { Satxler } = require('../../structures/Sentinel')
module.exports = {
    name: 'whitelist',
    aliases: ['wl'],
    
    category: 'security',
    premium: false,
    /**
     * @param {Satxler} client
     */
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
                            `<:cross:1317733546261217300> | Only the server owner or an extra owner with a higher role than mine is authorized to execute this command.`
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
                    `<:cross:1317733546261217300> | Only the server owner or extra owner with a higher role than mine can execute this command.






`
                )
            return message.channel.send({ embeds: [higherole] })
        }
        const antinuke = await client.db.get(`${message.guild.id}_antinuke`)
        if (!antinuke) {
            const dissable = new MessageEmbed().setColor(client.color)
                .setDescription(` ** ${message.guild.name} security settings <:antinuke:1290920329799008348>
Ohh NO! looks like your server doesn't enabled security

Current Status : <:red:1290545303409393727><:greentick:1290545729688965232> 

To enable use antinuke enable ** `)
            message.channel.send({ embeds: [dissable] })
        } else {
            const member =
                message.mentions.users.first() ||
                message.guild.members.cache.get(args[0])
            const wl = new MessageEmbed()
                .setColor(client.color)
                .setTitle(`__**Whitelist Commands**__`)
                .setDescription(
                    `**Adds user to whitelisted users which means that there will be no actions taken on the whitelisted members if they trigger the antinuke module.**`
                )
                .addFields([
                    {
                        name: `__**Usage**__`,
                        value: `<:stolen_emoji:1245702815737843772> \`${message.guild.prefix}whitelist @user/id\`\n<:stolen_emoji:1245702815737843772> \`${message.guild.prefix}wl @user\``
                    }
                ])
            if (!member) return message.channel.send({ embeds: [wl] })
            let data = await client.db?.get(
                `${message.guild.id}_${member.id}_wl`
            )
            if (data !== null) {
                if (
                    data.ban &&
                    data.kick &&
                    data.prune &&
                    data.botadd &&
                    data.serverup &&
                    data.memup &&
                    data.chcr &&
                    data.chup &&
                    data.chdl &&
                    data.rlcr &&
                    data.rldl &&
                    data.rlup &&
                    data.meneve &&
                    data.mngweb &&
                    data.mngstemo
                )
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<:cross:1317733546261217300> | <@${member.id}> is already a whitelisted member.`
                                )
                        ]
                    })
            }

            await client.db?.set(`${message.guild.id}_${member.id}_wl`, {
                ban: false,
                kick: false,
                prune: false,
                botadd: false,
                serverup: false,
                memup: false,
                chcr: false,
                chup: false,
                chdl: false,
                rlcr: false,
                rldl: false,
                rlup: false,
                meneve: false,
                mngweb: false,
                mngstemo: false
            })
            let menu = [
                {
                    label: 'Ban',
                    value: 'ban',
                    description: 'Whitelistes a member with ban permission'
                },
                {
                    label: 'Kick',
                    value: 'kick',
                    description: 'Whitelistes a member with kick permission'
                },
                {
                    label: 'Prune',
                    value: 'prune',
                    description: 'Whitelistes a member with prune permission'
                },
                {
                    label: 'Bot Add',
                    value: 'botadd',
                    description: 'Whitelistes a member with bot add permission'
                },
                {
                    label: 'Server Update',
                    value: 'serverup',
                    description:
                        'Whitelistes a member with server update permission'
                },
                {
                    label: 'Member Update',
                    value: 'memup',
                    description:
                        'Whitelistes a member with member update permission'
                },
                {
                    label: 'Channel Create',
                    value: 'chcr',
                    description:
                        'Whitelistes a member with channel create permission'
                },
                {
                    label: 'Channel Delete',
                    value: 'chdl',
                    description:
                        'Whitelistes a member with channel delete permission'
                },
                {
                    label: 'Channel Update',
                    value: 'chup',
                    description:
                        'Whitelistes a member with channel update permission'
                },
                {
                    label: 'Role Create',
                    value: 'rlc',
                    description:
                        'Whitelistes a member with role create permission'
                },
                {
                    label: 'Role Update',
                    value: 'rlup',
                    description:
                        'Whitelistes a member with role update permission'
                },
                {
                    label: 'Role Delete',
                    value: 'rldl',
                    description:
                        'Whitelistes a member with role update permission'
                },
                {
                    label: 'Mention Everyone',
                    value: 'meneve',
                    description:
                        'Whitelistes a member with mention everyone permission'
                },
                {
                    label: 'Manage Webhook',
                    value: 'mngweb',
                    description:
                        'Whitelistes a member with manage webhook permission'
                },
                {
                    label: 'Manage Stickers & Emojis',
                    value: 'mngstemo',
                    description:
                        'Whitelistes a member with Manage stickers & emojis permission'
                }
            ]
            let menuSelect = new MessageSelectMenu()
                .setCustomId('wl')
                .setMinValues(1)
                .setOptions([menu])
                .setPlaceholder('Choose Your Options')
            let btn = new MessageButton()
                .setLabel('Add This User To All Categories')
                .setStyle('PRIMARY')
                .setCustomId('catWl')
            const row2 = new MessageActionRow().addComponents([btn])
            const row = new MessageActionRow().addComponents([menuSelect])
            let msg
            if (
                !data?.ban &&
                !data?.kick &&
                !data?.prune &&
                !data?.botadd &&
                !data?.serverup &&
                !data?.memup &&
                !data?.chcr &&
                !data?.chup &&
                !data?.chdl &&
                !data?.rlcr &&
                !data?.rldl &&
                !data?.rlup &&
                !data?.meneve &&
                !data?.mngweb &&
                !data?.mngstemo
            ) {
                msg = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL:
                                    message.guild.iconURL({ dynamic: true }) ||
                                    client.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `Developed by 💞 By Alive`
                            })
                            .setColor(client.color)
                            .setDescription(
                                `<:red:1290545303409393727><:greentick:1290545729688965232> : **Ban**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Kick**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Prune**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Bot Add**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Server Update\n<:red:1290545303409393727><:greentick:1290545729688965232> : Member Role Update**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Channel Create**\n<:red:1290545303409393727><:greentick:1290545729688965232> :** Channel Delete**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Channel Update**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Role Create**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Role Delete**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Role Update**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Mention** @everyone\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Webhook Management**\n<:red:1290545303409393727><:greentick:1290545729688965232> : **Emojis & Stickers Management**`
                            )
                            .addFields(
                                {
                                    name: `**Executor**`,
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: `**Target**`,
                                    value: `<@!${member.id}>`,
                                    inline: true
                                }
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                    ],
                    components: [row, row2]
                })
            } else {
                msg = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL:
                                    message.guild.iconURL({ dynamic: true }) ||
                                    client.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `Developed by 💞 By Alive`
                            })
                            .setColor(client.color)
                            .setDescription(
                                `${data.ban ? '<:red:1290545303409393727><:greentick:1290545729688965232> ' : '<:red:1290545303409393727><:greentick:1290545729688965232> '}: **Ban**\n${data.kick ? '<:red:1290545303409393727><:greentick:1290545729688965232> ' : '<:red:1290545303409393727><:greentick:1290545729688965232> '}: **Kick**\n${data.prune ? '<:red:1290545303409393727><:greentick:1290545729688965232> ' : '<:red:1290545303409393727><:greentick:1290545729688965232> '}: **Prune**\n${data.botadd ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Bot Add**\n${data.serverup ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Server Update\n${data.memup ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: Member Role Update**\n${data.chcr ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Channel Create**\n${data.chdl ? '<:red:1290545303409393727><:greentick:1290545729688965232> ' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: ** Channel Delete**\n${data.chup ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Channel Update**\n${data.rlcr ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Role Create**\n${data.rldl ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Role Delete**\n${data.rlup ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Role Update**\n${data.meneve ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Mention** @everyone\n${data.mngweb ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Webhook Management**\n${data.mngstemo ? '<:red:1290545303409393727><:greentick:1290545729688965232>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Emojis & Stickers Management**`
                            )
                            .addFields(
                                {
                                    name: `**Executor**`,
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: `**Target**`,
                                    value: `<@!${member.id}>`,
                                    inline: true
                                }
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                    ],
                    components: [row, row2]
                })
            }
            const collector = msg.createMessageComponentCollector({
                filter: (i) => (i.isSelectMenu() || i.isButton) && i.user,
                time: 60000
            })
            collector.on('collect', async (i) => {
                i = await i
                if (i.user.id !== message.author.id)
                    return i.reply({
                        content: `Only <@${message.author.id}> Can Use This Intraction`,
                        ephemeral: true
                    })
                if (i.isButton()) {
                    if (i.customId == 'catWl') {
                        i.deferUpdate()
                        data = await client.db?.get(
                            `${i.guild.id}_${member.id}_wl`
                        )
                        data.ban = true
                        data.kick = true
                        data.prune = true
                        data.botadd = true
                        data.serverup = true
                        data.memup = true
                        data.chcr = true
                        data.chdl = true
                        data.chup = true
                        data.rlcr = true
                        data.rldl = true
                        data.rlup = true
                        data.meneve = true
                        data.mngweb = true
                        data.mngstemo = true
                        menuSelect = menuSelect.setDisabled(true)
                        btn = btn.setDisabled(true)
                        const newRow = new MessageActionRow().addComponents([
                            menuSelect
                        ])
                        const newRow1 = new MessageActionRow().addComponents([
                            btn
                        ])
                        msg.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setAuthor({
                                        name: message.guild.name,
                                        iconURL:
                                            message.guild.iconURL({
                                                dynamic: true
                                            }) || client.user.displayAvatarURL()
                                    })
                                    .setFooter({
                                        text: `Developed by 💞 By Alive`
                                    })
                                    .setColor(client.color)
                                    .setDescription(
                                        `${data.ban ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Ban**\n${data.kick ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Kick**\n${data.prune ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Prune**\n${data.botadd ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Bot Add**\n${data.serverup ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Server Update\n${data.memup ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: Member Role Update**\n${data.chcr ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Channel Create**\n${data.chdl ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: ** Channel Delete**\n${data.chup ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Channel Update**\n${data.rlcr ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Role Create**\n${data.rldl ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Role Delete**\n${data.rlup ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Role Update**\n${data.meneve ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Mention** @everyone\n${data.mngweb ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Webhook Management**\n${data.mngstemo ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Emojis & Stickers Management**`
                                    )
                                    .addFields(
                                        {
                                            name: `**Executor**`,
                                            value: `<@!${i.user.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `**Target**`,
                                            value: `<@!${member.id}>`,
                                            inline: true
                                        }
                                    )
                                    .setThumbnail(
                                        client.user.displayAvatarURL()
                                    )
                            ],
                            components: [newRow, newRow1]
                        })
                        let wls = []
                        const wl = await client.db?.get(
                            `${i.guild.id}_${member.id}_wl`
                        )
                        if (wl)
                            if (wl.length > 0) {
                                wl.map((w) => wls.push(w))
                            }
                        wls.push(member.id)
                        let already1 = await client.db.get(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )

                        if (already1) {
                            await client.db.pull(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                            await client.db.push(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                        } else {
                            await client.db.push(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                        }

                        return client.db?.set(
                            `${i.guild.id}_${member.id}_wl`,
                            data
                        )
                    }
                }
                if (i.isSelectMenu()) {
                    data = await client.db?.get(`${i.guild.id}_${member.id}_wl`)
                    i.deferUpdate()
                    if (i.values.includes('ban')) {
                        data.ban = data.ban ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Ban**\n${data.kick ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Kick**\n${data.prune ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Prune**\n${data.botadd ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Bot Add**\n${data.serverup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Server Update\n${data.memup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: Member Role Update**\n${data.chcr ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Channel Create**\n${data.chdl ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: ** Channel Delete**\n${data.chup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Channel Update**\n${data.rlcr ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Role Create**\n${data.rldl ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744>'}: **Role Delete**\n${data.rlup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Role Update**\n${data.meneve ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Mention** @everyone\n${data.mngweb ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Webhook Management**\n${data.mngstemo ? '<:redwrong:1290545864191774753><:green:1290545798848712744> ' : '<:redwrong:1290545864191774753><:green:1290545798848712744> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('kick')) {
                        data.kick = data.kick ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985>' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('prune')) {
                        //aise
                        data.prune = data.prune ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:icons_cross:1245257113824137298><:tick:1317818894546898985>'}: **Ban**\n${data.kick ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985>' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:icons_cross:1245257113824137298><:tick:1317818894546898985>'}: **Prune**\n${data.botadd ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:icons_cross:1245257113824137298><:tick:1317818894546898985> '}: **Bot Add**\n${data.serverup ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('botadd')) {
                        data.botadd = data.botadd ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:icons_cross:1245257113824137298><:tick:1317818894546898985> '}: **Ban**\n${data.kick ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('serverup')) {
                        data.serverup = data.serverup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('memup')) {
                        data.memup = data.memup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:icons_cross:1245257113824137298><:tick:1317818894546898985> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chcr')) {
                        data.chcr = data.chcr ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by ${client.user.username} Development`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:icons_cross:1245257113824137298><:tick:1317818894546898985> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chdl')) {
                        data.chdl = data.chdl ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chup')) {
                        data.chup = data.chup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rlc')) {
                        data.rlcr = data.rlcr ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rldl')) {
                        data.rldl = data.rldl ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rlup')) {
                        data.rlup = data.rlup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('meneve')) {
                        data.meneve = data.meneve ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('mngweb')) {
                        data.mngweb = data.mngweb ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('mngstemo')) {
                        data.mngstemo = data.mngstemo ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Developed by 💞 By Alive`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Ban**\n${data.kick ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Kick**\n${data.prune ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Prune**\n${data.botadd ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Bot Add**\n${data.serverup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Server Update\n${data.memup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: Member Role Update**\n${data.chcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Create**\n${data.chdl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: ** Channel Delete**\n${data.chup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Channel Update**\n${data.rlcr ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Create**\n${data.rldl ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Delete**\n${data.rlup ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Role Update**\n${data.meneve ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Mention** @everyone\n${data.mngweb ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Webhook Management**\n${data.mngstemo ? '<:Satxler_DNo:1218049715799851058><:enable:1318037008500658248> ' : '<:disable:1318037005493342280><:Satxler_Eno:1218051067389153290> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    let wls = []
                    const wl = await client.db?.get(
                        `${message.guild.id}_${member.id}_wl`
                    )
                    if (wl !== null)
                        if (wl.length > 0) {
                            wl.map((w) => wls.push(w))
                        }
                    wls.push(member.id)
                    let arr = [...new Set(wls)]
                    client.db?.set(`${message.guild.id}_${member.id}_wl`, arr)
                    menuSelect = menuSelect.setDisabled(true)
                    btn = btn.setDisabled(true)
                    const newRow = new MessageActionRow().addComponents([
                        menuSelect
                    ])
                    const newRow1 = new MessageActionRow().addComponents([btn])
                    if (msg)
                        msg.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setAuthor({
                                        name: message.guild.name,
                                        iconURL:
                                            message.guild.iconURL({
                                                dynamic: true
                                            }) || client.user.displayAvatarURL()
                                    })
                                    .setFooter({
                                        text: `Developed by 💞 By Alive`
                                    })
                                    .setColor(client.color)
                                    .setDescription(
                                        `${data.ban ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Ban**\n${data.kick ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : "<:red:1290545303409393727><:greentick:1290545729688965232>"}: **Kick**\n${data.prune ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Prune**\n${data.botadd ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Bot Add**\n${data.serverup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Server Update\n${data.memup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: Member Role Update**\n${data.chcr ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Channel Create**\n${data.chdl ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: ** Channel Delete**\n${data.chup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Channel Update**\n${data.rlcr ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Role Create**\n${data.rldl ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Role Delete**\n${data.rlup ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Role Update**\n${data.meneve ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Mention** @everyone\n${data.mngweb ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Webhook Management**\n${data.mngstemo ? '<:redwrong:1290545864191774753><:green:1290545798848712744>' : '<:red:1290545303409393727><:greentick:1290545729688965232>'}: **Emojis & Stickers Management**`
                                    )
                                    .addFields(
                                        {
                                            name: `**Executor**`,
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `**Target**`,
                                            value: `<@!${member.id}>`,
                                            inline: true
                                        }
                                    )
                                    .setThumbnail(
                                        client.user.displayAvatarURL()
                                    )
                            ],
                            components: [newRow, newRow1]
                        })
                    let wlls = []
                    const wll = await client.db?.get(
                        `${i.guild.id}_${member.id}_wl`
                    )
                    if (wll)
                        if (wll.length > 0) {
                            wll.map((w) => wlls.push(w))
                        }
                    wls.push(member.id)

                    let already = await client.db.get(
                        `${message.guild.id}_wl.whitelisted`,
                        member.id
                    )

                    if (already) {
                        await client.db.pull(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                        await client.db.push(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                    } else {
                        await client.db.push(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                    }

                    return client.db?.set(
                        `${message.guild.id}_${member.id}_wl`,
                        data
                    )
                }
            })
        }
    }
}
