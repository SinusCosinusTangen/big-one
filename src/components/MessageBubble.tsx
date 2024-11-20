import React from "react";
import Message from "../models/Message";

interface MessageProps {
    message: Message;
    currentUser?: string;
}

const MessageBubble: React.FC<MessageProps> = ({ message, currentUser }) => {
    const isSentByCurrentUser = message.from === currentUser;

    const today = new Date();
    const date = new Date(message.createdAt);
    const formattedDateTime = date.toLocaleString();
    var formattedTime = `${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

    if (date.getDate() + date.getMonth() !== today.getDate() + today.getMonth()) {
        formattedTime = `${date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    }

    return (
        <div className={`flex flex-col ${isSentByCurrentUser ? 'items-end' : 'items-start'} mb-2`}>
            {!isSentByCurrentUser && (
                <div>
                    <p className={`text-xs font-semibold text-slate-700 mb-1`}>
                        {message.fromUsername}
                    </p>
                </div>
            )}
            <div
                className={`relative max-w-xs py-2 rounded-lg text-sm overflow-hidden 
                            ${isSentByCurrentUser ? 'bg-blue-500  text-white' : 'bg-slate-300  text-black'}
                            transition-all duration-200 ease-in-out group`}
            >
                <p className="px-4">{message.message}</p>
                <div
                    className="flex justify-end relative pr-2 pl-4"
                >
                    <div className="relative">
                        <span className={`absolute bottom-0 right-0 text-xs ${isSentByCurrentUser ? 'text-slate-300' : 'text-slate-700'} transition-opacity duration-200 ease-in-out group-hover:opacity-0`}>
                            {formattedTime}
                        </span>
                        <span className={`text-xs ${isSentByCurrentUser ? 'text-slate-300' : 'text-slate-700'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out '`}>
                            {formattedDateTime}
                        </span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MessageBubble;
