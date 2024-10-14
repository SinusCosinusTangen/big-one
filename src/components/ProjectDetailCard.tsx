import React, { useEffect, useState } from "react";
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
        setError("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);

  const techStacks = project?.techStacks ?? [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-fit overlay p-4 md:p-6 bg-white shadow-lg rounded-lg max-w-full md:max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">{project?.projectName}</h2>
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
      </div>
    </div>
  );
};

export default ProjectDetailCard;
