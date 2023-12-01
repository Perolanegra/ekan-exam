import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal, WritableSignal } from '@angular/core';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError
} from 'rxjs';
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Document, Beneficiary } from './model/beneficiary';
import { InputControls, InputControlDocuments } from '../shared/dialog/model/controls';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private url = 'http://localhost:8080';
  http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private hasMock = false;

  constructor() { }
  // First page of beneficiarys
  private beneficiarys$ = this.http.get<Beneficiary[]>(`${this.url}/beneficiary`).pipe(
    map((data) => {
      this.documentKeys.set(Object.keys(data[0]?.documents[0]));
      return data as Beneficiary[];
    }),
    shareReplay(1),
    catchError(this.handleError)
  );

  documentKeys: WritableSignal<string[]> = signal([]);
  // Expose signals from this service with toSignal method that transforms observables into signals.
  beneficiarys = toSignal(this.beneficiarys$, { initialValue: [] as Beneficiary[] });
  selectedbeneficiary = signal<Beneficiary>({} as Beneficiary);

  private beneficiaryDocuments$ = toObservable(this.selectedbeneficiary).pipe(
    filter(Boolean),
    switchMap(beneficiary => of(beneficiary.documents))
  );

  beneficiaryDocuments = toSignal<Document[], Document[]>(this.beneficiaryDocuments$, { initialValue: [] });

  beneficiarySelected(bId: string): void {
    if (bId) {
      const foundbeneficiary = this.beneficiarys().find((b) => b.id === bId);
      this.selectedbeneficiary.set(foundbeneficiary ? foundbeneficiary : {} as Beneficiary);
    }
  }

  updateBeneficiary = (payload: Partial<Beneficiary>): void => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer your-access-token'
      })
    };

    this.http.patch<Partial<Beneficiary>>(`${this.url}/beneficiary/${payload.id}`, payload, httpOptions).pipe(
      map((updatedB) => updatedB as Beneficiary),
      shareReplay(1),
      catchError(this.handleError)
    ).subscribe();
  }

  createBeneficiary = (payload: Partial<Beneficiary>): void => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer your-access-token'
      })
    };

    if (this.hasMock) {
      payload.addedDate = new Date().toISOString()
      payload.updateDate = new Date().toISOString()
      payload.documents?.map(doc => {
        doc.addedDate = new Date().toISOString();
        doc.updatedDate = new Date().toISOString();
      })
    }

    this.http.post<any>(`${this.url}/beneficiary`, payload, httpOptions).pipe(
      map((response: Beneficiary) => response),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
      catchError(this.handleError)
    ).subscribe({
      next: (data: Beneficiary) => this.beneficiarys().push(data)
    });

  }

  removeBeneficiaryById = (bId: string | undefined) => {
    this.http.delete<any>(`${this.url}/beneficiary/${bId}`).pipe(
      map((response: any) => response),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
      catchError(this.handleError),
    ).subscribe({
      next: () => {
        this.beneficiarys = signal(this.beneficiarys().filter(b => b.id !== bId));
        this.selectedbeneficiary.set({} as Beneficiary);
      }
    });
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // In a real world app we Should centralize error and calls on HTTPInterceptors
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Algum erro ocorreu: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Servidor retornou o código: ${err.status}, A mensagem é: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }


  inputControlsBeneficiary = signal<InputControls[]>(
    [
      {
        type: 'text',
        id: 'id',
        className: '',
        label: '',
      },
      {
        type: 'text',
        id: 'name',
        className: '',
        label: 'Nome',
      },
      {
        type: 'tel',
        id: 'phone',
        className: '',
        label: 'Telefone',
      },
      {
        type: 'date',
        id: 'birthDate',
        className: '',
        label: 'Nascimento',
      },
      {
        type: 'date',
        id: 'addedDate',
        className: '',
        label: 'Inclusão',
      },
      {
        type: 'date',
        id: 'updateDate',
        className: '',
        label: 'Atualizado em',
      },
    ]
  )

  inputControlsDocs = signal<InputControlDocuments[]>(
    [
      {
        type: 'text',
        idDoc: 'documentType',
        className: '',
        label: 'Tipo',
      },
      {
        type: 'textarea',
        idDoc: 'desc',
        className: '',
        label: 'Descrição',
      },
      {
        type: 'date',
        idDoc: 'addedDate',
        className: '',
        label: 'Data Inclusão',
      },
      {
        type: 'date',
        idDoc: 'updatedDate',
        className: '',
        label: 'Data Atualização',
      },
    ]
  )

}
