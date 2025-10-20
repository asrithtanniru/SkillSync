
# SkillSync

**SkillSync** is a collaborative skill-swapping platform where users can connect, exchange skills, and learn from each other. It features **Google login**, **real-time chat**, **session scheduling**, **video calls via ZegoCloud**, and a **token-based reward system** built on the **Ethereum (Sepolia)** blockchain.

---

## 🌟 Overview

Traditional learning platforms are often one-sided and transactional. **SkillSync** redefines peer learning by allowing users to both teach what they know and learn what they seek through meaningful exchanges. It encourages collaboration, fosters real human interaction, and rewards active participation with blockchain-based tokens. Through this approach, SkillSync creates a vibrant ecosystem for lifelong learning and skill development.

---

## 🚀 Key Features

* Google Authentication for quick onboarding
* Real-time chat and notifications
* Session scheduling for structured learning
* ZegoCloud video integration for face-to-face sessions
* Ethereum-based token rewards on the Sepolia Testnet
* Skill-based user matching powered by Prisma
* Responsive and elegant UI with TailwindCSS and Shadcn UI

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, TypeScript, TailwindCSS, Shadcn UI
* **Backend:** Next.js (API Routes), Prisma ORM
* **Blockchain:** Ethereum (Sepolia Network)
* **Video Calls:** ZegoCloud SDK
* **Database:** PostgreSQL

---

## 💡 Project Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Create environment file

```bash
cp .env.example .env
```

Then add your credentials:

```
DATABASE_URL=postgresql://user:password@localhost:5432/skillsync
ZEGO_APP_ID=your_zegocloud_app_id
ZEGO_SERVER_SECRET=your_zegocloud_secret
NEXTAUTH_GOOGLE_ID=your_google_client_id
NEXTAUTH_GOOGLE_SECRET=your_google_secret
NEXTAUTH_SECRET=your_random_secret
SEPOLIA_PRIVATE_KEY=your_wallet_private_key
```

### 3️⃣ Run development server

```bash
npm run dev
```

---

## 📂 Folder Structure

```
SkillSync
│
├── prisma/            # Prisma schema and migrations
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable UI components (Shadcn)
│   ├── lib/           # Utils and helper functions
│   └── pages/api/     # Backend API routes
└── public/            # Static assets
```


