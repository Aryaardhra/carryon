import crypto from "crypto";

const generateSku = (productName, color, size) => {

  const productCode = productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();

  const colorCode = color
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();

  const random = crypto.randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `${productCode}-${colorCode}-${size}-${random}`;
};

export default generateSku;