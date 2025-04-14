import { User } from "../types/user";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { Role } from "../types/role";
import { SortEnum } from "../types/sort-type";
import {
  createGetService,
  createPostService,
  createPatchService,
  createDeleteService,
} from "../factory";

// Type definitions
export type UsersRequest = {
  page: number;
  limit: number;
  filters?: {
    roles?: Role[];
  };
  sort?: Array<{
    orderBy: keyof User;
    order: SortEnum;
  }>;
};

export type UsersResponse = InfinityPaginationType<User>;

export type UserRequest = {
  id: User["id"];
};

export type UserResponse = User;

export type UserPostRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "photo" | "role"
> & {
  password: string;
};

export type UserPostResponse = User;

export type UserPatchRequest = {
  id: User["id"];
  data: Partial<
    Pick<User, "email" | "firstName" | "lastName" | "photo" | "role"> & {
      password: string;
    }
  >;
};

export type UserPatchResponse = User;

export type UsersDeleteRequest = {
  id: User["id"];
};

export type UsersDeleteResponse = undefined;

// Format query params for users list endpoint
const formatUsersQueryParams = (params: UsersRequest) => {
  const searchParams = new URLSearchParams();

  searchParams.append("page", params.page.toString());
  searchParams.append("limit", params.limit.toString());

  if (params.filters) {
    searchParams.append("filters", JSON.stringify(params.filters));
  }

  if (params.sort) {
    searchParams.append("sort", JSON.stringify(params.sort));
  }

  return searchParams.toString();
};

// API Services using the new factory pattern
export const useGetUsersService = createGetService<
  UsersResponse,
  void,
  UsersRequest
>("/v1/users", {
  formatQueryParams: formatUsersQueryParams,
});

export const useGetUserService = createGetService<UserResponse, UserRequest>(
  (params) => `/v1/users/${params.id}`
);

export const usePostUserService = createPostService<
  UserPostRequest,
  UserPostResponse
>("/v1/users");

export const usePatchUserService = createPatchService<
  UserPatchRequest["data"],
  UserPatchResponse,
  { id: User["id"] }
>((params) => `/v1/users/${params.id}`);

export const useDeleteUsersService = createDeleteService<
  UsersDeleteResponse,
  UsersDeleteRequest
>((params) => `/v1/users/${params.id}`);
