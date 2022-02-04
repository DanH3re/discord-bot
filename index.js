  
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'] });
var prefix = '/'
const token = 'ODE1MTc2NzUwNjk0NDAwMDEw.YDomgg.P8UPrj_ziAwT20GN4W157NmOur0';

const queue = new Map();
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search')
var imgList = ["https://cdn.discordapp.com/attachments/939205663706468363/939211463598419998/1.png","https://cdn.discordapp.com/attachments/939205663706468363/939211464013676554/2.png","https://cdn.discordapp.com/attachments/939205663706468363/939211464563097690/3.png","https://cdn.discordapp.com/attachments/939205663706468363/939211464940613762/4.png","https://cdn.discordapp.com/attachments/939205663706468363/939211465422946304/5.png","https://cdn.discordapp.com/attachments/939205663706468363/939211465846554644/6.png","https://cdn.discordapp.com/attachments/939205663706468363/939211466198900806/7.png","https://cdn.discordapp.com/attachments/939205663706468363/939211466588954644/8.png","https://cdn.discordapp.com/attachments/939205663706468363/939211467171971172/9.png"];
client.login(token);
client.on('ready', () => {
    console.log('Bot ON');
});

client.on('guildMemberAdd', member => {
  var image = imgList[Math.floor(Math.random() * imgList.length)];
    member.guild.channels.cache.get("810643519659180082").send({
  "content": `${member}`,
  "embed": 
    {
      "title": "Добро пожаловать в **Rothschild Family**",
      "description": "**В первую очередь получите роль:**\n<:role:939225432694341632>  [Выдача роли](https://discord.com/channels/810640147854000138/879279441103175721)\n\n**Полезные каналы**\n<:leader:939230416504754176> [Наши лидерки](https://discord.com/channels/810640147854000138/897498450504056852)\n<:partners:939231876843962469> [Наши партнеры](https://discord.com/channels/810640147854000138/879279441103175721)\n<:galleyy:939231581128765470> [Галерея](https://discord.com/channels/810640147854000138/939205663706468363)\n\n**Соц. Сети**\n<:youtube:939232239160528926> [YouTube](https://www.youtube.com/channel/UCq8BM7uQmBsWKyNLl2Ps0Tg)",
      "color": 16764416,
      "image": {
        "url": `${image}`
      },
      "thumbnail": {
        "url": "https://i.imgur.com/tRi7oL7.png"
      }
    }
});
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
    
        if(command === 'reset'){
        deletemessage()
        resetBot()
       
    };

    if(command === 'm'){
      message = "";
      for(i = 1; i < args.length; i++) {
        message = message + " " + args[i]
      }
      client.channels.cache.get(args[0]).send(message)

  };

  
  const server_queue = queue.get(message.guild.id);
  if(command === 'play'){
  deletemessage()
  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel) return message.channel.send('<:error:864199217559765032> **Вы должны быть в голосовом канале чтобы использовать эту команду!**');
  const voicePerms = voiceChannel.permissionsFor(message.client.user);
  if(!voicePerms.has('CONNECT')) return message.channel.send('<:error:864199217559765032> **У вас нет прав чтобы использовать данную команду!**');
  if(!voicePerms.has('SPEAK')) return message.channel.send('<:error:864199217559765032> **У вас нет прав чтобы использовать данную команду!**');
  if(!args.length) return message.channel.send('<:error:864199217559765032> **Введите название или ссылку на видео!**');
  let song = {};

  if(ytdl.validateURL(args[0])) {
    const songInfo = await ytdl.getInfo(args[0]);
    song = {title: songInfo.videoDetails.title, author: songInfo.videoDetails.author, url: songInfo.videoDetails.video_url}
  } else {
    const videoFinder = async (query) => {
      const videoResult = await ytSearch(query);
      return(videoResult.videos.length > 1) ? videoResult.videos[0]: null;
    }
    const video = await videoFinder(args.join(' '))
    if(video) {
      song = {title: video.title, author: video.author, url: video.url}
    } else {
      message.channel.send('<:error:864199217559765032> **Видео не найдено.**');
    }
  }

if(!server_queue) {
  const queueConstructor = {
    voice_channel: voiceChannel,
    text_channel: message.channel,
    connection: null,
    songs: []
  };
  queue.set(message.guild.id, queueConstructor)
  queueConstructor.songs.push(song)

  try {
    const connection = await voiceChannel.join();
    queueConstructor.connection = connection;
    videoPlayer(message.guild, queueConstructor.songs[0])
  } catch(err) {
    queue.delete(message.guild.id)
    message.channel.send('<:error:864199217559765032> **Ошибка при подключении.**');
    console.log(err);
  } 
} else {
  server_queue.songs.push(song);
  message.channel.send(`<:queue:864199217739988992> **Песня __${song.title}__ добавлена в очередь на __${server_queue.songs.length}__ месте.**`);
}

} else if(command === 'stop'){
    deletemessage()
    stopSong(message, server_queue)
} else if(command === 'skip'){
    deletemessage()
    skipSong(message, server_queue)
  };

if(command === 'd'){
    isAdmin(message.member);
    message.delete();
    if(!args[0]) {
      message.channel.send({
          "embed": {
              "title": "<:error:864199217559765032> Ошибка",
              "description": "Недостаточно аргументов.",
              "color": 16711680
          }
      })
  } else if(args[0]<=100) {
  message.channel.bulkDelete(args[0]).catch(error => {
    if (error.code !== 0) {
          var errorDescription = 'Что то пошло не так.\n\n' + '```' + error + '```'
          message.channel.send({
              "embed": {
                  "title": "<:error:864199217559765032> Ошибка",
                  "description": errorDescription,
                  "color": 16711680
              }
          })
      }
  });
    message.channel.send({
        "embed": {
            "title": "Успешно <:checkmark:850726004649099264>",
            "description": `Удалил ${args[0]} сообщении.`,
            "color": 7601920
        }
    })
  } else if(args[0]<=500) {
      var deletedMessages = 0;
      message.channel.bulkDelete(100).catch(error => {
          // Only log the error if it is not an Unknown Message error
          if (error.code !== 0) {
              var errorDescription = 'Что то пошло не так.\n\n' + '```' + error + '```'
              message.channel.send({
                  "embed": {
                      "title": "<:error:864199217559765032> Ошибка",
                      "description": errorDescription,
                      "color": 16711680
                  }
              })
          } else {
              for (var i = 100; i < args[0];) {
                  i = i + 100;
                  message.channel.bulkDelete(100)
                  deletedMessages = deletedMessages + 100;
              }
              message.channel.send({
                  "embed": {
                      "title": "Успешно <:checkmark:850726004649099264>",
                      "description": `Удалил ${args[0]} сообщении.`,
                      "color": 7601920
                  }
              })
          }
      });
  
      
  
  } else {
      message.channel.send({
          "embed": {
              "title": "<:error:864199217559765032> Ошибка",
              "description": "Введите номер от 0 до 500",
              "color": 16711680
          }
      })
  }
}

});

