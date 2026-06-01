const { Client, GatewayIntentBits } = require("discord.js");
const Groq = require("groq-sdk");

// 😂 MEMES
const memesImg = [
  "https://i.imgflip.com/1bij.jpg",
  "https://i.imgflip.com/30b1gx.jpg",
  "https://i.imgflip.com/26am.jpg",
  "https://i.imgflip.com/1ur9b0.jpg",
  "https://i.imgflip.com/2kbn1e.jpg",
  "https://i.imgflip.com/1g8my4.jpg",
  "https://i.imgflip.com/1otk96.jpg",
  "https://i.imgflip.com/3si4.jpg",
  "https://i.imgflip.com/1h7in3.jpg",
  "https://i.imgflip.com/1ihzfe.jpg",
  "https://i.imgflip.com/2gnnjh.jpg",
  "https://i.imgflip.com/4t0m5.jpg",
  "https://i.imgflip.com/1yxkcp.jpg",
  "https://i.imgflip.com/1wz1x.jpg",
  "https://i.imgflip.com/39t1o.jpg",
  "https://i.imgflip.com/4acd7j.jpg",
  "https://i.imgflip.com/2fm6x.jpg",
  "https://i.imgflip.com/3vzej.jpg"
];

// 🤖 CLIENTE DISCORD
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🤖 GROQ IA
const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
});

// 💬 MENSAJES
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // 😂 COMANDO MEME
  if (message.content.toLowerCase() === "!meme") {
    const meme = memesImg[Math.floor(Math.random() * memesImg.length)];

    return message.reply({
      files: [meme]
    });
  }

  // 🤖 IA SOLO SI LO MENCIONAN
  if (!message.mentions.has(client.user)) return;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres Satoru Gojo. Hablas en español. Respondes MUY corto (1-2 frases máximo). Eres confiado, relajado y bromista."
        },
        {
          role: "user",
          content: message.content.replace(/<@!?\\d+>/g, "").trim()
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const respuesta = chatCompletion.choices[0].message.content;

    message.reply(respuesta);

  } catch (error) {
    console.log(error);
    message.reply("❌ Error con la IA.");
  }
});

// 🔑 LOGIN
client.login(process.env.DISCORD_TOKEN);