import { groqClient, DEFAULT_MODEL } from './config/groqClient.js';
import readline from 'readline';

// ─── Tool Declarations  ─────────────────────────────────────────

const sumDeclaration = {
  type: 'function',
  function: {
    name: 'sum',
    description: 'Get the sum of 2 numbers',
    parameters: {
      type: 'object',
      properties: {
        num1: { type: 'number', description: 'First number ex: 10' },
        num2: { type: 'number', description: 'Second number ex: 20' },
      },
      required: ['num1', 'num2'],
    },
  },
};

const primeDeclaration = {
  type: 'function',
  function: {
    name: 'checkPrime',
    description: 'Check if a number is prime or not',
    parameters: {
      type: 'object',
      properties: {
        num: { type: 'number', description: 'Number to check ex: 13' },
      },
      required: ['num'],
    },
  },
};

const cryptoDeclaration = {
  type: 'function',
  function: {
    name: 'getCryptoPrice',
    description: 'Get the current price of any crypto currency like bitcoin',
    parameters: {
      type: 'object',
      properties: {
        coin: { type: 'string', description: 'Crypto currency name ex: bitcoin' },
      },
      required: ['coin'],
    },
  },
};

// ─── Tool Implementations ─────────────────────────────────────────────────────

function sum({ num1, num2 }) {
  return num1 + num2;
}

function checkPrime({ num }) {
  if (num <= 1) return false;
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

async function getCryptoPrice({ coin }) {
  const apiKey = process.env.COINGECKO_API_KEY;
  console.log(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`)
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`,
    {
      headers: {
        'x-cg-demo-api-key': apiKey,  // ✅ pass key in header, not URL
        'Accept': 'application/json',
      },
    }
  );

  // ✅ Check if response is ok before parsing JSON
  if (!response.ok) {
    const text = await response.text();
    console.error('CoinGecko error:', text);
    return { error: `API error: ${text}` };
  }

  const data = await response.json();

  return data[coin]
    ? { coin, price: data[coin].usd }
    : { error: 'Coin not found' };
}

// ─── Available Tools Map ──────────────────────────────────────────────────────

const availableTools = {
  sum,
  checkPrime,
  getCryptoPrice,
};

const tools = [sumDeclaration, primeDeclaration, cryptoDeclaration];

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are a helpful AI Agent. You have access to 3 tools:
  1. sum — adds 2 numbers
  2. checkPrime — checks if a number is prime
  3. getCryptoPrice — gets current crypto price in USD
  
  Use these tools when needed. For general questions, answer directly.`,
};

// ─── History ──────────────────────────────────────────────────────────────────

const History = [];

// ─── Agent Loop ───────────────────────────────────────────────────────────────

async function runAgent(userProblem) {
  // Add user message to history
  History.push({ role: 'user', content: userProblem });

  while (true) {
    // Call Groq with tools
    const response = await groqClient.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [SYSTEM_PROMPT, ...History],
      tools: tools,
      tool_choice: 'auto',
    });

    const message = response.choices[0].message;

    // Add assistant message to history
    History.push(message);

    // Check if AI wants to call a tool
    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        console.log(`\n🔧 Calling tool: ${toolName} with args:`, toolArgs);

        // Execute the tool
        const toolFn = availableTools[toolName];
        const result = await toolFn(toolArgs);

        console.log(`✅ Tool result:`, result);

        // Add tool result to history
        History.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
      // Continue loop — let AI process tool results
    } else {
      // No tool call — AI has final answer
      console.log(`\n🤖 AI: ${message.content}\n`);
      break;
    }
  }
}

// ─── Interactive Terminal ─────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║          🤖 AI Agent                  ║');
  console.log('╠══════════════════════════════════════╣');
  console.log('║  Tools: sum, prime check, crypto      ║');
  console.log('║  "exit" → Quit                        ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const askQuestion = () => {
    rl.question('🧑 You: ', async (input) => {
      const userInput = input.trim();

      if (!userInput) { askQuestion(); return; }

      if (userInput.toLowerCase() === 'exit') {
        console.log('\n👋 Goodbye!\n');
        rl.close();
        return;
      }

      try {
        await runAgent(userInput);
      } catch (error) {
        console.error('❌ Error:', error.message);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main();