import { useRef } from "react";

const Pdf = ({ item }: { item: any }) => {
  const printRef = useRef<HTMLDivElement>(null);

  function parseRules(ruleString: string): string[] {
    return ruleString
      .split("-")
      .map((rule) => rule.trim())
      .filter((rule) => rule.length > 0);
  }

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>RegistrationForm-RESO2025</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  display: flex;
                  justify-content: center;
                  background-color: #f8fafc;
                  position: relative;
                }
                .print-container {
                  width: 700px;
                  max-width: 100%;
                  background-color: white;
                  padding: 30px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  position: relative;
                  z-index: 1;
                  overflow: hidden;
                }
                .watermark {
                  position: absolute;
                  opacity: 0.1;
                  font-size: 80px;
                  color: #3b82f6;
                  transform: rotate(-45deg);
                  z-index: 0;
                  pointer-events: none;
                  white-space: nowrap;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                }
                h2, h3 {
                  color: #1e40af;
                  text-align: center;
                  margin: 20px 0 10px;
                }
                h2 {
                  font-size: 24px;
                  font-weight: 700;
                }
                h3 {
                  font-size: 18px;
                  font-weight: 600;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                  table-layout: fixed;
                }
                th, td {
                  border: 1px solid #e2e8f0;
                  padding: 10px;
                  text-align: left;
                  word-wrap: break-word;
                }
                th {
                  background-color: #f1f5f9;
                  color: #1e293b;
                  font-weight: 600;
                  width: 30%;
                }
                ul {
                  padding-left: 20px;
                }
                hr {
                  margin: 20px 0;
                  border: 0;
                  border-top: 1px solid #e2e8f0;
                }
                strong {
                  color: #1e293b;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .print-container {
                    box-shadow: none;
                    padding: 0;
                    width: 100%;
                  }
                }
              </style>
            </head>
            <body>
              <div class="watermark">RESO 2025</div>
              <div class="print-container">
                ${printContent.innerHTML}
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() {
                      window.close();
                    }, 100);
                  }, 200);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const ruleText = item?.event?.description || item?.event?.description || "";
  const rules = parseRules(ruleText);
  const players = item.team?.players
    ? typeof item.team.players === "string"
      ? JSON.parse(item.team.players)
      : item.team.players
    : [];

  return (
    <div className="border p-6 m-6 rounded-2xl bg-white text-gray-800 shadow-md print:shadow-none max-w-4xl mx-auto">
      <div ref={printRef} className="w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
          Event Registration
        </h2>

        <div className="mb-6 space-y-2">
          <p className="break-words">
            <strong>Event:</strong> {item.event.event.toUpperCase()}
          </p>
          <p>
            <strong>Date of Registration:</strong>{" "}
            {new Date(item.createdAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }) || "No date"}
          </p>
          <p>
            <strong>Fee:</strong> ₹{item.event.fee}
          </p>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm mb-6">
            <tbody>
              {[
                ["Register Name", item.name],
                ["Email", item.user.email],
                ["Contact", item.contact],
                ["Address", item.address],
                ["Payment ID", item.transactionId],
                ["Bank", item.bankingName],
                ["Payment Status", item.approved ? "Approved" : "Pending"],
              ].map(([label, value], idx) => (
                <tr key={idx}>
                  <th className="border px-4 py-2 bg-gray-50 text-left font-medium w-1/3 text-gray-700">
                    {label}
                  </th>
                  <td className="border px-4 py-2 break-words">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {players?.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Team: {item.team.teamName}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-sm mb-6">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-gray-50 text-left text-gray-700 w-1/4">
                      Name
                    </th>
                    <th className="border px-4 py-2 bg-gray-50 text-left text-gray-700 w-1/4">
                      Game ID
                    </th>
                    <th className="border px-4 py-2 bg-gray-50 text-left text-gray-700 w-1/4">
                      Gender
                    </th>
                    <th className="border px-4 py-2 bg-gray-50 text-left text-gray-700 w-1/4">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border px-4 py-2 break-words">{player.name}</td>
                      <td className="border px-4 py-2 break-words">{player.gameId}</td>
                      <td className="border px-4 py-2 break-words">{player.gender}</td>
                      <td className="border px-4 py-2 break-words">
                        {player.teamLeader ? "Leader" : "Member"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {rules.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Event Rules
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              {rules.map((rule, index) => (
                <li key={index} className="break-words">{rule}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Print / Download
        </button>
      </div>
    </div>
  );
};

export default Pdf;