const { SlashCommandBuilder } = require('discord.js');
const { getFilmes, removeFilme } = require('../utils/movieManager.cjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove um filme da lista')
    .addStringOption(opt =>
      opt.setName('nome')
        .setDescription('Escolha o filme para remover')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    const nomeFilme = interaction.options.getString('nome');
    const removed = removeFilme(nomeFilme);

    if (!removed) {
      return interaction.reply({
        content: `Filme não encontrado: **${nomeFilme}**`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Filme **${nomeFilme}** removido da lista`,
      ephemeral: false,
    });
  },

  async autocomplete(interaction) {
    const filmes = getFilmes();
    const focused = interaction.options.getFocused().toLowerCase();

    const filtered = filmes.filter(f =>
      f.toLowerCase().includes(focused)
    ).slice(0, 25);

    await interaction.respond(
      filtered.map(f => ({ name: f, value: f }))
    );
  },
};
