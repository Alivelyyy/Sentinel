const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const { exec } = require('child_process')
const choice = ['🚫']
const rex = ['1237086498076098762']

module.exports = {
    name: 'execute',
    aliases: ['exec'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!rex.includes(message.author.id)) return
        let value = args.join(' ')
        if (!value)
            return message.channel.send(client.util.codeText(`undefined`))
        const m = await message.channel
            .send(`❯_ ${args.join(' ')}`)
            .catch((e) => {
                return
            })
        exec(`${args.join(' ')}`, async (e, stdout, stderr) => {
            if (e) {
                return message.channel
                    .send({
                        embed: {
                            color: client.color,
                            description: client.util.codeText(e.message, 'bash')
                        }
                    })
                    .catch((e) => {
                        return
                    })
            }
            if (!stdout && !stderr)
                return message.channel
                    .send({
                        embed: {
                            color: client.color,
                            description: 'Completed without result'
                        }
                    })
                    .catch((e) => {
                        return
                    })
            const embed = new MessageEmbed().setColor(client.color)
            let output
            if (stdout) {
                if (stdout.length > 1024)
                    output = await client.util.haste(stdout)
                else output = client.util.codeText(stdout, 'bash')
                embed.setDescription(output)
            }
            if (stderr) {
                if (stderr.length > 1024)
                    output = await client.util.haste(stderr)
                else output = client.util.codeText(stderr, 'bash')
                embed.setColor(client.color)
                embed.setDescription(output)
            }
            let m = await message.channel
                .send({
                    embeds: [embed]
                })
                .catch((e) => {
                    return
                })
        })
    }
}
