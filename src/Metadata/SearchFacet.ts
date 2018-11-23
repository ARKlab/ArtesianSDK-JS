import { AxiosInstance } from "axios";
import { Output } from "./Data/MarketData";

export class SearchFacet {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  /**
   * Search the marketdata metadata
   * @param filter ArtesianSearchFilter containing the search params
   * Returns ArtesianSearchResults entity
   */
  Search(filter: SearchFilter) {
    // todo validate
    const url =
      "/marketdata/searchfacet" +
      `?page=${filter.page}` +
      `&pageSize=${filter.pageSize}` +
      `&searchText=${filter.searchText}` +
      `&filters=${filtersToString(filter.filters)}` +
      `&sorts=${filter.sorts}`;

    return this._client.get<SearchResults>(url);
  }
}

type SearchFilter = {
  searchText: string;
  filters: Record<string, string[]>;
  sorts?: string[];
  pageSize: number;
  page: number;
};
type SearchResults = {
  results: Output[];
  facets: MetadataFacet[];
  countsResults: number;
};
type MetadataFacet = {
  facetName: string;
  facetType: MetadataFacetType;
  values: MetadataFacetCount[];
};
enum MetadataFacetType {
  Property,
  Tag
}
type MetadataFacetCount = {
  value: string;
  count: number;
};
// function ValidateFilter(filter: SearchFilter): string[] | SearchFilter {}

// function validateSorts(obj: { sorts: string[] }) {

// }

function filtersToString(filters: Record<string, string[]>) {
  return Object.keys(filters)
    .map(key =>
      filters[key]
        .map(value => `${key}:${value}`)
        .map(encodeURIComponent)
        .join(",")
    )
    .join(",");
}
