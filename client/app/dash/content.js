"use client";
import s from './page.module.css';
import InocLocker from "@/app/dash/(services)/inocLocker";
import PersonalDash from "@/app/dash/(services)/personalDash";

export default function Content({files,fetchData,content}) {
    return (
        <div className={s.content} >
            {content === 0 && <PersonalDash /> }
            {content === 2 && <InocLocker files={files} fetchData={fetchData}/> }
        </div>
    );
}