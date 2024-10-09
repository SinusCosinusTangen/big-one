import React, {useEffect, useState} from "react";
import { GetProject } from "../services/LandingPageService";
import Project from "../models/Project";

interface ProjectCardProps {
    id: string; // The ID of the project to fetch
}


const ProjectDetailCard: React.FC<ProjectCardProps> = ({ id }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectDetail = await GetProject(id);
                setProject(projectDetail);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [id]);

    var techStacks = project?.techStacks == null ? [] : project?.techStacks;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="h-fit overlay">
            <div className="card">
                <h2 className="text-3xl font-semibold mb-4">{project?.projectName}</h2>
                <p className="text-2xl font-sans text-start">{project?.projectDescriptionLong}</p>
                <hr className="border-2 rounded h-2 bg-slate-950 mt-4"/>
                <p className="text-1xl font-sans font-bold mb-2">Technology Stack</p>
                <div className="text-1xl font-sans mb-4 flex flex-wrap gap-1">
                {techStacks.map((techStack) => (
                    <><span className="bg-white-0 border-solid border-2 border-black rounded-full mb-1 px-2 py-1 text-center font-semibold" key={techStack.id}>{techStack.name}</span><span> </span></>
                ))}
                </div>
                <a href={project?.projectLink} target="_blank" className="text-blue-500 hover:font-semibold">View Project</a>
            </div>
        </div>
    );
};

export default ProjectDetailCard;