import { LegoSetDetails, BricksetApiResponse } from "@/types/lego";
import { getCached, setCache, TTL } from "./cache";
import { normalizeSetNumber } from "./utils";

const BRICKSET_API_URL = "https://brickset.com/api/v3.asmx";

export async function getLegoSetDetails(
  setNumber: string
): Promise<LegoSetDetails> {
  const apiKey = process.env.BRICKSET_API_KEY;
  if (!apiKey) {
    throw new Error("BRICKSET_API_KEY is not configured");
  }

  const normalized = normalizeSetNumber(setNumber);
  const cacheKey = `lego:${normalized}`;
  const cached = getCached<LegoSetDetails>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    apiKey,
    userHash: "",
    params: JSON.stringify({ setNumber: normalized }),
  });

  const response = await fetch(`${BRICKSET_API_URL}/getSets?${params}`);
  if (!response.ok) {
    throw new Error(`Brickset API error: ${response.status}`);
  }

  const data: BricksetApiResponse = await response.json();

  if (data.status !== "success") {
    throw new Error(`Brickset API error: ${data.message}`);
  }

  if (data.matches === 0 || data.sets.length === 0) {
    throw new Error(`No LEGO set found for number ${setNumber}`);
  }

  const set = data.sets[0];

  const result: LegoSetDetails = {
    setNumber: `${set.number}-${set.numberVariant}`,
    name: set.name,
    year: set.year,
    theme: set.theme,
    subtheme: set.subtheme || null,
    pieces: set.pieces ?? null,
    minifigs: set.minifigs ?? null,
    retailPrice: set.LEGOCom?.US?.retailPrice ?? null,
    imageUrl: set.image?.imageURL || null,
    bricksetUrl: set.bricksetURL || null,
    dimensions: set.dimensions
      ? {
          height: set.dimensions.height,
          width: set.dimensions.width,
          depth: set.dimensions.depth,
        }
      : null,
    weight: set.dimensions?.weight ?? null,
    ageRange: set.ageRange
      ? `${set.ageRange.min ?? "?"}${set.ageRange.max ? `-${set.ageRange.max}` : "+"}`
      : null,
    barcode:
      set.barcode?.UPC || set.barcode?.EAN || null,
    rating: set.rating || null,
    retired: (() => {
      const dateStr = set.LEGOCom?.US?.dateLastAvailable || set.LEGOCom?.UK?.dateLastAvailable;
      if (!dateStr) return null;
      return new Date(dateStr) < new Date();
    })(),
  };

  setCache(cacheKey, result, TTL.LEGO);
  return result;
}
