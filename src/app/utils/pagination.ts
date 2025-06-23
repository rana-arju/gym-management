type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
type IoptionResult = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  skip: number;
};
const calculatePagination = (options: IOptions): IoptionResult => {
  const page = options.page ? Number(options.page) : 1;
  const limit = options.limit ? Number(options.limit) : 10;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "asc";
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    skip,
  };
};

export const paginationHelper = {
  calculatePagination,
};
