export type PagedResult<Res> = {
    page: number;
    pageSize: number;
    count: number;
    isCountPartial: boolean;
    data: Res[];
  };
  