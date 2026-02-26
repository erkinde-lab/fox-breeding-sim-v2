# Analytics Comparison Guide for Fox Sim

This guide evaluates five privacy-first analytics options for **Fox Sim**, prioritizing ease of use for a beginner admin, low cost, and the specific needs of a simulation game (high pageviews and event tracking).

## Executive Summary
For a beginner admin, **Umami Cloud** is the recommended choice. It offers the best balance of a generous "starting" tier, easy-to-read dashboards, and the lowest cost as your traffic grows.

---

## Comparison Table (at ~100,000 Monthly Pageviews)

| Provider | Monthly Cost | Ease of Use | Event Tracking | Self-Hosting Option |
| :--- | :--- | :--- | :--- | :--- |
| **Umami** | **$9** | High | Excellent | Yes (Open Source) |
| **Pirsch** | ~$12 | High | Good | No |
| **Fathom** | $15 | Very High | Basic | No |
| **Simple Analytics** | $15 | High | Good | No |
| **Plausible** | $19 | High | Excellent | Yes (Open Source) |

---

## Detailed Analysis

### 1. Umami (Recommended)
*   **Best for:** Simulation games with high interaction counts.
*   **Why:** Umami Cloud starts at $9/month for 100k events. Unlike pageviews, "events" allow you to track specific actions (e.g., "Fox Bred") without extra cost.
*   **Pros:** Clean interface, simple script installation, and if you ever want to hit $0 cost, the self-hosting setup is highly accessible.
*   **Cons:** The free tier is limited (10k events), but the first paid tier is very affordable.

---

## How Free Self-Hosting Works (Umami)

If you want to keep your costs at **$0 forever**, you can "self-host" Umami. This means you run the software yourself rather than paying Umami to host it for you.

### The "Beginner-Friendly" Free Path
The most popular way to self-host Umami for free is by combining two services:

1.  **Vercel (The Server):** You can deploy the Umami "code" to Vercel for free. Vercel is the same platform that often hosts Next.js sites (like this game).
2.  **Supabase or Neon (The Database):** Umami needs a place to store its data. Both Supabase and Neon offer a "Free Tier" of PostgreSQL databases that are more than enough for a starting game.

**Pros of Self-Hosting:**
*   **Cost:** $0/month.
*   **Control:** You own 100% of the data on your own database.
*   **No Limits:** You aren't strictly capped by Umami's "event" limits (though you are limited by the database size, which usually fits millions of rows).

**Cons of Self-Hosting:**
*   **Setup Time:** It takes about 30–60 minutes to set up (connecting the database to Vercel).
*   **Maintenance:** If Umami releases a big update, you have to click "Update" in Vercel yourself.
*   **No Support:** You can't email Umami support if something breaks; you'll have to check their community forums.

---

## Why Umami is the best fit for Fox Sim

1.  **Simulation Game Traffic:** In games like *Alacrity* or *DogDayzz*, users click much more than on a standard blog. 100,000 pageviews can be reached quickly. Umami's $9 tier handles this much cheaper than Plausible ($19) or Fathom ($15).
2.  **Beginner Friendly:** The Umami dashboard uses clear graphs and simple lists. You don't need to be a data scientist to understand it.
3.  **Growth Path:** Start on the Cloud version for ease of use. If the game grows and the $9/month becomes $50/month, you can migrate your data to the **Free Self-Hosted** version anytime.

## Next Steps for the Admin

1.  **Sign Up:** Go to [umami.is](https://umami.is/) and create a Cloud account.
2.  **Add Website:** Enter `fox-sim` in your dashboard to get your **Website ID**.
3.  **Install:** Once you are ready, I can help you add the tracking script to `src/app/layout.tsx`.
4.  **Track Events:** We can then add "Event Hooks" to the breeding and shop pages so you can see exactly how many foxes are being created!
