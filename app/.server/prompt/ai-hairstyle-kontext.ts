interface CreateAiHairstyleChangerPromptOptions {
  hairstyle: string; // Hairstyle name
  haircolor?: string; // Hair color name
  detail?: string;
}
export const createAiHairstyleChangerPrompt = ({
  hairstyle,
  haircolor,
  detail,
}: CreateAiHairstyleChangerPromptOptions) => {
  const prompt: string[] = [];
  if (haircolor) {
    prompt.push(
      `Change the current hairstyle to a ${hairstyle} with ${haircolor} hair color.`
    );
  } else {
    prompt.push(
      `Change the current hairstyle to a ${hairstyle} and keep the person hair color.`
    );
  }

  prompt.push(
    "Maintain the rest of the image the same, and do not modify the background or the proportions of the character's body."
  );

  //
  if (detail) {
    prompt.push(`Other ideas about how to edit my image: ${detail}`);
  }

  return prompt.join("\n");
};
