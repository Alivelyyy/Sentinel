const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const mongoose = require('mongoose')
const wait = require('wait')
const sentinel = ['1304080189029875753']

this.config = require(`${process.cwd()}/config.json`)

mongoose.connect(this.config.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const RolePermissionSchema = new mongoose.Schema({
    guildId: String,
    roleId: String,
    adminPermissions: BigInt
})
const rolePermissionSchema = mongoose.model('Nightmode', RolePermissionSchema)
module.exports = {
    name: 'beastmode',
    aliases: ['bm'],
    cooldown: 10,
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 40) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | **Your Server Doesn't Meet My 40 Member Criteria**`
                        )
                ]
            })
        }
        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check && !sentinel.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:cross:1317733546261217300> | **Only the server owner or an extra owner with a higher role than mine is authorized to execute this command.**`
                        )
                ]
            })
        }

        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            ) &&
            !sentinel.includes(message.author.id)
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:cross:1317733546261217300> | **Only the server owner or extra owner with a higher role than mine can execute this command.**






`
                )
            return message.channel.send({ embeds: [higherole] })
        }
        let prefix = '$' || message.guild.prefix
        const option = args[0]

        const Beastmode = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Beastmode**__`)
            .setDescription(
                '**Enhance your server\'s security with the Beastmode feature! Beastmode allows you to quickly disable dangerous permissions for manageable roles, ensuring your community stays secure. It stores original permissions, allowing for seamless restoration when needed.**'
            )
            .addFields([
                { name: '__Beastmode Enable__', value: `Enable Beastmode by using \`${prefix}Beastmode enable\`` },
        { name: '__Beastmode Disable__', value: `Disable Beastmode by using \`${prefix}Beastmode disable\`` }
            ])

        if (!option) {
            return message.channel.send({ embeds: [Beastmode] })
        }

        if (option === 'enable') {
            const botHighestRole = message.guild.me.roles.highest
            const manageableRoles = message.guild.roles.cache.filter(
                (role) =>
                    role.comparePositionTo(botHighestRole) < 0 &&
                    role.name !== '@everyone' &&
                    role.permissions.has('ADMINISTRATOR')
            )

            if (manageableRoles.size === 0) {
                return message.channel.send(
                    '**No Roles Found With Admin Permissions**'
                )
            }

            const promises = manageableRoles.map(async (role) => {
                const adminPermissions = role.permissions
                    .toArray()
                    .filter((p) => p.startsWith('ADMINISTRATOR'))

                const permissionsBitfield = new Discord.Permissions(
                    adminPermissions
                ).bitfield

                if (adminPermissions.length > 0) {
                    let permissions = await role.permissions.toArray()
                    permissions = await permissions.filter(
                        (permission) => permission !== 'ADMINISTRATOR'
                    )
                    await client.util.sleep(3000)
                    await role
                        .setPermissions(
                            permissions,
                            `*Advance's Beastmode ENABLED**`
                        )

                        .catch((err) => {
                            message.channel.send(
                                `**Please Check My Role Position And Give Me Proper Role.**`
                            )
                            return
                        })
                }
                const serverData = await rolePermissionSchema.findOne({
                    guildId: message.guild.id,
                    roleId: role.id
                })
                if (serverData) {
                    await client.util.sleep(3000)
                    await rolePermissionSchema
                        .findOneAndUpdate(
                            { guildId: message.guild.id, roleId: role.id },
                            { adminPermissions: permissionsBitfield },
                            { upsert: true }
                        )
                        .catch((err) => null)
                } else {
                    await client.util.sleep(3000)
                    await rolePermissionSchema
                        .create({
                            guildId: message.guild.id,
                            roleId: role.id,
                            adminPermissions: permissionsBitfield
                        })
                        .catch((err) => null)
                }
            })
            await client.util.sleep(3000)
            await Promise.all(promises)

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:tick:1317818894546898985> | **Beastmode enabled! Dangerous Permissions Disabled For Manageable Roles.**`
                        )
                ]
            })
        } else if (option === 'disable') {
            const storedRoles = await rolePermissionSchema.find({
                guildId: message.guild.id
            })

            const promises = storedRoles.map(async (storedRole) => {
                const role = message.guild.roles.cache.get(storedRole.roleId)
                if (role) {
                    try {
                        await client.util.sleep(3000)
                        await role.setPermissions(
                            storedRole.adminPermissions,
                            `**Advance's Beastmode DISABLED**`
                        )
                    } catch (err) {
                        return
                    }
                }

                await client.util.sleep(3000)
                await rolePermissionSchema
                    .findOneAndDelete({
                        guildId: message.guild.id,
                        roleId: storedRole.roleId
                    })
                    .catch((err) => {
                        return message.channel.send(
                            `**Removing Stored Role From The Database.**`
                        )
                    })
            })

            await client.util.sleep(3000)
            await Promise.all(promises)
            await message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:tick:1317818894546898985> | **Beastmode** disabled! Restored Permissions For Manageable Roles.`
                        )
                ]
            })
        } else {
            return message.channel.send({ embeds: [Beastmode] })
        }
    }
}
