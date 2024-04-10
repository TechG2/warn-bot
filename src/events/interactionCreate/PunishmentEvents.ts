import { ModalSubmitInteraction } from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";

export default class MenuWarn extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: ModalSubmitInteraction): Promise<void> {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.startsWith("ban-"))
      await interaction.reply({
        ephemeral: true,
        content: "Funzione che banna l'utente",
      });
    else if (interaction.customId.startsWith("mute-"))
      await interaction.reply({
        ephemeral: true,
        content: "Funzione che muta l'utente",
      });
    else if (interaction.customId.startsWith("warn-"))
      await interaction.reply({
        ephemeral: true,
        content: "Funzione che warna l'utente",
      });
  }
}
