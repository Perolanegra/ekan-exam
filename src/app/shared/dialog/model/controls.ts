import { Beneficiary } from "../../../beneficiary/model/beneficiary";

export interface InputControls {
  type: string;
  id: keyof Beneficiary;
  className: string;
  label: string;
}
