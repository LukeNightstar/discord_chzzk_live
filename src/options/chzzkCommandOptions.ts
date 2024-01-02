import {ApplicationCommandOptionData, ApplicationCommandOptionType} from "discord.js";
import * as trace_events from "trace_events";

export const chzzkCommandOptions: ApplicationCommandOptionData[] = [
    {
        name: '생방송알림',
        description: '생방송 알림 관리 명령어',
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
            {
                name: '추가',
                description: '치지직 생방송 알림 추가',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'chzzk_id',
                        description: '치지직 채널 ID를 입력해주세요',
                        required: true,
                        type: ApplicationCommandOptionType.String,
                    },
                    {
                        name: 'notify_channel',
                        description: '알림을 보낼 채널을 선택해주세요',
                        required: true,
                        type: ApplicationCommandOptionType.Channel,
                    },
                    {
                        name: 'custom_message',
                        description: '알림과 함께 보낼 메세지를 작성해보세요. {title} {link}',
                        required: false,
                        type: ApplicationCommandOptionType.String,
                    },
                ]
            },
            {
                name: '제거',
                description: '치지직 알림 제거',
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: '목록',
                description: '알림 목록',
                type: ApplicationCommandOptionType.Subcommand,
            }
        ]
    }
]