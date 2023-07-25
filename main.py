import asyncio
import json
from serial.tools import list_ports
from websockets.server import serve, WebSocketServerProtocol

from DataImport import DataImport

data_import: DataImport = None


def get_input_mode():
  if data_import is None:
    return None
  return data_import.input_mode


def set_input_mode(mode):
  global data_import
  if get_input_mode() == mode:
    return
  if data_import is not None:
    data_import.close()
  data_import = DataImport(mode)


def get_status_code():
  if data_import is None:
    return 0
  return 2 if data_import.connected() else 1


def create_message():
  ports = sorted([port.device for port in list_ports.comports()])
  return {
    'ports': ports,
    'statusCode': get_status_code(),
  }


def create_init_message():
  return {
    **create_message(),
    'init': True,
    'inputMode': get_input_mode(),
  }


def read_message(msg):
  data: dict = json.loads(msg)
  set_input_mode(data.get('inputMode', None))


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

    await asyncio.Future()  # run forever


asyncio.run(main())