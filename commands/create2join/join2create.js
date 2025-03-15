const {

    MessageEmbed,

    Permissions,

    MessageActionRow,

    MessageButton,

} = require('discord.js');

module.exports = {

    name: 'j2csetup',

    description: 'Sets up the Temp Voice category and channels.',

    category: 'mod',

    premium: false,

    run: async (client, message, args) => {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('RED')

                        .setDescription(

                            'You need `Manage Channels` permission to use this command.'

                        )

                ]

            });

        }

        // Create the category

        let category = await message.guild.channels.create('Temp Voice', {

            type: 'GUILD_CATEGORY',

        });

        // Create the text channel

        const controlChannel = await message.guild.channels.create('control', {

            type: 'GUILD_TEXT',

            parent: category.id,

        });

        // Create the "Join to Create" voice channel

        const joinChannel = await message.guild.channels.create('Join to Create', {

            type: 'GUILD_VOICE',

            parent: category.id,

            userLimit: 2,

        });

        message.channel.send({

            embeds: [

                new MessageEmbed()

                    .setColor('GREEN')

                    .setDescription(

                        'Setup complete! Use the "Join to Create" channel to dynamically create temporary voice channels.'

                    )

            ]

        });

        // Send embed with buttons to the control channel

        const embed = new MessageEmbed()

            .setTitle('Voice Controller')

            .setColor('BLUE')

            .setDescription(

                'Use the buttons below to manage your temporary voice channel.'

            );

        const row = new MessageActionRow().addComponents(

            new MessageButton()

                .setCustomId('lock')

                .setLabel('Lock')

                .setStyle('DANGER'),

            new MessageButton()

                .setCustomId('unlock')

                .setLabel('Unlock')

                .setStyle('SUCCESS'),

            new MessageButton()

                .setCustomId('hide')

                .setLabel('Hide')

                .setStyle('SECONDARY'),

            new MessageButton()

                .setCustomId('unhide')

                .setLabel('Unhide')

                .setStyle('PRIMARY'),

            new MessageButton()

                .setCustomId('rename')

                .setLabel('Rename')

                .setStyle('SECONDARY')

        );

        await controlChannel.send({ embeds: [embed], components: [row] });

        // Listen for button interactions

        client.on('interactionCreate', async (interaction) => {

            if (!interaction.isButton()) return;

            const member = interaction.member;

            const voiceChannel = member.voice.channel;


            switch (interaction.customId) {

                case 'lock':

                    await voiceChannel.permissionOverwrites.edit(

                        message.guild.roles.everyone,

                        { CONNECT: false }

                    );

                    interaction.reply({

                        content: `🔒 Locked ${voiceChannel.name}`,

                        ephemeral: true,

                    });

                    break;

                case 'unlock':

                    await voiceChannel.permissionOverwrites.edit(

                        message.guild.roles.everyone,

                        { CONNECT: true }

                    );

                    interaction.reply({

                        content: `🔓 Unlocked ${voiceChannel.name}`,

                        ephemeral: true,

                    });

                    break;

                case 'hide':

                    await voiceChannel.permissionOverwrites.edit(

                        message.guild.roles.everyone,

                        { VIEW_CHANNEL: false }

                    );

                    interaction.reply({

                        content: `🙈 Hidden ${voiceChannel.name}`,

                        ephemeral: true,

                    });

                    break;

                case 'unhide':

                    await voiceChannel.permissionOverwrites.edit(

                        message.guild.roles.everyone,

                        { VIEW_CHANNEL: true }

                    );

                    interaction.reply({

                        content: `👀 Unhid ${voiceChannel.name}`,

                        ephemeral: true,

                    });

                    break;

                case 'rename':

                    const renameMessage = await interaction.reply({

                        content: 'Please enter a new name for your channel:',

                        ephemeral: true,

                        fetchReply: true,

                    });

                    const filter = (msg) => msg.author.id === interaction.user.id;

                    const collected = await controlChannel.awaitMessages({

                        filter,

                        max: 1,

                        time: 30000,

                        errors: ['time'],

                    }).catch(() => null);

                    if (collected && collected.first()) {

                        const newName = collected.first().content;

                        await voiceChannel.setName(newName);

                        interaction.followUp({

                            content: `✅ Renamed channel to ${newName}`,

                            ephemeral: true,

                        });

                        collected.first().delete();

                    } else {

                        interaction.followUp({

                            content: '⏳ Time ran out! Please try renaming again.',

                            ephemeral: true,

                        });

                    }

                    break;

            }

        });

        // Voice State Update for Temporary Channels

        client.on('voiceStateUpdate', async (oldState, newState) => {

            if (newState.channelId === joinChannel.id) {

                const tempChannel = await newState.guild.channels.create(

                    `${newState.member.user.username}'s Channel`,

                    {

                        type: 'GUILD_VOICE',

                        parent: category.id,

                        userLimit: 2,

                    }

                );

                await newState.member.voice.setChannel(tempChannel);

                const interval = setInterval(async () => {

                    if (tempChannel.members.size === 0) {

                        clearInterval(interval);

                        await tempChannel.delete();

                    }

                }, 5000);

            }

        });

    },

};