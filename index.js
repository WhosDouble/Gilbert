import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  REST,
  Routes,
} from "discord.js";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import db from "./db.js";
import bibleVersus from "./files/verses.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const userMessages = {};

// Log in with the bot token
client.login(process.env.DISCORD_TOKEN);

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

import fs from "fs";
import path from "path";

//storing count in json
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const countFilePath = path.join(__dirname, "choclateCount.json");

if (fs.existsSync(countFilePath)) {
  const data = fs.readFileSync(countFilePath, "utf8");
  const parsedData = JSON.parse(data);
  chocolateCount = parsedData.count || 0;
}

const emojis = [
  "😈",
  "😎",
  "😐",
  "😑",
  "😡",
  "😕",
  "😀",
  "😤",
  "🤩",
  "😛",
  "😁",
  "😋",
  "☹",
  "😝",
];

const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

const lol = ["lol", "ha", "hahaha", "haha", "lmao", "lmafo"];

const mj = [
  "micheal jackson",
  "mj",
  "mike jackson",
  "m. jackson",
  "m jackson",
  "Michael J. Jackson",
  "Michael J.",
  "Jackson, Michael",
];

const greeting = [
  "hello",
  "hi",
  "hey",
  "yo",
  "sup",
  "hola",
  "wsp",
  "ay",
  "wsg",
  "heyo",
  "ello",
];

const randomGreet = greeting[Math.floor(Math.random() * greeting.length)];

const thanks = [
  "thanks",
  "thank you",
  "gracias",
  "danke",
  "tank you",
  "tank u",
  "ty",
  "thank",
  "thank u",
  "thanks u",
  "thank uou",
  "thank ou",
];

const brainRot = [
  "Gyat",
  "Skill Issue",
  "Cope",
  "rizz",
  "Slay",
  "pookie",
  "skibidi",
  "sigma",
  "alpha",
  "fanum tax",
  "delulu",
  "ohio",
  "duke dennis",
  "duke",
  "sus",
  "gronk",
  "sussy",
  "baka",
  "imposter",
  "sussy imposter",
  "goon",
  "gooner",
  "gooning",
  "turbulence",
  "griddy",
  "gyatt",
  "gyyyaat",
  "ratio",
  "among us",
];

const denada = ["of course", "no worries", "no problem", "no problema"];
const randomDenada = denada[Math.floor(Math.random() * denada.length)];

const tellBtn = new ButtonBuilder()
  .setLabel("Tell me about yourself") // Button text
  .setStyle(ButtonStyle.Primary) // Button style
  .setCustomId("AboutGilbert"); // Unique button ID

const AnythingNewBtn = new ButtonBuilder()
  .setLabel("Anything new?")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("AnythingNew");

//TODO add a how to use button that explains how to use gilbert

// when defining multiple buttons you can create a row
const row = new ActionRowBuilder().addComponents(tellBtn, AnythingNewBtn);

async function registerCommands() {
  try {
    console.log("Clearing existing commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: [] }
    );
    console.log("Existing commands cleared.");
  } catch (error) {
    console.error("Error clearing commands:", error);
  }
}

client.on("guildMemberAdd", async (member) => {
  const welcomeId = "1227288321152122972";
  const welcomeChannel = member.guild.channels.cache.get(welcomeId);

  try {
    if (welcomeChannel) {
      welcomeChannel.send(
        `Heyo ${member.displayName}! heres a Big welcome to the Flowing Faith server!`
      );
    }
  } catch (error) {
    console.error(error);
  }
});

const bumpChannelId = "1228039676279918713";
const bumpId = "1351749413122474015";

