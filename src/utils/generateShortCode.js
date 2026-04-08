import crypto from "crypto";

const generateShortCode = () => {
    return crypto.randomBytes(4).toString("hex");
};

export default generateShortCode;