import {useUserContext} from "@/context/user";
import s from '../page.module.css';

export default function MedicalHistory() {

    return (
        <div className={s["il-container"]}>
            <div className={s["il-header"]}>
                <p>
                    <h1>Prescription History </h1>
                    <span>View details of prescriptions issued to you</span>
                </p>
            </div>
            {/*<div className={s["il-body"]}>*/}
            {/*    {files === undefined ? (<>*/}
            {/**/}
            {/*        </>)*/}
            {/*        : files.map(file => {*/}
            {/*            return (<File data={file} fetchData={fetchData}/>);*/}
            {/*        })*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    );
}