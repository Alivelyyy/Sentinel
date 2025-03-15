const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle(`**<:count:1317888645663035402> MemberCount**`)
            .setDescription(`<:member:1317888648456175737>  ${message.guild.memberCount}`)
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    }
}
