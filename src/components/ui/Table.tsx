import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  className,
  headerClassName,
  rowClassName,
  emptyMessage = "No data available",
  striped = false,
  hoverable = true,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
      <table className={cn("w-full text-sm text-left", className)}>
        <thead
          className={cn(
            "bg-linear-to-r from-teal/10 via-teal/5 to-cyan-50/10 uppercase text-xs tracking-wider border-b border-teal-500/10",
            headerClassName
          )}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-6 py-4 font-semibold text-gray-700", col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-teal-500/20">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-400 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const rCn =
                typeof rowClassName === "function"
                  ? rowClassName(row, idx)
                  : rowClassName;

              return (
                <tr
                  key={keyExtractor(row, idx)}
                  className={cn(
                    "transition-all duration-200",
                    striped && idx % 2 !== 0 && "bg-teal/2",
                    hoverable && "hover:bg-teal/5 hover:shadow-sm",
                    rCn
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-6 py-4 text-gray-700", col.className)}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
