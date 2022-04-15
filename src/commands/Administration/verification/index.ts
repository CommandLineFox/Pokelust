import Command from "../../../command/Command";
import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../BotClient";

export default class Autiomation extends Command {
    public constructor() {
        super("verification", "Configuring verification related options", [], ["ADMINISTRATOR"]);
    }

    async execute(interaction: CommandInteraction, client: BotClient): Promise<void> {
        const subcommand = this.subcommands.get(interaction.options.getSubcommand());
        if (!subcommand) {
            interaction.reply({ content: "I was unable to find the command.", ephemeral: true });
            return;
        }

        subcommand.execute(interaction, client);
    }
}