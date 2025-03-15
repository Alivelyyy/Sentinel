const { MessageEmbed } = require('discord.js')
const { getSettings } = require('../../models/mainrole')

module.exports = {
    name: 'mainrole',
    aliases: ['mr'],
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
        const settings = await getSettings(message.guild)
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
        const err = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields([
                { name: `\`mainrole\``, value: `**Shows the current page.**` },
                {
                    name: `\`mainrole add <role>\``,
                    value: `**Adds the provided role to Mainrole Configuration.**`
                },
                {
                    name: `\`mainrole remove <role>\``,
                    value: `**Removes the provided role from Mainrole Configuration.**`
                },
                {
                    name: `\`mainrole list\``,
                    value: `**Shows the Mainrole Configuration.**`
                },
                {
                    name: `\`mainrole reset\``,
                    value: `**Resets the Mainrole Configuration**\n‎ `
                }
            ])
            .setFooter({
                text: `Note: **AntiRole Ping Will Only Work When Your Server MainRole Are Configured**`,
                iconURL: client.user.displayAvatarURL()
            })
        const option = args[0]
        if (!option) {
            return message.channel.send({ embeds: [err] })
        }
        let response
        if (option.toLowerCase() === 'reset') {
            response = await addMainrole(message, null)
        } else if (option.toLowerCase() === 'add') {
            let input = args.slice(1).join(' ')
            const roles = findMatchingRoles(message.guild, input)
            if (roles.length === 0)
                response = '**No matching roles found matching your query**'
            else {
                response = await addMainrole(message, roles[0])
            }
        } else if (option.toLowerCase() === 'remove') {
            let input = args.slice(1).join(' ')
            const roles = findMatchingRoles(message.guild, input)
            if (roles.length === 0)
                response = '**No matching roles found matching your query**'
            else response = await removeMainrole(message, roles[0])
        } else if (option.toLowerCase() == 'list') {
            response = await listMainrole(message)
        } else return message.channel.send({ embeds: [err] })
        await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(response)
                    .setColor(client.color)
            ]
        })
    }
}

async function addMainrole({ guild, client }, role) {
    const settings = await getSettings(guild)
    if (role) {
        if (!guild.me.permissions.has('MANAGE_ROLES'))
            return `<:cross:1317733546261217300> | **I don't have the \`MANAGE_ROLES\` permission**`
        if (role.managed)
            return `<:cross:1317733546261217300> | **This role is managed by an integration.**`
    }
    if (!role) {
        settings.mainrole = []
        await settings.save()
        return `<:tick:1317818894546898985> | **Mainrole module was successfully disabled.**`
    }
    if (settings.mainrole.includes(role.id))
        return `<:cross:1317733546261217300> | **This role is already present in the mainrole config.**`
    if (settings.mainrole.length == 5)
        return `<:cross:1317733546261217300> | **Maximum 5 roles can be set for Mainroles.**`
    else settings.mainrole.push(role.id)
    await settings.save()
    return `<a:tk:1290911171389423717> | **Successfully **added** <@&${role.id}> to Mainrole Config.**`
}

async function removeMainrole({ guild, client }, role) {
    const settings = await getSettings(guild)
    if (role) {
        if (!guild.me.permissions.has('MANAGE_ROLES'))
            return `<:cross:1317733546261217300> | **I don't have the \`MANAGE_ROLES\` permission**`
    }
    if (!settings.mainrole.includes(role.id))
        return `<:cross:1317733546261217300> | **This role is not present in the mainrole config.**`
    if (settings.mainrole.length == 0)
        return `<:cross:1317733546261217300> | There are no Mainrole in my config.`
    else settings.mainrole = settings.mainrole.filter((r) => r !== role.id)
    await settings.save()
    return `<a:tk:1290911171389423717> | **Successfully **removed** <@&${role.id}> from Mainrole Config.**`
}

async function listMainrole({ guild, client }) {
    const settings = await getSettings(guild)
    if (settings.mainrole.length == 0)
        return 'There are no Mainrole available for this server.'
    let roles = settings.mainrole
        .map((role) => `<:stolen_emoji:1245702815737843772> <@&${role}> (${role})`)
        .join('\n')
    roles =
        `**Mainrole list for ${guild.name} - ${settings.mainrole.length}\n\n` +
        roles +
        `**`
    return roles
}

function findMatchingRoles(guild, query) {
    const ROLE_MENTION = /<?@?&?(\d{17,20})>?/
    if (!guild || !query || typeof query !== 'string') return []

    const patternMatch = query.match(ROLE_MENTION)
    if (patternMatch) {
        const id = patternMatch[1]
        const role = guild.roles.cache.find((r) => r.id === id)
        if (role) return [role]
    }

    const exact = []
    const startsWith = []
    const includes = []
    guild.roles.cache.forEach((role) => {
        const lowerName = role.name.toLowerCase()
        if (role.name === query) exact.push(role)
        if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role)
        if (lowerName.includes(query.toLowerCase())) includes.push(role)
    })
    if (exact.length > 0) return exact
    if (startsWith.length > 0) return startsWith
    if (includes.length > 0) return includes
    return []
}
