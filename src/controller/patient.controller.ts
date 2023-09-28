import { Request, Response } from "express"
import { Patient } from "../interface/patient"
import { connection } from "../config/mysql.config";
import { QUERY } from "../query/patient.query";
import { HttpResponse } from "../domain/response";
import { Code } from "../enum/code.enum";
import { Status } from "../enum/status.enum";
import { FieldPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket } from "mysql2";

type ResultSet = [RowDataPacket[] | ResultSetHeader, FieldPacket[] | RowDataPacket[][] | ProcedureCallPacket]

export const getPatients = async (req: Request, res: Response): Promise<Response<Patient[]>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

  try {
    const pool = await connection();

    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENTS);

    return res.status(Code.OK)
    .send(new HttpResponse(Code.OK, Status.OK, 'Patients retrieved.', result[0])); 

  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
    .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred!'));
  }
}

export const getPatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

  try {
    const pool = await connection();

    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);

    if ((result[0] as Array<ResultSet>).length > 0) {
      return res.status(Code.OK)
      .send(new HttpResponse(Code.OK, Status.OK, 'Patient retrieved.', result[0]));
    } else {
      return res.status(Code.NOT_FOUND)
      .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found.'));
    }
     
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
    .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred!'));
  }
}

export const createPatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

  let patient: Patient = { ...req.body }

  try {
    const pool = await connection();

    const result: ResultSet = await pool.query(QUERY.CREATE_PATIENT, Object.values(patient));
    
    patient = { id: (result[0] as ResultSetHeader).insertId, ...req.body}

    return res.status(Code.CREATED)
      .send(new HttpResponse(Code.CREATED, Status.CREATED, 'Patient created.', patient));
     
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
    .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred!'));
  }
}

export const updatePatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

  let patient: Patient = { ...req.body }

  try {
    const pool = await connection();

    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);

    if ((result[0] as Array<ResultSet>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.UPDATE_PATIENT, [...Object.values(patient), req.params.patientId]);
      return res.status(Code.OK)
      .send(new HttpResponse(Code.OK, Status.OK, 'Patient updated.', { ...patient, id: req.params.patientId }));
    } else {
      return res.status(Code.NOT_FOUND)
      .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found.'));
    }
     
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
    .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred!'));
  }
}

export const deletePatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

  let patient: Patient = { ...req.body }

  try {
    const pool = await connection();

    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);

    if ((result[0] as Array<ResultSet>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.DELETE_PATIENT, [req.params.patientId]);
      return res.status(Code.OK)
      .send(new HttpResponse(Code.OK, Status.OK, 'Patient deleted.'));
    } else {
      return res.status(Code.NOT_FOUND)
      .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found.'));
    }
     
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
    .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred!'));
  }
}