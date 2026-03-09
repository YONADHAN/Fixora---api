import fs from "fs"
import path from "path"
import { createStream } from "rotating-file-stream"

const accessLogDir = path.join(process.cwd(), "logs/access")

if (!fs.existsSync(accessLogDir)) {
  fs.mkdirSync(accessLogDir, { recursive: true })
}

export const accessLogStream = createStream(
  (time) => {

    const currentTime =
      !time || time === 0 ? new Date() : new Date(time)

    const date = currentTime
      .toISOString()
      .split("T")[0]

    return `access-${date}.log`
  },
  {
    interval: "1d",
    path: accessLogDir,
    maxFiles: 30,
    compress: "gzip"
  }
)