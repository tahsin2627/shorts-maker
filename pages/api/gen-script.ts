import type { NextApiRequest, NextApiResponse } from "next";

const sampleFacts = [
  "Did you know a chicken once lived for 18 months without its head? They called him Miracle Mike.",
  "Napoleon escaped exile and rebuilt his empire in just weeks — and most soldiers joined him willingly.",
  "Vlad the Impaler was so brutal that he inspired the Dracula legend.",
  "Bananas are berries, but strawberries aren’t!",
  "Octopuses have three hearts and blue blood."
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fact = sampleFacts[Math.floor(Math.random() * sampleFacts.length)];
  res.status(200).json({ script: fact });
}
