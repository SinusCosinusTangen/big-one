import { useEffect, useState } from "react";
import { ValidateUserToken } from "../../services/AuthService";
import MessageRoom from "../../components/MessageRoom";
import { User } from "../../models/User";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/Firebase";
import { USER_ADMIN } from "../../constant/Value";

const MessagePage = () => {
    const [user, setUser] = useState<User>();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [userTo, setUserTo] = useState<User>(USER_ADMIN);

    const validateUser = async () => {
        try {
            const res = await ValidateUserToken(localStorage.getItem("Token"), localStorage.getItem("Username"));
            setUser(res);

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
                <div className="relative bg-white border border-gray-300 rounded shadow-lg max-w-5xl w-full flex h-[500px]">
                    {isAdmin && (
                        <div className="w-1/3 border-r border-gray-300 overflow-y-auto chat-list">
                            {users.map((usr) => isAdmin && (
                                <button
                                    key={usr.id}
                                    className={`block w-full h-10 px-3 py-2 border-slate-500 border-b text-black text-sm shadow-sm font-semibold hover:bg-sky-500 hover:text-white transition-transform duration-200 ` + (userTo.username == usr.username ? `bg-slate-300` : ``)}
                                    onClick={() => setUserTo(usr)}
                                >
                                    {usr.username}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-grow">
                        <MessageRoom user1={userTo} user2={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagePage;
