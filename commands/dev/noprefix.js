const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: 'noprefix',
    aliases: ['np'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!this.config.np.includes(message.author.id)) return
        const embed = new MessageEmbed().setColor(client.color)
        let prefix = message.guild.prefix
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}noprefix \`<add/remove/list>\` \`<user id or mention>\``
                        )
                ]
            })
        }
        if (args[0].toLowerCase() === `list`) {
            let listing = (await client.db.get(`noprefix_${client.user.id}`))
                ? await client.db.get(`noprefix_${client.user.id}`)
                : []
            let info = []
            let ss
            if (listing.length < 1) info.push(`No Users ;-;`)
            else {
                for (let i = 0; i < listing.length; i++) {
                    ss = await client.users.fetch(`${listing[i]}`)
                    info.push(`${i + 1}) ${ss.tag} (${ss.id})`)
                }
            }
            return await client.util.pagination(
                message,
                info,
                '**No Prefix **Users List :-'
            )
        }
        let check = 0
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}noprefix \`<add/remove/list>\` \`<user id or mention>\``
                        )
                ]
            })
        }

        // Process user mention or ID
        let userId = args[1].replace(/<@!?(\d+)>/, '$1'); // Extract user ID from mention
        let user = await client.users.fetch(userId).catch(() => {
            check += 1
        })
        if (check == 1 || !user) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide a valid user ID or mention.\n${prefix}noprefix \`<add/remove/list>\` \`<user id or mention>\``
                        )
                ]
            })
        }

        let added = (await client.db.get(`noprefix_${client.user.id}`))
            ? await client.db.get(`noprefix_${client.user.id}`)
            : []

        let opt = args[0].toLowerCase()
        if (opt == `add` || opt == `a` || opt == `+`) {
            if (added.includes(user.id)) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setDescription(`${client.emoji.cross} | <@${user.id}> is Already present in my **No Prefix**`)
                    ]
                })
            }
            added.push(`${user.id}`)
            added = client.util.removeDuplicates(added)
            await client.db.set(`noprefix_${client.user.id}`, added)
            client.util.noprefix()
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:tick:1317818894546898985> | **<@${user.id}> (${user.id})** has been added as a **No Prefix** user.`
                        )
                ]
            })
        }
        if (opt == `remove` || opt == `r` || opt == `-`) {
            added = added.filter((srv) => srv != `${user.id}`)
            added = client.util.removeDuplicates(added)
            await client.db.set(`noprefix_${client.user.id}`, added)
            client.util.noprefix()
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:tick:1317818894546898985> | **<@${user.id}> (${user.id})** has been removed from a **No Prefix** user.`
                        )
                ]
            })
        }
        message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(
                        `${prefix}noprefix \`<add/remove/list>\` \`<user id or mention>\``
                    )
            ]
        })
    }
}
