const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'emojilist',
    aliases: ['emojis'],
    category: 'info',
    run: async (client, message, args) => {
        let Emojis = '';
        let EmojisAnimated = '';
        let EmojiCount = 0;
        let Animated = 0;
        let OverallEmojis = 0;
        
        function Emoji(id) {
            return client.emojis.cache.get(id).toString();
        }
        
        message.guild.emojis.cache.forEach((emoji) => {
            OverallEmojis++;
            if (emoji.animated) {
                Animated++;
                EmojisAnimated += Emoji(emoji.id);
            } else {
                EmojiCount++;
                Emojis += Emoji(emoji.id);
            }
        });
        
        const emojis = message.guild.emojis;
        if (emojis.size === 0)
            return message.channel.send('No Emoji Found');

        const embed = {
            color: client.color,
            title: `Emoji List for ${message.guild.name}`,
            description: `**Animated Emojis [${Animated}]**\n${EmojisAnimated}\n\n**Standard Emojis [${EmojiCount}]**\n${Emojis}`,
            footer: { text: `Total Emojis: ${OverallEmojis}` },
            timestamp: new Date()
        };

        message.channel.send({ embeds: [embed] });
    }
};