const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'Shows the latency of the bot.',
    run: async (client, message) => {
        const ping = client.ws.ping;
        let text = '';
        let dbPing = 'Calculating...';

        // Cache color and avatar URL
        const color = client.color;
        const userAvatarURL = client.user.displayAvatarURL();

        // Determine text based on ping
        const getPingText = (ping) => {
            if (ping <= 20) return 'Very Fast!';
            if (ping <= 30) return 'Fast!';
            if (ping <= 50) return 'Normal!';
            if (ping <= 70) return 'Slow!';
            if (ping <= 100) return 'Very Slow!';
            return 'Ultra Slow!';
        };

        // Measure database ping
        try {
            const start = Date.now();
            await mongoose.connection.db.command({ ping: 1 }); 
            const end = Date.now();
            dbPing = ((end - start) / 1000).toFixed(2);
        } catch (err) {
            console.error('Error measuring database ping:', err);
            dbPing = 'Error';
        }

        text = getPingText(ping);

        // Send the response
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor(`${ping}ms Pong!\n${dbPing} Database Ping!`, message.member.user.displayAvatarURL({ dynamic: true }))
                    .setColor(color)
                    .setFooter({
                        text: `Respond Speed: ${text}`,
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        });
    }
}
