import redis from "../configs/redis.js";

export const clearProductCache = async(category) => {
    const categoryId = category?._id || category;
    await Promise.all([
    redis.del("products"),
    redis.del("featured-products"),
    redis.del("latest-products"),
    redis.del("best-sellers"),
    redis.del(`category:${categoryId}`)
]);
}