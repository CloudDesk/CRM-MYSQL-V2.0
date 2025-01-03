import * as ExcelJS from "exceljs";

export const generateExcelDownload = (data, filename) => {
  if (!data || !data.length) {
    console.warn("No data available for export");
    return;
  }

  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Sheet1");

    // Add metadata
    wb.creator = "Your App Name";
    wb.created = new Date();
    wb.modified = new Date();

    // Add headers to worksheet
    const headers = Object.keys(data[0]);
    ws.addRow(headers);

    // Add data to worksheet
    data.forEach((row) => {
      const rowValues = Object.values(row);
      ws.addRow(rowValues);
    });

    // Save workbook to file
    return wb.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
  }
};
