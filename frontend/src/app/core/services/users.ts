import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedUsersResponse } from './models/user.model';

@Injectable({
  providedIn:'root',
})
export class UsersService {
  private readonly http=inject(HttpClient);
  private readonly apiUrl='http://localhost:3000/users';

  getUsers():Observable<PaginatedUsersResponse>{
    return this.http.get<PaginatedUsersResponse>(this.apiUrl);
  }
}