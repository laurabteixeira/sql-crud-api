import { Router } from 'express';
import { createPatient, deletePatient, getPatient, getPatients, updatePatient } from '../controller/patient.controller';

const patientRoutes = Router();

patientRoutes.route('/')
  .get(getPatients)
  .post(createPatient);

patientRoutes.route('/:patientId')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

export default patientRoutes; 