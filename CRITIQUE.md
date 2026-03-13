# Project Critique: Red Fox Sim

## 1. Monolithic Architectures
The project suffers from several "God objects" and monolithic components that centralize too much responsibility.
*   **`src/lib/store.ts` (1.4k+ lines)**: Combines global state, business logic, accessibility settings, and admin controls.
*   **`src/app/layout-client.tsx` (1.1k+ lines)**: Manages global navigation, multiple accessibility providers, and complex state-driven rendering.
*   **`src/app/admin/page.tsx` (1.9k+ lines)**: A single file containing the entire admin dashboard without componentization.

## 2. Spaghetti Code & Logic Complexity
*   **`getPhenotype` in `src/lib/genetics.ts`**: A massive "if-else" waterfall that is fragile and hard to extend.
*   **`runHierarchicalShow` in `src/lib/showing.ts`**: Intertwined logic for multiple show stages, making it difficult to test in isolation.

## 3. Signs of "AI Hallucinations" & Technical Debt
*   **Empty Action Stubs**: Critical actions like `breedFoxes` and `buyItem` are empty functions (`=> { }`), yet the UI treats them as successful.
*   **Reactive "Fix" Scripts**: Over 10 Python scripts in the root used for regex patching indicate a struggle with the build system rather than architectural solutions.
*   **Redundant Migrations**: Overlapping store migrations (v9, v10, v12) suggest repeated, uncoordinated fixes.

## 4. Multiplayer Readiness
*   **Local-First Persistence**: Zustand `persist` is incompatible with multiplayer.
*   **Hardcoded Ownership**: Frequent hardcoding of `player-1` instead of dynamic session-based IDs.
