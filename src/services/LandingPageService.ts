const API_URL = process.env.REACT_APP_PROJECT1_API_URL + '/Project';

const GetProjectList = async () => {
    try {
        console.log(process.env.REACT_APP_PROJECT1_API_URL)
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
        return jsonResponse.data; // Return the projects
    } catch (error) {
        console.error(error);
        return []; // Return an empty array on error
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
        return jsonResponse.data; // Return the projects
    } catch (error) {
        console.error(error);
        return null; // Return an empty array on error
    }
};

const AddProject = async (projectName: string, projectDescription: string, techStacks: string[], projectLink: string) => {
    try {
        console.log(projectName)

        const request = {
            projectName,
            "projectDescriptionLong": projectDescription,
            techStacks,
            projectLink
        };

        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("Token"),
            },
            body: JSON.stringify(request),
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
}

export { GetProjectList, GetProject, AddProject };