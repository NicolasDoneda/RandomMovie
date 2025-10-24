const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra o ping do bot 🏓'),

  async execute(interaction) {
    const ping = interaction.client.ws.ping;
    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor(0x00ff00)
      .setDescription(`Ping atual do bot: **${ping}ms**`)
      .setFooter({ text: 'Ping rápido como um relâmpago ⚡' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};