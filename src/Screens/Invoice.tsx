import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/* ===================== TYPES ===================== */

interface Product {
  name: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
}

/* ===================== UTILS ===================== */

function numberToWords(num: number) {
  return `${num.toFixed(2).toUpperCase()} ONLY`;
}

/* ===================== COMPONENT ===================== */

export default function InvoicePage() {
  const pdfRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    transportMode: "ROAD",
    vehicleNumber: "",
    supplyDate: "",
    deliveryPlace: "",
    billedTo: "",
    shippedTo: "",
    gstin: "",
    state: "",
    productName: "",
    hsn: "",
    quantity: 0,
    unit: "NOS",
    rate: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [generate, setGenerate] = useState(false);

  /* ===================== HANDLERS ===================== */

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: formData.productName,
        hsn: formData.hsn,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        rate: Number(formData.rate),
      },
    ]);

    setFormData({
      ...formData,
      productName: "",
      hsn: "",
      quantity: 0,
      rate: 0,
    });
  };

  const subtotal = products.reduce((s, p) => s + p.quantity * p.rate, 0);
  const sgst = subtotal * 0.09;
  const cgst = subtotal * 0.09;
  const igst = 0;
  const roundOff = 0;
  const total = subtotal + sgst + cgst + igst + roundOff;

  /* ===================== PDF ===================== */

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save(`${formData.billedTo}-invoice.pdf`);
  };

  /* ===================== UI ===================== */

  return (
    <div className="p-6">
      <h2 className="font-bold text-lg mb-3">Create Invoice</h2>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input name="invoiceNumber" placeholder="Invoice No" onChange={handleChange} className="border p-2" />
        <input name="invoiceDate" type="date" onChange={handleChange} className="border p-2" />
        <input name="vehicleNumber" placeholder="Vehicle Number" onChange={handleChange} className="border p-2" />
        <input name="supplyDate" type="date" onChange={handleChange} className="border p-2" />
        <input name="deliveryPlace" placeholder="Delivery Place" onChange={handleChange} className="border p-2" />
        <input name="billedTo" placeholder="Billed To" onChange={handleChange} className="border p-2" />
        <input name="shippedTo" placeholder="Shipped To" onChange={handleChange} className="border p-2" />
        <input name="gstin" placeholder="GSTIN" onChange={handleChange} className="border p-2" />
        <input name="state" placeholder="State" onChange={handleChange} className="border p-2" />
      </div>

      {/* PRODUCT */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        <input name="productName" placeholder="Product" value={formData.productName} onChange={handleChange} className="border p-2 col-span-2" />
        <input name="hsn" placeholder="HSN" value={formData.hsn} onChange={handleChange} className="border p-2" />
        <input name="quantity" type="number" placeholder="Qty" value={formData.quantity} onChange={handleChange} className="border p-2" />
        <input name="rate" type="number" placeholder="Rate" value={formData.rate} onChange={handleChange} className="border p-2" />
      </div>

      <button onClick={addProduct} className="bg-orange-600 text-white px-4 py-1 rounded">
        Add Product
      </button>

      <button onClick={() => setGenerate(true)} className="ml-3 bg-green-600 text-white px-4 py-1 rounded">
        Generate Invoice
      </button>

      {/* ===================== PDF TEMPLATE ===================== */}

      {generate && (
        <>
          <div
            ref={pdfRef}
            style={{
              width: "210mm",
              padding: "10mm",
              fontSize: "11px",
              fontFamily: "Arial",
              background: "#fff",
              position: "absolute",
              left: "-9999px",
            }}
          >
            {/* HEADER */}
            <div style={{ textAlign: "center", border: "1px solid black", padding: 6 }}>
              <b>M.ASWATH HOLLOW BRICKS & LORRY SERVICES</b><br />
              8/3157 ANDITHOTTAM, PANDIAN NAGAR, TIRUPUR - 641602<br />
              Phone: 9843083521, 9842048181<br />
              GSTIN: 33CPWPB5671P1Z4
            </div>

            <h3 style={{ textAlign: "center", margin: "6px 0" }}>T A X &nbsp; I N V O I C E</h3>

            {/* INVOICE DETAILS */}
            <table width="100%" border={1} cellPadding={4}>
              <tbody>
                <tr>
                  <td>Invoice No : {formData.invoiceNumber}</td>
                  <td>Date : {formData.invoiceDate}</td>
                </tr>
                <tr>
                  <td>Transport Mode : ROAD</td>
                  <td>Vehicle Number : {formData.vehicleNumber}</td>
                </tr>
                <tr>
                  <td>Date Of Supply : {formData.supplyDate}</td>
                  <td>Delivery Place : {formData.deliveryPlace}</td>
                </tr>
              </tbody>
            </table>

            {/* PARTY */}
            <table width="100%" border={1} cellPadding={5}>
              <tbody>
                <tr>
                  <td width="50%">
                    <b>Billed To</b><br />
                    {formData.billedTo}<br />
                    GSTIN : {formData.gstin}<br />
                    State : {formData.state}
                  </td>
                  <td width="50%">
                    <b>Shipped To</b><br />
                    {formData.shippedTo}<br />
                    GSTIN : {formData.gstin}<br />
                    State : {formData.state}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PRODUCTS */}
            <table width="100%" border={1} cellPadding={4}>
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Product Details</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      {p.name}<br />
                      <small>HSN : {p.hsn}</small>
                    </td>
                    <td>{p.quantity}</td>
                    <td>{p.unit}</td>
                    <td>{p.rate.toFixed(2)}</td>
                    <td>{(p.quantity * p.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS */}
            <table width="100%" border={1} cellPadding={4}>
              <tbody>
                <tr><td>SGST 9%</td><td>{sgst.toFixed(2)}</td></tr>
                <tr><td>CGST 9%</td><td>{cgst.toFixed(2)}</td></tr>
                <tr><td>IGST</td><td>{igst.toFixed(2)}</td></tr>
                <tr><td>Round Off</td><td>{roundOff.toFixed(2)}</td></tr>
                <tr><td><b>T O T A L</b></td><td><b>{total.toFixed(2)}</b></td></tr>
              </tbody>
            </table>

            <p><b>In Words :</b> {numberToWords(total)}</p>

            {/* FOOTER */}
            <table width="100%" border={1} cellPadding={6}>
              <tbody>
                <tr>
                  <td>
                    BANK NAME : ICICI BANK, TIRUPUR<br />
                    ACCOUNT NO : 253805004311<br />
                    IFSC CODE : ICIC0002538
                  </td>
                  <td align="right">
                    For M.ASWATH HOLLOW BRICKS & LORRY SERVICES<br /><br />
                    Authorised Signature
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button onClick={downloadPDF} className="bg-orange-600 text-white px-4 py-2 mt-4 rounded">
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}
