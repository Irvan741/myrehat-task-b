import { generateText } from "ai";
import { createOpenCodeSDK } from "ai-sdk-provider-opencode-sdk";

export async function polishDescription(description: string): Promise<string> {
  if (!description || description.trim() === "") {
    return description;
  }

  const provider = createOpenCodeSDK({});
  const { text } = await generateText({
    model: provider("opencode/big-pickle"),
    prompt: `Polish this homestay listing description to be more appealing and professional:\n\n${description}`,
  });

  return text || description;
}

export default polishDescription;