function scheduleBumpReminder() {
  const now = new Date();
  const nextWholeHour = new Date();

  nextWholeHour.setMinutes(0, 0, 0); // Reset to the exact hour
  nextWholeHour.setHours(now.getHours() + 1); // Move to the next whole hour

  const timeUntilNextHour = nextWholeHour - now;
  console.log(`Next bump reminder scheduled for: ${nextWholeHour}`);

  setTimeout(() => {
    sendBumpReminder();
    setInterval(sendBumpReminder, 2 * 60 * 60 * 1000); // Repeat every 2 hours
  }, timeUntilNextHour);
}

function sendBumpReminder() {
  const channel = client.channels.cache.get(bumpChannelId);
  if (channel) {
    channel.send(
      `⏰ <@&${bumpId}> ⏰\n- yo yo yo 🗣 it's been two hours bros, time to get bumpin 🤜`
    );
    console.log("Bump reminder sent!");
  } else {
    console.error("Bump channel not found!");
  }
}

const dailyVerseChannelId = "1227297701318889542";
const votdId = "1228395980898963516";

function scheduleDailyMessage() {
  const now = new Date();
  const next7AM = new Date();

  next7AM.setHours(7, 0, 0, 0); // Set time to 7:00:00 AM

  // If it's already past 9 AM today, schedule for tomorrow
  if (now >= next7AM) {
    next7AM.setDate(next7AM.getDate() + 1);
  }

  const timeUntilnext7AM = next7AM - now;
  console.log(`Next message scheduled for: ${next7AM}`);

  setTimeout(() => {
    sendVotd();
    setInterval(sendVotd, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, timeUntilnext7AM);
}

function sendVotd() {
  const channel = client.channels.cache.get(dailyVerseChannelId);
  const randomVerse = bibleVersus[Math.floor(Math.random() * verses.length)]; // Pick a random verse

  if (channel) {
    channel.send(`<@&${votdId}> ${randomVerse}`);
    console.log(`VOTD sent!`);
  } else {
    console.error("VOTD channel not found.");
  }
}

// the bot picking up on messages sent and responding accordingly
client.on("messageCreate", async (message) => {
  let member = await message.guild.members.fetch(message.author.id);
  // Ignore messages from bots
  if (message.author.bot) return;
  //handleing ai interactions
  if (
    message.content.toLowerCase().startsWith("gilbert") ||
    (message.reference?.messageId &&
      (await message.fetchReference()).author.id === client.user.id)
  ) {
    // Initialize pastMessages to store conversation history for the user
    let pastMessages = userMessages[message.author.id] || [];
    // If replying to a previous message, fetch the referenced message
    if (message.reference?.messageId) {
      try {
        const referencedMessage = await message.fetchReference();
        if (referencedMessage.author.id === client.user.id) {
          pastMessages.push({
            role: "assistant",
            content: referencedMessage.content,
          }); // Store Gilbert's last message
        }
      } catch (error) {
        console.error("Error fetching referenced message:", error);
      }
    }

    // Add the current message to the conversation history
    pastMessages.push({ role: "user", content: message.content });

    // Keep only the last 10 messages
    if (pastMessages.length > 100) {
      pastMessages.shift();
    }

    try {
      const messages = [
        {
          role: "system",
          content:
            "You're a gecko called Gilbert and you have a brother called Hilbert, you are a Christian, wholesome, and informal. You love making people smile, you speak with emojis sometimes and have positive vibes. You speak in a laid-back, engaging way, like a good friend hanging out in a Discord server. You never say anything offensive or rude, and you're always chill and supportive.",
        },
        ...pastMessages, // Add the pastMessages array to the context
      ];

      // Generate AI response
      const response = await openai.chat.completions.create({
        model: "ft:gpt-4o-mini-2024-07-18:bystander::BF7cC7KH",
        messages: messages,
        max_tokens: 165,
      });

      const gilbertReply = response.choices[0].message.content;
      message.reply(gilbertReply);

      // Store the updated conversation history in lastMessages
      userMessages[message.author.id] = pastMessages;
    } catch (error) {
      console.error("Error generating AI response:", error);
      message.reply(
        "dang man my brain feels weird. Try again later, please 😊"
      );
    }
  }

  // Handle chocolate mention
  if (message.content.toLowerCase().includes("chocolate")) {
    try {
      // Increment the chocolate count in the database
      await db.query(
        "UPDATE chocolate_count SET count = count + 1 WHERE id = 1"
      );

      // Get the updated chocolate count
      const res = await db.query(
        "SELECT count FROM chocolate_count WHERE id = 1"
      );
      const chocolateCount = res.rows[0].count;

      // Send a message with the updated count
      message.react("🍫");
      message.reply(
        `wow chocolate has been said ${chocolateCount} times. Way to go Luca ${randomEmoji}`
      );
    } catch (error) {
      console.error("Error updating chocolate count:", error);
      message.reply("Oops, something went wrong with the chocolate count!");
    }
  }
  // Check for mentions of Michael Jackson
  if (mj.some((mj) => message.content.toLowerCase().includes(mj))) {
    message.react("🕺");
    await message.channel.send({
      content: `now thats a cool artist ${member.displayName}`,
    });
  }
  // Handle greetings
  if (
    greeting.some(
      (greet) =>
        message.content.toLowerCase().startsWith(greet) &&
        message.content.toLowerCase().endsWith("gilbert")
    )
  ) {
    await message.channel.send({
      content: `${randomGreet} ${member.displayName} that's meee! How can I help you today?`,
      components: [row],
      ephemeral: false,
    });
  }
  // Handle "thanks" messages
  if (
    thanks.some(
      (thank) =>
        message.content.toLowerCase().includes(thank) &&
        message.content.toLowerCase().endsWith("gilbert")
    )
  ) {
    await message.channel.send({
      content: `${randomDenada} 😉 Thank you ${member.displayName} For thanking me 😎`,
    });
  }
  //brain rot detection
  if (brainRot.some((rot) => message.content.toLowerCase().includes(rot))) {
    message.react("😑");
    message.reply(
      `yo yo not cool ${member.displayName} try to mellow it down on the brain rot man`
    );
  }

  if (message.content.toLowerCase().includes(lol)) {
    message.reply("lol");
    message.react(randomEmoji);
  }

  // Handle "sad" messages
  if (message.content.toLowerCase().includes("sad")) {
    await message.channel.send({
      content: "Oh no I hope no one is sad 😞",
    });
  }
  // Handle "sorry" messages
  if (
    message.content.toLowerCase().includes("sorry") &&
    message.content.toLowerCase().endsWith("gilbert")
  ) {
    await message.channel.send({
      content: "It's ok humans make mistakes, but Gilbert doesn't 😐",
    });
  }
  //checks if a message contains the key word "fortnite"
  if (message.content.toLowerCase().includes("fortnite")) {
    message.reply("💩");
    await message.channel.send({
      content: "that game is mid",
    });
  }
});
// interactions down here so commands buttons etc
client.on("interactionCreate", async (interaction) => {
  // Ensure the interaction is a button press
  if (interaction.customId === "AboutGilbert") {
    await interaction.reply({
      content:
        "My name is Gilbert! My favorite food is a classic burrito I love Video Games and I'm a super cool Discord bot created by a very swag dude named Rango(aka Double). I was created on 3/18/2025 around 3:30pm. Pretty cool, right? 😎",
      ephemeral: true, // visible to everyone, set to true for user-only visibility
    });
  }

  if (interaction.customId === "AnythingNew") {
    await interaction.reply({
      content:
        "my memory has been increased by a HUGE AMOUNT (may not be permenant jsut test phase) but still cool right rango has now done two generations of training me so my personality is a little more well me lol try asking me something make sure the sentence starts with my name! Rango has alot of plans to add more wacky interactions!",
      ephemeral: true,
    });
  }

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: "try saying hi to me", type: "LISTENING" }],
    });
    registerCommands();
    scheduleDailyMessage();
    scheduleBumpReminder();
  });
});
