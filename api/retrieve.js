const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const commandDB = require('./commandDB.json'); // Import the JSON file

// Define your variables here (Important)
const BOT_TOKEN = '*********:**************************';
const DB_CHANNEL = '-100**********';
const BOT_DOMAIN = 'https://***************.vercel.app';

const bot = new Telegraf(BOT_TOKEN);

// -------------------------------------------------------------------------------------------------------------------------------------------- //

const reportButton = Markup.button.url('Report Error', 'tg://user?id=0123456789');
const deleteButton = Markup.button.callback('Delete', 'delete');
const riturajpsButton = Markup.button.url('Official Website', 'https://www.riturajps.in');

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
      const dbChannelId = DB_CHANNEL;

      try {
        const message = await ctx.telegram.copyMessage(ctx.from.id, dbChannelId, messageId, {
          reply_markup: {
            inline_keyboard: [
              [riturajpsButton],
              [reportButton, deleteButton]
            ]
          }
        });
        ctx.reply(`🎉 Requested For 🆔 : <pre>${messageId}</pre> 🙂`, { reply_to_message_id: message.message_id, parse_mode: 'HTML' });
      } catch (error) {
        ctx.reply('Sorry!! The Requested URL Could Not Be Retrieved 😐\n\n🧿 Please report this error to admin 👇', {
          reply_markup: {
            inline_keyboard: [
              [reportButton]
            ]
          }
        });
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
              [riturajpsButton],
              [reportButton, deleteButton]
            ]
          }
        });
          messages.push(message);
        }

        ctx.reply(`🎉 Requested For 🆔 <pre>${startId}</pre> to <pre>${endId}</pre> 🙂`, { reply_to_message_id: messages[0].message_id, parse_mode: 'HTML' });
      } catch (error) {
        ctx.reply('Sorry!! The Requested URL Could Not Be Retrieved 😐\n\n🧿 Please report this error to admin 👇', {
          reply_markup: {
            inline_keyboard: [
              [reportButton]
            ]
          }
        });
      }
    } else {
      ctx.reply('Invalid link format.');
    }
  } else {
    ctx.reply('Welcome to the Ritu Raj Bot!\n\n📢 To get the media you must visit to the Offical Website (www.riturajps.in) Website and explore the posts, in the post you will get the url to get your media.\n\n🧿 Must Join File Retrieve Channel 😘', {
      reply_markup: {
      inline_keyboard: [
        [riturajpsButton]
      ]
    }
    });
  }
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


// -------------------------------------------------------------------------------------------------------------------------------------------- //

bot.command('report', (ctx) => {
  ctx.reply('Report in case of any error occurs or for the broken links in this bot.', {
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

// Launch your bot with the defined BOT_DOMAIN
bot.launch({
  webhook: {
    domain: BOT_DOMAIN,
    hookPath: '/api/retrieve',
  },
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
