import s from '../page.module.css';
import {useUserContext} from "@/context/user";
import NewCase from "@/app/dash/(popups)/newCase";
import {CircularProgress} from "@mui/material";
import ExistingCase from "@/app/dash/(services)/existingCase";

export default function Symptosis({files,sCase,fetchSymptosis}) {
    const [user, _] = useUserContext();

    if (user.patient)
        return (
            <>
                {sCase === undefined ? <CircularProgress className={s.loading}/>  :
                    sCase.length === 0 ? <NewCase fetchSymptosis={fetchSymptosis} files={files}/> :
                        <ExistingCase fetchSymptosis={fetchSymptosis} sCase={sCase}/>
                }
            </>
        );
    else
        return (
            <div className={s["symptosis-doctor"]}>

            </div>
        );
}