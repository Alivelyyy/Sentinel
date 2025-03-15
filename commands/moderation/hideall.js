const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js')

module.exports = {
    name: 'hideall',
    aliases: ['hall'],
    category: 'mod',
    premium: true,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS') || message.member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Manage Channels\` permission to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        
        // Loop through all channels in the guild
        message.guild.channels.cache.forEach(channel => {
            if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_CATEGORY') {
                if (channel.manageable) {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        VIEW_CHANNEL: false,
                        reason: `${message.author.tag} (${message.author.id})`
                    })
                }
            }
        });
        
        const emb = new MessageEmbed()
            .setDescription(`All channels have been hidden for @everyone role`)
            .setColor(client.color)
        return message.channel.send({ embeds: [emb] })
    }
}
