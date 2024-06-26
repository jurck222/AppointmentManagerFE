export interface TimeWindow {
  startTime: string;
  endTime: string;
}

export interface Availability {
  id: number;
  doctorId: number;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}
