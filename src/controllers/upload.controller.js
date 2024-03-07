import {client} from '../db/postgresDB.js'

const uploadFile = async (req,res) => {
    const image = req.file
    if(!image) return res.status(400).json({message: 'No image provided'})

    res.status(200).json({message: 'Image uploaded successfully', image})
}


export {uploadFile}