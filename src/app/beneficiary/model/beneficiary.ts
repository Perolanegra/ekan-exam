export interface Beneficiary {
  id?: string;
  name: string;
  phone: string;
  birthDate: string;
  addedDate?: string;
  updateDate?: string;
  documents: Document[];
}

export interface Document {
  id: string;
  documentType: string;
  desc: string;
  addedDate: string;
  updatedDate: string;
}

export interface BeneficiaryResponse {
  results: Beneficiary[];
}
