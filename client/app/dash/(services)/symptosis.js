import s from '../page.module.css';
import {useUserContext} from "@/context/user";
import NewCase from "@/app/dash/(popups)/newCase";

export default function Symptosis({files}) {
    const [user, _] = useUserContext();

    if (user.patient)
        return (
            <NewCase files={files}/>
        );
    else
        return (
            <div className={s["symptosis-doctor"]}>

            </div>
        );
}