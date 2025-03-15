const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: `Show's the help command.`,
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        let prefix = message.guild?.prefix || '&'; // default prefix if not set

        const query = args[0]; // Get the query (command name) from arguments

        if (query) {
            const command = client.commands.get(query) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(query));

            if (!command) {
                return message.reply('Command not found!');
            }

            const aliases = command.aliases && command.aliases.length > 0 ? `\`${command.aliases.join(', ')}\`` : 'None';
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(command.description || 'No description available.');

            // Add fields sequentially
            embed.addFields([
                { name: 'Aliases', value: `\`${aliases}\``, inline: false }
            ]);

            // Check if the command has subcommands
            if (command.subcommand && command.subcommand.length > 0) {
                const subcommands = command.subcommand.map(subcmd => `\`${subcmd}\``).join(', ');
                embed.addFields([{ name: 'Subcommands', value: subcommands, inline: false }]);
            }

            if (typeof command.premium !== 'undefined') {
                embed.addFields([{ name: 'Premium', value: command.premium ? `\`Yes\`` : `\`No\``, inline: false }]);
            }

            embed.addFields([{ name: 'Usage', value: `\`${prefix}${command.name}\``, inline: false }]);

            // Set author, thumbnail, and footer
            embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter('');

            return message.channel.send({ embeds: [embed] });
        }  
        // Create a MessageSelectMenu
        const selectMenu = new MessageSelectMenu()
            .setCustomId('categorySelect')
            .setPlaceholder('Get Started!')
            .addOptions([
                {
                    label: 'AntiNuke',
                    value: 'antinuke',
                    description: 'Commands related to AntiNuke',
                },
                {
                    label: 'Moderation',
                    value: 'mod',
                    description: 'Commands related to Moderation',
                },
                {
                    label: 'Utility',
                    value: 'info',
                    description: 'Utility commands',
                },
                {
                    label: 'Welcomer',
                    value: 'welcomer',
                    description: 'Commands for Welcomer',
                },
                {
                    label: 'Reactionrole',
                    value: 'Reactionrole',
                    description: 'Commands for Reactionrole',
                },
                {
                    label: 'Ticket',
                    value: 'Ticket',
                    description: 'Commands for Ticket',
                },
                {
                    label: 'Voice',
                    value: 'voice',
                    description: 'Commands related to Voice',
                },
                {
                    label: 'Custom Role',
                    value: 'customrole',
                    description: 'Commands for Custom Roles',
                },
                {
                    label: 'Logging',
                    value: 'logging',
                    description: 'Commands for Logging',
                },
                {
                    label: 'Automod',
                    value: 'automod',
                    description: 'Commands for Automod',
                },
                {
                    label: 'Autorespond',
                    value: 'Autorespond',
                    description: 'Commands for Autorespond',
                },
                {
                    label: 'Giveaway',
                    value: 'Giveaway',
                    description: 'Commands for Giveaway',
                },
                {
                    label: 'Fun',
                    value: 'Fun',
                    description: 'Commands for Fun',
                },
                {
                    label: 'All Commands',
                    value: 'All Commands',
                    description: 'All Commands',
                }                                                 
            ]);

        // Buttons
        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Invite Me')
                .setStyle('LINK')
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`),
            new MessageButton()
                .setLabel('Support Me')
                .setStyle('LINK')
                .setURL('https://discord.gg/'),
            new MessageButton()
                .setCustomId('home')
                .setLabel('Home')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('delete')
                .setLabel('Delete')
                .setStyle('DANGER')
        );

        const initialEmbed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: `${client.user.username} Help Menu`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `Hello ! I'm **${client.user.username}**, your all-in-one server management and security bot with powerful features.\n\n \<:reddot:1317860462028914700> **Prefix for this server** \`${prefix}\`\n<:reddot:1317860462028914700>  **Total Commands: **\`${client.commands.size}\`\n<:reddot:1317860462028914700>  **Type ${prefix}dangermode enable  to enhance security!**`)
            .addField('`<> - Required | () - Optional`', '\u200B', false)
            .addField(
                    '__Modules__',
                    `
                    <:antinuke:1317733398185508924> **AntiNuke**
                    <:moderation:1317735997827448853> **Moderation**
                    <:utility:1317735995222786048> **Utility**
                    <:welcomer:1317735981360877658> **Welcomer**
                    <:reactionroles:1317735978659741696> **Reaction Role**
                    <:ticket:1317735976252084234> **Ticket**
                    <:voice:1317735973542690836> **Voice**
                    <:customrole:1317735971118387264> **Customrole**
                    <:logging:1317735967729123348> **Logging**
                    <:automod:1317735963761578054> **Automod**
                    <:autoresponder:1317735961169231872> **Autorespond**
                    <:giveway:1317735958606647349> **Giveaway**
                    <:fun:1317735956601765921> **Fun**
                    `,
                    false
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .addField(
                    'Links',
                    `[Support](https://discord.gg/) | [Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`,
                    true
                )
                .setFooter({
                    text: `Developed by 💞 By Alive.`,

                });


        const helpMessage = await message.channel.send({ embeds: [initialEmbed], components: [new MessageActionRow().addComponents(selectMenu), buttons] });

        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            time: 120000
        });

        const updateEmbed = (embed, category, commands) => {
            embed.fields = []; // Clear the fields
            embed.setDescription(`**${category.charAt(0).toUpperCase() + category.slice(1)} Commands**\n${commands.join(', ')}`);
            return embed;
        };

        collector.on('collect', async (i) => {
            if (i.isButton()) {
                if (i.customId === 'home') {
                    await helpMessage.edit({ embeds: [initialEmbed] });
                    i.deferUpdate();
                } else if (i.customId === 'delete') {
                    await helpMessage.delete();
                    i.deferUpdate();
                }
            } else if (i.isSelectMenu()) {
                const category = i.values[0];
                let commands = [];
                switch (category) {
                    case 'antinuke':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'security')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'mod':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'mod')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'info':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'info')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'welcomer':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'welcomer')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'voice':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'voice')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'automod':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'automod')
                            .map((x) => `\`${x.name}\``);
                        break;   
                    case 'customrole':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'customrole')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'logging':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'logging')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'Ticket':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'tic')
                            .map((x) => `\`${x.name}\``);
                        break; 
                    case 'Giveaway':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'give')
                            .map((x) => `\`${x.name}\``);
                        break;  
                    case 'Autorespond':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'autores')
                            .map((x) => `\`${x.name}\``);
                        break;  
                    case 'Fun':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'fun')
                            .map((x) => `\`${x.name}\``);
                        break; 
                    case 'Reactionrole':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'rrole')
                            .map((x) => `\`${x.name}\``);
                        break;  
                    case 'AI':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'ai')
                            .map((x) => `\`${x.name}\``);
                        break;                                                                                                

                }
                const updatedEmbed = updateEmbed(new MessageEmbed(initialEmbed), category, commands); // Create a new embed based on the initial one
                await helpMessage.edit({ embeds: [updatedEmbed] });
                i.deferUpdate();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                // Disable components after 60 seconds
                selectMenu.setDisabled(true);
                buttons.components.forEach(button => button.setDisabled(true));
                helpMessage.edit({ components: [new MessageActionRow().addComponents(selectMenu), buttons] });
            }
        });

        // Add a listener for interactions not belonging to the message author
        const otherUserCollector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user.id !== message.author.id,
            time: 120000
        });

        otherUserCollector.on('collect', async (i) => {
            await i.reply({ content: 'Bro, This is not your interaction.', ephemeral: true });
        });

        // Disable dropdown and buttons after 60 seconds
        setTimeout(async () => {
            selectMenu.setDisabled(true);
            buttons.components.forEach(button => button.setDisabled(true));
            await helpMessage.edit({ components: [new MessageActionRow().addComponents(selectMenu), buttons] });
            await helpMessage.edit({ embeds: [initialEmbed] });
        }, 120000);
    }
};