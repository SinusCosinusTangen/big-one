import { useEffect, useState } from "react";
import { ValidateUserToken } from "../../services/AuthService";
import MessageRoom from "../../components/MessageRoom";
import { User } from "../../models/User";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/Firebase";

const MessagePage = () => {
    const [user, setUser] = useState<User>();
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [username, setUsername] = useState("admin1");

    const validateUser = async () => {
        try {
            const res = await ValidateUserToken(localStorage.getItem("Token"), localStorage.getItem("Username"));
            setUser(res);
            setRole(res.role);

            if (res.role === "ADMINISTRATOR") {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("User validation error:", error);
        }
    };

    useEffect(() => {
        validateUser();
    }, []);

    const fetchUserMessage = async () => {
        try {
            if (!user) {
                window.location.href = "/auth";
            }
            const querySnapshot = await getDocs(collection(db, 'messageUser'));
            const userList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching user messages: ", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserMessage();
        }
    }, [user]);

    return (
        <div className="font-sans">
            <div className="absolute z-1 inset-0 flex justify-center items-center">
                <div className="relative bg-white border border-gray-300 rounded shadow-lg max-w-5xl w-full flex">
                    {isAdmin && (<div className="w-1/3 border-r border-gray-300 p-4">
                        {users.map((usr) => isAdmin && (
                            <button
                                key={usr.id}
                                className="mt-2 block w-full h-10 px-3 py-2 border border-sky-500 rounded-md text-black text-sm shadow-sm font-semibold hover:bg-sky-500 hover:text-white focus:ring focus:ring-sky-300 active:bg-sky-600 active:scale-95 transition-transform duration-200"
                                onClick={() => setUsername(usr.username)}
                            >
                                {usr.username}
                            </button>
                        ))}
                    </div>)}

                    <div className="flex-grow">
                        <MessageRoom user1={username} user2={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagePage;
