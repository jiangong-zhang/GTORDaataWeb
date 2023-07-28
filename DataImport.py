import serial
import struct
import threading
import time

size_dict = {
  'float32': 4,
}


class DataImport:
  def __init__(self, input_mode: dict, config: dict):
    self.input_mode = input_mode
    self.config = config
    self.teensy_ser = None

    self.expected_size = self.get_expected_size()
    self.start_code = [0xee, 0xe0]
    self.end_code = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf0]
    self.current_packet = []

    self.stop_thread = threading.Event()

    self.read_data_thread = threading.Thread(target=self.read_data, daemon=True)
    self.read_data_thread.start()

    print(f'Started data import with mode {input_mode}')


  def get_expected_size(self):
    size = 0
    for i in self.config['sensors']:
      datatypes = self.config['types'][i['type']]['datatypes']
      for j in datatypes:
        size += size_dict[j]
    return size
  

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
      idx = 0
      for i in self.config['sensors']:
        datatypes = self.config['types'][i['type']]['datatypes']
        for j in datatypes:
          raw_val = data[idx:idx+size_dict[j]]
          if j == 'float32':
            val = struct.unpack('f', bytes(raw_val))[0]
            print(f'{i["name"]}: {val}')
          idx += size_dict[j]
    else:
      print(f'Expected {self.expected_size} bytes, got {len(data)}')


  def connected(self):
    if self.input_mode['name'] in ['FAKE', 'BIN']:
      return True
    return self.teensy_ser is not None and self.teensy_ser.is_open
  

  def close(self):
    self.stop_thread.set()
    self.read_data_thread.join()

    if self.teensy_ser is not None:
      self.teensy_ser.close()

    print('Closed data import')
