import { useEffect, useState } from "react";
import bg from '../../asset/image/bg-img.jpeg'
import ProjectDetailCard from "../../components/ProjectDetailCard";
import { ValidateUserToken, Logout } from "../../services/AuthService";
import AddProjectForm from "../../components/AddProjectForm";
import Project from "../../models/Project";
import Navbar from "../../components/Navbar";
import ScrollButton from "../../components/ScrollButton";
import { GetProjectList } from "../../services/LandingPageService";
import MessagePage from "../Message/MessagePage";

const LandingPage = () => {
    const cvUrl = process.env.REACT_APP_CV_URL;

    const style = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
    };

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState("");
    const [isProjectDetailHidden, setIsProjectDetailHidden] = useState(true);
    const [showAddProject, setShowAddProject] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState("");
    const [greeting, setGreeting] = useState("Hello there!");
    const [username, setUsername] = useState(() => {
        const storedUsername = localStorage.getItem("Username");
        return storedUsername ? ` ${storedUsername}` : "";
    });
    const [showMessagePage, setShowMessagePage] = useState(false);

    const fetchProjects = async () => {
        const projectList = await GetProjectList();
        setProjects(projectList);
    };

    const makeGreeting = () => {
        const morning = `Good morning${username},`
        const afternoon = `Good afternoon${username},`
        const evening = `Good evening${username},`

        const currentHour = new Date().getHours();

        if (currentHour >= 4 && currentHour < 12) {
            setGreeting(morning);
        } else if (currentHour >= 12 && currentHour < 18) {
            setGreeting(afternoon);
        } else {
            setGreeting(evening);
        }
    }

    const validateUser = () => {
        ValidateUserToken(localStorage.getItem("Token"), localStorage.getItem("Username")).then((res) => {
            setRole(res.role);

            if (res.role === "ADMINISTRATOR") {
                setIsAdmin(true);
            }
        });
    }

    useEffect(() => {
        fetchProjects();
        makeGreeting();
        validateUser();
    }, [username, role]);

    const handleLogout = async () => {
        await Logout(localStorage.getItem("Token"), localStorage.getItem("Username"));
        setRole("");
    }

    const toggleMessageOverlay = () => {
        setShowMessagePage(true);
    }

    return (
        <div className="min-h-screen font-sans overflow-y-hidden bg-slate-700/30 no-scrollbar" style={style}>
            <Navbar role={role} handleLogout={handleLogout} toggleMessageOverlay={toggleMessageOverlay} />
            {/* Project Details Modal */}
            {!isProjectDetailHidden && (
                <div
                    className="fixed z-50 inset-0 bg-black/80 flex justify-center items-center px-4"
                    onClick={() => { setIsProjectDetailHidden(true); setProjectId(""); }}
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setIsProjectDetailHidden(true); }}
                            className="absolute top-2 right-4 text-gray-400 text-4xl hover:text-gray-200 focus:outline-none"
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
                        Welcome to <a className="hover:underline hover:font-bold active:font-semibold" href={cvUrl} target="_blank">James's</a> Portfolio
                    </h1>
                    <a href="https://github.com/SinusCosinusTangen">GitHub</a>
                </div>

                {/* Projects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5 sm:px-10 pb-10">
                    {isAdmin && (
                        <button onClick={() => { setShowAddProject(true); }}>
                            <div className="h-40 sm:h-52 text-center text-white rounded-lg bg-slate-700/25 p-2 border-2 hover:bg-gradient-to-r hover:from-slate-500/75 hover:to-slate-800/75 hover:scale-105 active:bg-gradient-to-r active:from-slate-500 active:to-slate-800 active:scale-100 transition-transform duration-200">
                                <h1 className="text-6xl font-semibold mb-4 mt-4">+</h1>
                                <h2 className="text-xl sm:text-2xl font-sans">Add Project</h2>
                            </div>
                        </button>
                    )}
                    {projects.map((project) => (
                        <button
                            key={project['id']}
                            onClick={() => {
                                setProjectId(project['id']);
                                setIsProjectDetailHidden(!isProjectDetailHidden);
                            }}
                            className="h-40 sm:h-52 text-center text-white rounded-lg bg-slate-700/25 p-2 border-2 hover:bg-gradient-to-r hover:from-slate-500/75 hover:to-slate-800/75 hover:scale-105 active:bg-gradient-to-r active:from-slate-500 active:to-slate-800 active:scale-100 transition-transform duration-200"
                        >
                            <h1 className="text-3xl sm:text-4xl font-semibold mb-4">{project['projectName']}</h1>
                            <h2 className="text-md sm:text-2xl font-sans">{project['projectDescriptionShort']}</h2>
                        </button>
                    ))}
                </div>
            </div>

            {/* Message Modal */}
            {showMessagePage && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                    onClick={() => { setShowMessagePage(!showMessagePage); }}>
                    <div
                        className="relative h-fit w-full max-w-xl bg-white rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setShowMessagePage(false); }}
                            className="absolute right-5 text-gray-600 text-4xl hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <MessagePage />
                    </div>
                </div>
            )}
            <ScrollButton />
        </div>
    );
};

export default LandingPage;
