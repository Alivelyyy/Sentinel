const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'profile',
    aliases: ['badge', 'badges', 'achievement', 'pr'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const user =
            message.mentions.users.first() ||
            client.users.cache.get(args[0]) ||
            message.author

        const destroyer = user.id === '1237086498076098762' ? true : false
        let badges = ''

        const guild = await client.guilds.fetch('1177091174859800637')

        const sus = await guild.members.fetch(user.id).catch((e) => {
            if (user) badges = badges
            else badges = '`No Badge Available`'
        })

        if (destroyer === true || user.id === '1237086498076098762')
            badges =
                badges +
                `\n<:jingle:1291442476430921809>・**[mr_harry55](https://discord.com/users/1237086498076098762)**`

        try {
            const dev = sus.roles.cache.has('1291097238336049194')
            if (dev === true)
                badges =
                    badges +
                    `\n<a:dev:1291433691037565008>・**Developer**`

            const own = sus.roles.cache.has('1291098211305521195')
            if (own === true)
                badges = badges + `\n<a:oz:1291416157114339482>・**Owner**`

            const han = sus.roles.cache.has('1291098239524933734')
            if (han === true)
                badges = badges + `\n<a:admin:1291442363138572318>・**Admin**`

            const manager = sus.roles.cache.has('1291098300820361277')
            if (manager === true)
                badges = badges + `\n<:mog:1291443886203605054>・**Mod**`

            const aman = sus.roles.cache.has('1291098366037594132')
            if (aman === true)
                badges =
                    badges + `\n<a:sup:1291440696355459193>・**Support Team**`

            const np = sus.roles.cache.has('1256892444214034482')
            if (fr === true)
                badges =
                   badges + `\n<:np:1292200370633965620>・**NoPrefix**`

            const hundi = sus.roles.cache.has('1291098413257199727')
            if (hundi === true)
                badges =
                    badges +
                    `\n<:bughunter:1291433689120509952>・**Bug Hunter**`

            const supp = sus.roles.cache.has('1291098456529571940')
            if (supp === true)
                badges =
                    badges +
                    `\n<a:pre:1291441311714643999>・**Premium User**`

            const fr = sus.roles.cache.has('1291098499697606676')
            if (fr === true)
                badges =
                    badges + `\n<:friend:1291433693893890068>・**Friends**`

            const me = sus.roles.cache.has('1252532365935513743')
            if (fr === true)
                badges =
                    badges + `\n<:member:1317888648456175737>・**Member**`
        } catch (err) {
            if (badges) {
                badges = ''
                badges = badges
            } else if (badges === '') badges = '`No Badge Available`'
        }

        const pr = new MessageEmbed()
            .setAuthor(
                `Profile For ${user.username}#${user.discriminator}`,
                client.user.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            //.setTitle(`${user.username}'s Profile`)
            .setColor(client.color)
            .setTimestamp()
            .setDescription(`**BADGES** <a:boost:1317891977316007996>
  ${badges ? badges : '`No Badge Available`'}`)
        //.setTimestamp();
        message.channel.send({ embeds: [pr] })
    }
}