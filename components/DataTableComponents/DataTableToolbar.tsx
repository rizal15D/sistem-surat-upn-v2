import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { Button } from "../ui/button";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterInput?: string;
  data?: { [key: string]: any };
}

export function DataTableToolbar<TData>({
  table,
  filterInput,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center py-4 gap-4">
      {filterInput && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 bottom-1/4 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder={`Filter ${filterInput}...`}
            value={
              (table.getColumn(filterInput)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterInput)?.setFilterValue(event.target.value)
            }
            className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
          />
        </div>
      )}
      {data &&
        Object.keys(data).map((key) => {
          if (table.getColumn(key)) {
            return (
              <DataTableFacetedFilter
                key={key}
                column={table.getColumn(key)}
                title={key}
                options={data[key]}
              />
            );
          }
        })}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
