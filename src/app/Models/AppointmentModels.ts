export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  availabilityId: number;
  service: string;
  startTime: Date;
  endTime: Date;
}
