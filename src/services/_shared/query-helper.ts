import type { GetServerSidePropsContext } from "next";
import type {
  QueryClient,
  QueryFunctionContext,
  UseQueryOptions,
} from "react-query";
import type { FetchQueryName } from "./fetch-query-names";

import { useMutation, useQuery } from "react-query";

import ApiClient from "./api-client";

type QueryFunction<T, K = void> = (apiClient: ApiClient, data: K) => Promise<T>;
type Query<T> = [FetchQueryName, T];

// const isProduction = process.env.NODE_ENV === 'production';

export function withApiClient<T, K>(fn: QueryFunction<T, K>) {
  let apiClient = new ApiClient();

  return async (queryContext: QueryFunctionContext<Query<K>>) => {
    const {
      queryKey: [, data],
    } = queryContext;

    return fn(apiClient, data);
  };
}

export function withLoading<T, K>(fn: QueryFunction<T, K>) {
  return async (apiClient: ApiClient, data: K) => {
    try {
      const result = await fn(apiClient, data);
      return result;
    } catch (error) {
      throw error;
    }
  };
}

type UseUseQueryOptions = UseQueryOptions & {
  hideLoadingBar?: boolean;
};

export function useUseQuery<T, K>(
  query: Query<K>,
  queryFn: QueryFunction<T, K>,
  options?: UseUseQueryOptions
) {
  const queryFnWithLoadingBar = !options?.hideLoadingBar
    ? withLoading(queryFn)
    : queryFn;
  const data = useQuery(query as any, withApiClient(queryFnWithLoadingBar), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options,
  } as any);

  return data;
}

/**
 * @param query fetch query name
 * @returns function to use in GetServerSideProps function to get data on Server Side Rendering
 */
export function setQueryData<T, K>(query: FetchQueryName) {
  return async (
    ctx: GetServerSidePropsContext,
    qc: QueryClient,
    data: T,
    params?: K
  ) => qc.setQueryData([query, params || null] as Query<K>, data);
}

/**
 * @param queryName fetch query name
 * @param fetchFn api fetch function to query data from server
 * @param options React Query options
 * @returns
 */
export function getQueries<T, K = void>(
  queryName: FetchQueryName,
  fetchFn: QueryFunction<T, K>,
  options?: UseUseQueryOptions
): [typeof useQueryHook, typeof setDataFn] {
  /**
   * @param queryData parameter object to pass api fetch function to query data from server
   * @param initialData initial data to return on mocking contexts (ex: storybook)
   * @returns useQuery hook for fetch data in components
   */
  function useQueryHook(queryData: K, initialData?: T) {
    const useQueryResult = useUseQuery<T, K>(
      [queryName, queryData || null] as Query<K>,
      fetchFn,
      {
        staleTime: Infinity,
        ...options,
        initialData,
      }
    );
    return { ...useQueryResult };
  }

  const setDataFn = setQueryData<T, K>(queryName);

  return [useQueryHook, setDataFn];
}

type MutationFunction<T, K> = (apiClient: ApiClient, data: T) => Promise<K>;

type UseUseMutationOptions =
  | {
      hideLoadingBar?: boolean;
    }
  | undefined;

export function getMutation<T, K>(fn: MutationFunction<T, K>) {
  return ({ hideLoadingBar }: UseUseMutationOptions = {}) => {
    const api = new ApiClient();

    const mutationData = useMutation(async (data: T) => {
      try {
        if (!hideLoadingBar) {
          // showLoading();
        }

        const result = await fn(api, data);

        if (!hideLoadingBar) {
          // hideLoading();
        }

        return result;
      } catch (error) {
        if (!hideLoadingBar) {
          // hideLoading();
        }

        throw error;
      }
    });

    return mutationData;
  };
}
