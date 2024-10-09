import React, {useEffect, useState} from "react";
import '../../output.css'
import bg from '../../asset/image/bg-img.jpeg'
import { GetProjectList } from "../../services/LandingPageService";
import ProjectDetailCard from "../../components/ProjectDetailCard";

const LandingPage = () => {

    const style = {backgroundImage: `url(${bg})`,
                   backgroundPosition: 'center',
                   backgroundSize: 'cover',
                   backgroundRepeat: 'no-repeat'
                  }

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [isProjectDetailHidden, setIsProjectDetailHidden] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            const projectList = await GetProjectList();
            setProjects(projectList);
        };

        fetchProjects();
    }, []);

    return (
        <div className="h-screen font-sans overflow-y-auto bg-slate-700/30" style={style}>
            {!isProjectDetailHidden && (
                <div 
                    className="fixed z-50 inset-0 bg-black/80 flex justify-center items-center" 
                    onClick={() => { setIsProjectDetailHidden(true); setProjectId(""); }} // Close on overlay click
                >
                    <div 
                        className="relative p-4 bg-white border border-gray-300 rounded shadow-lg max-w-md w-full"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
                    >
                        <button
                            onClick={() => { setProjectId(""); setIsProjectDetailHidden(true); }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        >
                            &times; {/* Close icon */}
                        </button>
                        <ProjectDetailCard id={projectId} />
                    </div>
                </div>
            )}
            <div className="mx-5">
                <div className="p-20 text-center">
                    <h1 className="text-white text-6xl font-semibold">Welcome to <a className="hover:underline hover:font-bold" href="#">James's</a> Portfolio</h1>
                    <h1 className="text-white text-4xl">Below are my list of project</h1>
                </div>
                <div className="grid grid-cols-3 gap-8 px-40 pb-10">
                    {projects.map((project) => (
                        <button key={project['id']} onClick={() => {setProjectId(project['id']); isProjectDetailHidden ?  setIsProjectDetailHidden(false) : setIsProjectDetailHidden(true)}}>
                            <div className="h-52 text-center text-white rounded-lg bg-slate-700/25 hover:bg-gradient-to-r from-slate-500/75 to-slate-800/75 p-2 border-2">
                                <h1 className="text-4xl font-semibold mb-4">{project['projectName']}</h1>
                                <h1 className="text-2xl font-sans">{project['projectDescriptionShort']}</h1>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;