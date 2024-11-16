export interface ClassDetail {
  id?: number;
  class_id?: string;
  class_name?: string;
  schedule?: null;
  lecturer_id?: number;
  student_count?: number;
  attached_code?: null;
  class_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  student_accounts?: Array<any>
}

const ClassInfo = () => {

};

export default ClassInfo;