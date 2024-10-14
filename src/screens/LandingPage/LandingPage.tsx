import React, {useEffect, useState} from "react";
import '../../output.css'
import bg from '../../asset/image/bg-img.jpeg'
import { GetProjectList } from "../../services/LandingPageService";
import ProjectDetailCard from "../../components/ProjectDetailCard";
import { ValidateUserToken } from "../../services/AuthService";
import AddProjectForm from "../../components/AddProjectForm";

const LandingPage = () => {

    // Retaining background image styling
    const style = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh', // Ensure it covers the full height
    };

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [isProjectDetailHidden, setIsProjectDetailHidden] = useState(true);
    const [showAddProject, setShowAddProject] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [greeting, setGreeting] = useState("Hello there!");

    useEffect(() => {
        const fetchProjects = async () => {
            const projectList = await GetProjectList();
            setProjects(projectList);
        };

        const makeGreeting = () => {
            const morning = "Good morning,"
            const afternoon = "Good afternoon,"
            const evening = "Good evening,"
            
            const currentHour = new Date().getHours();

            if (currentHour < 12) {
                setGreeting(morning);
            } else if (currentHour < 18) {
                setGreeting(afternoon);
            } else {
                setGreeting(evening);
            }
        }

        fetchProjects();
        makeGreeting();
        setIsAuthenticated(ValidateUserToken(sessionStorage.getItem("Token"), sessionStorage.getItem("Username")));
    }, []);

    return (
        <div className="min-h-screen font-sans overflow-y-auto bg-slate-700/30" style={style}>
            {/* Project Details Modal */}
            {!isProjectDetailHidden && (
                <div 
                    className="fixed z-50 inset-0 bg-black/80 flex justify-center items-center px-4" 
                    onClick={() => { setIsProjectDetailHidden(true); setProjectId(""); }} 
                >
                    <div 
                        className="relative p-4 bg-white border border-gray-300 rounded shadow-lg max-w-md w-full" 
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <button
                            onClick={() => { setProjectId(""); setIsProjectDetailHidden(true); }}
                            className="absolute top-2 right-5 text-gray-600 text-4xl hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <ProjectDetailCard id={projectId} />
                    </div>
                </div>
            )}

            {/* Add Project Modal */}
            {showAddProject && (
                <div 
                    className="fixed z-50 inset-0 bg-black/80 flex justify-center items-center px-4" 
                    onClick={() => { setShowAddProject(false); }}
                >
                    <div 
                        className="relative p-4 bg-white border border-gray-300 rounded shadow-lg max-w-md w-full" 
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <button
                            onClick={() => { setShowAddProject(false); }}
                            className="absolute top-2 right-5 text-gray-600 text-4xl hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <AddProjectForm />
                    </div>
                </div>
            )}

            <div className="mx-5">
                {/* Header Section */}
                <div className="py-16 sm:py-20 text-center">
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl mt-4">{greeting}</h2>
                    <h1 className="text-white text-6xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
                        Welcome to <a className="hover:underline hover:font-bold" href="#">James's</a> Portfolio
                    </h1>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5 sm:px-10 pb-10">
                    <button 
                        onClick={() => {
                            // setProjectId(project['id']); 
                            setIsProjectDetailHidden(!isProjectDetailHidden);
                        }}
                        className="h-40 sm:h-52 text-center text-white rounded-lg bg-slate-700/25 hover:bg-gradient-to-r from-slate-500/75 to-slate-800/75 p-2 border-2"
                    >
                        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Project Dummy1</h1>
                        <h2 className="text-md sm:text-2xl font-sans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore...</h2>
                    </button>
                    {projects.map((project) => (
                        <button 
                            key={project['id']} 
                            onClick={() => {
                                setProjectId(project['id']); 
                                setIsProjectDetailHidden(!isProjectDetailHidden);
                            }}
                            className="h-40 sm:h-52 text-center text-white rounded-lg bg-slate-700/25 hover:bg-gradient-to-r from-slate-500/75 to-slate-800/75 p-2 border-2"
                        >
                            <h1 className="text-3xl sm:text-4xl font-semibold mb-4">{project['projectName']}</h1>
                            <h2 className="text-md sm:text-2xl font-sans">{project['projectDescriptionShort']}</h2>
                        </button>
                    ))}

                    {isAuthenticated && (
                        <button onClick={() => { setShowAddProject(true); }}>
                            <div className="h-40 sm:h-52 items-center text-center text-white rounded-lg bg-slate-700/25 hover:bg-gradient-to-r from-slate-500/75 to-slate-800/75 p-2 border-2">
                                <h1 className="text-6xl font-semibold mb-4 mt-4">+</h1>
                                <h2 className="text-xl sm:text-2xl font-sans">Add Project</h2>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
