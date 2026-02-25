export interface LegoSetDetails {
  setNumber: string;
  name: string;
  year: number;
  theme: string;
  subtheme: string | null;
  pieces: number | null;
  minifigs: number | null;
  retailPrice: number | null;
  imageUrl: string | null;
  bricksetUrl: string | null;
  dimensions: {
    height: number | null;
    width: number | null;
    depth: number | null;
  } | null;
  weight: number | null;
  ageRange: string | null;
  barcode: string | null;
  rating: number | null;
  retired: boolean | null;
}

export interface BricksetApiResponse {
  status: string;
  message: string;
  matches: number;
  sets: BricksetSet[];
}

export interface BricksetSet {
  setID: number;
  number: string;
  numberVariant: number;
  name: string;
  year: number;
  theme: string;
  themeGroup: string;
  subtheme: string;
  category: string;
  pieces: number | null;
  minifigs: number | null;
  image: {
    thumbnailURL: string;
    imageURL: string;
  };
  bricksetURL: string;
  LEGOCom: {
    US?: { retailPrice: number; dateFirstAvailable: string; dateLastAvailable: string };
    UK?: { retailPrice: number; dateFirstAvailable: string; dateLastAvailable: string };
  };
  dimensions: {
    height: number | null;
    width: number | null;
    depth: number | null;
    weight: number | null;
  } | null;
  barcode: {
    EAN: string;
    UPC: string;
  } | null;
  ageRange: {
    min: number | null;
    max: number | null;
  } | null;
  rating: number;
}
