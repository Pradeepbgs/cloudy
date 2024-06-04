import { client } from "../db/postgresDB.js";
import fs from 'fs';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const uploadFile = async (req, res) => {
  const user = req.user;
  const file = req.file;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!file) {
    return res.status(400).json({ message: "No image provided" });
  }

  try {
    const storageRef = ref(storage, `images/${file.originalname}`);
    const fileBuffer = fs.readFileSync(file.path);
    const metadata = {
      contentType: file.mimetype,
    };

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed", error);
        return res.status(500).json({ message: "Internal server error" });
      },
      async () => {
        // Handle successful uploads on complete
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        try {
          // Insert file metadata into PostgreSQL database
          const query = `
            INSERT INTO file (user_id, filename, filetype, filesize, url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
          `;
          const values = [user.id, file.originalname, file.mimetype, file.size, downloadURL];
          const result = await client.query(query, values);

          // Remove local file after upload
          fs.unlinkSync(file.path);

          if (!result) {
            return res.status(500).json({ message: "Internal server error" });
          }

          return res.status(200).json({
            message: "File uploaded successfully",
            file: result.rows[0],
          });
        } catch (error) {
          fs.unlinkSync(file.path);
          console.error("Error uploading file metadata to DB:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    );
  } catch (error) {
    fs.unlinkSync(file.path);
    console.error("Error uploading file to Firebase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { uploadFile };
