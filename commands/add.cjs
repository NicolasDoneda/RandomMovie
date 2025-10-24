const { SlashCommandBuilder } = require('discord.js');
const { addFilme } = require('../utils/movieManager.cjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adiciona um filme à lista semanal 🍿')
    .addStringOption(opt =>
      opt.setName('nome')
         .setDescription('Nome do filme')
         .setRequired(true)
    ),

  async execute(interaction) {
    const nomeFilme = interaction.options.getString('nome');
    const usuario = interaction.user.username;

    const added = addFilme(nomeFilme, usuario);

    if (!added) {
      return interaction.reply({
        content: `Esse filme já foi adicionado, parceiro!`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Filme **${nomeFilme}** adicionado à fila por **${usuario}**`,
      ephemeral: false,
    });
  },
};
