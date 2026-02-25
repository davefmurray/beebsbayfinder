import { ApifyEbayItem, EbayPricingResult, EbaySoldListing } from "@/types/ebay";
import { getCached, setCache, TTL } from "./cache";
import { parsePrice, median } from "./utils";

const DEFAULT_ACTOR_ID = "caffein.dev~ebay-sold-listings";

export async function getEbaySoldListings(
  setNumber: string,
  retailPrice?: number | null
): Promise<EbayPricingResult> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured");
  }

  const keyword = `LEGO ${setNumber.replace(/-\d+$/, "")}`;
  const cacheKey = `ebay:${keyword}`;
  const cached = getCached<EbayPricingResult>(cacheKey);
  if (cached) return cached;

  const actorId = process.env.APIFY_EBAY_ACTOR_ID || DEFAULT_ACTOR_ID;
  const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keyword,
      maxItems: 30,
    }),
  });

  if (!response.ok) {
    if (response.status === 408) {
      throw new Error("eBay search timed out. Try again.");
    }
    throw new Error(`Apify API error: ${response.status}`);
  }

  const items: ApifyEbayItem[] = await response.json();
  const listings = normalizeListings(items);
  const filtered = filterListings(listings, retailPrice ?? null);
  const summary = computeSummary(filtered);

  const result: EbayPricingResult = {
    summary,
    listings: filtered,
    keyword,
  };

  setCache(cacheKey, result, TTL.EBAY);
  return result;
}

function normalizeListings(items: ApifyEbayItem[]): EbaySoldListing[] {
  return items
    .map((item) => {
      const price = parsePrice(item.price);
      if (price === null) return null;

      const shipping = parsePrice(item.shipping);

      return {
        title: item.title || "Untitled",
        price,
        shipping,
        totalPrice: price + (shipping ?? 0),
        date: item.date || "",
        url: item.url || "",
        itemId: item.itemId || null,
        currency: item.currency || "USD",
      };
    })
    .filter((item): item is EbaySoldListing => item !== null);
}

function filterListings(
  listings: EbaySoldListing[],
  retailPrice: number | null
): EbaySoldListing[] {
  return listings.filter((listing) => {
    if (listing.price < 5) return false;
    if (retailPrice && listing.price > retailPrice * 10) return false;
    return true;
  });
}

function computeSummary(listings: EbaySoldListing[]) {
  if (listings.length === 0) {
    return {
      count: 0,
      avgPrice: 0,
      medianPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      avgShipping: 0,
      avgTotalPrice: 0,
    };
  }

  const prices = listings.map((l) => l.price);
  const shippingCosts = listings
    .map((l) => l.shipping)
    .filter((s): s is number => s !== null);
  const totalPrices = listings.map((l) => l.totalPrice);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avg = (arr: number[]) => (arr.length > 0 ? sum(arr) / arr.length : 0);

  return {
    count: listings.length,
    avgPrice: Math.round(avg(prices) * 100) / 100,
    medianPrice: Math.round(median(prices) * 100) / 100,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgShipping:
      shippingCosts.length > 0
        ? Math.round(avg(shippingCosts) * 100) / 100
        : 0,
    avgTotalPrice: Math.round(avg(totalPrices) * 100) / 100,
  };
}
