const { QueryType, useMasterPlayer, useQueue } = require('discord-player')
const { joinVoiceChannel } = require('@discordjs/voice')
const { Player, usePlayer, createProgressBar } = require('discord-player');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events} = require('discord.js');
const fs = require('node:fs');

module.exports = {
    name : 'play',
    description : 'Play a song of your choice!',
    voiceChannel : true,
    options : [
        {
            name : 'biisi',
            description: 'Mitä soitetaan?',
            type : 3,
            required : true
        }
    ],

    async execute(interaction) {

        try {
            
            //const guildNode = usePlayer(interaction.guild.id);
            const progressBar = public.createProgressBar(); 
            //const progressPercentage = guildNode.getTimestamp();

            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');
            
            const player = useMasterPlayer();
            const queue = useQueue(interaction.guild.id);
            const query = interaction.options.getString('biisi', true);
            console.log(`biisi: **${query}**`)
            const results = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            await interaction.deferReply();
            await interaction.editReply(` Haku tehty.`)


            const success_embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('ehkä toimii')
                .addFields({ name: 'test', value: progressBar})
                //.addFields({ name: 'test', value: progressPercentage})
                .setDescription(`🎶 | Nyt toistaa: **${results.tracks[0]}**  Kappaleen pituus: **${results.tracks[0].duration}**!`)
                .setAuthor({name:'jesse', iconURL:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTUh833evNuxLRQ5Qk-LyuyydfCc1gN4G32Wn63sm1gLTT20iGo'})
                

            //const editEmbed = new EmbedBuilder()

            //const row = new ActionRowBuilder()
 
            if (!queue || !queue.node.isPlaying()) {
                await interaction.editReply({content: `Loading your track`, embeds: [success_embed]});


                const soitin = await player.play(channel, results, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username
                        },
                        bufferingTimeout: 5000,
                        leaveOnEnd: false,
                    }
                })

               
                
                await interaction.editReply({ embeds: [success_embed] });
            } else {
                queue.addTrack(results.playlist ? results.tracks : results.tracks[0])
                await interaction.editReply({content:`Loading your track`, embeds: [success_embed]});
            }

        } catch (error) {
            console.log(error)
        }
    }
}

    