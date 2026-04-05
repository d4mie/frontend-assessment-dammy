export type PaginatedResponse<TItem, TKey extends string> = {
  total: number;
  skip: number;
  limit: number;
} & Record<TKey, TItem[]>;

