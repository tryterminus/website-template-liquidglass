# Template Variable Reference

> Comprehensive mapping of every Handlebars variable in the site template, its data source from the Zillow agent scrape, and availability across 1,741 agents.

---

## Availability Legend

| Label | Meaning |
|---|---|
| **ALMOST ALWAYS** | 90%+ of agents have this field |
| **OFTEN** | 60–89% of agents |
| **SOMETIMES** | 30–59% of agents |
| **RARELY** | <30% of agents |
| **NEVER** | Not present in Zillow data — must be generated, derived, or uploaded |

---

## 1. Agent — Basic Info

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `agent.name` | `name` | 100% ALMOST ALWAYS | |
| `agent.title` | — | NEVER | Must be generated (e.g. "Luxury Real Estate Specialist") |
| `agent.brokerage` | `businessName` | 97.4% ALMOST ALWAYS | |
| `agent.serviceArea` | `professional.location` | 90.8% ALMOST ALWAYS | Often empty string — may need derivation from address |
| `agent.siteUrl` | — | NEVER | Generated at deploy time |
| `agent.metaTitle` | — | NEVER | AI-generated |
| `agent.metaDescription` | — | NEVER | AI-generated |

**Used on:** All pages (nav, footer, meta tags)

---

## 2. Agent — Contact Info

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `agent.phone` | `phoneNumbers.cell` | 99.8% ALMOST ALWAYS | Formatted: "(814) 231-8200" |
| `agent.phoneRaw` | `phoneNumbers.cell` | 99.8% ALMOST ALWAYS | Strip formatting for `tel:` links |
| `agent.email` | `email` | 100% ALMOST ALWAYS | |
| `agent.address` | `businessAddress.*` | 91% ALMOST ALWAYS | Combine address1 + city + state + zip |
| `agent.streetAddress` | `businessAddress.address1` | 90.8% ALMOST ALWAYS | |
| `agent.city` | `businessAddress.city` | 90.8% ALMOST ALWAYS | |
| `agent.state` | `businessAddress.state` | 92.0% ALMOST ALWAYS | |
| `agent.zip` | `businessAddress.postalCode` | 92.6% ALMOST ALWAYS | |
| `agent.latitude` | — | NEVER | Geocode from address |
| `agent.longitude` | — | NEVER | Geocode from address |

**Used on:** All pages (footer), contact.html, property.html

---

## 3. Agent — Social Links

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `agent.facebook` | — | NEVER | Not in Zillow scrape — must collect or omit |
| `agent.instagram` | — | NEVER | Not in Zillow scrape |
| `agent.linkedin` | — | NEVER | Not in Zillow scrape |

**Used on:** All pages (footer social icons)

**Recommendation:** Wrap in `{{#if}}` conditionals so missing social links hide the icons rather than rendering broken links.

---

## 4. Agent — Images

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `agent.photo` | `profilePhotoSrc` | 95.3% ALMOST ALWAYS | High-res version available |
| `agent.heroImage` | — | NEVER | Need stock photo or upload |
| `agent.buyHeroImage` | — | NEVER | Need stock photo or upload |
| `agent.aboutHeroImage` | — | NEVER | Need stock photo or upload |
| `agent.ctaBackgroundImage` | — | NEVER | Need stock photo or upload |

**Used on:** index.html (hero, about preview, exit modal), about.html (hero, story, CTA), contact.html, blog.html, property.html

**Note:** `sell.html` hero image is hardcoded (Unsplash) and not a template variable.

---

