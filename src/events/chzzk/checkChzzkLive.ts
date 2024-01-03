import {Client, EmbedBuilder, TextChannel} from "discord.js";
import {ChzzkClient} from "chzzk";
import ChzzkLiveModel from "../../model/chzzk/chzzkLiveModel";

interface CheckChzzkLiveProps {
    client: Client
    chzzkClient: ChzzkClient;
}

export async function CheckChzzkLive({
                                         client,
                                         chzzkClient
                                     }: CheckChzzkLiveProps) {
    try {
        const notificationConfigs = await ChzzkLiveModel.find();
        for (const notificationConfig of notificationConfigs) {
            const chzzkId = notificationConfig.chzzkId;
            const lastOpenDate = notificationConfig.openDate;
            const liveDetail = await chzzkClient.live.detail(chzzkId);

            // check time
            notificationConfig.lastChecked = new Date();

            if (liveDetail) {
                if (
                    lastOpenDate === null ||
                    (new Date(liveDetail.openDate) > new Date(lastOpenDate))
                ) {
                    const targetGuild =
                        client.guilds.cache.get(notificationConfig.guildId) ||
                        (await client.guilds.fetch(notificationConfig.guildId));
                    if (!targetGuild) {
                        await ChzzkLiveModel.findOneAndDelete({_id: notificationConfig._id});
                        continue;
                    }

                    const targetChannel =
                        targetGuild.channels.cache.get(notificationConfig.channelId) as TextChannel
                        || (await targetGuild.channels.fetch(notificationConfig.channelId) as TextChannel);
                    if (!targetChannel) {
                        await ChzzkLiveModel.findOneAndDelete({_id: notificationConfig._id});
                        continue;
                    }

                    notificationConfig.openDate = new Date(liveDetail.openDate + 'Z');
                    if (notificationConfig.liveId !== liveDetail.liveId) {
                        notificationConfig.liveId = liveDetail.liveId;
                    }

                    const streamLiveStatus = liveDetail.status;

                    if (streamLiveStatus === 'OPEN') {
                        const channelName = liveDetail.channel.channelName;
                        const channelLink = `https://chzzk.naver.com/${chzzkId}`
                        const channelIconUrl = liveDetail.channel.channelImageUrl!;

                        const previewData = liveDetail.liveImageUrl.replace('_{type}', '_1080');

                        const streamTitle = liveDetail.liveTitle
                        const streamLink = `https://chzzk.naver.com/live/${chzzkId}`
                        const streamCategory = liveDetail.liveCategoryValue

                        notificationConfig
                            .save()
                            .then(async () => {
                                const ChzzkLiveCard = new EmbedBuilder()
                                    .setColor('#00FFA3')
                                    .setTitle(streamTitle)
                                    .setURL(streamLink)
                                    .setDescription(`${channelName}님이 치지직 방송을 시작했습니다!`)
                                    .setAuthor({
                                        name: channelName,
                                        url: channelLink,
                                        iconURL: channelIconUrl,
                                    })
                                    .setImage(previewData)
                                    .setFooter({text: 'Chzzk Live BETA with 새참이'})
                                    .setTimestamp();

                                if (streamCategory) {
                                    ChzzkLiveCard.addFields([{name: '카테고리', value: `${streamCategory}`, inline: true}]);
                                }

                                if (notificationConfig.message !== null) {
                                    await targetChannel.send({
                                        content: `${notificationConfig.message}`,
                                        embeds: [ChzzkLiveCard],
                                        allowedMentions: {
                                            parse: ["everyone"]
                                        }
                                    });
                                } else {
                                    await targetChannel.send({
                                        embeds: [ChzzkLiveCard],
                                    });
                                }
                            })
                            .catch((e) => null);
                    }
                }
            }
        }
    } catch (e) {
        console.error(`Chzzk Live Data Fetch Error : ${__filename}\n`, e)
    }
}