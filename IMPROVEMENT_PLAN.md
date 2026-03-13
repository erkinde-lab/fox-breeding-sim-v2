# Improvement Plan: Red Fox Sim

## Phase 1: Architectural Decoupling
1.  **Decompose the Store**: Split `useGameStore` into smaller slices (e.g., `useUserStore`, `useKennelStore`).
2.  **Componentize Monoliths**: Break down `AdminPage` and `LayoutClient` into smaller, reusable components.
3.  **Modularize Genetics**: Refactor `getPhenotype` into a strategy-based pattern for each locus.

## Phase 2: Logic Restoration & Stabilization
1.  **Implement Stubbed Actions**: Fill in the logic for `breedFoxes`, `buyItem`, and Admin commands.
2.  **Cleanup Root Directory**: Remove reactive Python "fix" scripts and implement proper linting/formatting.
3.  **Consolidate Migrations**: Clean up the store migration history into a single, cohesive path.

## Phase 3: Multiplayer Infrastructure
1.  **Backend Integration**: Migrate to Supabase for Auth and persistent Postgres storage.
2.  **Server-Side Logic**: Move breeding and show calculations to the server to prevent cheating.
3.  **Real-Time Features**: Use Supabase Realtime for the marketplace and forums.
