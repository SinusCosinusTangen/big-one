import { TechStackRequest } from "../models/TechStack";
import { collection, addDoc, getDocs, query, where, deleteDoc, getDoc, doc } from "firebase/firestore";
import { db } from '../services/Firebase';

const API_URL = process.env.REACT_APP_MIDDLEWARE_API_URL + '/Project';

const getProjectList = async () => {
    try {
        const appState = await checkMiddlewareStatus();
        if (appState === 'OFFLINE') {
            return await getProjectListFromFirestore();
        }

        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return await getProjectListFromFirestore();
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return await getProjectListFromFirestore();;
    }
};

const getProject = async (id: string) => {
    try {
        const appState = await checkMiddlewareStatus();
        if (appState === 'OFFLINE') {
            return await getProjectFromFirestore(id);
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return await getProjectFromFirestore(id);
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return await getProjectFromFirestore(id);
    }
};

const addProject = async (projectName: string, projectDescription: string, techStacks: TechStackRequest[], projectLink: string) => {
    try {

        const request = {
            projectName,
            "projectDescriptionLong": projectDescription,
            "techStacks": techStacks,
            projectLink
        };

        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("Token"),
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        window.location.href = "/";
    } catch (error) {
        console.error(error);
        return null;
    }
}

const updateProject = async (projectId: string, projectName: string, projectDescription: string, techStacks: TechStackRequest[], projectLink: string) => {
    try {

        const request = {
            "id": projectId,
            projectName,
            "projectDescriptionLong": projectDescription,
            "techStacks": techStacks,
            projectLink
        };

        const response = await fetch(`${API_URL}/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("Token"),
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        window.location.href = "/";
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteProject = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("Token"),
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        window.location.href = "/";
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteProjectsFromFirestore = async () => {
    const projectsCollection = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsCollection);

    const deletePromises = projectsSnapshot.docs.map(doc => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
};

const loadProjectToFirestore = async () => {
    try {
        await deleteProjectsFromFirestore();
        const projects = await getProjectList();
        for (const project of projects) {
            await addDoc(collection(db, "projects"), project);
        }
    } catch (error) {
        console.error(error);
    }
};

const getProjectListFromFirestore = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return projectList;
    } catch (error) {
        console.error("Error fetching projects: ", error);
    }
};

const getProjectFromFirestore = async (id: string) => {
    try {
        const projectsRef = collection(db, 'projects');

        const q = query(projectsRef, where('id', '==', id));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No matching documents found.");
            return null;
        }

        const projectData = querySnapshot.docs[0].data();
        const firestoreId = querySnapshot.docs[0].id;
        return { firestoreId, ...projectData };
    } catch (error) {
        console.error("Error fetching project: ", error);
    }
};

const checkMiddlewareStatus = async () => {
    const docRef = doc(db, 'appState', 'middleware');
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        return docSnapshot.data()['state'];
    } else {
        console.log("No document found!");
    }

    return 'OFFLINE';
}

const getLinkUrl = async () => {
    const docRef = doc(db, 'link', 'link');
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return {
            github: data.github,
            gitlab: data.gitlab,
            linkedin: data.linkedin,
            cv: data.cv
        }
    }

    return {
        github: process.env.REACT_APP_GITHUB_URL,
        gitlab: process.env.REACT_APP_GITLAB_URL,
        linkedin: process.env.REACT_APP_LINKEDIN_URL,
        cv: process.env.REACT_APP_CV_URL
    };
}

export { getProjectList, getProject, addProject, updateProject, deleteProject, loadProjectToFirestore, checkMiddlewareStatus, getLinkUrl };