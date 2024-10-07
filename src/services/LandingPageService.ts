import React, { useState, useEffect } from "react";

const GetProjectList = async () => {
    try {
        const response = await fetch('http://localhost:5190/api/Project', {
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
        const response = await fetch(`http://localhost:5190/api/Project/${id}`, {
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

export { GetProjectList, GetProject };