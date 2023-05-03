"use client";
import s from './page.module.css';
import InocLocker from "@/app/dash/(services)/inocLocker";
import PersonalDash from "@/app/dash/(services)/personalDash";
import {useKeyContext} from "@/context/keys";
import MedicalHistory from "@/app/dash/(services)/medicalHistory";
import Symptosis from "@/app/dash/(services)/symptosis";

export default function Content({files, content, historyKey, history, setContent, sCase}) {
    const [keys, _] = useKeyContext();

    if (keys.publicKey === "")
        return (<></>);
    else
        return (
            <div className={s.content}>
                {content === 0 && <PersonalDash files={files} history={history} sCase={sCase} setContent={setContent} />}
                {content === 1 && <MedicalHistory history={history} historyKey={historyKey}/>}
                {content === 2 && <InocLocker files={files}/>}
                {content === 3 && <Symptosis files={files} sCase={sCase} />}
            </div>
        );
}