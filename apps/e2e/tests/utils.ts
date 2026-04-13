import { expect } from "@playwright/test";

const MAILPIT_API = "http://localhost:54324/api/v1";

export async function getLatestMagicLink(email: string): Promise<string> {
  // 1. Search for messages to this email
  const searchUrl = `${MAILPIT_API}/search?query=to:${encodeURIComponent(email)}`;

  // We might need to retry a few times as the email might take a second to arrive
  // TODO: Fix the part below to work - running 5 times for 1000 seconds is flaky!
  let messageId = "";
  for (let i = 0; i < 5; i++) {
    console.log(searchUrl);
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Failed to search Mailpit: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.messages && data.messages.length > 0) {
      // Sort by Created date or just take the first one (Mailpit search returns latest first usually)
      messageId = data.messages[0].ID;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  if (!messageId) {
    throw new Error(`No magic link email found for ${email}`);
  }

  // 2. Fetch the message content
  const messageUrl = `${MAILPIT_API}/message/${messageId}`;
  const response = await fetch(messageUrl);
  if (!response.ok)
    throw new Error(
      `Failed to fetch message from Mailpit: ${response.statusText}`,
    );

  const messageData = await response.json();
  const html = messageData.HTML || "";
  console.log(messageUrl);
  console.log(messageData);

  // 3. Extract the confirmation link
  const linkRegex = /href="([^"]*token_hash=[^"]*)"/;
  const match = html.match(linkRegex);

  if (!match || !match[1]) {
    throw new Error("Magic link not found in email body");
  }

  // The link might be HTML escaped (e.g., &amp;)
  return match[1].replace(/&amp;/g, "&");
}
