import { client } from "../db/postgresDB.js";
import fs from 'fs'

const uploadFile = async (req, res) => {
  const  user  = req.user;
  const file = req.file;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!file) {
    return res.status(400).json({ message: "No image provided" });
  }

  try {
    const query = `
        INSERT INTO file (user_id, filename, filetype, filesize)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;
    const value = [user.id, file.filename, file.mimetype, file.size];
    const result = await client.query(query, value);

    if (!result) {
      fs.unlinkSync(file.path)
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      file: result.rows[0],
    });
  } catch (error) {
    fs.unlinkSync(file.path)
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { uploadFile };
