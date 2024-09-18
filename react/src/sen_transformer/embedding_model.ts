import { pipeline, env } from "@xenova/transformers";

env.localModelPath = './';
// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = false;

let pipe: any = null;

export async function initializePipeline() {
  pipe = await pipeline("feature-extraction", "/models");
  return pipe;
}

export async function embeddingModel(description: string) {
  if (!pipe) {
    pipe = await initializePipeline();
  }
  // Generate the embedding from text
  const output = await pipe(description, {
    pooling: "mean",
    normalize: true,
  });
  // Extract the embedding output
  const embedding = Array.from(output.data);
  return embedding;
}
