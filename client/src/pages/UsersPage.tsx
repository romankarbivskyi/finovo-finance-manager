import { DataTable, Header, TimeSort } from "@/components";
import { ITEMS_PER_PAGE } from "@/constants";
import { fetchAllUsers } from "@/api/user.api";
import type { ApiResponse } from "@/types/api.types";
import type { User, UsersResponse } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modalStore";
import { toast } from "sonner";

const UsersPage = () => {
  const { openModal } = useModalStore();

  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery<ApiResponse<UsersResponse>, Error>({
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
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(user.email);
                  toast.success("Email copied to clipboard");
                }}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  openModal("deleteAccount", {
                    userId: user.id,
                    onDelete: refetch,
                  })
                }
              >
                Delete account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
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
