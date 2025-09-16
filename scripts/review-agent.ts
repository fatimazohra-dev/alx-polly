import fs from "fs";
import OpenAI from "openai";

// 👇 خلي API key ف .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1️⃣ Generate real code review using AI
async function generateCodeReview(diff: string): Promise<{ review: string; commitMessage: string }> {
  // Code review generation
  const reviewResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a code review assistant." },
      { role: "user", content: `Review this code diff:\n${diff}` },
    ],
  });

  const review = reviewResponse.choices[0].message?.content || "No review generated.";

  // Commit message generation
  const commitResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a git commit message generator." },
      { role: "user", content: `Generate a short Conventional Commit message for this diff:\n${diff}` },
    ],
  });

  const commitMessage = commitResponse.choices[0].message?.content || "chore: update code";

  return { review, commitMessage };
}

// 2️⃣ Write review to Markdown
function writeReviewToMarkdown(review: string, filePath = "code-review.md") {
  const content = `# Code Review Report\n\n${review}`;
  fs.writeFileSync(filePath, content);
  console.log(`✅ Review saved to ${filePath}`);
}

// 3️⃣ Main function
async function main() {gi
  let diff = "";
  try {
    diff = fs.readFileSync("diff.txt", "utf-8");
  } catch {
    diff = "Example diff: modified App.tsx with minor changes.";
  }

  const { review, commitMessage } = await generateCodeReview(diff);

  console.log("🔎 Code Review:\n", review);
  console.log("💬 Suggested Commit Message:\n", commitMessage);

  writeReviewToMarkdown(review);
}

main();
