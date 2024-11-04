import { TechStackRequest } from "../models/TechStack";
import { collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db } from '../services/Firebase';

const API_URL = process.env.REACT_APP_MIDDLEWARE_API_URL + '/Project';

const GetProjectList = async () => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return await GetProjectListFromFirestore();
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return await GetProjectListFromFirestore();;
    }
};

const GetProject = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return await GetProjectFromFirestore(id);
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return await GetProjectFromFirestore(id);
    }
};

const AddProject = async (projectName: string, projectDescription: string, techStacks: TechStackRequest[], projectLink: string) => {
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

const UpdateProject = async (projectId: string, projectName: string, projectDescription: string, techStacks: TechStackRequest[], projectLink: string) => {
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

const DeleteProject = async (id: string) => {
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

const LoadProjectToFirestore = async () => {
    try {
        await deleteProjectsFromFirestore();
        const projects = await GetProjectList();
        for (const project of projects) {
            await addDoc(collection(db, "projects"), project);
        }
    } catch (error) {
        console.error(error);
    }
};

const GetProjectListFromFirestore = async () => {
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

const GetProjectFromFirestore = async (id: string) => {
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

export { GetProjectList, GetProject, AddProject, UpdateProject, DeleteProject, LoadProjectToFirestore };