import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QRCode from "qrcode"; 

const PartyPass = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fetch the student details by ID from the backend
    const fetchStudent = async () => {
      const response = await fetch(`http://localhost:5001/api/v1/students/details/${studentId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await response.json();
      if (data.statusCode === 200) {
        setStudent(data.data);
        setLoading(false);
      } else {
        toast.error(data.message || "Failed to fetch student details.");
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleGeneratePass = async () => {
    if (!student) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 1000;

    // Load and draw the background image
    const bgImage = new Image();
    bgImage.src = "../../public/pass.jpg"; // Replace with your actual image path
    bgImage.onload = async () => {
      const imageAspectRatio = bgImage.width / bgImage.height; // Aspect ratio of your image
      const canvasAspectRatio = canvas.width / canvas.height; // Aspect ratio of canvas

      let drawWidth, drawHeight, drawX, drawY;

      if (imageAspectRatio > canvasAspectRatio) {
        // The image is wider than the canvas (horizontal)
        drawWidth = canvas.width;  // Set the width of the image to fit the canvas
        drawHeight = bgImage.height * (drawWidth / bgImage.width);  // Calculate the height to maintain aspect ratio
        drawX = 0;  // Center horizontally
        drawY = (canvas.height - drawHeight) / 2;  // Center vertically
      } else {
        // The image is taller than the canvas (vertical, though not expected here)
        drawHeight = canvas.height;
        drawWidth = bgImage.width * (drawHeight / bgImage.height);
        drawX = (canvas.width - drawWidth) / 2; // Center horizontally
        drawY = 0;
      }

      // Draw the image on the canvas
      ctx.drawImage(bgImage, drawX, drawY, drawWidth, drawHeight);

      // Set text styles and add student details in golden color and bold
      ctx.fillStyle = "gold";
      ctx.font = "bold 30px Arial";

      // Move text upwards
      ctx.fillText(`Name: ${student.name}`, 50, 600); // Higher on canvas
      ctx.fillText(`Roll No: ${student.rollNo}`, 50, 650); // Higher on canvas
      ctx.fillText(`Session: ${student.session}`, 50, 700); // Higher on canvas

      // Generate QR Code with student details (including name, rollNo, session)
      const qrData = JSON.stringify({
        name: student.name,
        email: student.email,
        session: student.session,
        rollNo: student.rollNo,
      });

      // Generate QR code image from the student details
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      const qrCodeImage = new Image();
      qrCodeImage.src = qrCodeUrl;

      // Draw the QR code on the canvas
      qrCodeImage.onload = () => {
        // Move QR code upwards
        const qrX = 600;
        const qrY = 550; // Position QR code higher
        ctx.drawImage(qrCodeImage, qrX, qrY, 150, 150); // Positioning QR code on the canvas

        // Allow the user to download the pass
        const link = document.createElement("a");
        link.download = "party-pass.png";
        link.href = canvas.toDataURL();
        link.textContent = "Download Pass";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-400">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl text-center text-gray-800 font-bold mb-8">Party Pass</h2>

        {loading ? (
          <p>Loading student details...</p>
        ) : (
          student && (
            <div className="space-y-6">
              <p className="text-lg font-semibold">Student: {student.name}</p>
              <p>Email: {student.email}</p>
              <p>Session: {student.session}</p>
              <p>Roll Number: {student.rollNo}</p>

              <canvas ref={canvasRef} className="hidden"></canvas>

              <button
                onClick={handleGeneratePass}
                className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
              >
                Generate Pass
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PartyPass;
