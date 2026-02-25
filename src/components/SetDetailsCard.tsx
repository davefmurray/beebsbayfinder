import { LegoSetDetails } from "@/types/lego";
import { formatCurrency } from "@/lib/utils";
import SetImage from "./SetImage";
import Badge from "./Badge";

interface SetDetailsCardProps {
  set: LegoSetDetails;
}

export default function SetDetailsCard({ set }: SetDetailsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 p-4 flex-shrink-0">
          <SetImage src={set.imageUrl} alt={set.name} />
        </div>

        <div className="p-5 flex-1">
          <div className="flex items-start gap-2 flex-wrap mb-2">
            <h2 className="text-xl font-bold text-gray-900">{set.name}</h2>
            <Badge>#{set.setNumber.replace(/-1$/, "")}</Badge>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant="default">{set.theme}</Badge>
            {set.subtheme && <Badge variant="default">{set.subtheme}</Badge>}
            <Badge variant="default">{set.year}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {set.pieces !== null && (
              <Detail label="Pieces" value={set.pieces.toLocaleString()} />
            )}
            {set.minifigs !== null && (
              <Detail
                label="Minifigs"
                value={set.minifigs.toString()}
              />
            )}
            {set.retailPrice !== null && (
              <Detail
                label="Retail Price"
                value={formatCurrency(set.retailPrice)}
              />
            )}
            {set.dimensions && (
              <Detail
                label="Box Size"
                value={`${set.dimensions.height} x ${set.dimensions.width} x ${set.dimensions.depth} cm`}
              />
            )}
            {set.weight !== null && (
              <Detail label="Weight" value={`${set.weight} kg`} />
            )}
            {set.ageRange && <Detail label="Ages" value={set.ageRange} />}
            {set.barcode && <Detail label="UPC/EAN" value={set.barcode} />}
            {set.rating !== null && (
              <Detail label="Rating" value={`${set.rating}/5`} />
            )}
          </div>

          {set.bricksetUrl && (
            <a
              href={set.bricksetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-blue-600 hover:underline"
            >
              View on Brickset
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>{" "}
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
