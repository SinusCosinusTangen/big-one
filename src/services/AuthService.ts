const API_URL = process.env.REACT_APP_MIDDLEWARE_API_URL + '/Auth';

const GetPublicKey = async () => {
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
        sessionStorage.setItem("publicKey", jsonResponse.data['publicKey']);
        return jsonResponse.data;
    } catch (error) {
        console.error(error);
        return;
    }
};

const RegisterUser = async (email: string, username: string, password: string, loginMethod: string) => {
    try {
        const encryptedPassword = await encryptPassword(password);
        if (!encryptedPassword) {
            throw new Error("Encryption failed.");
        }

        const request = {
            email,
            username,
            password: encryptedPassword,
            loginMethod
        };

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
};

const Login = async (usernameEmail: string, password: string, loginMethod: string) => {
    try {
        const encryptedPassword = await encryptPassword(password);
        if (!encryptedPassword) {
            throw new Error("Encryption failed.");
        }

        const request = {
            usernameEmail,
            password: encryptedPassword,
            loginMethod
        };

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const jsonResponse = await response.json();

        if (!response.ok) {
            if (jsonResponse.data) {
                throw new Error(jsonResponse.data);
            }
            throw new Error('Network response was not ok');
        }

        const token = jsonResponse.data["token"];
        const username = jsonResponse.data["username"];
        localStorage.setItem("Token", token);
        localStorage.setItem("Username", username);

        if (token) {
            window.location.href = "/";
        }

        return jsonResponse.data;
    } catch (error: any) {
        console.error(error.message);
        return { error: error.message };
    }
}


const ValidateUserToken = async (token: string | null, username: string | null) => {
    try {
        const request = {
            username,
            token
        };

        const response = await fetch(`${API_URL}/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            // Do nothing
        }

        const jsonResponse = await response.json();
        var newToken = jsonResponse.data["token"];

        if (username && newToken !== "EXPIRED") {
            localStorage.setItem("Token", newToken);
            localStorage.setItem("Username", username);

            return jsonResponse.data["role"];
        }

        return "";
    } catch (error) {
        return "";
    }
}

const Logout = async (token: string | null, username: string | null) => {
    const request = {
        username,
        token
    };

    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const jsonResponse = await response.json();

    console.log(jsonResponse);

    if (jsonResponse["data"] === "LOGOUT") {
        localStorage.removeItem("Token");
        localStorage.removeItem("Username");
    }

    window.location.href = "/";
}

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
    const b64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\n/g, '');

    const binaryString = window.atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

const importPublicKey = async (pem: string): Promise<CryptoKey | null> => {
    const keyData = pemToArrayBuffer(pem);

    return crypto.subtle.importKey(
        'spki',
        keyData,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        true,
        ['encrypt']
    ).catch(error => {
        console.error("Failed to import public key", error);
        return null;
    });
};

const encryptPassword = async (password: string): Promise<string | null> => {
    const publicKeyPem = sessionStorage.getItem('publicKey');
    if (!publicKeyPem) {
        throw new Error("Public key not available in session storage.");
    }

    const publicKey = await importPublicKey(publicKeyPem);
    if (!publicKey) {
        throw new Error("Invalid public key.");
    }

    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(password);

    const encryptedArrayBuffer = await crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        publicKey,
        encodedMessage
    );

    return arrayBufferToBase64(encryptedArrayBuffer);
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const binaryString = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return window.btoa(binaryString);
};

export { GetPublicKey, RegisterUser, Login, ValidateUserToken, Logout };