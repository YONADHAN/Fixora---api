



import path from 'path'
import fs from "fs"
import {createLogger, format } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"


const logDir = path.join(process.cwd(), "logs/error")

if(!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir,{recursive: true})
}

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "50d",
      zippedArchive: true
    })
  ]
})

export default logger