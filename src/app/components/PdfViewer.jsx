import { useEffect } from "react";
import PDFObject from "pdfobject";

const PDFViewer = ({ url }) => {
  useEffect(() => {
    PDFObject.embed(url, "#pdf-container");
  }, [url]);

  return <div className="w-full h-full rounded-lg" id="pdf-container" />;
};

export default PDFViewer;
