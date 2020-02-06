import { AuctionSide } from './../../../Data/Enums';
export type InternalActualRow = {
  P: string;
  C: string;
  ID: number;
  T: Date;
  D: number;
  S: Date;
  E: Date;
};
export type ActualRow = {
  providerName: string;
  curveName: string;
  tsId: number;
  time: Date;
  value: number;
  competenceStart: Date;
  competenceEnd: Date;
};
export function actualMapper(row: InternalActualRow): ActualRow {
  return {
    providerName: row.P,
    curveName: row.C,
    tsId: row.ID,
    time: row.T,
    value: row.D,
    competenceStart: row.S,
    competenceEnd: row.E
  };
}

export type InternalAuctionRow = {
  P: string;
  N: string;
  ID: number;
  T: Date;
  S: AuctionSide;
  D: number;
  Q: number;
};
export type AuctionRow = {
  providerName: string;
  curveName: string;
  tsId: number;
  bidTimestamp: Date;
  side: AuctionSide;
  price: number;
  quantity: number;
};
export function auctionMapper(row: InternalAuctionRow): AuctionRow {
  return {
    providerName: row.P,
    curveName: row.N,
    tsId: row.ID,
    bidTimestamp: row.T,
    side: row.S,
    price: row.D,
    quantity: row.Q
  };
}

export type InternalVersionedRow = {
  P: string;
  C: string;
  ID: number;
  V: Date;
  T: Date;
  D: number;
  S: Date;
  E: Date;
};
export function versionedMapper(row: InternalVersionedRow): VersionedRow {
  return {
    providerName: row.P,
    curveName: row.C,
    tsId: row.ID,
    version: row.V,
    time: row.T,
    value: row.D,
    competenceStart: row.S,
    competenceEnd: row.E
  };
}
export type VersionedRow = {
  providerName: string;
  curveName: string;
  tsId: number;
  version: Date;
  time: Date;
  value: number;
  competenceStart: Date;
  competenceEnd: Date;
};

export type InternalMasRow = {
  P: string;
  N: string;
  ID: number;
  PR: string;
  T: Date;
  S?: number;
  O?: number;
  C?: number;
  H?: number;
  L?: number;
  VP?: number;
  VG?: number;
  VT?: number;
};
export function masMapper(row: InternalMasRow): MasRow {
  return {
    providerName: row.P,
    curveName: row.N,
    tsId: row.ID,
    product: row.PR,
    time: row.T,
    settlement: row.S,
    open: row.O,
    close: row.C,
    high: row.H,
    low: row.L,
    volumePaid: row.VP,
    volumeGiven: row.VG,
    volumeTotal: row.VT
  };
}
export type MasRow = {
  providerName: string;
  curveName: string;
  tsId: number;
  product: string;
  time: Date;
  settlement?: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  volumePaid?: number;
  volumeGiven?: number;
  volumeTotal?: number;
};
