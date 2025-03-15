const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unlockall',
    aliases: ['ulall'],
    category: 'mod',
    premium: true,

    run: async (client, message, args) => {
        console.log("Command 'unlockall' triggered."); // Add this line for debugging
        
        if (!message.member.permissions.has('ADMINISTRATOR') || message.member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Manage Channels\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }

        // Loop through all channels in the guild
        message.guild.channels.cache.forEach(channel => {
            if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_CATEGORY') {
                if (channel.manageable) {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        SEND_MESSAGES: null, // Removing the specific overwrite
                        reason: `${message.author.tag} (${message.author.id})`
                    });
                }
            }
        });

        const emb = new MessageEmbed()
            .setDescription(`All channels have been unlocked`)
            .setColor(client.color);
        return message.channel.send({ embeds: [emb] });
    }
};
