export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  birthDate: string | Date;
  addedDate?: string | Date;
  updatedDate?: string | Date;
  documents: Document[];
}

export interface Document {
  id: string;
  documentType: string;
  desc: string;
  addedDate: string | Date;
  updatedDate: string | Date;
  showAccordeon?: boolean;
}


