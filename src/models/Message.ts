interface Message {
    id?: string | null | undefined;
    from: string;
    fromUsername: string;
    to: string;
    toUsername: string;
    message: string;
    createdAt: number;
}

export default Message;