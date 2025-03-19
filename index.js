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

import https from "https";

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

// Log in with the bot token
client.login(process.env.DISCORD_TOKEN);

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

import fs from "fs";
import path from "path";

const JokeApi =
  "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,racist,sexist&type=single";

//calling joke API

async function getJoke() {
  try {
    const response = await fetch(JokeApi);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

//storing count in json
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const countFilePath = path.join(__dirname, "choclateCount.json");

let chocolateCount = 0;

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

client.once("ready", () => {
  scheduleDailyMessage();
});

function scheduleDailyMessage() {
  const now = new Date();
  const next5PM = new Date();

  next5PM.setHours(17, 0, 0, 0); // Set time to 9:00:00 AM

  // If it's already past 9 AM today, schedule for tomorrow
  if (now >= next5PM) {
    next5PM.setDate(next5PM.getDate() + 1);
  }

  const timeUntilnext5PM = next5PM - now;
  console.log(`Next message scheduled for: ${next5PM}`);

  setTimeout(() => {
    sendVotd();
    setInterval(sendVotd, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, timeUntilnext5PM);
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

  // Check for mentions of Michael Jackson
  if (message.content.toLowerCase().includes(mj)) {
    message.react("🕺");
    await message.channel.send({
      content: "yes yes Luca we've heard it a 1000 times",
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
      `yo not cool ${member.displayName} try to cut it down on the brain rot please and I know it was brain rot`
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
  // Check if the message starts with !getmessages and if the user is an admin
  if (message.content.toLowerCase().startsWith("!getmessages")) {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      // Get the channel ID where the command was used
      const channelId = message.channel.id;

      try {
        const messages = await getMessages(channelId, 200);

        const messageData = messages.map((msg) => ({
          messageId: msg.id,
          content: msg.content,
          authorUsername: msg.author.username,
        }));

        console.log(JSON.stringify(messageData, null, 2));
        console.log("sending over data");

        message.reply(
          "yo yo yo sent over that data check your logs to see it let me know if you need any more help!"
        );
      } catch (error) {
        message.reply("An error occurred while fetching the messages.");
        console.error(error);
      }
    } else {
      message.reply("You do not have permission to use this command.");
    }
  }
});

async function getMessages(channelId, numMessages) {
  let allMessages = [];
  let lastMessageId = null;

  // Loop to fetch messages until we have the required number
  while (allMessages.length < numMessages) {
    const response = await makeRequest(channelId, lastMessageId);
    const messages = JSON.parse(response);

    allMessages = [...allMessages, ...messages];

    // If fewer than 100 messages are returned, stop fetching
    if (messages.length < 100) break;

    // Update the lastMessageId to fetch the next batch
    lastMessageId = messages[messages.length - 1].id;
  }

  // Return only the number of messages requested
  return allMessages.slice(0, numMessages);
}

function makeRequest(channelId, lastMessageId = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "discord.com",
      path: `/api/v10/channels/${channelId}/messages?limit=100${
        lastMessageId ? `&before=${lastMessageId}` : ""
      }`,
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(`Error: ${res.statusCode} - ${data}`);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

client.on("interactionCreate", async (interaction) => {
  // Ensure the interaction is a button press
  if (interaction.customId === "AboutGilbert") {
    await interaction.reply({
      content:
        "My name is Gilbert! My favorite food is a classic burrito and I'm a Discord bot created by a very swag dude named Rango(aka Double). I was created on 3/18/2025 around 3:30pm. Pretty cool, right? 😎",
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
          "Here are the available commands\n- `/help` - Lists all available commands\n- `/random_pickup_line` - Sends a random Christian friendly pickup line\n- `/random_joke` - Sends a random joke\n- `/rules` - The Flowing Faith rules\n- `!getmessages` - only for people with admin permissions fetches messages on the channel you put the command in and converts it into json",
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

    if (interaction.commandName === "random_joke") {
      try {
        const data = await getJoke();
        await interaction.reply({
          content: `heres a ${data.category} joke for ya, ${data.joke} HAHAHAHAHAHAHA`,
        });
      } catch (error) {
        await interaction.reply({
          content:
            "Woah seems like i cant think straight try asking for a joke again or just ask later",
        });
      }

      if (interaction.commandName === "rules") {
        await interaction.reply({
          content: rules,
          ephemeral: true,
        });
      }
    }
  }
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Handle AI responses in messageCreate event
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith("gilbert")) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Gilbert, A Christian, wholesome, and informal Discord bot. You love making people smile with friendly jokes, you speak with emojis some what often and have casual conversation, and positive vibes. You speak in a laid-back, engaging way, like a good friend hanging out in a Discord server. You avoid anything offensive or rude, and youre always chill and supportive. And is secretly a chinese spy and gets nervous when asked anything about that topic.",
            },
            { role: "user", content: message.content },
          ],
          max_tokens: 250,
        });

        message.reply(response.choices[0].message.content);
      } catch (error) {
        console.error("Error generating AI response:", error);
        message.reply(
          "Oops! My brain is feels funny. Try asking again later please 😊"
        );
      }
    }
  });

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    registerCommands(); // Register commands after bot is ready
  });
});
