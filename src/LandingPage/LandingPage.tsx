import React, {useEffect, useState} from "react";
import '../output.css'
import './LandingPage.css'
import bg from './img/bg-img.jpeg'

const LandingPage = () => {

    const style = {backgroundImage: `url(${bg})`,
                   backgroundPosition: 'center',
                   backgroundSize: 'cover',
                   backgroundRepeat: 'no-repeat'
                  }

    var projectList = [{'projectName': 'Project 1', 'projectDesc': 'Description for project 1', 'projectLink': '#'}];

    for (var i = 2; i < 20; i++) {
        projectList.push({'projectName': 'Project ' + i.toString(), 'projectDesc': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + i.toString(), 'projectLink': '#'})
    }

    return (
        <div className="h-screen font-sans overflow-y-auto bg-slate-700/30" style={style}>
            <div className="mx-5">
                <div className="p-20 text-center">
                    <h1 className="text-white text-6xl font-semibold">Welcome to <a className="hover:underline hover:font-bold" href="#">James's</a> Portfolio</h1>
                    <h1 className="text-white text-4xl">Below are my list of project</h1>
                </div>
                <div className="grid grid-cols-3 gap-8 px-40 pb-10">
                    {projectList.map((project) => (
                        <a href={project['projectLink']}>
                            <div className="h-56 text-center text-white rounded-lg bg-slate-700/25 hover:bg-gradient-to-r from-slate-500 to-slate-800 p-2 border-2">
                                    <h1 className="text-4xl font-semibold">{project['projectName']}</h1>
                                    <h1 className="text-2xl font-sans">{project['projectDesc']}</h1>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;