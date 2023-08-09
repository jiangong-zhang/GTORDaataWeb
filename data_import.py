import serial
import struct
import threading
import time

size_dict = {
  'float32': 4,
}


class Data:
  def __init__(self, config: dict):
    self.config = config

    self.reset()
  

  def reset(self):
    self.start_time = None

    self.millis = []
    self.data = []
    for sensor in self.config['sensors']:
      datatypes = self.config['types'][sensor['type']]['datatypes']
      for datatype in datatypes:
        self.data.append([])


  def add_entry(self, millis: int, entry: list[int]):
    if self.start_time is None:
      self.start_time = time.time() * 1000

    self.millis.append(time.time() * 1000 - self.start_time)
    for i, val in enumerate(entry):
      self.data[i].append(val)


  def get_graph_data(self, graphs: list[int]):
    graph_data = {
      'x': self.millis,
      'y': [],
    }
    for g in graphs:
      graph_data['y'].append(self.data[g])
    return graph_data


class DataImport:
  def __init__(self, input_mode: dict, data: Data, config: dict):
    self.input_mode = input_mode
    self.data = data
    self.config = config
    self.teensy_ser = None

    self.start_code = [0xee, 0xe0]
    self.end_code = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf0]
    self.current_packet = []
    self.packets_received = 0

    self.expected_size = 4 # length of millis

    for sensor in config['sensors']:
      datatypes = config['types'][sensor['type']]['datatypes']
      for datatype in datatypes:
        self.expected_size += size_dict[datatype]

    self.stop_thread = threading.Event()

    self.read_data_thread = threading.Thread(target=self.read_data, daemon=True)
    self.read_data_thread.start()

    print(f'Started data import with mode {input_mode}')


  def read_data(self):
    while not self.stop_thread.is_set():
      if self.input_mode['name'] == 'FAKE':
        pass
      elif self.input_mode['name'] == 'BIN':  
        pass
      else:
        try:
          if self.teensy_ser is None:
            self.teensy_ser = serial.Serial(baudrate=9600, port=self.input_mode['name'],
                                            timeout=1, write_timeout=1)

          if self.teensy_ser.in_waiting > 0:
            all_bytes = self.teensy_ser.read_all()
            for i in all_bytes:
              self.current_packet.append(i)

              if len(self.current_packet) >= len(self.end_code) and self.current_packet[-len(self.end_code):] == self.end_code:
                if self.current_packet[:len(self.start_code)] == self.start_code:
                  self.unpacketize()

                self.current_packet.clear()
        except serial.SerialException:
          print(f'Could not connect to {self.input_mode["name"]}')
        except Exception as e:
          print(f'Error while reading from serial: {e}')
      
      time.sleep(0.02)

  
  def unpacketize(self):
    data = self.current_packet[len(self.start_code):-len(self.end_code)]

    if len(data) == self.expected_size:
      millis = int.from_bytes(data[:4], 'little')
      data = data[4:]

      entry = []
      i = 0
      for sensor in self.config['sensors']:
        datatypes = self.config['types'][sensor['type']]['datatypes']
        for datatype in datatypes:
          raw_val = data[i:i+size_dict[datatype]]
          if datatype == 'float32':
            val = struct.unpack('f', bytes(raw_val))[0]
            entry.append(val)
            
          i += size_dict[datatype]
      self.data.add_entry(millis, entry)

      self.packets_received += 1
      print(f'Received packet {self.packets_received} at time {millis}')
    else:
      print(f'Expected {self.expected_size} bytes, got {len(data)}')


  def connected(self):
    if self.input_mode['name'] in ['FAKE', 'BIN']:
      return True
    return self.teensy_ser is not None and self.teensy_ser.is_open
  

  def close(self):
    self.data.reset()
    self.stop_thread.set()
    self.read_data_thread.join()

    if self.teensy_ser is not None:
      self.teensy_ser.close()

    print('Closed data import')
