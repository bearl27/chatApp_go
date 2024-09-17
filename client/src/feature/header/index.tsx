import { Settings, MessageCircle } from "lucide-react";
import style from "./index.module.scss";
import Link from "next/link";

export const Header = () => {
    return (
        <div className={style.header}>
            <Link href="/chat">
                <MessageCircle />
                <p>Chat</p>
            </Link>

            <Link href="/setting">
                <Settings />
                <p>Settings</p>
            </Link>
        </div>
    );
};