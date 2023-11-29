import { Beneficiary, Document } from "../../../beneficiary/model/beneficiary";

export interface InputControls {
  type: string;
  id: keyof Beneficiary;
  className: string;
  label: string;
  idDoc?: keyof Document; // probably have to change
}
