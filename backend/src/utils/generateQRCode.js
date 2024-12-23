import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
  try {
    // Convert data object to JSON string
    const jsonData = JSON.stringify(data);
    // Generate QR code
    const qrCode = await QRCode.toDataURL(jsonData);  // Generates QR code as a data URL
    return qrCode;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
