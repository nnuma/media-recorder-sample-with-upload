import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { UPLOAD_DIR } from '../../config'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
  })
  form.parse(req, (err) => {
    if (err) {
      console.log(err)
    }
  })
  res.status(200).json({})
}
