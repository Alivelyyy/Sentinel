const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const rex = ['1237086498076098762']
module.exports = {
    name: 'reload',
    aliases: ['rlcmd'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!rex.includes(message.author.id)) return
        try {
            let reload = false
            for (let i = 0; i < client.categories.length; i += 1) {
                let dir = client.categories[i]
                try {
                    if (!args[0]) {
                        const opp = new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:cross:1317733546261217300> | You didn't provided the command name.`
                            )
                        return message.channel.send({ embeds: [opp] })
                    }
                    delete require.cache[
                        require.resolve(`../../commands/${dir}/${args[0]}.js`)
                    ]
                    client.commands.delete(args[0])
                    const pull = require(`../../commands/${dir}/${args[0]}.js`)
                    client.commands.set(args[0], pull)
                    reload = true
                } catch {}
            }
            if (reload) {
                const op = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<:tick:1317818894546898985> | Successfully reloaded \`${args[0]}\``
                    )
                return message.channel.send({ embeds: [op] })
            }
            const notop = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:cross:1317733546261217300> | I was unable to reload \`${args[0]}\``
                )
            return message.channel.send({ embeds: [notop] })
        } catch (e) {
            const emesdf = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:cross:1317733546261217300> | I was unable to reload \`${args[0]}\``
                )
            return message.channel.send({ embeds: [emesdf] })
        }
    }
}
