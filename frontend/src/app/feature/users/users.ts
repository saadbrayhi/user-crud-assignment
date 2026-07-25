import { TableModule } from 'primeng/table';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/services/models/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-users',
  imports: [TableModule],
  templateUrl: './users.html',
  styleUrl: './users.css',


})
export class Users {
  private readonly usersService=inject(UsersService);
  private readonly chdR=inject(ChangeDetectorRef)
  users:User[]=[];
  totalRecords=0;
  loading=true;
  
  loadUsers(event:TableLazyLoadEvent):void{
    const rows=event.rows??5;
    const first=event.first??0;
    const page =first/rows+1;

    this.loading=true;

    this.usersService.getUsers(page,rows).subscribe({
      next:response=>{
      this.users=response.data;
      this.totalRecords=response.meta.totalItems;
      this.loading=false;
      this.chdR.detectChanges();
      console.log(response);
      },
      error:error=>{
        this.loading=false;
        this.chdR.detectChanges();
        console.error(error);
      },
    })
  }

  }
