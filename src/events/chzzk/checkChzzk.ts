import {Client} from "discord.js";
import {CheckChzzkLive} from "./checkChzzkLive";
import {ChzzkClient} from "chzzk";

interface CheckChzzkProps {
    client: Client;
}

export async function CheckChzzk({client}: CheckChzzkProps) {
    try {
        const chzzkClient = new ChzzkClient();
        await CheckChzzkLive({client, chzzkClient});
        setInterval(() => {
            try {
                CheckChzzkLive({client, chzzkClient});
            } catch (e) {
                console.error(`Error in setInterval of CheckChzzkLive: ${__filename}\n`, e);
            }
        }, 60_000);
        console.log("CheckChzzkLive function called and scheduled successfully.");
    } catch (e) {
        console.error(`Error in CheckChzzk: ${__filename}\n`, e);
    }
}