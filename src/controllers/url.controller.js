import prisma from "../config/db.js";
import generateShortCode from "../utils/generateShortCode.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import validator from "validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import redis from "../config/redis.js";


const shortenUrl = asyncHandler(async (req, res) => {
    const { url } = req.body;

 if (!url) {
    throw new ApiError(400, "URL is required");
}
 if (!validator.isURL(url , { require_protocol: true })) {
    throw new ApiError(400, "Invalid URL format");
}
 const existingUrl = await prisma.url.findFirst({
    where: {
        longUrl: url
    }
});
    if (existingUrl) {
        return res.status(200).json(
            new ApiResponse(200, "URL already exists", existingUrl)
        );
    }


    let shortCode;
    let existingCode;
do {
    shortCode = generateShortCode();
    existingCode = await prisma.url.findUnique({
        where: {
            shortCode
        }    });
} while (existingCode);


    const newUrl = await prisma.url.create({
        data: {
            shortCode,
            longUrl: url
        }
    });

    return res.status(201).json(
        new ApiResponse(201, "Short URL created", newUrl)
    );
});

const redirectUrl = asyncHandler(async (req, res) => {

    const { shortCode } = req.params;

    const cachedUrl = await redis.get(shortCode);

    if (cachedUrl) {
        return res.redirect(cachedUrl);
    }

    const url = await prisma.url.findUnique({
        where: {
            shortCode
        }
    });

    if (!url) {
        throw new ApiError(404, "URL not found");
    }
     await redis.set(shortCode, url.longUrl, "EX", 3600);

    return res.redirect(url.longUrl);
});

export { shortenUrl, redirectUrl };