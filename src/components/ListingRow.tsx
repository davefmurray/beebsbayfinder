import { EbaySoldListing } from "@/types/ebay";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ListingRowProps {
  listing: EbaySoldListing;
}

export default function ListingRow({ listing }: ListingRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-2 pr-3 text-sm">
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
        {listing.shipping !== null ? formatCurrency(listing.shipping) : "Free"}
      </td>
      <td className="py-2 pl-3 text-sm text-right whitespace-nowrap text-gray-500">
        {listing.date ? formatDate(listing.date) : "-"}
      </td>
    </tr>
  );
}
