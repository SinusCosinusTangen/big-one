export interface TechStack {
    id: string | null | undefined;
    name: string;
    type: string;
    createdDate: string | null;
    lastModified: string | null;
}

export class TechStackRequest {

    name: string;
    type: string;

    constructor() {
        this.name = "";
        this.type = "";
    }
}