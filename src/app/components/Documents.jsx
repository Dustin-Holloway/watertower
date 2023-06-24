"use client";

import { Card, Typography, Modal } from "@material-tailwind/react";
import PDFViewer from "./PdfViewer";
import { useState } from "react";

const TABLE_HEAD = ["Name", "Job", "Employed", ""];

const TABLE_ROWS = [
  {
    name: (
      <a href="pdf/19.Machinery's handbook.pdf" download>
        Machinery Handbook.pdf
      </a>
    ),
    job: "Meeting Minuts",
    date: "23/04/18",
  },
  {
    name: "Alexa Liras",
    job: "Developer",
    date: "23/04/18",
  },
  {
    name: "Laurent Perrier",
    job: "Executive",
    date: "19/09/17",
  },
  {
    name: "Michael Levi",
    job: "Developer",
    date: "24/12/08",
  },
  {
    name: "Richard Gran",
    job: "Manager",
    date: "04/10/21",
  },
];

export default function DocsTable() {
  const [pdfViewer, displayPdfViewer] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const handlePdfViewerOpen = () => {
    setPdfViewerOpen(true);
  };

  const handlePdfViewerClose = () => {
    setPdfViewerOpen(false);
  };

  return (
    <Card className="overflow-scroll h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(({ name, job, date }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    href="/pdf/19.Machinery's_handbook.pdf"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {job}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {date}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue"
                    className="font-medium"
                    onClick={() => setPdfViewerOpen(true)}
                  >
                    Edit
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pdfViewerOpen && (
        <div className="fixed w-full rounded-lg inset-0 z-50 flex items-center justify-center">
          <div className="fixed w-full rouned-lg inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg w-1/2 h-full z-10 p-2">
            <div className="flex justify-between w-fullitems-center mb-4">
              <Typography type="heading-5">PDF Viewer</Typography>
              <button
                className="btn btn-primary"
                onClick={handlePdfViewerClose}
              >
                Close
              </button>
            </div>
            <PDFViewer url="/pdf/19.Machinery's handbook.pdf" />
          </div>
        </div>
      )}
    </Card>
  );
}
