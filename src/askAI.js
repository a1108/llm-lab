import { callGroq } from './config/groqClient.js';

// Clean and simple — no more dotenv or Groq client setup here!
 async function askAI(question) {
  const messages = [
    {
      role: 'user',
      content: question,
    },
  ];

  return await callGroq(messages);
}

// Run directly — just change your question here!
const question = 'What is JavaScript?';
const answer = await askAI(question);
console.log(`\n🤖 Answer: ${answer}\n`);