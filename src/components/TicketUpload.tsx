"use client";

import { useCallback, useRef, useState } from "react";
import JSZip from "jszip";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";

type Verified = { storagePath: string; qrMessage: string; fileType: "pdf" | "pkpass" };

export default function TicketUpload({ eventId, onVerified }: { eventId: string; onVerified: (v: Verified) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");

  const scanPdf = useCallback(async (file: File) => {
    const { GlobalWorkerOptions, getDocument } = await import("pdfjs-dist/legacy/build/pdf");
    GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

    const buf = await file.arrayBuffer();
    const pdf = await getDocument({ data: buf }).promise;

    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE, BarcodeFormat.PDF_417, BarcodeFormat.AZTEC, BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.EAN_13, BarcodeFormat.ITF
    ]);

    const reader = new BrowserMultiFormatReader(hints);
    const scales = [2,3,4,5];
    const maxPages = Math.min(pdf.numPages, 8);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      for (let s = 0; s < scales.length; s++) {
        const viewport = page.getViewport({ scale: scales[s] });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d"); if (!ctx) continue;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;

        setStatus(`Scanning page ${pageNum}/${maxPages} @x${scales[s]}`);
        setProgress(5 + Math.floor(((pageNum - 1) * scales.length + s + 1) / (maxPages * scales.length) * 65));

        try {
          const result = await reader.decodeFromCanvas(canvas);
          if (result?.getText()) return result.getText();
        } catch { /* continue */ }
      }
    }
    throw new Error("No barcode found in PDF");
  }, []);

  const readPkpass = useCallback(async (file: File) => {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const passJsonStr = await zip.file("pass.json")?.async("string");
    if (!passJsonStr) throw new Error("Invalid pkpass (missing pass.json)");
    const pass = JSON.parse(passJsonStr);
    const msg = pass?.barcodes?.[0]?.message ?? pass?.barcode?.message ?? pass?.message ?? null;
    if (!msg) throw new Error("No barcode message in pass.json");
    return msg as string;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setStatus("Analyzing file..."); setProgress(3);

    const isPdf = /pdf$/i.test(file.type) || /\.pdf$/i.test(file.name);
    const isPkpass = /pkpass$/i.test(file.type) || /\.pkpass$/i.test(file.name);

    let qrMessage = "";
    if (isPdf) qrMessage = await scanPdf(file);
    else if (isPkpass) qrMessage = await readPkpass(file);
    else throw new Error("Unsupported file (use PDF or PKPASS)");

    setStatus("Requesting upload URL..."); setProgress(70);
    const ext = isPdf ? "pdf" : "pkpass";
    const signRes = await fetch("/api/uploads/r2/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, ext, contentType: file.type || (isPdf ? "application/pdf" : "application/vnd.apple.pkpass") })
    });
    if (!signRes.ok) throw new Error("Sign failed");
    const { url, key } = await signRes.json();

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const pct = 70 + Math.round((ev.loaded / ev.total) * 30);
          setProgress(Math.min(100, pct)); setStatus("Uploading...");
        }
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
      xhr.onerror = () => reject(new Error("Upload network error"));
      xhr.send(file);
    });

    onVerified({ storagePath: key, qrMessage, fileType: isPdf ? "pdf" : "pkpass" });
  }, [eventId, readPkpass, scanPdf, onVerified]);

  return (
    <div className="border rounded p-4">
      <div className="font-medium mb-2">Upload your ticket (PDF or PKPASS)</div>
      <input ref={fileRef} type="file" accept=".pdf,.pkpass,application/pdf,application/vnd.apple.pkpass"
             onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }} />
      {progress > 0 && (
        <div className="mt-4">
          <div className="h-2 bg-neutral-200 rounded"><div className="h-full bg-blue-600 rounded" style={{ width: `${progress}%` }} /></div>
          <div className="text-xs text-neutral-600 mt-1">{status} ({progress}%)</div>
        </div>
      )}
    </div>
  );
}