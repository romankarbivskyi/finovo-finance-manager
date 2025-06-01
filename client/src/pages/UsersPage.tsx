import { DataTable, Header, TimeSort } from "@/components";
import { ITEMS_PER_PAGE } from "@/constants";
import { fetchAllUsers } from "@/api/user.api";
import type { ApiResponse } from "@/types/api.types";
import type { User, UsersResponse } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";

const UsersPage = () => {
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { data: apiResponse, isLoading } = useQuery<
    ApiResponse<UsersResponse>,
    Error
  >({
    queryKey: ["goals", offset, ITEMS_PER_PAGE, sort],
    queryFn: async () => await fetchAllUsers(ITEMS_PER_PAGE, offset, sort),
    refetchInterval: 10000,
  });

  const { users = [], total = 0 } = apiResponse?.data ?? {};

  const handleSortChange = (sortBy: string) => {
    setSort(sortBy);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground capitalize">
            {row.getValue("id")}
          </span>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "PPP 'at' p");
      },
    },
  ];

  return (
    <div className="container mx-auto">
      <Header title="Users" subtitle="View and manage users in the system" />

      <div className="space-y-4">
        <TimeSort onSortChange={handleSortChange} />
        <DataTable
          data={users}
          columns={columns}
          page={page}
          onPageChange={setPage}
          total={total}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default UsersPage;
