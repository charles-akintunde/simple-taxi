// models/driver.ts

export interface Driver {
    id: string;  // UUID
    email: string;
    password: string;  // This will store the hashed password
}