## 5. Agent — Stats & Credentials

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `agent.avgRating` | `ratings.average` | 64.6% OFTEN | 0–5 scale |
| `agent.googleRating` | `ratings.average` | 64.6% OFTEN | Same source, used on sell.html |
| `agent.reviewCount` | `ratings.count` | 64.6% OFTEN | |
| `agent.homesSold` | `agentSalesStats.countAllTime` | 83.6% OFTEN | |
| `agent.totalSold` | `agentSalesStats.countAllTime` | 83.6% OFTEN | Same source, used on sell.html |
| `agent.totalTransactions` | `agentSalesStats.countAllTime` | 83.6% OFTEN | Same source, used on index.html |
| `agent.totalVolume` | — | NEVER | Could estimate: countAllTime × averageValueThreeYear |
| `agent.volumeSold` | — | NEVER | Numeric portion for count-up animation |
| `agent.volumeSoldSuffix` | — | NEVER | e.g. "M" or "B" |
| `agent.yearsExperience` | `professionalInformation["Member since"]` | Derivable | Parse date, subtract from current year |
| `agent.careerStartYear` | `professionalInformation["Member since"]` | Derivable | Parse year from "08/04/2016" → 2016 |
| `agent.trustBadge1` | `isTopAgent` | 9.5% RARELY | Only true for top agents — need alternative badge text |
| `agent.commissionRate` | — | NEVER | Business-specific, must be provided |

**Used on:** index.html (hero, social proof bar), buy.html, sell.html, about.html (stats section), contact.html

---

## 6. Agent — Bio & Copy

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `agent.bioExcerpt` | `getToKnowMe.description` | 74.7% OFTEN | Excerpt/truncate from full bio |
| `agent.bioHeadline` | — | NEVER | AI-generated from bio |
| `agent.bioIntro` | `getToKnowMe.description` | 74.7% OFTEN | AI-split: first paragraph |
| `agent.bioBody` | `getToKnowMe.description` | 74.7% OFTEN | AI-split: middle paragraphs |
| `agent.bioClosing` | `getToKnowMe.description` | 74.7% OFTEN | AI-split: closing paragraph |
| `agent.specialtiesSubtitle` | — | NEVER | AI-generated |
| `agent.personalNote` | — | NEVER | AI-generated from bio, conditional section |
| `agent.personalNoteExtra` | — | NEVER | AI-generated, conditional |
| `agent.footerDisclaimer` | — | NEVER | Must be generated per brokerage/state |

**Used on:** index.html (about preview), about.html (story section, beyond real estate)

---

## 7. Agent — Collections

### 7a. Specialties (about.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.specialties[].title` | `getToKnowMe.specialties` | 91.3% ALMOST ALWAYS |
| `agent.specialties[].description` | — | NEVER — AI-generated per specialty |
| `agent.specialties[].icon` | — | NEVER — must map specialty → SVG icon |

**Zillow specialties are simple strings** like "Buyer's Agent", "Listing Agent", "Relocation", "Short-Sale". The template expects rich objects with title + description + icon SVG path.

### 7b. Credentials (about.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.credentials[]` | `agentLicenses` | 63.8% OFTEN |

Zillow provides license number + state + type. Must transform to display strings like "Licensed in PA — RS367942".

### 7c. Languages (about.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.languages[]` | `getToKnowMe.languages` | 5.6% RARELY |

**Recommendation:** Section is wrapped in `{{#if}}` — will auto-hide when empty.

### 7d. Lifestyle Images (about.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.lifestyleImages[].src` | — | NEVER |
| `agent.lifestyleImages[].alt` | — | NEVER |

**Recommendation:** Section is wrapped in `{{#if}}` — will auto-hide when empty.

### 7e. Service Areas (index.html JSON-LD)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.serviceAreas[]` | — | NEVER — derive from past sales cities or geocoding |

### 7f. Neighborhoods (index.html, neighborhoods.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.neighborhoods[].name` | — | NEVER |
| `agent.neighborhoods[].slug` | — | NEVER |
| `agent.neighborhoods[].image` | — | NEVER |
| `agent.neighborhoods[].tagline` | — | NEVER |
| `agent.neighborhoods[].avgPrice` | — | NEVER |
| `agent.allAreas[].name` | — | NEVER |
| `agent.allAreas[].url` | — | NEVER |

**Must be researched/generated** based on agent's market area. Can potentially derive neighborhood list from `pastSales` city data.

