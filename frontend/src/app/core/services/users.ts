import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateUserPayload,
  UpdateUserPayload,
  PaginatedUsersResponse,
  User,
} from './models/user.model';

@Injectable({
  providedIn:'root',
})
export class UsersService {
  private readonly http=inject(HttpClient);
  private readonly apiUrl='http://localhost:3000/users';

  getUsers(page:number,limit:number,sortBy?:string,search?:string,):Observable<PaginatedUsersResponse>{
    let params=new HttpParams()
    .set('page',page)
    .set('limit',limit);
    if(sortBy){
      params=params.set('sortBy',sortBy);
    }
    if(search){
      params=params.set('search',search);
    }
    return this.http.get<PaginatedUsersResponse>(this.apiUrl,{
      params,
    });

  }

  createUser(payload:CreateUserPayload):Observable<User>{
    return this.http.post<User>(this.apiUrl,payload);
  }
  updateUser(id:number,payload:UpdateUserPayload):Observable<User>{
    return this.http.patch<User>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

}