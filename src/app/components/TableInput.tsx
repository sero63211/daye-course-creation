"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import { Plus, Trash2 } from "lucide-react";

interface TableRow {
  id: string;
  columns: string[];
}

interface TableInputProps {
  onAddContent: (tableData: any) => void;
  initialColumnCount?: number;
}

const TableInput: React.FC<TableInputProps> = ({
  onAddContent,
  initialColumnCount = 2,
}) => {
  // Konstante Spaltenüberschriften
  const columnHeaders = ["Kurdisch", "Übersetzung"];

  // State für alle Tabellenzeilen
  const [rows, setRows] = useState<TableRow[]>([
    { id: crypto.randomUUID(), columns: Array(initialColumnCount).fill("") },
  ]);

  // Function zum Hinzufügen einer neuen Zeile
  const addRow = () => {
    setRows([
      ...rows,
      { id: crypto.randomUUID(), columns: Array(initialColumnCount).fill("") },
    ]);
  };

  // Function zum Entfernen einer Zeile
  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // Update cell value in a specific row
  const updateCell = (rowId: string, columnIndex: number, value: string) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              columns: row.columns.map((col, idx) =>
                idx === columnIndex ? value : col
              ),
            }
          : row
      )
    );
  };

  // Submit the complete table
  const handleAddTable = () => {
    // Filtern leerer Zeilen (alle Zellen einer Zeile sind leer)
    const filledRows = rows.filter((row) =>
      row.columns.some((cell) => cell.trim() !== "")
    );

    if (filledRows.length === 0) {
      alert("Bitte fügen Sie mindestens eine Zeile mit Inhalt hinzu");
      return;
    }

    // This is what we pass to the parent component
    const tableData = {
      text: JSON.stringify({
        headers: columnHeaders,
        rows: filledRows.map((row) => row.columns),
      }),
      translation: "",
      type: "table" as const,
      contentType: "table",
      uniqueId: crypto.randomUUID(),
    };

    console.log("TABLEINPUT: Sending table data to parent:", tableData);
    onAddContent(tableData);

    // Reset table to single empty row after adding
    setRows([
      { id: crypto.randomUUID(), columns: Array(initialColumnCount).fill("") },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tabelle erstellen
        </h3>

        {/* Tabellenkopf mit festen Spaltenüberschriften */}
        <div
          className="grid gap-4 mb-2 font-medium text-gray-700"
          style={{
            gridTemplateColumns: `repeat(${columnHeaders.length}, 1fr) auto`,
          }}
        >
          {columnHeaders.map((header, index) => (
            <div key={index} className="px-2">
              {header}
            </div>
          ))}
          <div></div> {/* Platzhalter für Aktions-Button */}
        </div>

        {/* Tabellenzeilen */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {rows.map((row, rowIndex) => (
            <div
              key={row.id}
              className="grid gap-2 items-center"
              style={{
                gridTemplateColumns: `repeat(${columnHeaders.length}, 1fr) auto`,
              }}
            >
              {row.columns.map((cell, colIndex) => (
                <InputField
                  key={colIndex}
                  value={cell}
                  onChange={(value) => updateCell(row.id, colIndex, value)}
                  placeholder={`${rowIndex + 1}. ${columnHeaders[colIndex]}`}
                />
              ))}
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="bg-red-500 text-white w-8 h-8 rounded flex items-center justify-center"
                disabled={rows.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Zeile hinzufügen Button */}
        <button
          type="button"
          onClick={addRow}
          className="w-full mt-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
        >
          <Plus size={16} className="mr-1" />
          Zeile hinzufügen
        </button>
      </div>

      {/* Tabelle hinzufügen Button */}
      <button
        type="button"
        onClick={handleAddTable}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tabelle hinzufügen
      </button>
    </div>
  );
};

export default TableInput;
