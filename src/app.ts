import 'reflect-metadata'
import { ExpressServer } from './presentation/http/server'
import { createServer } from 'http'
import { config } from './shared/config'
import chalk from 'chalk'
import { MongoConnect } from './interfaceAdapters/database/mongoDb/mongoConnect'
import { startBookingHoldExpiryScheduler } from './interfaceAdapters/shedulers/booking_hold_expiry.sheduler'

async function startApp() {
  const expressServer = new ExpressServer()
  const mongoConnect = new MongoConnect()

  try {
    console.log(
      chalk.greenBright('-------------------------------------------\n')
    )
    await mongoConnect.connectDB()
    const httpServer = createServer(expressServer.getApp())

    httpServer.listen(config.server.PORT, () => {
      console.log(
        chalk.yellowBright.bold(
          `🚀 Server running at ${chalk.blueBright(
            `http://localhost:${config.server.PORT}`
          )}`
        )
      )
      console.log(
        chalk.greenBright('\n-------------------------------------------\n')
      )
      startBookingHoldExpiryScheduler()
    })
  } catch (error) {
    console.error(chalk.redBright.bold(' Failed to start server'), error)
  }
}

startApp()
