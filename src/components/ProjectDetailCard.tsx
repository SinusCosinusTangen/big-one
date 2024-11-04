import React, { useEffect, useState } from "react";
import { GetProject } from "../services/LandingPageService";
import Project from "../models/Project";
import { DeleteProject } from "../services/LandingPageService";
import { ValidateUserToken } from "../services/AuthService";
import Icon from "react-icons-kit";
import { pencil } from "react-icons-kit/fa/pencil"
import { trash } from "react-icons-kit/fa/trash"
import AddProjectForm from "./AddProjectForm";

interface ProjectCardProps {
    id: string;
}

const ProjectDetailCard: React.FC<ProjectCardProps> = ({ id }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState("");
    const [showEditProject, setShowEditProject] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectDetail = await GetProject(id);
                setProject(projectDetail);
            } catch (error) {
                console.error(error);
                setError("Error fetching project details");
            } finally {
                setLoading(false);
            }
        };

        const validateUser = () => {
            ValidateUserToken(localStorage.getItem("Token"), localStorage.getItem("Username")).then((res) => {
                setRole(res);
                if (res === "ADMINISTRATOR") {
                    setIsAdmin(true);
                }
            });
        }

        fetchProjects();
        validateUser();
    }, [id]);

    const techStacks = project?.techStacks ?? [];

    const handleDeleteProject = async (id: string | undefined) => {
        if (id && isAdmin) {
            await DeleteProject(id);
        }
    }

    if (loading) return <div className="h-fit w-screen overlay p-4 md:p-6 bg-white shadow-lg rounded-lg max-w-full md:max-w-md mx-auto transition-transform duration-200">Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="h-fit w-screen overlay p-4 md:p-6 bg-white shadow-lg rounded-lg max-w-full md:max-w-md mx-auto transition-transform duration-200">
            {/* Add Project Modal */}
            {showEditProject && (
                <div
                    className="fixed z-50 inset-0 bg-black/80 flex justify-center items-center px-4"
                    onClick={() => { setShowEditProject(false); }}
                >
                    <div
                        className="relative p-4 bg-white border border-gray-300 rounded shadow-lg max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setShowEditProject(false); }}
                            className="absolute top-2 right-5 text-gray-600 text-4xl hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <AddProjectForm id={id} />
                    </div>
                </div>
            )}

            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-semibold">{project?.projectName}</h2>
                <p className="text-base sm:text-lg font-sans text-start mb-4">{project?.projectDescriptionLong}</p>

                <hr className="border-2 rounded h-2 bg-slate-950 mt-4" />

                <p className="text-lg sm:text-xl font-sans font-bold mb-2">Technology Stack</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {techStacks.map((techStack) => (
                        <span
                            className="bg-gray-200 text-gray-800 border-solid border-2 border-gray-300 rounded-full px-3 py-1 text-sm sm:text-base font-semibold"
                            key={techStack.id}
                        >
                            {techStack.name}
                        </span>
                    ))}
                </div>

                <a
                    href={project?.projectLink}
                    target="_blank"
                    className="text-blue-500 hover:font-semibold text-base sm:text-lg"
                    rel="noopener noreferrer"
                >
                    View Project
                </a>
                {isAdmin && (
                    <div className="flex justify-end items-center">
                        <button
                            className="flex items-center text-base sm:text-lg hover:text-blue-500 hover:scale-105 active:scale-100 transition-transform duration-200 mr-4"
                            onClick={() => setShowEditProject(true)}
                        >
                            <Icon icon={pencil} style={{ marginBottom: '4px' }} />
                            <span className="text-lg" style={{ lineHeight: '1.5' }}>Edit</span>
                        </button>

                        <button
                            className="flex items-center text-base sm:text-lg hover:text-red-500 hover:scale-105 active:scale-100 transition-transform duration-200"
                            onClick={() => handleDeleteProject(project?.id)}
                        >
                            <Icon icon={trash} style={{ marginBottom: '4px' }} />
                            <span className="text-lg" style={{ lineHeight: '1.5' }}>Delete Project</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailCard;
