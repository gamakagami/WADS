import Ticket from '../models/ticket.model.js';
import PDFDocument from 'pdfkit';

export const exportTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.pdf');
    doc.pipe(res);

    tickets.forEach(ticket => {
      doc.text(`Title: ${ticket.title}`);
      doc.text(`Description: ${ticket.description}`);
      doc.text('---');
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};


// tambah yang lain nanti, tunggu selesai semua