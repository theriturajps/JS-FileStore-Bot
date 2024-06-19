const { Telegraf, Markup } = require('telegraf');

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// -------------------------------------------------------------------------------------------------------------------------------------------- //

const reportButton = Markup.button.url('Report Error', 'tg://user?id=0123456789');
const copyrightButton = Markup.button.url('Copyright', 'https://t.me/riturajps');
const deleteButton = Markup.button.callback('Delete', 'delete');
const channelButton = Markup.button.url('File Retrieve Channel', 'https://t.me/iamriturajps');

// -------------------------------------------------------------------------------------------------------------------------------------------- //


// -------------------------------------------------------------------------------------------------------------------------------------------- //

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('Report Error', 'tg://user?id=0123456789'),
  Markup.button.callback('Delete', 'delete')
]);

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.start(async (ctx) => {
  const startPayload = ctx.startPayload;
  if (startPayload) {
    const input = startPayload.split('_');
    if (input.length === 2 && input[0] === 'id') {
      const messageId = input[1];
      const dbChannelId = process.env.DB_CHANNEL;

      try {
        const message = await ctx.telegram.copyMessage(ctx.from.id, dbChannelId, messageId, {
          reply_markup: {
            inline_keyboard: [
              [reportButton, copyrightButton], 
              [deleteButton]
            ]
          }
        });
        ctx.reply(`🎉 Requested For 🆔 : <pre>${messageId}</pre> 🙂`, { reply_to_message_id: message.message_id, parse_mode: 'HTML' });
      } catch (error) {
        ctx.reply('Message not found or could not be retrieved 😐');
      }
    } else if (input.length === 3 && input[0] === 'id') {
      const startId = parseInt(input[1]);
      const endId = parseInt(input[2]);
      const dbChannelId = process.env.DB_CHANNEL;
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

        ctx.reply(`🎉 Requested For 🆔 <pre>${startId}</pre> to <pre>${endId}</pre> 🙂`, { reply_to_message_id: messages[0].message_id, parse_mode: 'HTML' });
      } catch (error) {
        ctx.reply('Messages not found or could not be retrieved 😐 or Please cheack it is the Valid 🆔');
      }
    } else {
      ctx.reply('Invalid link format.');
    }
  } else {
    ctx.reply('Welcome to the bot!\n\n📢 You can retrieve from single ID and as well as by batch ID with this bot.', {
      reply_markup: {
      inline_keyboard: [[channelButton], [deleteButton]]
    }
    });
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.help((ctx) => ctx.reply('📖 You can use :\n\n🧿 "<pre>/upmedia</pre>" : Reply to upload a video or document\n🧿 "<pre>/get</pre>" : To retrieve your media\n\n✅ Eg. <pre>/get Message ID</pre>\n\n🔰 NOTE: When you upload a video/document, you will get a Message ID', {parse_mode:'HTML'}));

bot.action('delete', (ctx) => ctx.deleteMessage());

bot.command('photo', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }));

// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('upmedia', async (ctx) => {
  if (process.env.COPY_MESSAGE === 'active') {
    // Check if the user replied to a message
    if (!ctx.message.reply_to_message) {
      return ctx.reply('📖 Please reply to a message you want to upload.');
    }

    const dbChannelId = process.env.DB_CHANNEL;
    const publicChannelId = process.env.PUBLIC_CHANNEL;
    const publicChannelMode = process.env.PUBLIC_CHANNEL_MODE;

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
          await ctx.telegram.sendMessage(publicChannelId, `<b>✅ Title:</b> <pre>${title}</pre>\n\n<b>🔎 Message ID:</b> <pre>${message.message_id}</pre>\n\n<b>⚠️ Uploaded By:</b> <a href="${uploaderLink}">#User</a>`, { parse_mode: 'HTML' });
        }

        const uploadedMessageId = message.message_id;
        
        const link = `https://t.me/riturajpsbot?start=id_${uploadedMessageId}`;

        ctx.reply(`✅ Your <pre>${title}</pre> is successfully stored and sent to the public channel 🙂.\n\n🔎 <b>Message ID:</b> <pre>${message.message_id}</pre>\n\n🛰️ Please use "<pre>/get ${message.message_id}</pre>" to retrieve.\n\n🔗 You can also use this link to retrieve the media:\n${link}`, { parse_mode: 'HTML' });
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
  if (process.env.COPY_MESSAGE === 'active') {
    const input = ctx.message.text.split(' ');
    if (input.length !== 2) {
      return ctx.reply('🔎 Please use : /get Message ID.');
    }

    const messageId = input[1];
    const dbChannelId = process.env.DB_CHANNEL;

    try {
      const message = await ctx.telegram.copyMessage(ctx.from.id, dbChannelId, messageId, keyboard);
      ctx.reply(`🎉 Requested For <pre>${messageId}</pre> ID 🙂`, {reply_to_message_id: message.message_id, parse_mode:'HTML'});
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
    domain: process.env.BOT_DOMAIN,
    hookPath: '/api/riturajps',
  },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
