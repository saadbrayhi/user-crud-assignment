
export interface User{
id:number,
firstName:string,
lastName:string,
emai:string,
createdAt:string,
UpdatedAt:string,
}

export interface CreateUserPayload{
    firstName:string,
    lastName:string,
    email:string,
}

export interface UpdateUserPayload{
    firstName?:string,
    lastName?:string,
    email?:string,
}
export interface PaginationMeta{
    itemsPerPage:number,
    totalItems:number,
    currentPage:number,
    totalPages:number,
    sortBy:[string,string][];
}
export interface PaginationLinks{
    first?:string;
    previous?:string;
    current:string;
    next?:string;
    last?:string;
}
export interface PaginatedUsersResponse{
    data:User[];
    meta:PaginationMeta;
    links:PaginationLinks;
}