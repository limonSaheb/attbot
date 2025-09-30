import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export const attendenceView = (customId = "", placeholder = "", moods = []) => {
  const makeSelect = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder);

  moods.map((el) => {
    makeSelect.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(el?.label)
        .setValue(el?.value)
    );
  });

  const attendenceRow = new ActionRowBuilder().addComponents(makeSelect);

  return attendenceRow;
};
