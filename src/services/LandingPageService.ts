import { TechStackRequest } from "../models/TechStack";

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
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return [];
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
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return null;
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

export { GetProjectList, GetProject, AddProject, DeleteProject };