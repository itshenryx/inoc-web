"use client";

import s from '../page.module.css';
import {useUserContext} from "@/context/user";
import UpdateDetails from "@/app/dash/(popups)/updateDetails";
import {useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "@/app/firebase-config";
import {cryptico} from "@veikkos/cryptico";
import CryptoJS from "crypto-js";
import {useKeyContext} from "@/context/keys";
import {convertWordArrayToUint8Array} from "@/app/dash/(util)/convertWordArrayToUint8Array";

function LockerItems({data}) {
    const [keys, _] = useKeyContext();

    const handleDownload = async () => {
        const snap = await getDoc(doc(db, "locker", auth.currentUser.uid, data.shared ? "recieved" : "owned", data.id));
        const fileData = snap.data();
        const decryptedKey = cryptico.decrypt(fileData.aes, keys.privateKey);
        let aesKey = decryptedKey.plaintext;
        const decryptedContent = CryptoJS.AES.decrypt(fileData.content, aesKey);

        const typedArray = convertWordArrayToUint8Array(decryptedContent);
        const blob = new Blob([typedArray], {type: fileData.mimeType});
        const href = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), {href, style: "display:none", download: fileData.name});
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(href);
        a.remove();
    };

    return (
        <div className={s["file-preview"]} onClick={handleDownload}>
            <span>{data.name.split(".")[1]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                 className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h1>{data.name.split(".")[0]}</h1>
            <p>{data.size}</p>
        </div>
    );
};

export default function PersonalDash({files, history, sCase, setContent}) {
    const [user, _] = useUserContext({});
    const [changeDetails, setChangeDetails] = useState(false);

    return (<>
            {changeDetails && <UpdateDetails changeDetails={changeDetails} setChangeDetails={setChangeDetails}/>}
            <div className={s["pd"]}>
                <div className={s["pd-left"]}>
                    <div className={s["pd-title"]}>
                        <div>
                            <p>Personal Details</p>
                            <span>Stored Securely using E2EE</span>
                        </div>
                        <button onClick={() => setChangeDetails(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path
                                    d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"/>
                            </svg>
                        </button>
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
                <div className={s["pd-right"]}>
                    <div className={s["pd-rbox"]}>
                        <div className={s["pd-rbox-title"]}>
                            <p>
                                inocLocker<span>Recently Added Files</span>
                            </p>
                            <button onClick={() => setContent(2)}>
                                <span>View in inocLocker</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}
                                     stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                                </svg>
                            </button>
                        </div>
                        <div className={s["pd-rbox-box"]}>
                            <div className={s["pd-rbox-boxc"]}>
                                {files === undefined ? <></> :
                                    files.map((data) => {
                                        return (<LockerItems data={data}/>)
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    {
                        user.patient ?
                            <div className={s["pd-bottom-box"]}>
                                <div className={s["pd-history"]}>
                                    <div className={s["pd-rbox-title"]}>
                                        <p>
                                            Medical History
                                        </p>
                                        <button onClick={() => setContent(1)}>
                                            <span>More details</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.8}
                                                 stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className={s["pd-history-details"]}>
                                        { history !== undefined &&
                                            history.map((data) => {
                                                return (
                                                   <div className={s.homeHistory}>
                                                        <p><span>Doctor</span>{data.dName}</p>
                                                        <span>{data.opened}</span>
                                                   </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={s["pd-symptosis"]}>
                                    <h2>Open Symptosis Case</h2>
                                </div>
                            </div> :
                            <div className={s["pd-bottom-box"]}>
                                <div className={s["pd-history"]}>
                                    <div className={s["pd-rbox-title"]}>
                                        <p>
                                            Open Symptosis Cases
                                        </p>
                                        <button onClick={() => setContent(3)}>
                                            <span>Read more</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.8}
                                                 stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                    }

                    {/*<div className={s["pd-rbox"]}>*/}
                    {/*    <div className={s["pd-rbox-title"]}>*/}
                    {/*        <p>*/}
                    {/*            Medical History<span>Recently Added</span>*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*    <div className={s["pd-rbox-box"]}>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className={s["pd-rbox"]}>*/}
                    {/*    <div className={s["pd-rbox-title"]}>*/}
                    {/*        <p>*/}
                    {/*            Symptosis<span>Open cases</span>*/}
                    {/*        </p>*/}
                    {/*        <button onClick={() => setContent(3)}>*/}
                    {/*            <span>More details</span>*/}
                    {/*            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}*/}
                    {/*                 stroke="currentColor" className="w-6 h-6">*/}
                    {/*                <path strokeLinecap="round" strokeLinejoin="round"*/}
                    {/*                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>*/}
                    {/*            </svg>*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*    <div className={s["pd-rbox-box"]}>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                {/*<div className={s["pd-profile"]}>*/}
                {/*</div>*/}
                {/*<div className={s["pd-locker"]}>*/}
                {/*</div>*/}
            </div>
        </>
    );
}