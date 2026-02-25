"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import SetDetailsCard from "@/components/SetDetailsCard";
import PricingSection from "@/components/PricingSection";
import {
  SetDetailsSkeleton,
  PricingSkeleton,
} from "@/components/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { LegoSetDetails } from "@/types/lego";
import { EbayPricingResult } from "@/types/ebay";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [legoData, setLegoData] = useState<LegoSetDetails | null>(null);
  const [ebayData, setEbayData] = useState<EbayPricingResult | null>(null);
  const [legoLoading, setLegoLoading] = useState(false);
  const [ebayLoading, setEbayLoading] = useState(false);
  const [legoError, setLegoError] = useState<string | null>(null);
  const [ebayError, setEbayError] = useState<string | null>(null);

  const doSearch = useCallback(
    async (setNumber: string) => {
      setLegoData(null);
      setEbayData(null);
      setLegoError(null);
      setEbayError(null);
      setLegoLoading(true);
      setEbayLoading(true);

      router.push(`/?set=${setNumber}`, { scroll: false });

      const legoPromise = fetch(`/api/lego/${setNumber}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to fetch set data");
          return data as LegoSetDetails;
        })
        .then((data) => {
          setLegoData(data);
          setLegoLoading(false);
          return data;
        })
        .catch((err) => {
          setLegoError(err.message);
          setLegoLoading(false);
          return null;
        });

      const ebayPromise = legoPromise.then((legoResult) => {
        const retailParam = legoResult?.retailPrice
          ? `?retailPrice=${legoResult.retailPrice}`
          : "";
        return fetch(`/api/ebay/${setNumber}${retailParam}`)
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok)
              throw new Error(data.error || "Failed to fetch eBay data");
            return data as EbayPricingResult;
          })
          .then((data) => {
            setEbayData(data);
            setEbayLoading(false);
          })
          .catch((err) => {
            setEbayError(err.message);
            setEbayLoading(false);
          });
      });

      await Promise.all([legoPromise, ebayPromise]);
    },
    [router]
  );

  useEffect(() => {
    const setParam = searchParams.get("set");
    if (setParam) {
      doSearch(setParam);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = legoLoading || ebayLoading;
  const hasResults = legoData || ebayData || legoError || ebayError;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            BeebsBayFinder
          </h1>
          <p className="text-gray-500">
            LEGO Set Pricing for eBay Sellers
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <SearchBar onSearch={doSearch} isLoading={isLoading} />

        {hasResults && (
          <div className="space-y-6">
            {legoLoading && <SetDetailsSkeleton />}
            {legoError && (
              <ErrorMessage title="Set Data Error" message={legoError} />
            )}
            {legoData && <SetDetailsCard set={legoData} />}

            {ebayLoading && <PricingSkeleton />}
            {ebayError && (
              <ErrorMessage title="Pricing Error" message={ebayError} />
            )}
            {ebayData && (
              <PricingSection
                pricing={ebayData}
                retailPrice={legoData?.retailPrice ?? null}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
