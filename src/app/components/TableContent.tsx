"use client";
import React, { useEffect } from "react";

interface TableContentProps {
  item: any; // Using any to avoid TypeScript constraints
}

const TableContent: React.FC<TableContentProps> = ({ item }) => {
  useEffect(() => {
    console.log("TABLECONTENT-IMPROVED: Component mounted with item:", item);
  }, [item]);

  // Handle non-string text case
  if (typeof item.text !== "string") {
    console.error(
      "TABLECONTENT-IMPROVED: Invalid item.text - not a string:",
      item.text
    );
    return (
      <div className="text-red-500 p-2 border border-red-300 rounded">
        Fehler: Tabellendaten sind nicht im korrekten Format.
      </div>
    );
  }

  // Parse the JSON string with robust error handling
  let tableData;
  try {
    // Try parsing the JSON string
    tableData = JSON.parse(item.text);
    console.log(
      "TABLECONTENT-IMPROVED: Successfully parsed table data:",
      tableData
    );
  } catch (error) {
    console.error(
      "TABLECONTENT-IMPROVED: Error parsing JSON:",
      error,
      "Text was:",
      item.text
    );
    return (
      <div className="text-red-500 p-2 border border-red-300 rounded">
        Fehler beim Parsen der Tabellendaten: {error.message}
      </div>
    );
  }

  // Validate that we have headers and rows
  if (
    !tableData ||
    !tableData.headers ||
    !tableData.rows ||
    !Array.isArray(tableData.headers) ||
    !Array.isArray(tableData.rows)
  ) {
    console.error("TABLECONTENT-IMPROVED: Invalid table structure:", tableData);
    return (
      <div className="text-red-500 p-2 border border-red-300 rounded">
        Ungültiges Tabellenformat: Headers oder Zeilen fehlen
      </div>
    );
  }

  return (
    <div className="w-full mt-3">
      <h3 className="font-medium text-lg text-black mb-2">Tabelle</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tableData.headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableContent;
