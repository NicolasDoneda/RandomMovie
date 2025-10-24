const { SlashCommandBuilder } = require('discord.js');
const { saveFilmes } = require('../utils/movieManager.cjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpa todos os filmes da lista 🍿'),

  async execute(interaction) {
    saveFilmes([]); // Limpa todos os filmes
    return interaction.reply({
      content: '🗑️ Lista de filmes limpa com sucesso!',
      ephemeral: false,
    });
  },
};
