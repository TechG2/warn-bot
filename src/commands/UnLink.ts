import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import VerifyModel from "../Schemas/VerifyModel";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";
import { verify } from "../config/config.json";

export default class UnLink extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("un-link")
        .setDescription("Serve a scollegare il tuo account Fandom."),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // Check if linked
    const isVerified = await VerifyModel.findOne({
      userId: interaction.user.id,
      "fandomInfo.fandomLinked": true,
    });
    if (!isVerified) {
      await interaction.reply({
        ephemeral: true,
        content:
          "Il tuo account non è ancora stato linkato, verificati per farlo.",
      });
      return;
    }

    // Remove role
    const member = await interaction.guild!.members.fetch(interaction.user.id);
    await member.roles.remove([verify.linkedRole, verify.verifiedRole]);

    // Update db
    await VerifyModel.updateOne(
      { _id: isVerified._id },
      {
        "fandomInfo.fandomLinked": false,
        "fandomInfo.info": {},
        finished: false,
      }
    );

    // out
    await interaction.reply({
      ephemeral: true,
      content:
        "Account scollegato, per riconnetterlo vai nel canale di verifica.",
    });
  }
}
