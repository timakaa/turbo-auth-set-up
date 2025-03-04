/**
* This file is auto-generated by nestjs-proto-gen-ts
*/

import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export namespace users {
    export interface UsersService {
        createUser(
            data: CreateUserRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<UserResponse>;
        findOne(
            data: FindOneRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<UserResponse>;
        updateUser(
            data: UpdateUserRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<UserResponse>;
        deleteUser(
            data: DeleteUserRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<UserResponse>;
        updateHashedRefreshToken(
            data: UpdateHashedRefreshTokenRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<UserResponse>;
        findByEmail(
            data: FindByEmailRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<FindByEmailResponse>;
    }
    export interface UserResponse {
        id?: number;
        name?: string;
        email?: string;
        provider?: string;
        password?: string;
        hashedRefreshToken?: string;
        role?: string;
    }
    export interface FindByEmailResponse {
        user?: users.UserResponse;
        notFound?: google.protobuf.Empty;
    }
    export interface CreateUserRequest {
        name?: string;
        email?: string;
        password?: string;
        provider?: string;
    }
    export interface FindOneRequest {
        id?: number;
    }
    export interface UpdateUserRequest {
        id?: number;
        name?: string;
        email?: string;
        password?: string;
    }
    export interface DeleteUserRequest {
        id?: number;
    }
    export interface UpdateHashedRefreshTokenRequest {
        id?: number;
        hashedRefreshToken?: string;
    }
    export interface FindByEmailRequest {
        email?: string;
    }
}
export namespace google {
    export namespace protobuf {
        // tslint:disable-next-line:no-empty-interface
        export interface Empty {
        }
    }
}

