import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearTokens } from "./authSlice";
import { getApiBaseUrl } from "../../api/config";

export { getApiBaseUrl };

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.access || localStorage.getItem("access");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Re-authentication wrapper:
 * Automatically refreshes expired access tokens using the Refresh/ endpoint.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token is invalid or expired (401 Unauthorized), attempt refresh
  if (result.error && result.error.status === 401) {
    const refreshToken =
      api.getState().auth.refresh || localStorage.getItem("refresh");

    if (refreshToken) {
      // Calls path("Refresh/", TokenRefreshView.as_view(), name="refresh")
      const refreshResult = await baseQuery(
        {
          url: "Refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data && refreshResult.data.access) {
        const newAccess = refreshResult.data.access;
        const newRefresh = refreshResult.data.refresh || refreshToken;

        // Save fresh tokens in Redux store and localStorage
        api.dispatch(
          setTokens({
            access: newAccess,
            refresh: newRefresh,
          })
        );

        // Retry the original query with the new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh token expired or blacklisted
        api.dispatch(clearTokens());
      }
    } else {
      api.dispatch(clearTokens());
    }
  }

  return result;
};

/**
 * RTK Query API slice matching backend/apps/Hotels/urls.py:
 * - Login/   -> TokenObtainPairView
 * - Refresh/ -> TokenRefreshView
 * - Logout/  -> LogoutView
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Menu", "Gallery", "Branch", "Feedback", "Category"],
  endpoints: (builder) => ({
    // path("Login/", TokenObtainPairView.as_view(), name="login")
    login: builder.mutation({
      query: (credentials) => ({
        url: "Login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // path("Refresh/", TokenRefreshView.as_view(), name="refresh")
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "Refresh/",
        method: "POST",
        body,
      }),
    }),

    // path("Logout/", LogoutView.as_view(), name="logout")
    logout: builder.mutation({
      query: (body) => ({
        url: "Logout/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
