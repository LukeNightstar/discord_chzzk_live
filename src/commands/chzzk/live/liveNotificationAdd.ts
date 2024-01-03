import {CommandInteraction, EmbedBuilder} from "discord.js";
import {ChzzkClient} from "chzzk";
import ChzzkLiveModel from "../../../model/chzzk/chzzkLiveModel";


interface LiveNotificationAddProps {
    commandInteraction: CommandInteraction;
    chzzkId: string;
    notifyChannel: string;
    customMessage: string | null;
}

export async function LiveNotificationAdd({
                                              commandInteraction,
                                              chzzkId,
                                              notifyChannel,
                                              customMessage
                                          }: LiveNotificationAddProps) {
    try {
        const duplicateExists = await ChzzkLiveModel.exists({
            channelId: notifyChannel,
            chzzkId: chzzkId,
        });
        if (duplicateExists) {
            await commandInteraction.followUp({
                content: '해당 치지직 채널은 이미 디스코드 알림 채널에 등록되었습니다.', ephemeral: true,
            });
            return;
        }

        const chzzkClient = new ChzzkClient();
        const channelDetail = await chzzkClient.channel(chzzkId);

        if (!channelDetail) {
            await commandInteraction.followUp({
                content: '채널 정보를 읽어오는데 오류가 발생했습니다. Chzzk ID를 확인해주세요.',
                ephemeral: true
            });
            return;
        }

        const channelName = channelDetail.channelName;

        const chzzkNotificationConfig = new ChzzkLiveModel({
            guildId: commandInteraction.guildId,
            channelId: notifyChannel,
            chzzkId: chzzkId,
            channelName: channelName,
            message: customMessage,
            lastChecked: new Date(),
        });

        const chzzkUrl = `https://chzzk.naver.com/${chzzkId}`;
        const profileImage = channelDetail.channelImageUrl;

        chzzkNotificationConfig
            .save()
            .then(async () => {
                const LiveAddCard = new EmbedBuilder()
                    .setTitle('**Chzzk 생방송 알림 추가 완료**')
                    .setDescription('Chzzk 생방송 알림이 추가되었습니다!')
                    .setColor('#00FFA3')
                    .addFields([
                        {name: '채널명', value: `[${channelName}](${chzzkUrl})`},
                        {name: '알림 설정 채널', value: `<#${notifyChannel}>`}
                    ])
                    .setFooter({
                        text: 'CHZZK BETA'
                    })
                    .setTimestamp();

                if (profileImage) {
                    LiveAddCard.setThumbnail(profileImage);
                }

                if (customMessage === null) {
                    LiveAddCard.addFields({name: '메세지', value: `지정된 메세지 없음`});
                    await commandInteraction.followUp({embeds: [LiveAddCard]});
                } else {
                    LiveAddCard.addFields({name: '메세지', value: `${customMessage}`});
                    await commandInteraction.followUp({embeds: [LiveAddCard]});
                }
            })
            .catch((e) => {
                commandInteraction.followUp({
                    content: 'DB에 문제가 발생했습니다. \n잠시 기다려주세요. \n문제가 지속된다면 관리자에게 문의하세요.', ephemeral: true,
                });
                console.error(e);
            });

    } catch (e) {
        console.error(`Error on ${__filename}\n`, e);
    }
}


