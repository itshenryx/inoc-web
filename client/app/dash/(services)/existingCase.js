import s from '@/app/dash/page.module.css';
import {useEffect, useState} from "react";
import {cryptico} from "@veikkos/cryptico";
import {useKeyContext} from "@/context/keys";
import CryptoJS from "crypto-js";
import {doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore";
import {auth, db} from "@/app/firebase-config";
import {convertWordArrayToUint8Array} from "@/app/dash/(util)/convertWordArrayToUint8Array";
import CloseCase from "@/app/dash/(popups)/closeCase";

export default function ExistingCase({sCase, fetchSymptosis}) {
    const [pKey, setPKey] = useState(undefined);
    const [description, setDescription] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [prediction, setPrediction] = useState("");
    const [open, setOpen] = useState(false);
    const [keys, _] = useKeyContext();
    const [comment, setComment] = useState("");
    const [cArray, setCArray] = useState([]);

    const handleDownload = async () => {
        const snap = await getDoc(doc(db, "locker", auth.currentUser.uid, "owned", sCase.attached));
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

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "symptosis", sCase.pId), (doc) => {
            if ( doc !== undefined )
                setCArray(doc.data().comments);
        });

        const patientAES = cryptico.decrypt(sCase.pKey, keys.privateKey);
        setPKey(patientAES.plaintext);

        const dDescrition = CryptoJS.AES.decrypt(sCase.description, patientAES.plaintext).toString(CryptoJS.enc.Utf8);
        const dSymptoms = CryptoJS.AES.decrypt(sCase.symptoms, patientAES.plaintext).toString(CryptoJS.enc.Utf8);
        let symptomArr = dSymptoms.split(",");
        symptomArr = symptomArr.filter(r => r !== "");
        let stringSymptoms = "";
        symptomArr.forEach((str, index) => {
            const words = str.split("_");
            const convertedStr = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
            stringSymptoms = stringSymptoms.concat(convertedStr);
            if (index === symptomArr.length - 2)
                stringSymptoms = stringSymptoms.concat(" & ");
            else if (index !== symptomArr.length - 1)
                stringSymptoms = stringSymptoms.concat(", ");
        });
        let dPrediction = CryptoJS.AES.decrypt(sCase.prediction, patientAES.plaintext).toString(CryptoJS.enc.Utf8);
        dPrediction = dPrediction.replaceAll(",", ", ");

        setDescription(dDescrition);
        setSymptoms(stringSymptoms);
        setPrediction(dPrediction);
    }, []);

    const handleComment = async (e) => {
        e.target.disabled = true;
        let d = cArray;
        d.push("p_" + comment);
        await updateDoc(doc(db,"symptosis",sCase.pId),{
            comments: d,
        });
        e.target.value= "";
        setComment("");
        e.target.disabled = false;
    };

    return (
        <>
            {open && <CloseCase fetchSymptosis={fetchSymptosis} setOpen={setOpen} userID={sCase.pId} docID={sCase.dId}/>}
            <div className={s["case"]}>
                <div className={s["case-container"]}>
                    <div className={s["case-title"]}>
                        <p>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd"
                                    d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                                    clipRule="evenodd"/>
                            </svg>
                            {sCase.date}
                        </span>
                            Symptosis Consultation (Dr. {sCase.dName})
                        </p>
                        <button onClick={() => {
                            setOpen(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z"/>
                                <path fillRule="evenodd"
                                      d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5.22 1.72a.75.75 0 011.06 0L10 10.94l1.72-1.72a.75.75 0 111.06 1.06L11.06 12l1.72 1.72a.75.75 0 11-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 01-1.06-1.06L8.94 12l-1.72-1.72a.75.75 0 010-1.06z"
                                      clipRule="evenodd"/>
                            </svg>
                            CLOSE CASE
                        </button>
                    </div>
                    <div className={s["case-body"]}>
                        <div className={s["case-details"]}>
                            <div className={s["case-details-block"]}>
                                <div className={s["case-icon"]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"/>
                                    </svg>
                                </div>
                                <div className={s["case-data"]}>
                                    <label><span>Description</span> <p>{description}</p></label>
                                    <label><span>Symptoms</span> <p>{symptoms}</p></label>
                                    <label><span>Severity</span>
                                        <p>{sCase.severity === 0 ? "Low" : sCase.severity === 1 ? "Medium" : "High"}</p></label>
                                    <label><span>Attached File</span> {sCase.attachedName === "na" ? <p>No file Attached</p> :
                                        <div onClick={handleDownload}>
                                    <span>
                                        {sCase.attachedName}
                                    </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                                 className="w-5 h-5">
                                                <path
                                                    d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"/>
                                                <path
                                                    d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"/>
                                            </svg>
                                        </div>}</label>
                                </div>
                            </div>
                            <div className={s["case-details-block"]}>
                                <div className={s["case-icon"]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/>
                                    </svg>
                                </div>
                                <div className={s["case-data"]}>
                                    <label><span>Doctor's Name</span> <p>{sCase.dName}</p></label>
                                    <label><span>Age</span> <p>{sCase.dAge}</p></label>
                                    <label><span>Contact Number</span> <p>{sCase.dNumber}</p></label>
                                    <label><span>Email</span> <p>{sCase.dEmail}</p></label>
                                </div>
                            </div>
                        </div>
                        <div className={s["case-analysis"]}>
                            <div className={s["case-ai"]}>
                                <svg id="eLtG5EpaNv91" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink"
                                     viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                                    <ellipse rx="103.316954" ry="103.316954"
                                             transform="matrix(1.451843 0 0 1.451843 150.000004 150.000004)"
                                             fill="#2b3954"/>
                                    <g transform="matrix(.868831 0 0 0.868831 15.600084 10.338749)">
                                        <rect width="68.058964" height="125.798526" rx="34.03" ry="34.03"
                                              transform="matrix(.851156 0 0 0.851156 67.350096 96.462915)" fill="#fff"
                                              strokeWidth="0"/>
                                        <rect width="68.058964" height="125.798526" rx="34.03" ry="34.03"
                                              transform="matrix(.851156 0 0 0.851156 184.102137 96.462915)" fill="#fff"
                                              strokeWidth="0"/>
                                    </g>
                                </svg>
                                <div className={s["case-ai-data"]}>
                                    <h3>AI Analysis</h3>
                                    <p>
                                        {prediction}
                                    </p>
                                    <div>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path
                                                strokeLinecap="round" strokeLinejoin="round"
                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                                        </span>
                                        <p>
                                            Please only consider this as a preliminary analysis and wait for the consulted
                                            doctor's response.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={s["case-chat"]}>
                                <div className={s["case-chat-body"]}>
                                    <div className={s["case-chat-title"]}>
                                        <p>
                                            DR.<span>{sCase.dName}</span>
                                        </p>
                                        <span>{sCase.dEmail}</span>
                                    </div>
                                    <div className={s["case-chat-bodyc"]}>
                                        { cArray !== undefined &&
                                            cArray.map((data) => {
                                                if (data.substring(0,2) === "p_")
                                                    return (
                                                        <div className={s["case-msg-sent"]}>
                                                            <p>{data.slice(2)}</p>
                                                        </div>
                                                    )
                                                else
                                                    return (
                                                        <div className={s["case-msg-recieved"]}>
                                                            <p>{data.slice(2)}</p>
                                                        </div>
                                                    )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={s["case-chat-input"]}>
                                    <input type="text" value={comment} onChange={e => {
                                        setComment(e.target.value.trimStart());
                                    }} placeholder={"Enter your message here"}/>
                                    <button onClick={handleComment}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                             stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}