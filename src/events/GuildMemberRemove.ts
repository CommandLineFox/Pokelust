import Event from "@event/Event";
import { GuildMember, TextChannel } from "discord.js";
import MyntClient from "~/BotClient";

export default class GuildMemberRemove extends Event {
    public constructor() {
        super({ name: "guildMemberRemove" });
    }

    public async callback(client: MyntClient, member: GuildMember): Promise<void> {
        try {
            const guild = member.guild;
            const database = client.database;
            const guildDb = await database.getGuild(guild.id);
            if (!guildDb?.config.leaveLog?.channel || !guildDb.config.leaveLog.notification || !guildDb.config.leaveLog.message) {
                return;
            }

            if (!guildDb.config.roles?.member) {
                return;
            }

            const role = guild.roles.cache.get(guildDb.config.roles.member);
            if (!role) {
                return;
            }

            if (!member.roles.cache.has(role.id)) {
                return;
            }

            const channel = guild.channels.cache.get(guildDb.config.leaveLog?.channel) as TextChannel;
            if (!channel) {
                await database.guilds.updateOne({ id: guild.id }, { "$unset": { "config.channels.leaveChannel": "" } });
                return;
            }

            const line = guildDb.config.leaveLog?.message.replace("{member}", member.user.tag).replace("{server}", member.guild.name);
            const message = await channel.send(line);
            if (guildDb.config.leaveLog.emote) {
                message.react(guildDb.config.leaveLog.emote);
            }
        } catch (error) {
            client.emit("error", (error as Error));
        }
    }
}
