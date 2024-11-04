import { useState, useEffect } from 'react';
import { AddProject, UpdateProject } from '../services/LandingPageService';
import { TechStackRequest } from '../models/TechStack';
import * as service from '../services/LandingPageService'
import Project from '../models/Project';

interface ProjectCardProps {
    id?: string;
}

const AddProjectForm: React.FC<ProjectCardProps> = ({ id }) => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [techStack, setTechStack] = useState<TechStackRequest>({ name: "", type: "" });
    const [projectLink, setProjectLink] = useState("");
    const [techStacks, setTechStacks] = useState<TechStackRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async (projectId: string) => {
            if (id) {
                try {
                    setLoading(true);
                    const projectDetail = await service.GetProject(projectId);
                    if (projectDetail) {
                        setProjectName(projectDetail["projectName"]);
                        setProjectDescription(projectDetail["projectDescriptionLong"]);
                        setTechStacks(projectDetail["techStacks"]);
                        setProjectLink(projectDetail["projectLink"]);
                    }
                } catch (error) {
                    console.error(error);
                    setError("error");
                } finally {
                    setLoading(false);
                }
            };
        }

        if (id) {
            fetchProjects(id);
        }
    }, [id]);

    const inputClass = `mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                        invalid:border-pink-500 invalid:text-pink-600
                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500`;

    const handleTechStacks = (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedTechStack = techStack.name;
        if (trimmedTechStack && !techStacks.find(ts => ts.name.trim().toLowerCase() === trimmedTechStack.toLowerCase())) {
            setTechStacks((prevStacks: TechStackRequest[]) => [...prevStacks, techStack]);
        }

        setTechStack({ name: "", type: "" });
    };

    const removeTechStack = (techStackToRemove: string) => {
        setTechStacks((prevStacks) => prevStacks.filter(ts => ts.name !== techStackToRemove));
    };

    const addProject = async () => {
        await AddProject(projectName, projectDescription, techStacks, projectLink);
    };

    const updateProject = async () => {
        if (id)
            await UpdateProject(id, projectName, projectDescription, techStacks, projectLink);
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form className="max-w-full md:max-w-lg mx-auto p-4 md:p-6"
            onSubmit={(e) => handleTechStacks(e)}
            onKeyDown={(e) => { if (e.key == 'Enter') e.preventDefault() }}
        >
            <p className="mt-2 text-lg">Project Name</p>
            <input value={projectName} type="text" className={inputClass} onChange={(e) => setProjectName(e.target.value)} required />
            {!projectName && (<label className="text-red-500">* This field is required.</label>)}

            <p className="mt-2 text-lg">Description</p>
            <input value={projectDescription} type="text" className={inputClass} onChange={(e) => setProjectDescription(e.target.value)} required />
            {!projectDescription && (<label className="text-red-500">* This field is required.</label>)}

            <p className="mt-2 text-lg">Tech Stacks</p>
            <div className="relative flex items-center mb-2">
                <input
                    value={techStack.name}
                    type="text"
                    className={inputClass}
                    onChange={(e) => setTechStack({ name: e.target.value, type: "Programming Language" })}
                    onKeyDown={(e) => e.key === 'Enter' && handleTechStacks(e)}
                />
            </div>
            <div className="text-sm font-sans mb-2 flex flex-wrap gap-1 max-h-32 overflow-auto">
                {techStacks.map((stack) => (
                    <span
                        className="relative flex items-center bg-gray-200 text-gray-800 border-solid border-2 border-gray-400 rounded-full pl-2 pr-1 py-1 text-center font-semibold"
                        key={stack.name}
                    >
                        <span className="flex-1 text-left">{stack.name}</span>
                        <button
                            onClick={() => removeTechStack(stack.name)}
                            className="text-base text-gray-600 hover:text-red-500 hover:font-bold ml-1"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>

            <p className="mt-2 text-lg">Project Link</p>
            <input value={projectLink} type="text" className={inputClass} onChange={(e) => setProjectLink(e.target.value)} />

            <button
                className="mt-8 block w-full h-10 px-3 py-2 border border-sky-500 rounded-md text-black text-sm shadow-sm font-semibold
                           hover:bg-sky-500 hover:text-white
                           focus:ring focus:ring-sky-300
                           active:bg-sky-600 active:scale-95 transition-transform duration-200"
                type="button"
                onClick={id ? updateProject : addProject}
            >
                {id && (<span>Edit {projectName}</span>)}
                {!id && (<span>Add {projectName}</span>)}
            </button>
        </form>
    );
};

export default AddProjectForm;
