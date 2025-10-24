const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { sortearFilme } = require('../utils/movieManager.cjs');

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sortear')
    .setDescription('Sorteia um filme manualmente 🎥'),

  async execute(interaction) {
    const filme = sortearFilme();

    if (!filme) {
      return interaction.reply({
        content: 'A lista está vazia! Use /add',
        ephemeral: false,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🍿 Filme da semana')
      .setDescription(`🎬 O filme sorteado é: **${filme}**`)
      .setColor(`#${randomColor()}`)
      .setFooter({ text: `${fraseAleatoria()} | Pega a pipoca e senta 🍿` });

    return interaction.reply({ embeds: [embed] });
  },
};
