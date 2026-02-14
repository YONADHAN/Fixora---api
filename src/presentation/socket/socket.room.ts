import { Socket } from 'socket.io'

export const registerRooms = (socket: Socket) => {
  const { user } = socket.data

  if (!user?.userId) return

  socket.join(`user:${user.userId}`)
  socket.join(`role:${user.role}`)

  console.log(
    `Socket ${socket.id} joined rooms: user:${user.userId}, role:${user.role}`
  )
}
