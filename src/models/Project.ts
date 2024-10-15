import { TechStack } from "./TechStack";

interface Project {
    id: string;
    projectName: string;
    projectDescriptionShort: string;
    projectDescriptionLong: string;
    projectLink: string;
    techStacks: TechStack[];
    createdDate: string;
    lastModified: string;
}

export default Project;