"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableComponents/DataTableColumnHeader";
import Link from "next/link";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).includes(value);
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        // Edit and Delete buttons
        <div className="flex items-center space-x-2">
          <Link href={`/data-master/dosen/${payment.id}`}>
            <Button variant="default" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      );
    },
  },
  // ...
];
