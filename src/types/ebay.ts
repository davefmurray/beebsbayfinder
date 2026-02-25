export interface EbaySoldListing {
  title: string;
  price: number;
  shipping: number | null;
  totalPrice: number;
  date: string;
  url: string;
  itemId: string | null;
  currency: string;
}

export interface EbayPricingSummary {
  count: number;
  avgPrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  avgShipping: number;
  avgTotalPrice: number;
}

export interface EbayPricingResult {
  summary: EbayPricingSummary;
  listings: EbaySoldListing[];
  keyword: string;
}

export interface ApifyEbayItem {
  title?: string;
  price?: string | number;
  soldPrice?: string | number;
  shipping?: string | number;
  shippingPrice?: string | number;
  currency?: string;
  soldCurrency?: string;
  date?: string;
  endedAt?: string;
  url?: string;
  itemId?: string;
  totalPrice?: string | number;
  [key: string]: unknown;
}
