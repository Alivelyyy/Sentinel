const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'setautoresponder',
    category: 'autoresponder',
    description: 'Set an autoresponder trigger and reply',
    run: async (client, message, args) => {
        // Check if the user has necessary permissions
        if (!message.member.permissions.has('MANAGE_MESSAGES') && message.guild.ownerId !== message.member.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | You must be the **Guild Owner** or have \`Manage Messages\` permission to use this command.`
                        ),
                ],
            });
        }

        // Ensure proper format of arguments
        if (args.length < 2) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | Please provide both a trigger phrase and a reply message.`
                        ),
                ],
            });
        }

        const trigger = args[0].toLowerCase(); // Trigger phrase
        const replyMessage = args.slice(1).join(' '); // The reply message

        // Store the trigger and reply in an in-memory object (or database for persistent storage)
        client.autoresponders = client.autoresponders || {};

        // Ensure the trigger is unique
        if (client.autoresponders[trigger]) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | An autoresponder for this trigger already exists.`
                        ),
                ],
            });
        }

        // Add the trigger and reply to the bot's memory
        client.autoresponders[trigger] = replyMessage;

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(
                        `<a:tk:1304818061034917979> | Successfully set an autoresponder for the trigger \`${trigger}\` with the reply: \`${replyMessage}\`.`
                    ),
            ],
        });

        // Listen for messages that match the trigger
        client.on('messageCreate', (msg) => {
            if (msg.author.bot) return; // Ignore bot messages
            // Check if the message content contains the trigger (case-insensitive)
            if (msg.content.toLowerCase().includes(trigger)) {
                msg.reply(replyMessage);
            }
        });
    },
};
