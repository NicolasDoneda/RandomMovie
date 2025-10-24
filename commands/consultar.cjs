const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { gerarInfoFilme } = require('../utils/geminiManager.cjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('consulta')
    .setDescription('Consulta informações de um filme sem adicionar à fila 🔍')
    .addStringOption(opt =>
      opt.setName('nome')
         .setDescription('Nome do filme')
         .setRequired(true)
    ),

  async execute(interaction) {
    const nome = interaction.options.getString('nome');

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

      // Cria embed
      const embed = new EmbedBuilder()
        .setTitle(`${filme.titulo} (${filme.ano})`)
        .setDescription(filme.sinopse)
        .setColor(0xffa500) // cor laranja pra diferenciar do /add
        .addFields(
          { name: '🎥 Diretor', value: filme.diretor || '—', inline: true },
          { name: '🎭 Gênero', value: filme.genero || '—', inline: true },
          { name: '⭐ Nota', value: filme.nota || '—', inline: true },
          { name: '🎬 Atores', value: filme.atores || '—', inline: false },
          { name: '📺 Onde assistir', value: filme.onde_assistir || '—', inline: false }
        );

      // Adiciona poster como thumbnail
      if (filme.poster_url && filme.poster_url.startsWith('http')) {
        embed.setThumbnail(filme.poster_url);
      }

      // Cria o botão "Adicionar à Fila"
      const botao = new ButtonBuilder()
        .setCustomId(`add_movie_${Date.now()}`) // ID único
        .setLabel('Adicionar à Fila')
        .setEmoji('🍿')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(botao);

      // Envia a mensagem com o embed e o botão
      const response = await interaction.editReply({ 
        embeds: [embed], 
        components: [row] 
      });

      // Cria um collector para capturar o clique no botão
      const collector = response.createMessageComponentCollector({ 
        time: 300000 // 5 minutos para clicar
      });

      collector.on('collect', async i => {
        // Verifica se quem clicou foi quem consultou
        if (i.user.id !== interaction.user.id) {
          return i.reply({ 
            content: '❌ Apenas quem consultou pode adicionar o filme!', 
            ephemeral: true 
          });
        }

        // Importa a função addFilme aqui pra evitar circular dependency
        const { addFilme } = require('../utils/movieManager.cjs');
        
        const usuario = i.user.username;
        const added = addFilme(filme.titulo, usuario);

        if (!added) {
          return i.reply({ 
            content: `O filme **${filme.titulo}** já está na lista!`, 
            ephemeral: true 
          });
        }

        // Atualiza o embed para mostrar quem adicionou
        embed.addFields({ name: '👤 Adicionado por', value: usuario, inline: false });
        embed.setColor(0x00ffff); // muda pra cor cyan (mesma do /add)

        // Remove o botão após adicionar
        await i.update({ embeds: [embed], components: [] });
        
        await i.followUp({ 
          content: `✅ **${filme.titulo}** foi adicionado à fila!`, 
          ephemeral: true 
        });
      });

      collector.on('end', collected => {
        // Se ninguém clicou, remove o botão após 5 minutos
        if (collected.size === 0) {
          interaction.editReply({ embeds: [embed], components: [] });
        }
      });

    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: 'Erro ao consultar informações do filme 😕',
      });
    }
  },
};