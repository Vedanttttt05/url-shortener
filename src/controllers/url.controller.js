import prisma from "../config/db.js";
import generateShortCode from "../utils/generateShortCode.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redis from "../config/redis.js";
const shortenUrl = asyncHandler(async (req, res) => {
    const { url } = req.body;

    if (!url) {
        throw new Error("URL is required");
    }

    const shortCode = generateShortCode();

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
     await redis.set(shortCode, url.longUrl);

    return res.redirect(url.longUrl);
});

export { shortenUrl, redirectUrl };