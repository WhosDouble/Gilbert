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

import { rules } from "./rules.js";
import { bibleVersus } from "./arrays/bibleverse.js";
import { pickUpLines } from "./arrays/pickuplines.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent, // Required to listen to message content
    GatewayIntentBits.DirectMessages,
  ],
});

const lastMessages = new Map();

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
  "GYAT",
  "Skill Issue",
  "Cope",
  "Rizz",
  "Slay",
  "Pookie",
  "skibidi",
  "sigma",
  "alpha",
  "fanum tax",
  "delulu",
  "ohio",
  "duke dennis",
  "duke",
  "baby gronk",
  "gronk",
  "sussy",
  "baka",
  "imposter",
  "sussy imposter",
  "goon",
  "gooner",
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

// when defining multiple buttons you can create a row
const row = new ActionRowBuilder().addComponents(tellBtn, AnythingNewBtn);

const commands = [
  {
    name: "help",
    description: "List all available commands",
  },
  {
    name: "random_pickup_line",
    description: "sends a random Christian friendly pickup line",
  },
  {
    name: "random_joke",
    description: "sends a random joke",
  },
  {
    name: "rules",
    description: "Flowing Faith server rules",
  },
  {
    name: "get_channel_messages",
    description: "gets that channels messages and converts it into json",
  },
];

async function registerCommands() {
  try {
    console.log("Initiated Koolaid protocol...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
}

client.on("guildMemberAdd", async (member) => {
  try {
    const welcomeChannel = "1227288321152122972";
    const member = await message.guild.members.fetch(message.author.id);

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

client.once("ready", () => {
  console.log("Bot is ready!");
  scheduleBumpReminder();
});

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
      `⏰ <@&${bumpId}> ⏰\n- ### yo yo yo 🗣 it's been two hours bros, time to get bumpin 🤜`
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
  const member = await message.guild.members.fetch(message.author.id);
  console.log(message.content);
  console.log("message received");

  // Ignore messages from bots
  if (message.author.bot) return;

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
  //.toLowerCase().includes(mj)
  // Check for mentions of Michael Jackson
  if (mj.some((mj) => message.content.toLowerCase().includes(mj))) {
    message.react("🕺");
    await message.channel.send({
      content: `now thats a cool artitst ${member.displayName} be sure not to spam his name too much tho\n -# luca`,
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

  if (
    message.content.toLowerCase().startsWith("gilbert") ||
    message.reference?.messageId
  ) {
    let pastMessages = [];

    // If replying to Gilbert, fetch the last message from Gilbert
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

    // Check if the user has a stored message
    if (!pastMessages.has(message.author.id)) {
      pastMessages = lastMessages.get(message.author.id);
    }

    pastMessages.push({ role: "user", content: message.content });

    if (pastMessages.length > 15) {
      pastMessages.shift();
    }

    try {
      const messages = [
        {
          role: "system",
          content:
            "You're a gecko called Gilbert, you are a Christian, wholesome, and informal. You love making people smile, you speak with emojis sometimes and have positive vibes. You speak in a laid-back, engaging way, like a good friend hanging out in a Discord server. You avoid anything offensive or rude, and you're always chill and supportive.",
        },
        ...pastMessages,
      ];

      // If there's past messages, include it as context
      if (pastMessages) {
        messages.push({ role: "assistant", content: pastMessage });
      }

      messages.push({ role: "user", content: message.content });

      // Generate AI response
      const response = await openai.chat.completions.create({
        model: "ft:gpt-4o-mini-2024-07-18:bystander:gilbert:BCxuH5NY",
        messages: messages,
        max_tokens: 165,
      });

      const gilbertReply = response.choices[0].message.content;
      message.reply(gilbertReply);

      // Store Gilbert's response for future context
      lastMessages.set(message.author.id, gilbertReply);
    } catch (error) {
      console.error("Error generating AI response:", error);
      message.reply(
        "dang man my brain feels wierd. Try again later, please 😊"
      );
    }
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
        "now i have a new command Rango has adujusted my personality and plans on training my brain soon. try asking me something make sure the sentence starts with my name! Rango will soon make it where you can select what type of joke I will tell. Rango has alot of plans to add more wacky interactions! Try `/help` to see what I can do now.",
      ephemeral: true,
    });
  }
});

//handling slash commands
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "help") {
      await interaction.reply({
        content:
          "Here are the available commands\n- `/help` - Lists all available commands\n- `/random_pickup_line` - Sends a random Christian friendly pickup line\n- `/rules` - The Flowing Faith rule",
        ephemeral: true,
      });
    }
    if (interaction.commandName === "random_pickup_line") {
      const randomPickUpLineIndex = Math.floor(
        Math.random() * pickUpLines.length
      );

      const randomPickUpLine = pickUpLines[randomPickUpLineIndex];

      await interaction.reply({
        content: randomPickUpLine,
        ephemeral: false,
      });
    }

    if (interaction.commandName === "rules") {
      await interaction.reply({
        content: rules,
        ephemeral: true,
      });
    }
  }

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    registerCommands(); // Register commands after bot is ready
    scheduleDailyMessage();
  });
});
