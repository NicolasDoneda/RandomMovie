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

    await interaction.deferReply();

    try {
      const filme = await gerarInfoFilme(nome);

      const camposVazios = [
        filme.titulo,
        filme.ano,
        filme.diretor,
        filme.genero,
        filme.atores,
        filme.sinopse,
        filme.nota,
        filme.onde_assistir
      ].every(campo => !campo || campo.trim() === "");

      if (camposVazios) {
        return interaction.editReply({
          content: `❌ Filme "${nome}" não encontrado ou não possui informações disponíveis.`,
        });
      }

      // Checa se já foi adicionado
      const added = addFilme(filme.titulo, usuario);
      if (!added) {
        return interaction.editReply({
          content: `O filme **${filme.titulo}** já está na lista.`,
        });
      }

      // Cria embed
      const embed = new EmbedBuilder()
        .setTitle(`${filme.titulo} (${filme.ano})`)
        .setDescription(filme.sinopse)
        .setColor(0x00ffff)
        .addFields(
          { name: '🎥 Diretor', value: filme.diretor || '—', inline: true },
          { name: '🎭 Gênero', value: filme.genero || '—', inline: true },
          { name: '⭐ Nota', value: filme.nota || '—', inline: true },
          { name: '🎬 Atores', value: filme.atores || '—', inline: false },
          { name: '📺 Onde assistir', value: filme.onde_assistir || '—', inline: false },
          { name: '👤 Adicionado por', value: usuario, inline: false }
        );

      // Adiciona poster como thumbnail
      if (filme.poster_url && filme.poster_url.startsWith('http')) {
        embed.setThumbnail(filme.poster_url);
      }

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: 'Erro ao gerar informações do filme 😕',
      });
    }
  },
};