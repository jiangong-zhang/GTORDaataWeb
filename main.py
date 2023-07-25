import asyncio
import json
import subprocess
from serial.tools import list_ports
from websockets.server import serve, WebSocketServerProtocol

input_mode = None


def create_message():
  ports = [port.device for port in list_ports.comports()]
  ports.sort()
  msg = { 'ports': ports }
  return msg


def create_init_message():
  msg = create_message()
  msg['init'] = True
  if input_mode:
    msg['inputMode'] = input_mode
  return msg


def read_message(msg):
  global input_mode

  data: dict = json.loads(msg)
  input_mode = data.get('inputMode', None)


async def handler(websocket: WebSocketServerProtocol):
  await websocket.send(json.dumps(create_init_message()))

  async for message in websocket:
    read_message(message)
    await asyncio.sleep(0.1)
    await websocket.send(json.dumps(create_message()))


async def main():
  print('\nStarting websocket server...')
  async with serve(handler, 'localhost', 3001):
    print('Websocket server running on port 3001')
    print('\nStarting client...')
    subprocess.Popen('cd client && yarn dev', shell=True)

    await asyncio.Future()  # run forever


asyncio.run(main())