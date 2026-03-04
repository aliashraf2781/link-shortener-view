import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FiSearch, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
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
  enableSearch?: boolean;
  enableSort?: boolean;
  enableStatusFilter?: boolean;
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
  enableSearch = true,
  enableSort = true,
  enableStatusFilter = true,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Helper to extract text content from a value
  const extractText = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.toLowerCase();
    if (typeof value === "number") return value.toString().toLowerCase();
    if (React.isValidElement(value)) {
      // For React elements, try to extract text from props
      return "";
    }
    return String(value).toLowerCase();
  };

  // Filter data based on search term (only in searchable columns)
  const searchedData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    const searchableColumns = columns.filter((col) => col.searchable !== false && (col.key === "title" || col.key === "short_code"));
    
    if (searchableColumns.length === 0) return data;

    return data.filter((row) => {
      return searchableColumns.some((col) => {
        const value = (row as Record<string, unknown>)[col.key];
        const text = extractText(value);
        return text.includes(term);
      });
    });
  }, [data, searchTerm, columns]);

  // Filter data by status
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return searchedData;

    return searchedData.filter((row) => {
      const status = (row as Record<string, unknown>).is_active;
      if (statusFilter === "active") return status === "active";
      if (statusFilter === "inactive") return status === "inactive";
      return true;
    });
  }, [searchedData, statusFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !enableSort) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortColumn];
      const bValue = (b as Record<string, unknown>)[sortColumn];

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Default comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sortDirection === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection, enableSort]);

  const handleSort = (columnKey: string) => {
    if (!enableSort) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar and Filters */}
      <div className="space-y-3">
        {enableSearch && (
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or generated link..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Status Filter */}
        {enableStatusFilter && (
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-600 py-1">Filter by status:</span>
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    statusFilter === status
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
        <table className={cn("w-full text-sm text-left", className)}>
          <thead
            className={cn(
              "bg-linear-to-r from-teal-600/10 via-teal-500/5 to-cyan-50/10 uppercase text-xs tracking-wider border-b border-teal-500/10",
              headerClassName
            )}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "px-6 py-4 font-semibold text-gray-700",
                    enableSort && "cursor-pointer hover:bg-teal-50 transition",
                    col.headerClassName
                  )}
                  title={enableSort ? "Click to sort" : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.header}</span>
                    {enableSort && sortColumn === col.key && (
                      <span className="shrink-0">
                        {sortDirection === "asc" ? (
                          <FiChevronUp className="h-4 w-4 text-teal-600" />
                        ) : (
                          <FiChevronDown className="h-4 w-4 text-teal-600" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-500/20">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400 font-medium"
                >
                  {searchTerm ? "No results found" : emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => {
                const rCn =
                  typeof rowClassName === "function"
                    ? rowClassName(row, idx)
                    : rowClassName;

                return (
                  <tr
                    key={keyExtractor(row, idx)}
                    className={cn(
                      "transition-all duration-200",
                      striped && idx % 2 !== 0 && "bg-teal-50/30",
                      hoverable && "hover:bg-teal-50/50 hover:shadow-sm",
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
    </div>
  );
}

export default Table;
