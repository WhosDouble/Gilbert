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
const countFilePath = path.join(__dirname, "choclateCount.json");

let choclateCount = 0;

if (fs.existsSync(countFilePath)) {
  const data = fs.readFileSync(countFilePath, "utf8");
  const parsedData = JSON.parse(data);
  chocolateCount = parsedData.count || 0;
}

const emojis = ["😈", "😎", "😐", "😑", "😡", "😕", "😀", "😤", "🤩", "😛"];

const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

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
//channels to send messages to / get permissions from
const channels = [
  {
    name: "welcome",
    id: "98823723625922321",
    guildId: "1227288120584704121",
    nsfw: false,
    topic: "Welcome to the server!",
    position: 0,
    parrentID: "",
    lastMessageId: "",
  },
];

client.on("guildMemberAdd", async (member) => {
  try {
    const welcomeChannel = await client.channels.fetch(channels[0].id);
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

const bumpChannelId = "1228039676279918713"; // Replace with your actual channel ID
const bumpId = "1351749413122474015"; // Replace with your actual role ID

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
      `⏰ <@&${bumpId}> ⏰ yo yo yo 🗣 it's been two hours bros, time to get bumpin 🤜`
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
  const next9AM = new Date();

  next9AM.setHours(9, 0, 0, 0); // Set time to 9:00:00 AM

  // If it's already past 9 AM today, schedule for tomorrow
  if (now >= next9AM) {
    next9AM.setDate(next9AM.getDate() + 1);
  }

  const timeUntilNext9AM = next9AM - now;
  console.log(`Next message scheduled for: ${next9AM}`);

  setTimeout(() => {
    sendVotd();
    setInterval(sendVotd, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, timeUntilNext9AM);
}

function sendVotd() {
  const channel = client.channels.cache.get(dailyVerseChannelId);
  const randomVerse = verses[Math.floor(Math.random() * verses.length)]; // Pick a random verse

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
  console.log(
    "Current number of messageCreate listeners:",
    client.listeners("messageCreate").length
  );
  console.log(message.content);
  console.log("message recived");

  // Ignore messages from bots
  if (message.author.bot) return;

  if (
    greeting.some(
      (greet) =>
        message.content.toLowerCase().startsWith(greet) &&
        message.content.toLowerCase().endsWith("gilbert")
    )
  ) {
    // Respond only once for greetings
    await message.channel.send({
      content: `${randomGreet} ${member.displayName} that's meee! How can I help you today?`,
      components: [row], // Multiple Buttons need to be wrapped inside an action row
      ephemeral: false,
    }); // Ensure no further checks are done for this message
  }
  if (message.content.toLowerCase().includes("chocolate")) {
    // Increment the chocolate count
    chocolateCount++;

    // Save the updated count to the file
    const updatedData = { count: chocolateCount };
    fs.writeFileSync(
      countFilePath,
      JSON.stringify(updatedData, null, 2),
      "utf8"
    );

    // React to the message with a chocolate emoji
    message.react("🍫");

    // Reply to the message with the updated count
    message.reply(
      `wow chocolate has been said ${chocolateCount} times. Way to go Luca ${randomEmoji}`
    );
  }
});

// Check if the message contains the word "chocolate" (case-insensitive)
if (message.content.toLowerCase().includes(mj)) {
  // React to the message with a chocolate emoji
  message.reply("yes yes luca weve heard it a 1000 times");
}

if (
  thanks.some(
    (thank) =>
      message.content.toLowerCase().includes(thank) &&
      message.content.toLowerCase().endsWith("gilbert")
  )
) {
  // Respond only once for thanks
  await message.channel.send({
    content: `No problema😉 Thank you ${member.displayName} For thanking me 😎`,
    ephemeral: false,
  }); // Ensure no further checks are done for this message
}

if (message.content.toLowerCase().includes("sad")) {
  // Respond only once for sad messages
  await message.channel.send({
    content: "Oh no I hope no one is sad 😞",
  }); // Ensure no further checks are done for this message
}

if (
  message.content.toLowerCase().includes("sorry") &&
  message.content.toLowerCase().endsWith("gilbert")
) {
  // Respond only once for sorry messages
  await message.channel.send({
    content: "It's ok humans make mistakes, but Gilbert doesn't 😐",
  }); // Ensure no further checks are done for this message
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
        "Now i give out 2 hour reminders in the #bump channel and should give out daily versus Rango will soon make it where you can select what type of joke I will tell. Rango has alot of plans to add more wacky interactions! Try `/help` to see what I can do now.",
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
          "Here are the available commands\n- /help: Lists all available commands\n- /random_pickup_line: Sends a random Christian friendly pickup line\n- /random_joke: Sends a random joke\n- /rules: The Flowing Faith rules",
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
        content: "Woah seems like i cant think straight try asking for a joke again or just ask later";
      }
    }
    if (interaction.commandName === "rules") {
      await interaction.reply({
        content: rules,
        ephemeral: true,
      });
    }
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  registerCommands(); // Register commands after bot is ready
});
