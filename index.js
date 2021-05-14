const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'] });
var prefix = '/'
const token = 'ODE1MTc2NzUwNjk0NDAwMDEw.YDomgg.P8UPrj_ziAwT20GN4W157NmOur0';
client.login(token);
client.on('ready', () => {
    console.log('Bot ON');
});

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get("810643519659180082").send({
        "content": `${member}`,
        "embed": 
          {
            "description": "**:performing_arts: Тут вы можете получить роль:**\n<#810640147854000141>\n\n**:question: Если вам не выдают роль или есть вопрос пишите в ЛС:**\n<@322408740475240461>\n\n**:busts_in_silhouette: По вопросам вступления:**\n<@403957025022672896>\n\n**:money_with_wings: По финансовым вопросам:**\n<@322408740475240461>",
            "color": 16753408,
            "author": {
              "name": "Добро пожаловать в дискорд канал Rothschild Family",
              "icon_url": "https://imgur.com/OYqsnfg.png"
            },
            "image": {
              "url": "https://cdn.discordapp.com/attachments/810647550641963008/813051137883373629/unknown.png"
            },
            "thumbnail": {
              "url": "https://imgur.com/99X6OuW.png"
            }
          }
        
      })
});

client.on("message", async message => {
    if (message.author.bot) return;
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase();
    function deletemessage() {
        if(message.channel.type !== 'dm') {
            message.delete()
        }


    
    }
    if(command === 'test'){
        deletemessage()
       
    };

    if(command === 'm'){
      message = "";
      for(i = 1; i < args.length; i++) {
        message = message + " " + args[i]
      }
      client.channels.cache.get(args[0]).send(message)

  };

});
