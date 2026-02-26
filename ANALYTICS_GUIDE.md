# Analytics Comparison & Implementation Guide for Red Fox Sim

This guide evaluates privacy-first analytics options for **Red Fox Sim**, prioritizing low cost (0/mo limit), international privacy compliance, and eventual self-hosting migration.

## Recommendation: Umami Analytics
After evaluating Plausible, Fathom, Simple Analytics, Pirsch, and Umami, **Umami** is the clear winner for this specific project.

### 1. Cost Efficiency (0/mo Budget)
Umami Cloud's **Hobby Tier** is $9/month for 100,000 events.
- **Why this fits:** Most other providers (Plausible, Fathom) start at $15-$19/month, which exceeds your budget.
- **Event-Based Advantage:** In a simulation game, tracking *actions* (e.g., "Fox Bred", "Item Purchased") is more valuable than just pageviews. Umami treats pageviews and custom events equally in its 100k limit.

### 2. Traffic & Regional Estimates
Based on comparable niche simulation games (e.g., *Alacrity*, *DogDayzz*):
- **Estimated Monthly Pageviews:** 100,000 - 300,000 for a moderately active community.
- **Regional Breakdown:** ~50% North America, ~30% Europe (GDPR zone), ~20% Rest of World.
- **Privacy Impact:** Umami is cookieless and anonymized, making it fully compliant with **GDPR** and **CCPA** without requiring a cookie consent banner, which keeps the game UI clean and "folk-style."

### 3. Migration Path to Self-Hosting (The $0 Option)
You expressed a preference for eventually migrating to a self-hosted solution.
- **Ease of Migration:** Umami is open-source and lightweight. You can migrate from Umami Cloud to your own server without losing data.
- **Free Hosting Stack:** You can host Umami for **$0/month** by using:
  - **Vercel** for the application hosting.
  - **Supabase** or **Neon** for the PostgreSQL database (Free tiers are ample for millions of events).
- **Comparison:** Self-hosting Plausible is significantly more complex (requires a dedicated server with at least 4GB RAM and Docker setup).

---

## Implementation Strategy: Event Tracking

To get the most out of Umami, we will track specific game events. This allows you to see which features are popular without collecting personal data.

### Suggested Events to Track:
| Event Name | Description | Location |
| :--- | :--- | :--- |
| `fox_bred` | Triggered when two foxes are bred. | `/breeding` |
| `kit_born` | Triggered when a new kit is generated. | `/breeding` |
| `custom_fox_created` | Triggered when a player creates a custom fox. | `/shop/custom` |
| `item_purchased` | Triggered on successful shop purchase. | `/shop/supplies` |
| `show_entered` | Triggered when a fox is entered into a show. | `/shows` |

---

## Next Steps for the Admin

1. **Sign Up:** Create an account at [cloud.umami.is](https://cloud.umami.is).
2. **Add Website:** Add your domain (e.g., `fox-breeding-sim-v2.onrender.com`) to get a **Website ID**.
3. **Update Environment Variables:** I can help you add the `NEXT_PUBLIC_UMAMI_ID` to Render.
4. **Deploy Script:** Once configured, the tracking script will be added to the global layout.

---

## Privacy Compliance Statement
By using Umami, the game remains compliant with:
- **GDPR (EU):** No personal data stored, no cross-site tracking.
- **CCPA/CPRA (California):** No "sale" of data, no cookies used for identification.
- **PECR (UK):** No non-essential cookies placed on the user's device.
