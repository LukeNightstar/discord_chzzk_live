import {ChatInputApplicationCommandData, Client, CommandInteraction, Interaction} from "discord.js";

export type SlashCommand = ChatInputApplicationCommandData & {
    execute: (client: Client, interaction: CommandInteraction) => void;
}

export type InteractionSlashCommand = ChatInputApplicationCommandData & {
    execute: (client: Client, interaction: Interaction) => void;
}