const Discord = require ( "discord.js" );
const client = new Discord.Client ();
const logs = require ( "discord-logs" );
const fs = require("fs")
const config = require('./config.json');
const db = require ( "quick.db" );
var moment = require ( "moment" );
require ( "moment-duration-format" );
logs ( client );
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();

client.on("ready", () => {
    client.user.setPresence({activity: {name: "Developed By Jahky"}, status: "dnd"});
})

const ses = client.channels.cache.get(config.ses)
client.on("ready", () => {
    if (!ses) return
    ses.join()
})

setInterval(() => {
    if (!ses) return
    ses.join()
}, 1);

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})

client.on('message', message => {
    if (!message.guild || message.author.bot || !message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})

client.on ( "voiceChannelJoin" , ( member , channel ) => {
    if ( member.user.bot ) return
    const json = {
        "channel" : channel.id ,
        "start" : new Date ().getTime ()
    };
    db.set ( `1data:${ member.user.id }:${ channel.id }` , json );
} );

client.on ( "voiceChannelLeave" , ( member , channel ) => {
    if ( member.user.bot ) return
    let data = db.fetch ( `1data:${ member.user.id }:${ channel.id }` );
    if ( data ) {
        let total = db.fetch ( `1total:${ member.user.id }:${ channel.id }` ) || {
            "total" : 0
        };

        const json = {
            "channel" : data.channel ,
            "total" : Number ( total.total ) + (
                new Date ().getTime () - Number ( data.start )
            )
        };
        db.set ( `1total:${ member.user.id }:${ channel.id }` , json );
        db.delete ( `1data:${ member.user.id }:${ channel.id }` );
        db.add ( `2channel:${ channel.id }` , new Date ().getTime () - Number ( data.start ) )
        if ( channel.parentID === config.public ) {
            db.add (
                `1public:${ member.user.id }` ,
                new Date ().getTime () - Number ( data.start )
            );
        }
        else if ( channel.parentID == config.priv ) {
            db.add ( `1private:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.alone ) {
            db.add ( `1alone:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.game ) {
            db.add ( `1game:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.vk ) {
            db.add ( `1game:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.dc ) {
            db.add ( `1game:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.register ) {
            db.add ( `1kayıt:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.sorun ) {
            db.add ( `1mod:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( channel.parentID == config.terapi ) {
            db.add ( `1mod:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
    }
} );

client.on ( "voiceChannelSwitch" , ( member , oldChannel , newChannel ) => {
    if ( member.user.bot ) return
    let data = db.fetch ( `1data:${ member.user.id }:${ oldChannel.id }` );
    if ( data ) {
        let mainData = db.fetch ( `1total:${ member.user.id }:${ data.channel }` ) || {
            "total" : 0
        };
        const json = {
            "channel" : data.channel ,
            "total" :
                Number ( mainData.total ) + (
                new Date ().getTime () - Number ( data.start )
                                          )
        };
        db.set ( `1total:${ member.user.id }:${ oldChannel.id }` , json );
        db.add ( `2channel:${ oldChannel.id }` , new Date ().getTime () - Number ( data.start ) )
        const json2 = {
            "channel" : newChannel.id ,
            "start" : new Date ().getTime ()
        };
        db.set ( `1data:${ member.user.id }:${ newChannel.id }` , json2 );
        if ( oldChannel.parentID === pub ) {
            db.add (
                `1public:${ member.user.id }` ,
                new Date ().getTime () - Number ( data.start )
            );
        }
        else if ( oldChannel.parentID == config.priv ) {
            db.add ( `1private:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.alone ) {
            db.add ( `1alone:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.game ) {
            db.add ( `1game:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.vk ) {
            db.add ( `1game:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.dc ) {
            db.add ( `1game:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.kayıt ) {
            db.add ( `1kayıt:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.sorun ) {
            db.add ( `1mod:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( oldChannel.parentID == config.terapi ) {
            db.add ( `1mod:${ member.user.id }` , new Date ().getTime () - Number ( data.start ) )
        }
    }
} );

client.on ( "message" , async message => {
    if ( message.author.bot ) return;
    let member = message.guild.members.cache.get ( message.author.id )
    var totall = (
                     await db.fetch (
                         `messageCount:${ message.author.id }:${ message.channel.id }`
                     )
                 ) || { "count" : 0 };
    db.set ( `messageCount:${ message.author.id }:${ message.channel.id }` , {
        "channel" : message.channel.id ,
        "count" : totall.count + 1
    } );
    db.add ( `totalMessage:${ message.author.id }` , 1 );
    db.add ( `3mesajKanal:${ message.channel.id }` , 1 )
    var st = message.member.voice;
    var data = await db.fetch ( `1data:${ message.author.id }:${ st.channelID }` );
    if ( data ) {
        var total = (
                        await db.fetch (
                            `1total:${ message.author.id }:${ data.channel }`
                        )
                    ) || { "total" : 0 };
        const json = {
            "channel" : data.channel ,
            "total" : Number ( total.total ) + (
                Date.now () - Number ( data.start )
            )
        };
        db.set ( `1total:${ message.author.id }:${ data.channel }` , json );
        db.delete ( `1data:${ message.author.id }:${ st.channelID }` );
        const json2 = {
            "channel" : st.channelID ,
            "start" : Date.now ()
        };
        db.set ( `1data:${ message.author.id }:${ st.channelID }` , json2 );
        db.add ( `2channel:${ st.channelID }` , new Date ().getTime () - Number ( data.start ) )
        if ( st.channel.parentID === config.pub ) {
            db.add (
                `1public:${ message.author.id }` ,
                new Date ().getTime () - Number ( data.start )
            );
        }
        else if ( st.channel.parentID == config.priv ) {
            db.add ( `1private:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.alone ) {
            db.add ( `1alone:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.game ) {
            db.add ( `1game:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.vk ) {
            db.add ( `1game:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.dc ) {
            db.add ( `1game:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.kayıt ) {
            db.add ( `1kayıt:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.sorun ) {
            db.add ( `1mod:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
        else if ( st.channel.parentID == config.terapi ) {
            db.add ( `1mod:${ message.author.id }` , new Date ().getTime () - Number ( data.start ) )
        }
    }
} );

client
    .login(config.token)
    .then(() => console.log(`${client.user.username} Olarak Giriş Yapıldı Bot Aktif`))
    .catch(() => console.log("Bot Giriş Yaparken Bir Hata Oluştu"))