const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mostra a lista de comandos disponíveis 🎬'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📜 Comandos do Bot de Filmes')
      .setColor(0x00ffff)
      .setDescription(`
/add [nome] - Adiciona um filme à lista
/remove [nome] - Remove um filme da lista
/list - Mostra a lista de filmes
/sortear - Sorteia um filme manualmente
/clear - Limpa todos os filmes da lista
/help - Mostra esta mensagem
/ping - Pong! Retorna meu ping atual
      `)
      .setFooter({ text: 'Pega a pipoca e aproveita 🎥' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
