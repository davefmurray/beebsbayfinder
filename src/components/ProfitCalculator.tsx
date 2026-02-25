"use client";

import { useState, useMemo, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface ProfitCalculatorProps {
  medianPrice: number;
  retailPrice: number | null;
}

const EBAY_FEE_RATE = 0.13;
const PROCESSING_FEE_RATE = 0.03;
const DEFAULT_SHIPPING = 9;

export default function ProfitCalculator({ medianPrice, retailPrice }: ProfitCalculatorProps) {
  const [sellPrice, setSellPrice] = useState(medianPrice);
  const [costOfGoods, setCostOfGoods] = useState(retailPrice ?? 0);
  const [shippingCost, setShippingCost] = useState(DEFAULT_SHIPPING);

  useEffect(() => {
    setSellPrice(medianPrice);
  }, [medianPrice]);

  useEffect(() => {
    setCostOfGoods(retailPrice ?? 0);
  }, [retailPrice]);

  const calc = useMemo(() => {
    const ebayFee = sellPrice * EBAY_FEE_RATE;
    const ccFee = sellPrice * PROCESSING_FEE_RATE;
    const totalCosts = ebayFee + ccFee + shippingCost + costOfGoods;
    const profit = sellPrice - totalCosts;
    const margin = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
    return { ebayFee, ccFee, profit, margin };
  }, [sellPrice, costOfGoods, shippingCost]);

  const profitable = calc.profit >= 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <h4 className="text-sm font-bold text-gray-900 mb-3">Profit Calculator</h4>

      <div className="flex gap-4 flex-wrap mb-3">
        <CurrencyInput label="Sell Price" value={sellPrice} onChange={setSellPrice} />
        <CurrencyInput label="Your Cost" value={costOfGoods} onChange={setCostOfGoods} />
        <CurrencyInput label="Shipping" value={shippingCost} onChange={setShippingCost} />
      </div>

      <div className="space-y-1 text-sm text-gray-500 mb-3">
        <FeeRow label="eBay Fee (13%)" amount={-calc.ebayFee} />
        <FeeRow label="Payment Processing (3%)" amount={-calc.ccFee} />
        <FeeRow label="Shipping Cost" amount={-shippingCost} />
        <FeeRow label="Cost of Goods" amount={-costOfGoods} />
      </div>

      <div
        className={`rounded-md border px-3 py-2 flex items-center justify-center gap-4 text-sm font-semibold ${
          profitable
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        <span>Profit: {formatCurrency(calc.profit)}</span>
        <span>Margin: {calc.margin.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function CurrencyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-xs text-gray-500 uppercase font-medium">{label}</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="text-sm border border-gray-300 rounded-md pl-5 pr-2 py-1 w-24 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function FeeRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium">{formatCurrency(amount)}</span>
    </div>
  );
}
