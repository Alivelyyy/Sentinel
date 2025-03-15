const { Message, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'addemoji',
    aliases: ['addemote', 'steal'],
    cooldown: 5,
    category: 'info',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | You must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            });
        }

        if (!message.guild.me.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | I must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            });
        }

        // Check if the command is a reply to a message
        if (!message.reference) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You need to reply to a message with an emoji to use this command.`
                        )
                ]
            });
        }

        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        const emojiMatch = referencedMessage.content.match(/<a?:\w+:(\d+)>/);

        if (!emojiMatch) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | The replied message doesn't contain a valid emoji.`
                        )
                ]
            });
        }

        const emojiId = emojiMatch[1];
        const isAnimated = referencedMessage.content.startsWith('<a:');
        const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}${isAnimated ? '.gif' : '.png'}`;

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Emoji Steal Options')
            .setDescription('Select an option to steal the emoji or sticker.')
            .setImage(emojiUrl);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('steal_emoji')
                .setLabel('Steal as Emoji')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('steal_sticker')
                .setLabel('Steal as Sticker')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('steal_another')
                .setLabel('Steal Another')
                .setStyle('SECONDARY')
        );

        const msg = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'steal_emoji') {
                try {
                    const emojiName = args[0] || 'stolen_emoji';
                    const newEmoji = await message.guild.emojis.create(emojiUrl, emojiName);
                    await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<:tick:1317818894546898985> | Successfully added the emoji ${newEmoji.toString()}.`
                                )
                        ],
                        ephemeral: true
                    });
                } catch (err) {
                    await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<:cross:1317733546261217300> | Unable to add the emoji. Possible reasons: \`Slots are Full\` or \`Mass emojis added\`.`
                                )
                        ],
                        ephemeral: true
                    });
                }
            } else if (interaction.customId === 'steal_sticker') {
                try {
                    const stickerName = args[0] || 'stolen_sticker';
                    // const stickerFormat = isAnimated ? 'APNG' : 'PNG';
                    // await message.guild.stickers.create(emojiUrl, stickerName, 'sticker description');
                    await interaction.reply({
                        content: `Sticker stealing functionality is not supported via the Discord API. Please manually upload stickers via the Discord UI.`,
                        ephemeral: true
                    });
                } catch (err) {
                    await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<:cross:1317733546261217300> | Unable to add the sticker. Possible reasons: \`Slots are Full\` or \`Invalid Format\`.`
                                )
                        ],
                        ephemeral: true
                    });
                }
            } else if (interaction.customId === 'steal_another') {
                await interaction.reply({
                    content: 'Please reply to another emoji to steal.',
                    ephemeral: true
                });
                await msg.delete();
            }
        });

        collector.on('end', () => {
            if (!msg.deleted) {
                msg.edit({ components: [] });
            }
        });
    }
};
