import { validateSearchFilter } from './../../Common/validators';
import { Output } from "./Data/MarketDataEntity";
import { IService } from './MarketDataService';

export class SearchFacet {
  constructor(private _client: IService) {
  }
  /**
   * Search the marketdata metadata
   * @param filter ArtesianSearchFilter containing the search params
   * Returns ArtesianSearchResults entity
   */
  Search(filter: SearchFilter) {
    validateSearchFilter(filter);
    const url =
      "marketdata/searchfacet" +
      `?page=${filter.page}` +
      `&pageSize=${filter.pageSize}` +
      `&searchText=${filter.searchText}` +
      `&filters=${filtersToString(filter.filters)}` +
      `&sorts=${filter.sorts}`;

    return this._client.get<SearchResults>(url);
  }
}

export type SearchFilter = {
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
