const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../config.json");
var moment = require ( "moment" );
require ( "moment-duration-format" );

module.exports = {
    name: "top",
    aliases: ["top10"],
    run: async (client, message, args) => {
        let member = message.guild.members.cache.get(message.author.id)
        if (!message.content.startsWith("!top")) {
            return;
        }
        let data = await db
            .all()
            .filter(x => x.ID.startsWith(`1total`))
            .sort(function (a, b) {
                return JSON.parse(b.data).total - JSON.parse(a.data).total;
            });
        var liste = []
        var i = 0;
        for (i in data) {
            liste.push({
                "kullanıcı": data[i].ID.split(":")[1],
                "sure": JSON.parse(data[i].data).total
            })

        }
        var result = []
        liste.reduce(function (res, value) {
            if (!res[value.kullanıcı]) {
                res[value.kullanıcı] = { "kullanıcı": value.kullanıcı, "sure": 0 };
                result.push(res[value.kullanıcı])
            }
            res[value.kullanıcı].sure += value.sure;
            return res;
        }, {});
        db.set(`%tamam${message.guild.id}`, result)
        let sos = await db.fetch(`%tamam${message.guild.id}`)
        let uu = sos.sort(function (a, b) {
            return b.sure - a.sure
        })
        let tiki = 0
        uu.length = 5
        let arrays = []
        let num = 1
        for (tiki in uu) {
            arrays.push(`\`${num++}.\` - <@${uu[tiki].kullanıcı}> - \`${moment.duration(Number(uu[tiki].sure)).format("h [saat] m [dakika]")}\``)
        }
        let mesaj = db.all().filter(x => x.ID.startsWith(`totalMessage`)).sort(function (a, b) {
            return b.data - a.data
        })
        mesaj.length = 5
        let bak = 0
        let sayı = 1
        let aruuy = []
        for (bak in mesaj) {
            aruuy.push(`\`${sayı++}.\` - <@${mesaj[bak].ID.split(":")[1]}> - \`${mesaj[bak].data}\``)
        }
        let kanal = db.all().filter(x => x.ID.startsWith(`2channel`)).sort(function (a, b) {
            return b.data - a.data
        })
        let cems = 0
        kanal.length = 5
        let nams = 1
        let arooy = []
        for (cems in kanal) {
            arooy.push(`\`${nams++}.\` - <#${kanal[cems].ID.split(":")[1]}> - \`${moment.duration(Number(kanal[cems].data)).format("h [saat] m [dakika]")}\` `)
        }
        let mesajKanal = db.all().filter(x => x.ID.startsWith(`3mesajKanal`)).sort(function (a, b) {
            return b.data - a.data
        })
        mesajKanal.length = 5
        let toki = 0
        let number = 1
        let arvy = []
        for (toki in mesajKanal) {
            arvy.push(`\`${number++}.\` - <#${mesajKanal[toki].ID.split(":")[1]}> - \`${mesajKanal[toki].data}\``)
        }
        let publics = db.all().filter(x => x.ID.startsWith(`1public`)).sort(function (a, b) {
            return b.data - a.data
        })
        publics.length = 5
        let tokix = 0
        let numberx = 1
        let arvey = []
        for (tokix in publics) {
            arvey.push(`\`${numberx++}.\` - <@${publics[tokix].ID.split(":")[1]}> - \`${moment.duration(Number(publics[tokix].data)).format("h [saat] m [dakika]")}\``)
        }

        const toplam = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, "")
            .setThumbnail(message.author.avatarURL)
            .setColor("RANDOM")
            .setFooter("Developed By Jahky")
            .setTimestamp()
            .setDescription(`
        
Sunucunun Toplam İstatistikleri;

**➥ En Aktif 5 Ses Kanalı**
${arooy.join("\n")}

**➥ En Aktif 5 Mesaj Kanalı**
${arvy.join("\n")}

**➥ Seste En Aktif İlk 5 Üye**
${arrays.join("\n")}

**➥ Mesaj Kanallarında En Aktif 5 Üye**
${aruuy.join("\n")}

**➥ En Aktif 5 Sesli Kanalı**
${arvey.join("\n")}

         ` )
        message.channel.send(toplam)
    }
}