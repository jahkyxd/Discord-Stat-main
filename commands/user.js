const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../config.json");
var moment = require ( "moment" );
require ( "moment-duration-format" );

module.exports = {
    name: "user",
    aliases: ["kullanıcı"],
    run: async (client, message, args) => {
        var user = message.mentions.users.first();
        if (!user) return message.reply("Lütfen bir kullanıcıyı etiketliyip tekrar dene")
        let member = message.guild.members.cache.get(user.id)
        let st = member.voice
        var data1 = await db.fetch(`1data1:${user.id}:${st.channelID}`);
        if (data1) {
            var total = (
                await db.fetch(
                    `1total:${user.id}:${data1.channel}`
                )
            ) || { "total": 0 };
            const json = {
                "channel": data1.channel,
                "total": Number(total.total) + (
                    Date.now() - Number(data1.start)
                )
            };
            db.set(`1total:${user.id}:${data1.channel}`, json);
            db.delete(`1data:${user.id}:${st.channelID}`);
            const json2 = {
                "channel": st.channelID,
                "start": Date.now()
            };
            db.set(`1data:${user.id}:${st.channelID}`, json2);
            if (st.channel.parentID === pub) {
                db.add(
                    `1public:${user.id}`,
                    new Date().getTime() - Number(data1.start)
                );
            }
            else if (st.channel.parentID == config.priv) {
                db.add(`1private:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.alone) {
                db.add(`1alone:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.game) {
                db.add(`1game:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.vk) {
                db.add(`1game:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.dc) {
                db.add(`1game:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.kayıt) {
                db.add(`1kayıt:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.sorun) {
                db.add(`1mod:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
            else if (st.channel.parentID == config.terapi) {
                db.add(`1mod:${member.user.id}`, new Date().getTime() - Number(data.start))
            }
        }
        let data = await db
            .all()
            .filter(x => x.ID.startsWith(`1total:${user.id}`))
            .sort(function (a, b) {
                return JSON.parse(b.data).total - JSON.parse(a.data).total;
            });

        let ses = await db.fetch(`1public:${user.id}`) || 0
        let priv1 = await db.fetch(`1private:${user.id}`) || 0
        let kayıt1 = await db.fetch(`1kayıt:${user.id}`) || 0
        let game1 = await db.fetch(`1game:${user.id}`) || 0
        let alone1 = await db.fetch(`1alone:${user.id}`) || 0
        let mod1 = await db.fetch(`1mod:${user.id}`) || 0
        let format = moment.duration(ses).format("h [saat] m [dakika.]");
        let toplamPriv = moment.duration(priv1).format("h [saat] m [dakika.]");
        let toplamKayıt = moment.duration(kayıt1).format("h [saat] m [dakika.]");
        let toplamGame = moment.duration(game1).format("h [saat] m [dakika.]");
        let toplamAlone = moment.duration(alone1).format("h [saat] m [dakika.]");
        let toplamMod = moment.duration(mod1).format("h [saat] m [dakika.]");
        let sayi = data.length;
        var isimler = [];
        data.length = 10;
        var i = 0;
        let arr = [];
        for (i in data) {
            arr.push(Number(JSON.parse(data[i].data).total));
            isimler.push(
                `<#${JSON.parse(data[i].data).channel}>: \`${moment
                    .duration(Number(JSON.parse(data[i].data).total))
                    .format("h [saat] m [dakika.]")}\``
            );
        }
        var textDatas = db
            .all()
            .filter(x => x.ID.startsWith(`messageCount:${user.id}`))
            .sort(function (a, b) {
                return JSON.parse(b.data).count - JSON.parse(a.data).count;
            });
        var textTotal = (
            await db.fetch(`totalMessage:${user.id}`)
        ) || 0;
        textDatas.length = 5;
        var liste = "";
        var i = 0;
        for (i in textDatas) {
            liste += `<#${JSON.parse(textDatas[i].data).channel}>: \`${JSON.parse(textDatas[i].data).count
                }\` \n`;
        }

        let data2 = await db
            .all()
            .filter(x => x.ID.startsWith(`1total:${user.id}`))
            .sort(function (a, b) {
                return JSON.parse(b.data).total - JSON.parse(a.data).total;
            });
        let uw = 0
        let array = []
        for (uw in data2) {
            array.push(Number(JSON.parse(data2[uw].data).total));
        }
        let toplam = moment
            .duration(array.reduce((a, b) => a + b, 0))
            .format("h [saat] m [dakika.]");
        let üye = message.guild.members.cache.get(user.id);

        const embed = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.avatarURL({ "dynamic": true }))
            .setFooter('Developed By Jahky')
            .setTimestamp()
            .setColor("RANDOM")
            .setThumbnail(user.avatarURL({ "dynamic": true }))
            .setColor("RANDOM")
            .setDescription(`${üye} (${üye.roles.highest}) Rolüne sahip kişinin sunucudaki istatistikleri;
───────────────
**➥ Sesli Sohbet Bilgileri:**
• Toplam: \`${toplam}\`
• Public Odalar: \`${format}\`
• Kayıt Odaları: \`${toplamKayıt}\`
• Sorun Çözme & Terapi: \`${toplamMod}\`
• Secret Odalar: \`${toplamPriv}\`
• Alone Odalar: \`${toplamAlone}\`
• Oyun & Eğlence Odaları: \`${toplamGame}\`
───────────────
**➥ Kanal Bilgileri:** (\`Toplam ${sayi} kanalda durmuş\`)
${isimler.join("\n")}
───────────────
**➥ Mesaj Bilgileri:** (\`Toplam: ${textTotal}\`)
${liste}
    ` );
        message.channel.send(embed);
    }
}