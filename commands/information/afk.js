const { MessageEmbed } = require('discord.js');
const db = require('../../models/afk.js');

module.exports = {
    name: 'afk',
    description: "Set's You Away From Keyboard",
    category: 'info',
    run: async (client, message, args) => {
        // Combine arguments into a single string for the reason
        const reason = args.join(' ') ? args.join(' ') : "I'm AFK :)";
        
        // Regular expression to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        
        // Check if the reason starts with "discord.gg" or contains any URL
        if (urlRegex.test(reason) || reason.startsWith("discord.gg")) {
            const embed = new MessageEmbed()
                .setTitle('AFK Status Not Set')
                .setDescription('Your AFK status cannot be set due Links Detection ⚠')
                .setColor(client.color); // Error color
            return message.channel.send({ embeds: [embed] });
        }

        // Check if the user is already AFK
        const data = await db.findOne({
            Guild: message.guildId,
            Member: message.author.id
        });

        if (data) {
            const embed = new MessageEmbed()
                .setTitle('UwU, you are already AFK.')
                .setColor(client.color);
            return message.channel.send({ embeds: [embed] });
        } else {
            // Save the AFK data
            const newData = new db({
                Guild: message.guildId,
                Member: message.author.id,
                Reason: reason,
                Time: Date.now()
            });
            await newData.save();

            const embed = new MessageEmbed()
                .setDescription(`Your AFK is now set to: **${reason}**`)
                .setColor(client.color);
            return message.channel.send({ embeds: [embed] });
        }
    }
};
