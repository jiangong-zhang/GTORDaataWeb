import serial

class DataImport:
  def __init__(self, input_mode):
    self.input_mode = input_mode
    self.teensy_ser = None
    print(input_mode)
  

  def read(self):
    if self.input_mode['name'] == 'FAKE':
      pass
    elif self.input_mode['name'] == 'BIN':
      pass
    else:
      try:
        self.teensy_ser = serial.Serial(baudrate=230400, port=self.input_mode['name'],
                                        timeout=2, write_timeout=1)
      except serial.SerialException:
        print(f'Could not connect to {self.input_mode["name"]}')


  def connected(self):
    if self.input_mode['name'] in ['FAKE', 'BIN']:
      return True
    return self.teensy_ser is not None and self.teensy_ser.is_open
  

  def close(self):
    if self.teensy_ser is not None:
      self.teensy_ser.close()
