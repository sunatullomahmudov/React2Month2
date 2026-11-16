
import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../api/api";

export const usersApi = createApi({
  reducerPath: "usersApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API,
  }),

  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // GET
    getUsers: builder.query<any[], void>({
      query: () => "",
      providesTags: ["Users"],
    }),

    // ADD
    addUser: builder.mutation<any, any>({
      query: (user) => ({
        url: "",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    // EDIT
    editUser: builder.mutation<any, any>({
      query: (user) => ({
        url: `/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    // DELETE
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
} = usersApi;

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});
