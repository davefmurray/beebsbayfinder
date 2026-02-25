import { EbayPricingResult } from "@/types/ebay";
import { formatCurrency } from "@/lib/utils";
import ListingRow from "./ListingRow";
import Badge from "./Badge";

interface PricingSectionProps {
  pricing: EbayPricingResult;
  retailPrice: number | null;
}

export default function PricingSection({
  pricing,
  retailPrice,
}: PricingSectionProps) {
  const { summary, listings } = pricing;

  if (summary.count === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          eBay Sold Pricing
        </h3>
        <p className="text-gray-500">
          No sold listings found for &ldquo;{pricing.keyword}&rdquo;
        </p>
      </div>
    );
  }

  const percentDiff =
    retailPrice && retailPrice > 0
      ? Math.round(
          ((summary.avgPrice - retailPrice) / retailPrice) * 100
        )
      : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            eBay Sold Pricing
          </h3>
          <Badge>{summary.count} listings</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatBox label="Average" value={formatCurrency(summary.avgPrice)} />
          <StatBox label="Median" value={formatCurrency(summary.medianPrice)} />
          <StatBox label="Low" value={formatCurrency(summary.minPrice)} />
          <StatBox label="High" value={formatCurrency(summary.maxPrice)} />
        </div>

        <div className="flex gap-4 flex-wrap text-sm text-gray-600 mb-1">
          <span>
            Avg w/ Shipping:{" "}
            <strong>{formatCurrency(summary.avgTotalPrice)}</strong>
          </span>
          {summary.avgShipping > 0 && (
            <span>
              Avg Shipping:{" "}
              <strong>{formatCurrency(summary.avgShipping)}</strong>
            </span>
          )}
          {percentDiff !== null && (
            <Badge variant={percentDiff < 0 ? "red" : "green"}>
              {percentDiff > 0 ? "+" : ""}
              {percentDiff}% vs retail
            </Badge>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-t border-b border-gray-200 bg-gray-50">
              <th className="py-2 pr-3 pl-5 text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="py-2 px-3 text-xs font-medium text-gray-500 uppercase text-right">
                Price
              </th>
              <th className="py-2 px-3 text-xs font-medium text-gray-500 uppercase text-right">
                Shipping
              </th>
              <th className="py-2 pl-3 pr-5 text-xs font-medium text-gray-500 uppercase text-right">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="px-5">
            {listings.map((listing, i) => (
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
                    <span className="line-clamp-1" title={listing.title}>
                      {listing.title}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-sm text-right whitespace-nowrap font-medium">
                  {formatCurrency(listing.price)}
                </td>
                <td className="py-2 px-3 text-sm text-right whitespace-nowrap text-gray-500">
                  {listing.shipping !== null
                    ? formatCurrency(listing.shipping)
                    : "Free"}
                </td>
                <td className="py-2 pl-3 pr-5 text-sm text-right whitespace-nowrap text-gray-500">
                  {listing.date ? new Date(listing.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
