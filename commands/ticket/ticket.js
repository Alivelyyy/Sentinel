const {

    MessageEmbed,

    Permissions,

    MessageActionRow,

    MessageButton,

} = require('discord.js');

module.exports = {

    name: 'ticketsetup',

    description: 'Sets up the ticket panel for the server.',

    category: 'ticket',

    run: async (client, message, args) => {

        if (message.author.id !== message.guild.ownerId) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('RED')

                        .setDescription('Only the server owner can use this command.')

                ]

            });

        }

        const channelMention = args[0];

        const channelId = channelMention?.replace(/[<#>]/g, '');

        const channel = message.guild.channels.cache.get(channelId);

        if (!channel || channel.type !== 'GUILD_TEXT') {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('RED')

                        .setDescription('Please mention a valid text channel.')

                ]

            });

        }

        // Create the Jingle Ticket Manager role with black color

        let role = message.guild.roles.cache.find(r => r.name === 'Jingle Ticket Manager');

        if (!role) {

            role = await message.guild.roles.create({

                name: 'Jingle Ticket Manager',

                color: '#000000', // Hex code for black color

                permissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_MESSAGES],

                reason: 'Role for managing tickets',

            });

        }

        // Create the Jingle Tickets category

        let category = message.guild.channels.cache.find(

            c => c.name === 'Jingle Tickets' && c.type === 'GUILD_CATEGORY'

        );

        if (!category) {

            category = await message.guild.channels.create('Jingle Tickets', {

                type: 'GUILD_CATEGORY',

            });

        }

        // Ticket panel embed

        const ticketPanelEmbed = new MessageEmbed()

            .setTitle('Jingle Ticket Panel')

            .setDescription('Click the button below to create a ticket.')

            .setColor('BLACK')

            .setThumbnail(client.user.displayAvatarURL()); // Bot's profile picture

        const ticketPanelButton = new MessageActionRow().addComponents(

            new MessageButton()

                .setCustomId('create_ticket')

                .setLabel('Create Ticket')

                .setStyle('PRIMARY')

        );

        await channel.send({

            embeds: [ticketPanelEmbed],

            components: [ticketPanelButton],

        });

        // Listen for interaction

        client.on('interactionCreate', async (interaction) => {

            if (!interaction.isButton()) return;

            if (interaction.customId === 'create_ticket') {

                const user = interaction.user;

                // Check if user already has a ticket

                const existingTicket = message.guild.channels.cache.find(

                    c => c.name === `ticket-${user.username}` && c.parentId === category.id

                );

                if (existingTicket) {

                    return interaction.reply({

                        content: 'You already have an open ticket!',

                        ephemeral: true,

                    });

                }

                // Create a new ticket

                const ticketChannel = await message.guild.channels.create(`ticket-${user.username}`, {

                    type: 'GUILD_TEXT',

                    parent: category.id,

                    permissionOverwrites: [

                        {

                            id: message.guild.roles.everyone,

                            deny: [Permissions.FLAGS.VIEW_CHANNEL],

                        },

                        {

                            id: user.id,

                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],

                        },

                        {

                            id: role.id,

                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],

                        },

                    ],

                });

                const ticketEmbed = new MessageEmbed()

                    .setTitle('Ticket')

                    .setDescription('A member of the team will be with you shortly.')

                    .setColor('BLACK')

                    .setThumbnail(client.user.displayAvatarURL()); // Bot's profile picture

                const closeButton = new MessageActionRow().addComponents(

                    new MessageButton()

                        .setCustomId('close_ticket')

                        .setLabel('Close Ticket')

                        .setStyle('DANGER')

                );

                await ticketChannel.send({

                    content: `${user}, welcome to your ticket!`,

                    embeds: [ticketEmbed],

                    components: [closeButton],

                });

                interaction.reply({

                    content: `Your ticket has been created: ${ticketChannel}`,

                    ephemeral: true,

                });

            }

            if (interaction.customId === 'close_ticket') {

                const ticketChannel = interaction.channel;

                if (ticketChannel.parentId !== category.id) {

                    return interaction.reply({

                        content: 'This is not a ticket channel.',

                        ephemeral: true,

                    });

                }

                await interaction.reply('Closing ticket in 5 seconds...');

                setTimeout(async () => {

                    await ticketChannel.delete('Ticket closed by user');

                }, 5000);

            }

        });

        message.channel.send({

            embeds: [

                new MessageEmbed()

                    .setColor('GREEN')

                    .setDescription(`Ticket system setup complete in ${channel}.`)

            ]

        });

    },

};