export type Sensor = {
  X: number;
  Y: number;
  Z: number;
  co2: number;
  humid: number;
  temp: number;
  sensor_timestamp: number;
};

export type XSensor = Partial<Sensor> & { sensor_timestamp: number };
