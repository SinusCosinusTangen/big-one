interface Message {
    id?: string | null | undefined;
    from: string;
    to: string;
    message: string;
    createdAt: number;
}

export default Message;