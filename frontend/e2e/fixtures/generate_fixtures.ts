import PDFDocument from "pdfkit";
import * as path from "path";
import * as fs from "fs";

const outputDir = path.resolve(__dirname);
const outputPath = path.join(outputDir, "sample_contract.pdf");

function generatePdf() {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Title
  doc.fontSize(20).text("CONSTRUCTION CONTRACT", { align: "center" });
  doc.moveDown();

  // Subtitle
  doc.fontSize(12).text("Agreement for Residential Building Works", { align: "center" });
  doc.moveDown(2);

  // Parties
  doc.fontSize(11).text("BETWEEN:");
  doc.text("ABC Construction Ltd. (hereinafter referred to as the 'Contractor')");
  doc.text("and");
  doc.text("John Smith (hereinafter referred to as the 'Client')");
  doc.moveDown();

  // Scope
  doc.fontSize(13).text("1. SCOPE OF WORK");
  doc.fontSize(11).text(
    "The Contractor agrees to perform all necessary construction work for the residential building project located at 123 Main Street, Springfield. This includes foundation work, framing, roofing, electrical installation, plumbing, and finishing work as specified in the attached plans and specifications."
  );
  doc.moveDown();

  // Timeline
  doc.fontSize(13).text("2. PROJECT TIMELINE");
  doc.fontSize(11).text(
    "Work shall commence on July 1, 2026 and shall be completed no later than December 31, 2026. Delays caused by weather conditions or force majeure events may extend the completion date upon written agreement by both parties."
  );
  doc.moveDown();

  // Payment
  doc.fontSize(13).text("3. PAYMENT TERMS");
  doc.fontSize(11).text(
    "The total contract price is $250,000 USD, payable in installments: 25% upon signing, 25% upon completion of foundation, 25% upon framing completion, and the remaining 25% upon final inspection and acceptance."
  );
  doc.moveDown();

  // Liability
  doc.fontSize(13).text("4. LIABILITY AND INSURANCE");
  doc.fontSize(11).text(
    "The Contractor shall maintain general liability insurance of no less than $1,000,000 per occurrence. The Contractor shall indemnify and hold harmless the Client from any claims arising from negligence in the performance of the work."
  );
  doc.moveDown();

  // Termination
  doc.fontSize(13).text("5. TERMINATION");
  doc.fontSize(11).text(
    "Either party may terminate this agreement with 30 days written notice. In the event of termination, the Contractor shall be compensated for all work completed to date."
  );
  doc.moveDown();

  // Dispute resolution
  doc.fontSize(13).text("6. DISPUTE RESOLUTION");
  doc.fontSize(11).text(
    "Any disputes arising from this agreement shall first be submitted to mediation. If mediation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association."
  );
  doc.moveDown();

  // Signature block
  doc.moveDown(2);
  doc.text("Contractor: ___________________________ Date: ___________");
  doc.text("ABC Construction Ltd.");
  doc.moveDown();
  doc.text("Client: ___________________________ Date: ___________");
  doc.text("John Smith");

  doc.end();

  return new Promise<void>((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

generatePdf()
  .then(() => {
    console.log(`PDF generated at: ${outputPath}`);
  })
  .catch((err) => {
    console.error("Failed to generate PDF:", err);
    process.exit(1);
  });
