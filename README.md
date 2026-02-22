# 🤖 Ask AI — LLM Query Tool

A simple Node.js project that lets you ask any question to an AI model powered by **Groq** and **LLaMA 3.3 70B**.

---

## 📁 Project Structure
```
ask-ai/
│
├── src/
│   └── askAI.js        # Core AI function using Groq SDK
├── index.js            # Entry point — run your question here
├── .env                # Your API key (never push this!)
├── .gitignore          # Ignores node_modules and .env
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ask-ai.git
cd ask-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root folder:
```env
API_KEY=your_groq_api_key_here
```
Get your free API key from 👉 [https://console.groq.com](https://console.groq.com)

### 4. Run the project

#### Ask a single question
```bash
node src/askAI.js
```

#### Chat with memory
```bash
node src/chatWithMemory.js

---

## 💡 How It Works

1. `index.js` defines a question and calls the `askAI()` function
2. `askAI.js` sends the question to **Groq API** using the **LLaMA 3.3 70B** model
3. The AI response is returned and printed in the terminal

---

## 🧠 Model Used

| Property | Value |
|----------|-------|
| Provider | [Groq](https://groq.com) |
| Model | `llama-3.3-70b-versatile` |
| Speed | Ultra-fast inference |
| Cost | Free tier available |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `groq-sdk` | Groq API client |
| `dotenv` | Load environment variables |


---

## 📸 Sample Output
```bash
Answer to 'What is the weather in New York?': 
I don't have real-time data, but I can tell you that New York 
typically experiences cold winters and hot summers...
```