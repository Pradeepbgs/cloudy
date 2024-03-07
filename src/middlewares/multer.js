import {v4 as uuid} from 'uuid'
import path from 'path'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueName = uuid()
      cb(null,  uniqueName+path.extname(file.originalname))
    }
  })
  
  const upload = multer({  storage })

  export {upload}