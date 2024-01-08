"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import axios from "axios";

export type Role = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original;
      const queryClient = useQueryClient();

      const { mutate } = useMutation({
        mutationFn: async () => {
          const { data } = await axios.delete(`/api/role`, {
            data: { id: role.id },
          });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["role"],
          });
        },
      });

      return (
        // Edit and Delete buttons
        <div className="flex items-center space-x-2 text-white">
          <Link href={`/data-master/role/${role.id}`}>
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-opacity-90"
            >
              <InfoCircledIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="bg-danger hover:bg-opacity-90"
            onClick={() => mutate()}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
      );
    },
  },
  // ...
];
