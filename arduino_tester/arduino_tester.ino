#include <Arduino.h>

using namespace std;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int num_values = 6;
  int packet_size = 2 + 4 + 4 * num_values + 8;
  uint8_t packet[packet_size];
  int idx = 0;

  packet[idx++] = 0xee;
  packet[idx++] = 0xe0;

  uint32_t t = millis();
  uint8_t *ptr = (uint8_t *) &t;
  for (int i = 0; i < 4; ++i) {
    packet[idx++] = ptr[i];
  }
  
  for (int i = 0; i < 6; ++i) {
    float f = random(100000, 200000) / 1000.0;
    uint8_t *ptr = (uint8_t *) &f;
    for (int j = 0; j < 4; ++j) {
      packet[idx++] = ptr[j];
    }
  }

  for (int i = 0; i < 7; ++i) {
    packet[idx++] = 0xff;
  }
  packet[idx++] = 0xf0;

  Serial.write(packet, packet_size);
  
  delay(200);
}
