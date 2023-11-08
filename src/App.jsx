import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./components/PdfDisplay";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
function App() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allfile, setallfile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [originalPdf, setOriginalPdf] = useState("");
  const base = "http://localhost:5000";

  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await axios.get(`${base}/get-files`);
    console.log(result);
    setallfile(result.data.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    const result = await axios.post(`${base}/upload-files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (result.data.status === "ok") {
      alert("Pdf Uploaded...");
      getPdf();
    }
  };
  const showPdf = (pdf, id) => {
    setPdfFile(`${base}/files/${pdf}`);
    setOriginalPdf(pdf);
  };
  return (
    <div className="App">
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Upload Pdf || MERN APP</h4>

        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          class="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button class="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allfile == null
            ? ""
            : allfile.map((data, i) => {
                return (
                  <div key={i} className="inner-div">
                    <h6>Title: {data.title}</h6>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.pdf, data._id)}
                    >
                      Show Pdf
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
      <PdfComp pdfFile={pdfFile} baseUrl={base} originalPdf={originalPdf} />
    </div>
  );
}
export default App;
