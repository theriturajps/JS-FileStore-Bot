const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const commandDB = require('./commandDB.json'); // Import the JSON file

// Define your variables here (Important)
const BOT_TOKEN = '***********:*****************************';
const DB_CHANNEL = '-100***********';
const BOT_DOMAIN = 'https://***********.vercel.app';
const PUBLIC_CHANNEL = '-100**********';
const PUBLIC_CHANNEL_MODE = 'off';
const COPY_MESSAGE = 'deactivate';

const bot = new Telegraf(BOT_TOKEN);

// -------------------------------------------------------------------------------------------------------------------------------------------- //

const reportButton = Markup.button.url('Report Error', 'tg://user?id=6350915754');
const copyrightButton = Markup.button.url('Copyright', 'tg://user?id=6350915754');
const deleteButton = Markup.button.callback('Delete', 'delete');
const riturajpsButton = Markup.button.url('Channel', 'https://t.me/iamriturajps');

// -------------------------------------------------------------------------------------------------------------------------------------------- //


// -------------------------------------------------------------------------------------------------------------------------------------------- //

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('Report Error', 'tg://user?id=6350915754'),
  Markup.button.callback('Delete', 'delete')
]);

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.start(async (ctx) => {
  const startPayload = ctx.startPayload;
  if (startPayload) {
    const input = startPayload.split('_');
    if (input.length === 2 && input[0] === 'id') {
      const messageId = input[1];
      const dbChannelId = DB_CHANNEL;

      try {
        const message = await ctx.telegram.copyMessage(ctx.from.id, dbChannelId, messageId, {
          reply_markup: {
            inline_keyboard: [
              [reportButton, copyrightButton], 
              [deleteButton]
            ]
          }
        });
        ctx.reply(`🎉 Requested For 🆔 : <code>${messageId}</code> 🙂`, { reply_to_message_id: message.message_id, parse_mode: 'HTML' });
      } catch (error) {
        ctx.reply('Message not found or could not be retrieved 😐');
      }
    } else if (input.length === 3 && input[0] === 'id') {
      const startId = parseInt(input[1]);
      const endId = parseInt(input[2]);
      const dbChannelId = DB_CHANNEL;
      const messages = [];

      try {
        for (let i = startId; i <= endId; i++) {
          const message = await ctx.telegram.copyMessage(ctx.from.id, dbChannelId, i, {
          reply_markup: {
            inline_keyboard: [
              [reportButton, copyrightButton], 
              [deleteButton]
            ]
          }
        });
          messages.push(message);
        }

        ctx.reply(`🎉 Requested For 🆔 <code>${startId}</code> to <code>${endId}</code> 🙂`, { reply_to_message_id: messages[0].message_id, parse_mode: 'HTML' });
      } catch (error) {
        ctx.reply('Messages not found or could not be retrieved 😐 or Please cheack it is the Valid 🆔');
      }
    } else {
      ctx.reply('Invalid link format.');
    }
  } else {
    ctx.reply('Welcome to the Ritu Raj Bot!\n\n📢 To get the media you must visit to the Offical Website (www.riturajps.in) Website and explore the posts, in the post you will get the url to get your media.\n\n🧿 Must Join Channel 😘', {
      reply_markup: {
        inline_keyboard: [
          [riturajpsButton]
        ]
      }
    });
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.help((ctx) => ctx.reply('<b>📖 You can use :</b>\n\n🧿 "<code>/upmedia</code>" : Reply to upload a video or document\n\n🧿 "<code>/get</code>" : To retrieve your media\n\n✅ Eg. <code>/get Message ID</code>\n\n🔰 NOTE: When you upload a video/document, you will get a Message ID', {parse_mode:'HTML'}));

bot.action('delete', (ctx) => ctx.deleteMessage());

bot.command('photo', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }));

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('upmedia', async (ctx) => {
  if (COPY_MESSAGE === 'active') {
    // Check if the user replied to a message
    if (!ctx.message.reply_to_message) {
      return ctx.reply('📖 Please reply to a message you want to upload.');
    }

    const dbChannelId = DB_CHANNEL;
    const publicChannelId = PUBLIC_CHANNEL;
    const publicChannelMode = PUBLIC_CHANNEL_MODE;

    try {
      const repliedMessage = ctx.message.reply_to_message;

      // Check if the replied message is a video or document
      if (repliedMessage.video || repliedMessage.document) {
        let title;
        if (repliedMessage.video) {
          title = repliedMessage.video.file_name;
        } else {
          title = repliedMessage.document.file_name;
        }

        // Copy the replied message to the DB_CHANNEL
        const message = await ctx.telegram.copyMessage(dbChannelId, ctx.chat.id, repliedMessage.message_id);

        // Get the user ID of the uploader
        const uploaderUserId = ctx.from.id;

        // Send the extracted title, message ID, and uploader information to the PUBLIC_CHANNEL if PUBLIC_CHANNEL_MODE is "on"
        if (publicChannelMode === 'on') {
          const uploaderLink = `tg://user?id=${uploaderUserId}`;
          await ctx.telegram.sendMessage(publicChannelId, `<b>✅ Title:</b> ${title}\n\n<b>🔎 ID:</b> <code>${message.message_id}</code>\n\n<b>⚠️ Uploaded By:</b> <a href="${uploaderLink}">#User</a>`, { parse_mode: 'HTML' });
        }

        const uploadedMessageId = message.message_id;
        
        const link = `https://t.me/TheGetBot?start=id_${uploadedMessageId}`;

        ctx.reply(`✅ <b>${title}</b> is successfully stored and info has been sent to the public channel 🙂.\n\n🔎 <b>Message ID:</b> <code>${message.message_id}</code>\n\n🛰️ Please use "<code>/get ${message.message_id}</code>" command to retrieve.\n\n🔗 You can also use this link to retrieve the media: ${link}`, { parse_mode: 'HTML' });
      } else {
        ctx.reply('The replied message is not a video or document. Please upload a video/document to store and send to the public channel.');
      }
    } catch (error) {
      ctx.reply('Message not found or could not be uploaded 😐');
    }
  } else {
    ctx.reply('This function is temporarily disabled 😔');
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('get', async (ctx) => {
  if (COPY_MESSAGE === 'active') {
    const input = ctx.message.text.split(' ');
    if (input.length !== 2) {
      return ctx.reply('🔎 Please use : /get Message ID.');
    }

    const messageId = input[1];
    const dbChannelId = DB_CHANNEL;

    try {
      const message = await ctx.telegram.copyMessage(ctx.from.id, dbChannelId, messageId, keyboard);
      ctx.reply(`🎉 Requested For <code>${messageId}</code> ID 🙂`, {reply_to_message_id: message.message_id, parse_mode:'HTML'});
    } catch (error) {
      ctx.reply('Message not found or could not be retrieved 😐');
    }
  } else {
    ctx.reply('This function is temporarily disabled 😔');
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('send', async (ctx) => {
  const userId = ctx.message.text.split(' ')[1]; // Extract the user ID from the command
  if (userId) {
    const repliedMessage = ctx.message.reply_to_message;
    if (repliedMessage) {
      try {
        const copiedMessage = await ctx.telegram.copyMessage(userId, ctx.chat.id, repliedMessage.message_id);
        ctx.reply(`Message sent to user with ID ${userId} 🎉`);
      } catch (error) {
        ctx.reply('Error sending the message.');
      }
    } else {
      ctx.reply('Please tell the user to start the bot first and please use the valid User ID with the command "/send <user_id>". ');
    }
  } else {
    ctx.reply('Please reply to a message that you want to send to the user with /send <user_id>');
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('id', async (ctx) => {
  const userId = ctx.message.from.id; // Get the user's ID who sent the command
  const userFirstName = ctx.message.from.first_name;
  const userLastName = ctx.message.from.last_name || '';
  const username = ctx.message.from.username || '';

  const userInfo = `
🧿 User ID: ${userId}
🧿 First Name: ${userFirstName}
🧿 Last Name: ${userLastName}
🧿 Username: ${username}
  `;

  ctx.reply(`Here is the information:\n${userInfo}`, {
    reply_markup: {
      inline_keyboard: [
        [deleteButton]
      ]
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.on('text', async (ctx) => {
  const messageText = ctx.message.text;

  // Check if the message is a command
  const matchingCommand = commandDB.find((command) => messageText === command.command);

  if (matchingCommand) {
      // Send the response with HTML and Markdown support
      const sentMessage = await ctx.replyWithHTML(matchingCommand.message, {
          reply_to_message_id: ctx.message.message_id,
          reply_markup: {
          inline_keyboard: [
            [reportButton]
          ]
        }
      });
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('report', (ctx) => {
  ctx.reply('Report in case of any error occurs in this bot.', {
    reply_markup: {
      inline_keyboard: [
        [reportButton], 
        [deleteButton]
      ]
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.action('delete', (ctx) => ctx.deleteMessage());

// -------------------------------------------------------------------------------------------------------------------------------------------- //



bot.launch({
  webhook: {
    domain: BOT_DOMAIN,
    hookPath: '/api/riturajps',
  },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
