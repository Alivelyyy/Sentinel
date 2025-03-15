
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'coinflip',
    aliases: ['flip', 'coin'],
    category: 'fun',
    description: 'Flip a coin',
    cooldown: 3,
    run: async (client, message, args) => {
        const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
        
        const embed = {
            color: client.color,
            title: '🪙 Coin Flip',
            description: `The coin landed on: **${result}**!`
        };

        message.reply({ embeds: [embed] });
    }
};
