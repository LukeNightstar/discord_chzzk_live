import {CommandInteraction, Interaction} from "discord.js";
import {LiveNotificationAdd} from "./liveNotificationAdd";

interface ChzzkLiveCommandProps {
    commandInteraction: CommandInteraction;
    interaction: Interaction;
    chzzkLiveCommand: string;
    chzzkId: string
    notifyChannel: string;
    customMessage: string | null;
}

export async function ChzzkLiveCommand({
                                           commandInteraction,
                                           interaction,
                                           chzzkLiveCommand,
                                           chzzkId,
                                           notifyChannel,
                                           customMessage
                                       }: ChzzkLiveCommandProps) {
    switch (chzzkLiveCommand) {
        case '추가':
            try {
                await LiveNotificationAdd({
                    commandInteraction,
                    chzzkId,
                    notifyChannel,
                    customMessage
                });
            } catch (e) {
                await commandInteraction.followUp({
                    content: '알림 추가에 문제가 발생했습니다. 잠시 기다려주세요. 문제가 지속된다면 관리자에게 문의하세요.', ephemeral: true,
                });
                console.error((`Chzzk Live Notification Add Error : ${__filename}`), e);
            }
            break;

        case '제거':
            try {
                if (!chzzkId || !notifyChannel) {
                    await commandInteraction.followUp({
                        content: '입력된 값에 문제가 있습니다. 잠시 후 다시 시도해보세요.', ephemeral: true,
                    });
                    return;
                }
            } catch (e) {
                await commandInteraction.followUp({
                    content: '알림 제거에 문제가 발생했습니다. 잠시 기다려주세요. 문제가 지속된다면 관리자에게 문의하세요.', ephemeral: true,
                });
                console.error((`Chzzk Live Notification Del Error : ${__filename}`), e);
            }
            break;

        case '목록':
            try {

            } catch (e) {
                await commandInteraction.followUp({
                    content: '목록 불러오기에 문제가 발생했습니다. 잠시 기다려주세요. 문제가 지속된다면 관리자에게 문의하세요.', ephemeral: true,
                });
                console.error((`Chzzk Live Notification List Error : ${__filename}`), e);
            }
            break;
    }
}