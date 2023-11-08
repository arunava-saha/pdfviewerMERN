import { useState } from "react";
import { Document, Page } from "react-pdf";
import axios from "axios";
const PdfDisplay = (props) => {
  const [numPages, setNumPages] = useState();
  const [selectedPages, setSelectedPages] = useState([]);
  let pageNumber = 1;
  const base = props.baseUrl;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const download = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = pdfUrl.split("/", 5)[4]; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handlePageSelection = (pageNumber) => {
    setSelectedPages((prevSelectedPages) => {
      if (prevSelectedPages.includes(pageNumber)) {
        // return prevSelectedPages.filter((page) => page !== pageNumber);
        return;
      }
      return [...prevSelectedPages, pageNumber];
    });
  };
  const generatePdf = async (e) => {
    const requestData = {
      selectedPages: selectedPages.sort(),
      originalPdf: props.originalPdf,
    };
    console.log(props.originalPdf);
    console.log(requestData);
    const result = await axios.post(`${base}/generate-pdf`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    console.log("reault-one: - ", result);
    if (result.statusText === "OK") {
      alert("Pdf Generated...");

      const url = result.data.filePath.substring(1);
      window.open(base + url);
    }
    setSelectedPages([]);
  };

  return (
    <div className="pdf-div">
      <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        <button
          className="btn btn-primary"
          onClick={() => download(props.pdfFile)}
        >
          download
        </button>
        <button className="btn ml-10 btn-primary" onClick={generatePdf}>
          Generate Pdf
        </button>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page, i) => {
            return (
              <div key={i}>
                <hr />
                <input
                  type="button"
                  value="Add pdf"
                  onClick={() => handlePageSelection(i + 1)}
                />
                <p>
                  Page {pageNumber++} of {numPages}
                </p>
                <Page
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                <hr />
              </div>
            );
          })}
      </Document>
    </div>
  );
};

export default PdfDisplay;
