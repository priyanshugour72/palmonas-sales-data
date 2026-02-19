"use client";

import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useSalesContext } from "@/hooks/sales/useSalesContext";
import { parseExcelFile } from "@/lib/sales/excelParser";

const { Dragger } = Upload;

export function UploadZone() {
  const { setRows, meta, clearData } = useSalesContext();

  const handleFile = async (file: File) => {
    const result = await parseExcelFile(file);
    setRows(result.rows, {
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
      totalRows: result.totalRows,
      headers: result.headers,
    });
    return false; // prevent default upload
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Upload Excel
        </h2>
        {meta && (
          <button
            type="button"
            onClick={clearData}
            className="text-sm text-rose-600 hover:underline dark:text-rose-400"
          >
            Clear data
          </button>
        )}
      </div>
      <Dragger
        name="file"
        multiple={false}
        accept=".xlsx,.xls"
        showUploadList={false}
        beforeUpload={(file) => {
          handleFile(file);
          return false;
        }}
        className="!border-dashed !border-slate-300 !bg-slate-50/50 dark:!border-slate-600 dark:!bg-slate-800/30"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-4xl text-indigo-500" />
        </p>
        <p className="ant-upload-text text-slate-600 dark:text-slate-300">
          Click or drag Excel file here
        </p>
        <p className="ant-upload-hint text-slate-500 dark:text-slate-400">
          Same format: State, District, Zone, Gross sales, Discounts, etc.
        </p>
      </Dragger>
      {meta && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loaded: {meta.fileName} — {meta.totalRows.toLocaleString()} rows
        </p>
      )}
    </div>
  );
}
