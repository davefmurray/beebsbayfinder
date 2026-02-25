"use client";

import { useState, useMemo } from "react";
import { EbayPricingResult, EbaySoldListing, EbayPricingSummary } from "@/types/ebay";
import { formatCurrency, median } from "@/lib/utils";
import Badge from "./Badge";
import ProfitCalculator from "./ProfitCalculator";

interface PricingSectionProps {
  pricing: EbayPricingResult;
  retailPrice: number | null;
}

type DateRange = "all" | "7" | "15" | "30" | "60" | "90";
type Condition = "all" | "new" | "used";

const NEW_KEYWORDS = ["new", "sealed", "nib", "nisb", "bnib", "factory sealed", "brand new", "mint"];
const USED_KEYWORDS = ["used", "open box", "incomplete", "missing", "no box", "loose", "pre-owned", "played"];

function detectCondition(title: string): "new" | "used" | "unknown" {
  const lower = title.toLowerCase();
  if (USED_KEYWORDS.some((k) => lower.includes(k))) return "used";
  if (NEW_KEYWORDS.some((k) => lower.includes(k))) return "new";
  return "unknown";
}

function computeFilteredSummary(listings: EbaySoldListing[]): EbayPricingSummary {
  if (listings.length === 0) {
    return { count: 0, avgPrice: 0, medianPrice: 0, minPrice: 0, maxPrice: 0, avgShipping: 0, avgTotalPrice: 0 };
  }
  const prices = listings.map((l) => l.price);
  const shippingCosts = listings.map((l) => l.shipping).filter((s): s is number => s !== null);
  const totalPrices = listings.map((l) => l.totalPrice);
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avg = (arr: number[]) => (arr.length > 0 ? sum(arr) / arr.length : 0);
  return {
    count: listings.length,
    avgPrice: Math.round(avg(prices) * 100) / 100,
    medianPrice: Math.round(median(prices) * 100) / 100,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgShipping: shippingCosts.length > 0 ? Math.round(avg(shippingCosts) * 100) / 100 : 0,
    avgTotalPrice: Math.round(avg(totalPrices) * 100) / 100,
  };
}

export default function PricingSection({ pricing, retailPrice }: PricingSectionProps) {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [condition, setCondition] = useState<Condition>("all");

  const filtered = useMemo(() => {
    let result = pricing.listings;

    if (dateRange !== "all") {
      const days = parseInt(dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((l) => l.date && new Date(l.date) >= cutoff);
    }

    if (condition !== "all") {
      result = result.filter((l) => {
        const detected = detectCondition(l.title);
        if (condition === "new") return detected === "new" || detected === "unknown";
        return detected === "used";
      });
    }

    return result;
  }, [pricing.listings, dateRange, condition]);

  const summary = useMemo(() => computeFilteredSummary(filtered), [filtered]);

  if (pricing.listings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">eBay Sold Pricing</h3>
        <p className="text-gray-500">No sold listings found for &ldquo;{pricing.keyword}&rdquo;</p>
      </div>
    );
  }

  const percentDiff =
    retailPrice && retailPrice > 0
      ? Math.round(((summary.avgPrice - retailPrice) / retailPrice) * 100)
      : null;

  const isFiltered = dateRange !== "all" || condition !== "all";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h3 className="text-lg font-bold text-gray-900">eBay Sold Pricing</h3>
          <Badge>
            {summary.count}{isFiltered ? ` / ${pricing.listings.length}` : ""} listings
          </Badge>
        </div>

        <div className="flex gap-3 mb-4 flex-wrap">
          <FilterSelect
            label="Period"
            value={dateRange}
            onChange={(v) => setDateRange(v as DateRange)}
            options={[
              { value: "all", label: "All time" },
              { value: "7", label: "Last 7 days" },
              { value: "15", label: "Last 15 days" },
              { value: "30", label: "Last 30 days" },
              { value: "60", label: "Last 60 days" },
              { value: "90", label: "Last 90 days" },
            ]}
          />
          <FilterSelect
            label="Condition"
            value={condition}
            onChange={(v) => setCondition(v as Condition)}
            options={[
              { value: "all", label: "All" },
              { value: "new", label: "New / Sealed" },
              { value: "used", label: "Used / Open" },
            ]}
          />
        </div>

        {summary.count === 0 ? (
          <p className="text-gray-500 text-sm">No listings match these filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatBox label="Average" value={formatCurrency(summary.avgPrice)} />
              <StatBox label="Median" value={formatCurrency(summary.medianPrice)} />
              <StatBox label="Low" value={formatCurrency(summary.minPrice)} />
              <StatBox label="High" value={formatCurrency(summary.maxPrice)} />
            </div>

            <div className="flex gap-4 flex-wrap text-sm text-gray-600 mb-1">
              <span>
                Avg w/ Shipping: <strong>{formatCurrency(summary.avgTotalPrice)}</strong>
              </span>
              {summary.avgShipping > 0 && (
                <span>
                  Avg Shipping: <strong>{formatCurrency(summary.avgShipping)}</strong>
                </span>
              )}
              {percentDiff !== null && (
                <Badge variant={percentDiff < 0 ? "red" : "green"}>
                  {percentDiff > 0 ? "+" : ""}
                  {percentDiff}% vs retail
                </Badge>
              )}
            </div>

            <ProfitCalculator medianPrice={summary.medianPrice} retailPrice={retailPrice} />
          </>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-gray-200 bg-gray-50">
                <th className="py-2 pr-3 pl-5 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-500 uppercase text-right">Price</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-500 uppercase text-right">Shipping</th>
                <th className="py-2 pl-3 pr-5 text-xs font-medium text-gray-500 uppercase text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 pr-3 pl-5 text-sm">
                    {listing.url ? (
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline line-clamp-1"
                        title={listing.title}
                      >
                        {listing.title}
                      </a>
                    ) : (
                      <span className="line-clamp-1" title={listing.title}>{listing.title}</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-sm text-right whitespace-nowrap font-medium">
                    {formatCurrency(listing.price)}
                  </td>
                  <td className="py-2 px-3 text-sm text-right whitespace-nowrap text-gray-500">
                    {listing.shipping !== null ? formatCurrency(listing.shipping) : "Free"}
                  </td>
                  <td className="py-2 pl-3 pr-5 text-sm text-right whitespace-nowrap text-gray-500">
                    {listing.date
                      ? new Date(listing.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-500 uppercase mb-1">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-xs text-gray-500 uppercase font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
