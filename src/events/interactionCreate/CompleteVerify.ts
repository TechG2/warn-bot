import { ButtonInteraction } from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import { verify } from "../../config/config.json";

export default class CompleteVerify extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: ButtonInteraction): Promise<Promise<void>> {
    if (!interaction.isButton() || !interaction.customId) return;

    if (interaction.customId === "completeVerify") {
      const member = await interaction
        .guild!.members.fetch(interaction.user.id)
        .catch(() => {});
      if (!member) {
        await interaction.editReply({ content: "C'è stato un errore." });
        return;
      }
      await interaction.deferUpdate();

      await member.roles
        .add([verify.linkedRole, verify.verifiedRole])
        .catch(() => {});
      await interaction.channel!.delete();
    }
  }
}
