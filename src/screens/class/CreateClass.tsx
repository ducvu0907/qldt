export interface ClassCreateRequest {
  token: string,
  class_id: string, // 6 digits
  class_name: string,
  class_type: string, // LT, BT, LT_BT
  start_date: Date,
  end_date: Date,
  max_student_amount: number, // < 50
};

const CreateClass = () => {
  
};

export default CreateClass;