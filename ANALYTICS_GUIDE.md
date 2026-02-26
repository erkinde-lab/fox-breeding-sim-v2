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
*   **Pros:** Clean interface, simple script installation, and if you ever want to hit $0 cost, the self-hosting setup is the most popular in the developer community.
*   **Cons:** The free tier is limited (10k events), but the first paid tier is very affordable.

### 2. Pirsch
*   **Best for:** Those who want a European-hosted, lightweight solution.
*   **Pros:** Very fast, strictly GDPR compliant, and scales its pricing smoothly ($6 for 10k, ~$12 for 100k).
*   **Cons:** Interface is slightly more "technical" than Fathom or Umami. No easy "one-click" self-host path compared to Umami.

### 3. Fathom Analytics
*   **Best for:** Maximum simplicity ("Set it and forget it").
*   **Pros:** One of the pioneers of privacy-first analytics. Their dashboard is famous for being "one page" and impossible to get lost in.
*   **Cons:** Most expensive starting point ($15/mo). No free tier.

### 4. Simple Analytics
*   **Best for:** Users who hate cookie banners.
*   **Pros:** They are the "loudest" about privacy and have a very cool AI feature that lets you ask questions about your data (e.g., "Which page is most popular on Tuesdays?").
*   **Cons:** Pricing is on the higher side ($15/mo). Free tier has a strict 30-day data history limit.

### 5. Plausible
*   **Best for:** Feature-rich tracking and open-source enthusiasts.
*   **Pros:** Extremely powerful and well-regarded. Great for deep dives into where users are coming from.
*   **Cons:** Most expensive for high-traffic sites ($19/mo for 100k views).

---

## Why Umami is the best fit for Fox Sim

1.  **Simulation Game Traffic:** In games like *Alacrity* or *DogDayzz*, users click much more than on a standard blog. 100,000 pageviews can be reached quickly. Umami's $9 tier handles this much cheaper than Plausible ($19) or Fathom ($15).
2.  **Beginner Friendly:** The Umami dashboard uses clear graphs and simple lists. You don't need to be a data scientist to understand it.
3.  **Growth Path:** If the game becomes a huge hit and costs start rising, Umami's "Self-Hosted" version is very easy to set up on services like Railway or Render for a flat $5/month or even free.

## Next Steps for the Admin

1.  **Sign Up:** Go to [umami.is](https://umami.is/) and create a Cloud account.
2.  **Add Website:** Enter `fox-sim` in your dashboard to get your **Website ID**.
3.  **Install:** Once you are ready, I can help you add the tracking script to `src/app/layout.tsx`.
4.  **Track Events:** We can then add "Event Hooks" to the breeding and shop pages so you can see exactly how many foxes are being created!
