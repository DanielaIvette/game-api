import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "../interfaces/user.role.interface";
import { AuthGuard } from "@nestjs/passport";
import { RolProtected } from "./rol.protected.decorator";
import { UserRoleGuard } from "../guards/user.role.ts/user.rol.guards";

export function Auth(...args: UserRole[]) {
    return applyDecorators(
    RolProtected(...args),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
);
}