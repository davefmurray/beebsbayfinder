import { NextRequest, NextResponse } from "next/server";
import { getLegoSetDetails } from "@/lib/brickset";
import { isValidSetNumber } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ setNumber: string }> }
) {
  const { setNumber } = await params;

  if (!isValidSetNumber(setNumber)) {
    return NextResponse.json(
      { error: "Invalid set number. Must be 4-7 digits." },
      { status: 400 }
    );
  }

  try {
    const details = await getLegoSetDetails(setNumber);
    return NextResponse.json(details);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not configured")
      ? 503
      : message.includes("No LEGO set found")
        ? 404
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
