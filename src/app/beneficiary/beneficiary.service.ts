import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  catchError,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  throwError,
  OperatorFunction,
  UnaryFunction,
  pipe,
  distinctUntilChanged,
  of,
} from 'rxjs';
import {
  toSignal,
  toObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { Document, Beneficiary } from './model/beneficiary';
import {
  InputControls,
  InputControlDocuments,
} from '../shared/dialog/model/controls';

/**
 * Operador customizado para RxJs que garante que apenas stream
 * de dado válido chegue ao `next`.
 *
 * Filtra observable com valor `null` ou `undefined` e evita que stream
 * de dado prossiga caso valor seja filtrado.
 *
 * @returns Observable de valor que não seja `null` e nem `undefined`.
 */
export function filterNullish<T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> {
  return pipe(
    filter((value) => value != null) as OperatorFunction<
      T | null | undefined,
      T
    >
  );
}

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryService {
  private url = 'http://localhost:8080';
  http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private hasMock = false;

  private readonly beneficiary = signal<any>({} as Beneficiary);
  private readonly _selectedbeneficiary = signal<any>({} as Beneficiary);

  public readonly recentBeneficiaries = toSignal(
    toObservable(this.beneficiary).pipe(
      // filterNullish<any>(),
      switchMap(() => this.getBeneficiaries())
    ),
    { initialValue: [], manualCleanup: true }
  );

  public readonly selectedbeneficiary = toSignal(
    toObservable(this._selectedbeneficiary).pipe(
      distinctUntilChanged(),
      filterNullish<any>(),
      takeUntilDestroyed(this.destroyRef),
      switchMap((foundbeneficiary: Beneficiary) => of(foundbeneficiary))
    ),
    { initialValue: {} as Beneficiary, manualCleanup: true }
  );

  getBeneficiaries(): Observable<any> {
    return this.http.get<Beneficiary[]>(`${this.url}/beneficiary`).pipe(
      map((data) => data as Beneficiary[]),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  beneficiarySelected(bId: string): void {
    if (bId) {
      const foundbeneficiary = this.recentBeneficiaries().find(
        (b: any) => b.id === bId
      );
      this._selectedbeneficiary.set(foundbeneficiary ? foundbeneficiary : {});
    }
  }

  createBeneficiary = (payload: Partial<Beneficiary>): void => {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     // 'Authorization': 'Bearer your-access-token'
    //   }),
    // };

    if (this.hasMock) {
      payload.addedDate = new Date().toISOString();
      payload.updatedDate = new Date().toISOString();
      payload.documents?.map((doc) => {
        doc.addedDate = new Date().toISOString();
        doc.updatedDate = new Date().toISOString();
      });
    }

    payload.documents?.map((doc: Partial<Document>) => delete doc.id);

    this.http
      .post<any>(`${this.url}/beneficiary`, payload)
      .pipe(
        map((response: Beneficiary) => response),
        shareReplay(1),
        takeUntilDestroyed(this.destroyRef),
        catchError(this.handleError)
      )
      .subscribe(this.beneficiary.set);
  };

  updateBeneficiary = (payload: Partial<Beneficiary>): void => {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     // 'Authorization': 'Bearer your-access-token'
    //   }),
    // };

    if (payload.id) {
      this.http
        .patch<Partial<Beneficiary>>(
          `${this.url}/beneficiary/${payload.id}`,
          payload,
        )
        .pipe(
          map((updatedB) => updatedB),
          distinctUntilChanged(),
          shareReplay(1),
          takeUntilDestroyed(this.destroyRef),
          catchError(this.handleError)
        )
        .subscribe({
          next: (data: any) => {
            this.beneficiary.set(data);
            this._selectedbeneficiary.set(data);
          },
        });
    }
  };

  removeBeneficiaryById = (bId: string | undefined) => {
    this.http
      .delete<any>(`${this.url}/beneficiary/${bId}`)
      .pipe(
        map((response: any) => response),
        shareReplay(1),
        takeUntilDestroyed(this.destroyRef),
        catchError(this.handleError)
      )
      .subscribe({
        next: (data: any) => {
          this.beneficiary.set(data);
          this._selectedbeneficiary.set({} as Beneficiary);
        },
      });
  };

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

  inputControlsBeneficiary = signal<InputControls[]>([
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
      id: 'updatedDate',
      className: '',
      label: 'Atualizado em',
    },
  ]);

  inputControlsDocs = signal<InputControlDocuments[]>([
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
  ]);
}
