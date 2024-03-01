// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
//     const roles = this.reflector.get<String>('roles', context.getHandler());
//     console.log(roles);
//     if (!roles) {
//       return true;
//     }
//   }
// }