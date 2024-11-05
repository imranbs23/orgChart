
export declare class Role extends Entity {
    pid?:string;
    name?: string;
    metadata?: Metadata;
    category?: RoleCategory;
    project?: EntityRef;
    template?: EntityRef;
    users?: EntityRef[];
    expanded:boolean;
}

export declare class UserRef {
  constructor(id: string, name?: string);
  id: string;
  name?: string;
}

export declare class Entity {
    constructor(id: string);
    id: string;
    tags?: string[];
    created?: string;
    createdBy?: UserRef;
    deleted?: boolean;
    lastModified?: string;
    lastModifiedBy?: UserRef;
    _etag?: string;
}
export declare type RoleCategory = 'Project' | 'Assurance';
export interface Timing {
  startDate?: Date;
  endDate?: Date;
  duration?: number;
}
export declare class MetadataSource {
  template?: EntityRef;
  project?: EntityRef;
  phase?: EntityRef;
}
export declare class MetadataWellbore {
  plannedSpudDate?: Date;
  spud?: MetadataSpud;
}
export declare class MetadataSpud {
  planned?: Timing;
  actual?: Timing;
}
export declare class Metadata {
  source?: MetadataSource;
  wellbore?: MetadataWellbore;
}
export declare class EntityRef {
  constructor(id: string, name?: string);
  id: string;
  name?: string;
  docType?: string;
  version?: string;
}
export declare class User extends Entity {
  email?: string;
  email_verified?: boolean;
  family_name?: string;
  given_name?: string;
  local?: string;
  logins?: LoginRef[];
  name?: string;
  phone?: string;
  phone_verified?: boolean;
  picture?: string;
  profile?: string;
  timezone?: string;
  type?: UserType;
  username?: string;
}
export declare enum UserType {
  UserPrincipal = "UserPrincipal",
  ServicePrincipal = "ServicePrincipal"
}
export interface LoginRef {
  provider?: string;
  providerId?: string;
}


export interface Role_Temp {
  Id: string;
  Role: string;
  Manager: string;
  ChartType: string;
  color: string;
}
