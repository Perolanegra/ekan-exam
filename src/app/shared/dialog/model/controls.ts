import { Beneficiary, Document } from "../../../beneficiary/model/beneficiary";

export interface InputControls {
  type: string;
  id: keyof Beneficiary;
  className: string;
  label: string;
}

export interface InputControlDocuments extends Omit<InputControls, 'id'> {
  idDoc: keyof Document
}
