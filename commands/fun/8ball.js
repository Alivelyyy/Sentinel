
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: '8ball',
    aliases: ['8b'],
    category: 'fun',
    description: 'Ask the Magic 8 Ball a question',
    cooldown: 3,
    run: async (client, message, args) => {
        if (!args.length) {
            return message.reply('Please ask a question!');
        }

        const responses = [
            'It is certain.',
            'Without a doubt.',
            'Yes, definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Reply hazy, try again.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Don\'t count on it.',
            'My sources say no.',
            'Very doubtful.'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const embed = {
            color: client.color,
            title: '🎱 Magic 8 Ball',
            fields: [
                { name: 'Question', value: args.join(' '), inline: false },
                { name: 'Answer', value: response, inline: false }
            ]
        };

        message.reply({ embeds: [embed] });
    }
};
