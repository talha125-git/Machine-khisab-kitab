import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getKitabStats, formatDate, formatPKR, getDayName } from './storage';

export function generateKitabPDF(kitab) {
  const doc = new jsPDF();

  const stats = getKitabStats(kitab);
  const now = new Date();
  const timestamp = now.toLocaleString();

  // Colors
  const headerColor = [22, 101, 52]; // Tailwind ledger-800 approx

  // Title
  doc.setFontSize(22);
  doc.setTextColor(...headerColor);
  doc.text('Khisab Kitab Report', 14, 22);

  // Kitab Details
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Title: ${kitab.title}`, 14, 32);

  // Summary Stats
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Days Completed: ${stats.daysCompleted} / 15`, 14, 40);

  // Table Data
  const tableColumn = ["Day", "Date", "Income (PKR)"];
  const tableRows = [];

  kitab.days.forEach(day => {
    // Only include saved days
    if (day.saved) {
      const dayName = getDayName(day.date);
      const dateStr = `${formatDate(day.date)} (${dayName})`;

      const rowData = [
        `Day ${day.dayNumber}`,
        dateStr,
        day.income ? formatPKR(parseFloat(day.income)) : '-'
      ];

      tableRows.push(rowData);
    }
  });

  if (tableRows.length === 0) {
    tableRows.push(["-", "No data entered yet", "-"]);
  }

  // Draw Table
  autoTable(doc, {
    startY: 48,
    head: [tableColumn],
    body: tableRows,
    foot: [
      ["Total", "", formatPKR(stats.totalIncome)]
    ],
    theme: 'grid',
    headStyles: { fillColor: headerColor, textColor: 255 },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 4 },
    alternateRowStyles: { fillColor: [245, 250, 245] },
  });

  // Add generated on at the bottom footer of the last page
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${timestamp}`, 14, pageHeight - 10);

  // Save the PDF
  const filename = `${kitab.title.replace(/[^a-zA-Z0-9 -]/g, '')}_Report.pdf`;
  doc.save(filename);
}
