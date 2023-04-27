"use client";
import s from './page.module.css';
import InocLocker from "@/app/dash/(services)/inocLocker";

export default function Content({files,fetchData}) {
    return (
        <div className={s.content} >
            <InocLocker files={files} fetchData={fetchData}/>
        </div>
    );
}