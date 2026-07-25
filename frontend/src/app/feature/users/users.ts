import { TableModule } from 'primeng/table';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/services/models/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { InputText } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-users',
  imports: [TableModule, InputText, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',


})
export class Users {
  private readonly usersService=inject(UsersService);
  private readonly chdR=inject(ChangeDetectorRef)
  users:User[]=[];
  totalRecords=0;
  loading=true;
  searchValue='';
  lastTableEvent?:TableLazyLoadEvent;
  
  loadUsers(event:TableLazyLoadEvent):void{
    this.lastTableEvent=event;
    const sortField=event.sortField;
    const sortOrder=event.sortOrder;
    const rows=event.rows??5;
    const first=event.first??0;
    const page =first/rows+1;
    const direction=sortOrder===1?'ASC':sortOrder===-1?'DESC':undefined
    const sortBy=sortField && direction ?`${sortField}:${direction}`:undefined

    const search = this.searchValue.trim();
    this.loading=true;

    this.usersService.getUsers(page,rows,sortBy,search).subscribe({
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

  onSearchChange():void{
    if(!this.lastTableEvent){
      return;
    }
    this.loadUsers({
      ...this.lastTableEvent,
      first:0,
    });
  }

  }
