import { NextRequest, NextResponse } from "next/server";
import { getEbaySoldListings } from "@/lib/apify";
import { isValidSetNumber } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setNumber: string }> }
) {
  const { setNumber } = await params;

  if (!isValidSetNumber(setNumber)) {
    return NextResponse.json(
      { error: "Invalid set number. Must be 4-7 digits." },
      { status: 400 }
    );
  }

  const retailPrice = request.nextUrl.searchParams.get("retailPrice");
  const price = retailPrice ? parseFloat(retailPrice) : null;

  try {
    const result = await getEbaySoldListings(
      setNumber,
      price && !isNaN(price) ? price : null
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
