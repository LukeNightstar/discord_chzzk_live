import {CommandInteraction, PermissionsBitField} from "discord.js";
import {ChzzkLiveCommand} from "./live/chzzkLiveCommand";
import {InteractionSlashCommand} from "../../type";
import {chzzkCommandOptions} from "../../options/chzzkCommandOptions";

export const ChzzkCommand: InteractionSlashCommand = {
    name: '치지직',
    description: '치지직 명령어',
    dmPermission: false,
    defaultMemberPermissions: PermissionsBitField.Flags.Administrator,
    options: chzzkCommandOptions,
    execute: async (_, interaction) => {
        const commandInteraction = interaction as CommandInteraction
        if (commandInteraction.isChatInputCommand()) {
            try {
                const subCommandGroup = commandInteraction.options.getSubcommandGroup();

                switch (subCommandGroup) {
                    case '생방송알림':
                        try {
                            const chzzkLiveCommand = commandInteraction.options.getSubcommand();
                            const chzzkId = commandInteraction.options.get('chzzk_id')?.value?.toString()!;
                            const notifyChannel = commandInteraction.options.get('notify_channel')?.value?.toString()!;
                            const customMessage = commandInteraction.options.get('custom_message')?.value?.toString() || null;

                            await ChzzkLiveCommand({
                                commandInteraction,
                                interaction,
                                chzzkLiveCommand,
                                chzzkId,
                                notifyChannel,
                                customMessage,
                            })
                        } catch (e) {
                            await commandInteraction.followUp({
                                content: '치지직 Live 명령어에 문제가 발생했습니다. 잠시 기다려주세요. 문제가 지속된다면 관리자에게 문의하세요.', ephemeral: true,
                            });
                            console.error(`Chzzk Live Command Error : ${__filename}\n`, e);
                        }
                        break;
                }
            } catch (e) {
                await commandInteraction.followUp({
                    content: '명령어 호출에 문제가 발생했습니다. \n잠시 뒤에 다시 시도해주세요. \n문제가 지속된다면 관리자에게 문의하세요.', ephemeral: true,
                })
                console.error(`Chzzk Command Error : ${__filename}\n`, e);
            }
        }
    }
}