### 7g. Reviews (index.html, about.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.reviews[].comment` | `reviewsData.reviews[].reviewComment` | 100% of reviews |
| `agent.reviews[].rating` | `reviewsData.reviews[].rating` | 100% of reviews |
| `agent.reviews[].reviewerName` | `reviewsData.reviews[].reviewer.screenName` | 99.9% (firstName only 25.2%) |
| `agent.reviews[].reviewerInitial` | — | Derive from screenName or firstName |
| `agent.reviews[].workDescription` | `reviewsData.reviews[].workDescription` | 99.9% |
| `agent.reviews[].date` | `reviewsData.reviews[].createDate` | 100% — format from ISO |

**65% of agents have reviews.** Template should handle the 35% with no reviews (hide section or show placeholder).

### 7h. Blog Posts (blog.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.blogPosts[].category` | — | NEVER |
| `agent.blogPosts[].dateISO` | — | NEVER |
| `agent.blogPosts[].dateFormatted` | — | NEVER |
| `agent.blogPosts[].title` | — | NEVER |
| `agent.blogPosts[].excerpt` | — | NEVER |
| `agent.blogPosts[].body` | — | NEVER (optional) |
| `agent.blogPosts[].ctaUrl` | — | NEVER (optional) |
| `agent.blogPosts[].ctaText` | — | NEVER (optional) |
| `agent.blogPosts[].ctaUrl2` | — | NEVER (optional) |
| `agent.blogPosts[].ctaText2` | — | NEVER (optional) |

**Entirely AI-generated** — market updates, buying/selling guides, neighborhood spotlights.

---

## 8. Listings

### 8a. Featured Listings (index.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.featuredListings[].photos[0]` | `forSaleListings.listings[].primary_photo_url` | 100% of listings |
| `agent.featuredListings[].address` | `forSaleListings.listings[].address.line1 + line2` | 100% |
| `agent.featuredListings[].status` | `forSaleListings.listings[].home_marketing_status` | 100% |
| `agent.featuredListings[].price` | `forSaleListings.listings[].price` | 100% |
| `agent.featuredListings[].beds` | `forSaleListings.listings[].bedrooms` | 79.7% |
| `agent.featuredListings[].baths` | `forSaleListings.listings[].bathrooms` | 78.6% |
| `agent.featuredListings[].sqft` | — | NEVER in listing data |
| `agent.featuredListings[].id` | `forSaleListings.listings[].zpid` | 100% |

**Only 31.8% of agents have active listings.** Featured listings may need to pull from past sales as fallback.

### 8b. Active Listings (buy.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.activeListings[].photos.[0]` | `forSaleListings.listings[].primary_photo_url` | 100% |
| `agent.activeListings[].address` | `forSaleListings.listings[].address.line1 + line2` | 100% |
| `agent.activeListings[].status` | `forSaleListings.listings[].home_marketing_status` | 100% |
| `agent.activeListings[].price` | `forSaleListings.listings[].price` | 100% (numeric) |
| `agent.activeListings[].priceRaw` | `forSaleListings.listings[].price` | 100% |
| `agent.activeListings[].beds` | `forSaleListings.listings[].bedrooms` | 79.7% |
| `agent.activeListings[].baths` | `forSaleListings.listings[].bathrooms` | 78.6% |
| `agent.activeListings[].sqft` | — | NEVER |
| `agent.activeListings[].id` | `forSaleListings.listings[].zpid` | 100% |

### 8c. Sold Listings (sell.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.soldListings[].photos.[0]` | `pastSales.past_sales[].image_url` | 100% |
| `agent.soldListings[].address` | `pastSales.past_sales[].street_address + city_state_zipcode` | 100% |
| `agent.soldListings[].price` | `pastSales.past_sales[].price` | 100% (formatted string) |
| `agent.soldListings[].beds` | `pastSales.past_sales[].bedrooms` | 92.6% |
| `agent.soldListings[].baths` | `pastSales.past_sales[].bathrooms` | 91.7% |
| `agent.soldListings[].sqft` | `pastSales.past_sales[].livingAreaValue` | 92.3% |
| `agent.soldListings[].soldDetails` | `pastSales.past_sales[].sold_date + represented` | 100% |

---

## 9. Property Page (property.html)

