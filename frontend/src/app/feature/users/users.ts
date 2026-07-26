import { TableModule } from 'primeng/table';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/services/models/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { FormsModule } from "@angular/forms";
import {FormBuilder,ReactiveFormsModule,Validators,}from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [TableModule,FormsModule, ReactiveFormsModule,DialogModule,ButtonModule,InputTextModule,ConfirmDialogModule],
  providers:[ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.css',


  
})
export class Users {
  private readonly usersService=inject(UsersService);
  private readonly chdR=inject(ChangeDetectorRef)
  private readonly formBuilder=inject(FormBuilder)
  private readonly confirmationService=inject(ConfirmationService);

  users:User[]=[];
  totalRecords=0;
  loading=true;
  searchValue='';
  lastTableEvent?:TableLazyLoadEvent;
  userDialogVisible=false;
  saving=false;
  selectedUser:User |null=null;
  
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
  userForm = this.formBuilder.nonNullable.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
});

openCreateDialog(): void {
  this.selectedUser=null;
  this.userForm.reset();
  this.userDialogVisible = true;
}

openEditDialog(user:User):void{
  this.selectedUser = user;
  this.userForm.setValue({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  this.userDialogVisible = true;
}

submitUser():void{
    if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }
  const payload=this.userForm.getRawValue();

    const request$ =this.selectedUser ? this.usersService.updateUser(this.selectedUser.id,payload): this.usersService.createUser(payload)
    
  this.saving=true;
  request$.subscribe({
    next: () => {
      this.saving = false;
      this.selectedUser = null;
      this.userDialogVisible = false;
      this.userForm.reset();

      if (this.lastTableEvent) {
        this.loadUsers({
          ...this.lastTableEvent,
          first: 0,
        });
      }
    },
    error: error => {
      this.saving = false;
      console.error(error);
    },
  });

}
  closeUserDialog(): void {
    this.userDialogVisible = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

confirmDelete(user: User): void {
  this.confirmationService.confirm({
    header: 'Delete user',
    message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'p-button-danger',

    accept: () => {
      this.deleteUser(user.id);
    },
  });
}

private deleteUser(id: number): void {
  this.usersService.deleteUser(id).subscribe({
    next: () => {
      if (this.lastTableEvent) {
        this.loadUsers(this.lastTableEvent);
      }
    },
    error: error => {
      console.error(error);
    },
  });
}

}
