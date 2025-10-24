const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { gerarInfoFilme } = require('../utils/geminiManager.cjs');
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
    const nome = interaction.options.getString('nome');
    const usuario = interaction.user.username;

    await interaction.deferReply(); // mostra "pensando..."

    try {
      const filme = await gerarInfoFilme(nome);

      const added = addFilme(filme.titulo, usuario);
      if (!added) {
        return interaction.editReply({
          content: `O filme **${filme.titulo}** já está na lista.`,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`${filme.titulo} (${filme.ano})`)
        .setDescription(filme.sinopse)
        .setColor(0x00ffff)
        .addFields(
          { name: '🎥 Diretor', value: filme.diretor || '—', inline: true },
          { name: '🎭 Gênero', value: filme.genero || '—', inline: true },
          { name: '⭐ Nota', value: filme.nota || '—', inline: true },
          { name: '🎬 Atores', value: filme.atores || '—', inline: false },
          { name: '👤 Adicionado por', value: usuario, inline: false }
        );

      if (filme.poster_url) embed.setImage(filme.poster_url);

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: 'Erro ao gerar informações do filme 😕',
      });
    }
  },
};