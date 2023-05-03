import s from '../page.module.css';
import {useUserContext} from "@/context/user";
import NewCase from "@/app/dash/(popups)/newCase";
import {CircularProgress} from "@mui/material";
import ExistingCase from "@/app/dash/(services)/existingCase";
import {useState} from "react";
import DoctorSymptosis from "@/app/dash/(services)/doctorSymptosis";
import ExistingCaseDoc from "@/app/dash/(services)/existingCaseDoc";

export default function Symptosis({files, sCase }) {
    const [user, _] = useUserContext();
    const [selectedCase, setSelectedCase] = useState(undefined);

    if (user.patient)
        return (
            <>
                {sCase === undefined ? <CircularProgress className={s.loading}/> :
                    sCase.length === 0 ? <NewCase files={files}/> :
                        <ExistingCase sCase={sCase}/>
                }
            </>
        );
    else
        return (
            <>
                {sCase === undefined ? <CircularProgress className={s.loading}/> :
                    selectedCase === undefined ?
                        <DoctorSymptosis setSelectedCase={setSelectedCase} sCase={sCase} files={files}/> :
                        <ExistingCaseDoc sCase={selectedCase} setSelectedCase={setSelectedCase}/>
                }
            </>
        );
}