| Template Variable | Zillow Source | Availability | Notes |
|---|---|---|---|
| `property.address` | Listing address | Available | |
| `property.price` | Listing price | Available | |
| `property.beds` | Listing bedrooms | ~80-93% | |
| `property.baths` | Listing bathrooms | ~79-92% | |
| `property.sqft` | `livingAreaValue` (past sales only) | 92.3% past / 0% active | |
| `property.status` | Listing status | Available | |
| `property.mlsNumber` | — | NEVER | Not in scrape |
| `property.description` | — | NEVER | Not in scrape — AI-generate or omit |
| `property.photos[]` | Single photo only | Partial | Zillow gives 1 photo per listing, not gallery |
| `property.mapEmbed` | — | NEVER | Generate from lat/lng |
| `property.features[]` | — | NEVER | Not in scrape |
| `property.similarListings[]` | — | NEVER | Must compute from nearby listings |

---

## 10. Neighborhood Detail Page (neighborhoods/neighborhood.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `neighborhood.name` | — | NEVER |
| `neighborhood.slug` | — | NEVER |
| `neighborhood.description` | — | NEVER |
| `neighborhood.image` | — | NEVER |
| `neighborhood.longDescription1` | — | NEVER |
| `neighborhood.longDescription2` | — | NEVER |
| `neighborhood.longDescription3` | — | NEVER |
| `neighborhood.avgPrice` | — | NEVER |
| `neighborhood.avgSqft` | — | NEVER |
| `neighborhood.walkability` | — | NEVER |
| `neighborhood.vibe` | — | NEVER |
| `neighborhood.schoolRating` | — | NEVER |
| `neighborhood.population` | — | NEVER |
| `neighborhood.insiderTips[].title` | — | NEVER |
| `neighborhood.insiderTips[].description` | — | NEVER |

**Entire neighborhood section must be researched/generated** per agent's market.

---

## 11. Selling Process (sell.html)

| Template Variable | Zillow Source | Availability |
|---|---|---|
| `agent.sellingProcess[].number` | — | NEVER |
| `agent.sellingProcess[].title` | — | NEVER |
| `agent.sellingProcess[].description` | — | NEVER |

**Recommendation:** Hardcode this section (generic 4-step process) since it's the same for every agent.

---

## 12. Global

| Template Variable | Source | Notes |
|---|---|---|
| `currentYear` | System | Generated server-side at render time |

---

## Summary: Data Source Breakdown

| Source | Count | Examples |
|---|---|---|
| **Direct from Zillow** | ~25 vars | name, email, phone, brokerage, photo, ratings, sales stats |
| **Derived from Zillow** | ~8 vars | yearsExperience (from member-since), totalVolume (sales × avg), reviewerInitial, phoneRaw |
| **AI-generated** | ~35 vars | bio splits, blog posts, meta tags, specialties descriptions, neighborhood content, disclaimers |
| **External / uploaded** | ~10 vars | hero images, social links, map embeds, commission rate |
| **Hardcoded in template** | ~5 vars | My Approach steps, sell hero image, selling process |
| **System-generated** | ~2 vars | siteUrl, currentYear |

### Key Gaps Requiring AI Generation Pipeline

1. **Bio processing** — Split raw `getToKnowMe.description` HTML into headline, intro, body, closing, excerpt
2. **Blog posts** — Generate 3–6 market-relevant articles per agent
3. **Neighborhood content** — Research and write neighborhood profiles based on agent's past sales geography
4. **Meta tags** — Generate SEO title and description per page
5. **Specialties enrichment** — Expand simple strings ("Buyer's Agent") into rich cards with descriptions and icons
6. **Footer disclaimer** — Generate based on brokerage and state regulations

### Key Gaps Requiring Fallback Handling

1. **Active listings** — Only 31.8% have any; show past sales or "Contact me for listings" fallback
2. **Reviews** — 35% have none; hide review sections or show "Be the first to leave a review"
3. **Rating** — 35.4% have no rating; hide stars or show "New agent"
4. **Bio** — 25.3% have no bio; AI-generate a generic one from name + brokerage + market
5. **Beds/baths on listings** — ~20% missing; show "—" placeholder
6. **Languages** — 94.4% empty; section auto-hides via `{{#if}}`
