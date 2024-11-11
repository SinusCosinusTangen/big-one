import { useState, useEffect, useRef } from 'react';
import { query, collection, orderBy, limit, onSnapshot, addDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../services/Firebase';
import MessageBubble from './MessageBubble';
import Message from '../models/Message';
import { User } from '../models/User';
import { send } from 'react-icons-kit/fa/send'
import Icon from 'react-icons-kit';

interface MessageRoomProps {
    user1: User;
    user2?: User;
}

const MessageRoom: React.FC<MessageRoomProps> = ({ user1, user2 }) => {
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");

    window.scrollTo(0, document.body.scrollHeight);

    useEffect(() => {
        if (user2) {
            setMessages([]);
            const q1 = query(
                collection(db, "messages"),
                where("from", "==", user2.id),
                where("to", "==", user1.id),
                orderBy("createdAt", "desc"),
                limit(50)
            );

            const q2 = query(
                collection(db, "messages"),
                where("from", "==", user1.id),
                where("to", "==", user2.id),
                orderBy("createdAt", "desc"),
                limit(50)
            );

            const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = { ...doc.data(), id: doc.id } as Message;

                    if (!fetchedMessages.some(msg => msg.id === data.id)) {
                        fetchedMessages.push(data);
                    }
                });

                setMessages((prevMessages) => {
                    const combinedMessages = [...prevMessages, ...fetchedMessages];
                    const uniqueMessages = Array.from(new Set(combinedMessages.map(msg => msg.id)))
                        .map(id => combinedMessages.find(msg => msg.id === id))
                        .filter((msg): msg is Message => msg !== undefined);

                    return uniqueMessages.sort((a, b) => a.createdAt - b.createdAt);
                });
            });

            const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = { ...doc.data(), id: doc.id } as Message;

                    if (!fetchedMessages.some(msg => msg.id === data.id)) {
                        fetchedMessages.push(data);
                    }
                });

                setMessages((prevMessages) => {
                    const combinedMessages = [...prevMessages, ...fetchedMessages];
                    const uniqueMessages = Array.from(new Set(combinedMessages.map(msg => msg.id)))
                        .map(id => combinedMessages.find(msg => msg.id === id))
                        .filter((msg): msg is Message => msg !== undefined);

                    return uniqueMessages.sort((a, b) => a.createdAt - b.createdAt);
                });
            });

            return () => {
                unsubscribe1();
                unsubscribe2();
            };
        }
    }, [user1, user2]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, []);

    const fetchMessageUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'messageUser'));
            const messageUserList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return messageUserList;
        } catch (error) {
            console.error("Error fetching projects: ", error);
        }
    }

    const sendMessage = async () => {
        try {
            if (!user2) {
                window.location.href = "/auth";
                return;
            }

            if (text.trim() === "") {
                console.error("Cannot send an empty message");
                return;
            }

            const message: Message = {
                from: user2.id,
                fromUsername: user2.username,
                to: user1.id,
                toUsername: user1.username,
                message: text,
                createdAt: new Date().getTime()
            };

            const messageUser = {
                id: user2.id,
                username: user2.username
            }

            setText("");
            await addDoc(collection(db, "messages"), message);

            const messageUserList = await fetchMessageUsers();
            const messageUserIdList = messageUserList?.map((usr) => usr.id);

            if (messageUserList?.length === 0 || (messageUserIdList && !messageUserIdList.includes(user2.id))) {
                await addDoc(collection(db, "messageUser"), messageUser);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <p className="p-4 shadow-lg">{user1.username}</p>
            <div ref={messageContainerRef} className="flex-grow overflow-y-auto max-h-[400px] p-2 message">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} currentUser={user2?.id} />
                ))}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                className="mt-2 z-50 px-4 py-2 relative"
            >
                <div className="flex items-center">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        className={`flex-grow h-12 px-4 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-md 
                        transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400`}
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="absolute ml-2 right-4 h-12 w-12 flex items-center justify-center active:text-sky-500"
                    >
                        <Icon icon={send} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageRoom;
