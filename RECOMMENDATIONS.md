# Technology Recommendations for Red Fox Sim

Based on the project's evolution towards a multiplayer, automated simulation, the following tools are recommended to enhance development, release, and upkeep.

## 🛠️ Development & Design

### **v0 (Vercel)**
- **Purpose:** Redesigning and iterating on UI components.
- **Why it fits:** It can rapidly generate Tailwind-based components that match the "folk" aesthetic while improving accessibility and responsiveness.
- **Use Case:** Redesigning the Kennel or Shop interfaces.

### **Context7 (Upstash)**
- **Purpose:** Long-term memory for AI agents (like Jules).
- **Why it fits:** Addresses the "Jules errors" pain point. By storing genetic rules, project constraints, and historical bug fixes in a persistent vector store, agents can maintain consistency across tasks without re-learning the genetics logic every time.
- **Use Case:** Preventing regressions in complex allele interactions (e.g., White Markings lethal combinations).

### **Stitch (Google)**
- **Purpose:** Simplifying MCP (Model Context Protocol) server management.
- **Why it fits:** Helpful for creating automated game loops (biweekly schedules) and custom management tools that agents can interact with.

## 🚀 Release & Infrastructure

### **Supabase**
- **Purpose:** Backend-as-a-Service (Postgres + Auth + Realtime).
- **Why it fits:** The fastest path for a solo dev to implement multiplayer features. It handles user accounts, a global marketplace (realtime), and forum data storage out of the box.
- **Comparison:** Preferred over Neon for this specific project because it includes Auth and Realtime sync which Neon lacks.

### **Linear**
- **Purpose:** Project management and task tracking.
- **Why it fits:** Essential for maintaining a strict biweekly release cadence. It provides a structured way to manage the backlog for future moderators and track the progress of complex features like the "Breeding Center" overhaul.

## 📈 Ongoing Upkeep & Analytics

### **Tinybird**
- **Purpose:** Real-time data engineering and game balance analytics.
- **Why it fits:** While Umami tracks web traffic, Tinybird is designed for "Game Analytics." It can analyze breeding trends in real-time to ensure the "Red/Gold" distribution remains balanced across the entire player base.
- **Privacy:** Tinybird allows for complete control over data ingestion, ensuring that no PII (Personally Identifiable Information) is stored while still providing powerful insights into game mechanics.

### **Umami**
- **Purpose:** Privacy-first web analytics.
- **Why it fits:** Already recommended for general site traffic monitoring due to its cookieless, anonymized nature.

## Summary Table

| Tool | Category | Key Impact |
| :--- | :--- | :--- |
| **v0** | Dev | Accelerated UI redesigns. |
| **Context7** | Dev | Prevents AI errors in complex genetics logic. |
| **Supabase** | Release | Enables multiplayer, forums, and marketplace. |
| **Tinybird** | Upkeep | Real-time game balance and breeding trends. |
| **Linear** | Upkeep | Manages the biweekly release schedule. |
| **Stitch** | Dev | Orchestrates background automation tasks. |

## 🧠 Clarification on "Memory"

There are four distinct types of "memory" your project will benefit from. It is important to note that **Linear and Tinybird do not use your browser's local storage (Website Memory).**

| Memory Type | Recommended Tool | Role in Red Fox Sim |
| :--- | :--- | :--- |
| **AI Context Memory** | **Context7 (Upstash)** | **Solves "Jules errors."** Stores persistent rules (genetics, code patterns) that AI agents retrieve to stay consistent. |
| **Project History** | **Linear** | **Schedule Consistency.** Remembers what tasks were finished and what's next for your biweekly releases. |
| **Game Data Memory** | **Tinybird** | **Game Balance.** Tracks millions of breeding/show events to identify trends (e.g., "Silver fox birthrate is too high"). |
| **Player State** | **Supabase** | **Multiplayer.** Replaces local storage (Website Memory) so players can log in from any device. |
