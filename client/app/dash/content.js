"use client";
import s from './page.module.css';
import InocLocker from "@/app/dash/(services)/inocLocker";

export default function Content() {
    return (
        <div className={s.content} >
            <InocLocker />
        </div>
    )
}