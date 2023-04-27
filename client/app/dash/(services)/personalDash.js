"use client";

import s from '../page.module.css';
import {useUserContext} from "@/context/user";
import UpdateDetails from "@/app/dash/(popups)/updateDetails";
import {useState} from "react";

export default function PersonalDash({files, fetchData}) {
    const [user, _] = useUserContext({});
    const [changeDetails, setChangeDetails] = useState(false);

    return ( <>
        {changeDetails && <UpdateDetails changeDetails={changeDetails} setChangeDetails={setChangeDetails} />}
        <div className={s["pd"]}>
            <div className={s["pd-left"]}>
                <div className={s["pd-profile"]}>
                    <div className={s["il-header"]}>
                        <p>
                            <h1>Personal Details</h1>
                        </p>
                        <div className={s["il-buttons"]}>
                            <button onClick={() => setChangeDetails(true)}>
                                EDIT DETAILS
                            </button>
                        </div>
                    </div>
                    <div className={s["pd-details"]}>
                        <label><span>name</span> <p>{user.name}</p></label>
                        <label><span>age</span> <p>{user.age}</p></label>
                        <label><span>number</span> <p>{user.number}</p></label>
                        <label><span>email</span> <p>{user.email}</p></label>
                        <label><span>blood group</span> <p>{user.blood}</p></label>
                        <label><span>gender</span> <p>{user.gender}</p></label>
                        <label><span>address</span> <p>{user.address}</p></label>
                        <label><span>TYPE</span> <p>{user.patient ? "Patient" : "Doctor"}</p></label>
                    </div>
                </div>
                <div className={s["pd-locker"]}>
                </div>
            </div>
            <div className={s["pd-right"]}>
            </div>
        </div>
        </>
    );
}