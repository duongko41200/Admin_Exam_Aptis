import redis from "../lib/redis.config.js";

class redisDataFactory {
  static create = async ({ hash, field, value }) => {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await redis.hSet(hash, field, stringValue);
      return {
        message: "Created or overwritten",
        hash,
        field,
        value,
      };
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };
  static getAllWithQuery = async ({ hash, field }) => {
    try {
      if (field) {
        const raw = await redis.hGet(hash, field);
        let value;
        try {
          value = raw !== null ? JSON.parse(raw) : null;
        } catch {
          value = raw;
        }
        return res.json({ hash, field, value });
      } else {
        const rawObject = await redis.hGetAll(hash);
        const parsedObject = {};

        for (const key in rawObject) {
          try {
            parsedObject[key] =
              typeof rawObject[key] === "string"
                ? JSON.parse(rawObject[key])
                : rawObject[key];
          } catch {
            parsedObject[key] = rawObject[key];
          }
        }

        return { hash, values: parsedObject };
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static update = async ({ hash, field, value }) => {
    // Nếu muốn chỉ update khi field tồn tại:
    // const exists = await redis.hExists(hash, field);
    // if (!exists) {
    //   return res.status(404).json({
    //     error: 'Field does not exist, cannot update',
    //   });
    // }

    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await redis.hSet(hash, field, stringValue);

    return {
      message: "Created or overwritten",
      hash,
      field,
      value,
    };
  };

  static delete = async ({ hash, field }) => {
    const result = await redis.hDel(hash, field);
    return {
      message: result ? "Deleted" : "Field not found",
      hash,
      field,
    };
  };
}

export default redisDataFactory;
