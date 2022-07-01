import { student } from './student.model';

export class  project{
  PRO_ID: String;
  PRO_TITLE: String;
  DEPARTMENT: String;
  LEVEL: String;
  YEAR: String;
  PRO_TYPE: String;
  SEMESTER: Number;
  BATCH: String;
  GUIDE: String;
  SYNOPSIS: String;
  REPORT: String;
  PPT: String;
  DIS_SYNOPSIS: boolean;
  DIS_PPT: boolean;
  DIS_REPORT:boolean;
  students: student[];
  technologies: [];
  MODIFIED_BY: String;
  CREATED_AT: any;
  UPDATED_AT: any;
}
