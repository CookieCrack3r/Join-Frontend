import { User } from '../interface/user';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CreateUser } from '../interface/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signUpUser(userDetails: CreateUser): Observable<any> {
    const url = environment.baseUrl + "/api/signup/";
    return this.http.post<CreateUser>(url, userDetails).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    )
  }

  getAllUsers(): Observable<User[]> {
    const url = environment.baseUrl + "/api/users/";
    return this.http.get<User[]>(url);
  }

  getCurrentUser(): Observable<User[]> {
    const url = environment.baseUrl + "/api/current_user/";
    return this.http.get<User[]>(url);
  }

  deleteUser(userId: number): Observable<any> {
    const url = environment.baseUrl + `/api/users/${userId}/`;
    return this.http.delete(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  updateUser(user: User): Observable<User> {
    const url = environment.baseUrl + `/api/users/${user.id}/`;
    return this.http.put<User>(url, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
