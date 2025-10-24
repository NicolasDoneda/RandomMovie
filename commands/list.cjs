const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getFilmes } = require('../utils/movieManager.cjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Mostra a lista de filmes acumulados 🎬'),

  async execute(interaction) {
    const filmes = getFilmes();

    if (filmes.length === 0) {
      return interaction.reply({
        content: 'A lista está vazia! Use /add para adicionar filmes 🍿',
        ephemeral: false,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎬 Lista de filmes acumulados')
      .setDescription(
        filmes.map((f, i) => `${i + 1}. ${f.nome} (adicionado por ${f.usuario})`).join('\n')
      )
      .setColor('#FFA500');

    return interaction.reply({ embeds: [embed] });
  },
};
