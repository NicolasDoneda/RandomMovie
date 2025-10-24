const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { sortearFilme } = require('./utils/movieManager.cjs');

const frases = [
  "Firmeza? Agora bora assistir essa obra-prima!",
  "Se for ruim, a culpa é de quem adicionou 🤡",
  "Prepare a pipoca e a decepção 🍿😭",
  "Pegue seu cobertor e sua falta de expectativa 😎",
  "Se der sono, finge que tá curtindo 😏",
];

function randomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function fraseAleatoria() {
  return frases[Math.floor(Math.random() * frases.length)];
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Carrega todos os comandos da pasta "commands"
client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.cjs'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  // Cron job: todo sábado às 18h
  cron.schedule('0 18 * * 6', async () => {
    try {
      const canal = await client.channels.fetch('1431295233878003752');
      const filme = sortearFilme();

      if (!filme) {
        canal.send('Lista vazia! Use /add para adicionar filmes 🍿');
        return;
      }

      canal.send({
        embeds: [{
          title: '🍿 Filme da semana',
          description: `🎬 O filme sorteado é: **${filme}**`,
          color: parseInt(randomColor(), 16),
          footer: { text: `${fraseAleatoria()} | Pega a pipoca e senta 🍿` }
        }]
      });
    } catch (err) {
      console.error('Erro no cron job:', err);
    }
  });
});

// Evento para interações de slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: '❌ Ocorreu um erro ao executar o comando!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
