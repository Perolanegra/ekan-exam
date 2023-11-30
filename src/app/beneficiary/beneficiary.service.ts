import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, WritableSignal, inject, signal } from '@angular/core';
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
import { Document, Beneficiary, BeneficiaryResponse } from './model/beneficiary';
import { InputControls, InputControlDocuments } from '../shared/dialog/model/controls';

@Injectable({
  providedIn: 'any'
})
export class BeneficiaryService {
  private url = 'http://localhost:3000';
  http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  constructor() { }
  // First page of beneficiarys
  private beneficiarys$ = this.http.get<BeneficiaryResponse>(`${this.url}/list`).pipe(
    map((data) => data.results as Beneficiary[]),
    shareReplay(1),
    catchError(this.handleError)
  );

  // Expose signals from this service with toSignal method that transforms observables into signals.
  beneficiarys = toSignal(this.beneficiarys$, { initialValue: [] as Beneficiary[] });
  selectedbeneficiary = signal<Beneficiary>({} as Beneficiary);

  private beneficiaryDocuments$ = toObservable(this.selectedbeneficiary).pipe(
    filter(Boolean),
    switchMap(beneficiary => of(beneficiary.documents))
  );

  changeToApiURL(): void {
    this.url = "https://localhost:3200";
  }

  beneficiaryDocuments = toSignal<Document[], Document[]>(this.beneficiaryDocuments$, { initialValue: [] });

  beneficiarySelected(bId: string): void {
    if (bId) {
      const foundbeneficiary = this.beneficiarys().find((b) => b.id === bId);
      this.selectedbeneficiary.set(foundbeneficiary ? foundbeneficiary : {} as Beneficiary);
    }
  }

  updatedBeneficiary: WritableSignal<Beneficiary | undefined> = signal(undefined);

  updateBeneficiary = (payload: Partial<Beneficiary>): void => {
    this.http.put<Beneficiary>(`${this.url}/update`, payload).pipe(
      map((updatedB) => updatedB as Beneficiary),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
      catchError(this.handleError)
    ).subscribe(res => {
      this.updatedBeneficiary.set(res);
    });
  }

  createdBeneficiary: WritableSignal<Beneficiary | undefined> = signal(undefined);

  createBeneficiary = (payload: Beneficiary): void => {
    this.http.post<any>(`${this.url}/create`, payload).pipe(
      map((response: Beneficiary) => response),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
      catchError(this.handleError)
    ).subscribe({
      next: (data) => this.createdBeneficiary.set(data)
    });

  }

  removedBeneficiaryById: WritableSignal<{
    "success": boolean,
    "name": string,
    "id": string
  } | undefined> = signal(undefined);

  removeBeneficiaryById = (bId: string) => {
    this.http.delete<any>(`${this.url}/remove`, { body: bId }).pipe(
      map((response: any) => response),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
      catchError(this.handleError),
    ).subscribe({
      next: (data) => this.removedBeneficiaryById.set(data)
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
