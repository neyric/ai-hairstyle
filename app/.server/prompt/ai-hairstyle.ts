interface CreateAiHairstyleChangerPromptOptions {
  hairstyle: string; // Hairstyle name
  haircolor?: string; // Hair color name
  haircolorHex?: string; // Hair color hex value
  withStyleReference?: boolean; // With hairstyle reference
  withColorReference?: boolean; // With haircolor reference
  detail?: string;
}
export const createAiHairstyleChangerPrompt = ({
  hairstyle,
  haircolor,
  haircolorHex,
  withStyleReference,
  withColorReference,
  detail,
}: CreateAiHairstyleChangerPromptOptions) => {
  const prompt: string[] = [];
  if (haircolor) {
    prompt.push(
      `Change the current hairstyle to a ${hairstyle} with ${haircolor} hair color${
        haircolorHex ? ` (hex: ${haircolorHex}).` : "."
      }`
    );
  } else {
    prompt.push(
      `Change the current hairstyle to a ${hairstyle} and keep the person hair color and skin tone.`
    );
  }

  if (withStyleReference) {
    prompt.push(
      "Use the second image attachment as the hairstyle reference. The first image attachment is the original photo of the user."
    );
  }
  if (withColorReference) {
    if (withStyleReference) {
      prompt.push("Use the third image attachment as a color reference");
    } else {
      prompt.push(
        "Use the second image attachment as a hair color reference. The first image attachment is the original photo of the user."
      );
    }
  }

  prompt.push(
    "Keep the person’s face, facial features, and expression exactly the same.",
    "The new hairstyle should look natural and realistic, blending seamlessly with the original lighting and photo style."
  );

  if (detail) {
    prompt.push("", "Special Requests", detail);
  }

  return prompt.join("\n");
};
