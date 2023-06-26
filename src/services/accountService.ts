import constate from "constate";
import { getMutation, getQueries } from "./_shared/query-helper";

export const [useGetFiles] = getQueries(
  "files.getFiles",
  async (api) => {
    const data = await api.get<any>(`/Title`);
    return {
      data,
    };
  },
  {
    useErrorBoundary: true,
    retry: false,
    staleTime: 1000,
    refetchOnReconnect: false,
    // refetchOnWindowFocus: true,
   // hideLoadingBar: true,
  }
);


const useUserRegisterMutation = getMutation(async (api, data) => {
  return api.post<any, any>('/Account/register', data);
});

export const [FileProvider, useFile] = constate(
  () => {
    const data = useGetFiles();
    return {
      data,
    };
  },

  ({ data }) => data
);
