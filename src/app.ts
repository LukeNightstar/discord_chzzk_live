import {Client, Events, Interaction} from "discord.js";

import 'dotenv/config'
import mongoose from "mongoose";
import commands from "./commands/commands";
import {CheckChzzk} from "./events/chzzk/checkChzzk";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DB_URL = process.env.DB_URL

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
});

const startBot = async () => {
    await client.login(BOT_TOKEN);

    client.on(Events.ClientReady, async () => {
        if (client.application) {
            try {
                await client.application.commands.set(commands);
                console.log("Info: Command Registered");
            } catch (e) {
                console.error(`Info: Command Register Error : ${__filename}\n`, e);
            }
        }

        await CheckChzzk({client});
    })

    // Handler Logic
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {

        // SlashCommand Handler
        if (interaction.isCommand()) {
            try {

                const slashCommand = commands
                    .find(({name}) => name === interaction.commandName);

                if (slashCommand) {
                    await interaction.deferReply({ephemeral: false});
                    slashCommand.execute(client, interaction);
                    console.log(`info: command ${slashCommand.name} handled correctly`)
                }
            } catch (e) {
                console.error(`Info: SlashCommandHandler Error ${__filename} \n`, e)
            }
        }

    });
};

mongoose.connect(DB_URL)
    .then(() => {
        console.log('DB connected')
        startBot().catch((e) => console.error("Bot Start Error", e));
    })
    .catch((e) => console.log("MongoDB connection error", e));

