import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutoCompleteService {
  constructor(private http: HttpClient) {}

  getItems(
    searchTerm: string,
    pageIndex: number,
    pageSize: number
  ): Observable<string[]> {
    const searchApiUrl = 'https://localhost:7226/api/cities';

    const httpParams = new HttpParams({
      fromString:
        'SearchTerm=' +
        searchTerm +
        '&PageIndex=' +
        pageIndex +
        '&PageSize=' +
        pageSize,
    });

    return this.http
      .get<string[]>(searchApiUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  handleError(error: Response | any): Observable<never> {
    let errMsg: string;

    if (!(error instanceof Response)) {
      errMsg = error.message ? error.message : error.toString();
      if (error && error.err) {
        console.log('Server returned: ', error.error.text);
      }
    } else {
      const body = error.json() || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    console.error(errMsg);
    return throwError(new Error(errMsg));
  }
}
