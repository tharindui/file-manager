import constate from "constate";
import { getQueries } from "./_shared/query-helper";

export const [useGetFiles] = getQueries(
  "files.getFiles",
  async (api) => {
    const data = await api.get<any>(`repos/tannerlinsley/react-query`);
    return {
      data,
    };
  },
  {
    useErrorBoundary: true,
    retry: false,
    staleTime: Infinity,
    refetchOnReconnect: true,
    // refetchOnWindowFocus: true,
    // hideLoadingBar: true,
  }
);

export const [FileProvider, useFile] = constate(
  () => {
    const data = useGetFiles();
    return {
      data,
    };
  },

  ({ data }) => data
);
