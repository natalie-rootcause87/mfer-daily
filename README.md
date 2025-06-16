# Mfers Daily

A minimalist game/space for holders of mfers to check in once per day and share their vibes.

## Features

- 🔐 Mfers-Only Gating: Must hold an mfer to post (read-only otherwise)
- 📝 One Post Per Day: Encourages presence without FOMO or grind
- 📜 Shared Timeline: Scroll through what other mfers posted today or this week
- 🎯 Zero Monetization: No tokens, no upgrades—no web3 noise
- 🤖 AI Moderation: Posts are automatically moderated using OpenAI
- 🏆 Passive Achievements: Track your posting streak

## Tech Stack

- Frontend: Next.js 14
- Backend: Serverless (AWS Lambda)
- Auth: Wallet connection (RainbowKit)
- Storage: MongoDB Atlas
- NFT Check: Viem
- Deployment: AWS Amplify

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mfer-daily.git
   cd mfer-daily
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_MONGODB_URI=your_mongodb_uri_here
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_MFER_CONTRACT_ADDRESS=0x79FCDEF22feeD20eDDacbB2587640e45491b757f
   NEXT_PUBLIC_CHAIN_ID=1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
