export function generateUniqueDisplayName(): string {
  const adjectives = ["cloudy", "sunny", "happy", "brave", "calm", "gentle"];
  const nouns = ["sky", "breeze", "mountain", "river", "forest", "meadow"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 90) + 10;
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}