const videoPlayer = async (guild, song) => {
  const song_queue = queue.get(guild.id);
    if (!song) {
        song_queue.voice_channel.leave();
        song_queue.text_channel.send(`<:queue:864199217739988992> **Очередь музыки закончилась.**`);
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        song_queue.songs.shift();
        videoPlayer(guild, song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`<:music:864199218049712128> **Ебашу песню под названием - __${song.title}__**`);
}

const skipSong = (message, server_queue) => {
  if(!message.member.voice.channel) return message.channel.send('<:error:864199217559765032> **Вы должны быть в голосовом канале чтобы использовать эту команду!**');
  if(!server_queue) return message.channel.send('<:error:864199217559765032> **Ничего не было добавлено в очередь.**');
  message.channel.send(`**<:skip:864199217626087474> Переключаюсь на следующею композицию.**`);
  server_queue.connection.dispatcher.end();
}

const stopSong = (message, server_queue) => {
  if(!message.member.voice.channel) return message.channel.send('<:error:864199217559765032> **Вы должны быть в голосовом канале чтобы использовать эту команду!**');
  if(!server_queue) return message.channel.send('<:error:864199217559765032> **Ничего не было добавлено в очередь.**');
  message.channel.send(`**<:stop:864199219237879828> Остановил проигравание всех песен.**`);
  server_queue.song = [];
  server_queue.connection.dispatcher.end();
}

function isAdmin(user) {
  if(!user.hasPermission('ADMINISTRATOR')) return message.channel.send("<:error:864199217559765032> **У вас недостаточно прав!**")
}

function getRandomNumber(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function resetBot() {
  console.log('RESTARTING...');
  process.exit(1);
}
