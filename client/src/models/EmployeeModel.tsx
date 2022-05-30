export interface Employee {
  _id: string;
  full_name: string;
  login_id: string;
  salary: number;
  profile_pic: string;
}

export type Employees = Array<Employees>;