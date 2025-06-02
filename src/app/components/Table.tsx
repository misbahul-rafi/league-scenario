'use client'
import React from "react";

interface Props {
  titles: string[];
  fields: string[];
  data: Record<string, any>[];
  onRowClick?: (rowData: Record<string, any>) => void;
}

export default function Table({ titles, fields, data, onRowClick }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm whitespace-nowrap text-gray-900">
        <thead className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 uppercase text-xs">
          <tr className="bg-gray-500">
            {titles.map((title, idx) => (
              <th key={idx} className="px-6 py-3 text-center">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
              <td colSpan={fields.length} className="text-center py-2 whitespace-nowrap text-gray-900 dark:text-gray-100">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
              >
                {fields.map((field, colIndex) => (
                  <td key={colIndex} className="text-center py-2 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {String(row[field] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
