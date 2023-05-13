import s from "@/app/dash/page.module.css";
import {useEffect, useState} from "react";
import * as Select from "@radix-ui/react-select";
import symptomList from "@/app/dash/(util)/symptomList";
import {doc, collection, getDocs, query, setDoc, getDoc, addDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "@/app/firebase-config";
import AttachFile from "@/app/dash/(popups)/attachFile";
import {cryptico} from "@veikkos/cryptico";
import CryptoJS from "crypto-js";
import {useUserContext} from "@/context/user";
import {useKeyContext} from "@/context/keys";

async function getAIresult(symptoms) {
    const body = {symptoms: symptoms.filter(r => r !== "")};
    return fetch("http://16.16.103.70/predict", {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

function Symptom({symptoms, index, setRefreshState}) {
    return (
        <Select.Root onValueChange={r => {
            symptoms[index] = r;
            setRefreshState(Math.random());
        }}>
            <Select.Trigger className={s.SymptomTrigger}>
                <Select.Value placeholder={"Select a Symptom that you are facing "}/>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className={s.SymptomContent}>
                    <Select.ScrollUpButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
                        </svg>
                    </Select.ScrollUpButton>
                    <Select.Viewport className={s.SymptomViewport}>
                        <Select.Group>
                            <Select.Label className={s.SelectLabel}>Symptoms</Select.Label>
                            {
                                symptomList.map((data, index) => {
                                    const formatted = data.toLowerCase().replaceAll(" ", "_");
                                    return (
                                        <>
                                            <Select.Item value={formatted} disabled={symptoms.includes(formatted)}
                                                         className={s.SymptomItem}>
                                                <Select.ItemText>{data}</Select.ItemText>
                                            </Select.Item>
                                            <Select.Separator className={s.SymptomSeparator}/>
                                        </>
                                    );
                                })
                            }
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                        </svg>
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

function Doctors({doctors, selectedDoctor, setSelectedDoctor}) {
    return (
        <Select.Root onValueChange={r => {
            setSelectedDoctor(r);
        }}>
            <Select.Trigger className={s.DoctorTrigger}>
                <Select.Value placeholder={"Select a Doctor to consult"}/>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className={s.SymptomContent}>
                    <Select.ScrollUpButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
                        </svg>
                    </Select.ScrollUpButton>
                    <Select.Viewport className={s.SymptomViewport}>
                        <Select.Group>
                            <Select.Label className={s.SelectLabel}>Doctors</Select.Label>
                            {
                                doctors.map((data) => {
                                    return (
                                        <>
                                            <Select.Item value={data} className={s.SymptomItem}>
                                                <Select.ItemText>{data.name}</Select.ItemText>
                                            </Select.Item>
                                        </>
                                    );
                                })
                            }
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                        </svg>
                    </Select.ScrollDownButton>
                    <Select.Arrow/>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

function Severity({severity, setSeverity}) {
    return (
        <Select.Root defaultValue={"0"} onValueChange={r => {
            setSeverity(r);
        }}>
            <Select.Trigger className={s.SeverityTrigger}>
                <Select.Value placeholder={"Severity"}/>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className={s.SymptomContent}>
                    <Select.ScrollUpButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
                        </svg>
                    </Select.ScrollUpButton>
                    <Select.Viewport className={s.SymptomViewport}>
                        <Select.Group>
                            <Select.Label className={s.SelectLabel}>Severity</Select.Label>
                            <Select.Item value={"0"} className={s.SymptomItem}>
                                <Select.ItemText>Low</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"1"} className={s.SymptomItem}>
                                <Select.ItemText>Medium</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"2"} className={s.SymptomItem}>
                                <Select.ItemText>High</Select.ItemText>
                            </Select.Item>
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                        </svg>
                    </Select.ScrollDownButton>
                    <Select.Arrow/>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

export default function NewCase({files}) {
    const [description, setDescription] = useState("");
    const [symptoms, setSymptoms] = useState(["", "", "", "", ""]);
    const [symptomsCount, setSymptomsCount] = useState(1);
    const [refreshState, setRefreshState] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [attached, setAttached] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("0");
    const [valid, setValid] = useState(false);

    const [user,_] = useUserContext();
    const [keys,__] = useKeyContext();

    const fetchDoctors = async () => {
        const q = query(collection(db, "doctors"));
        let arr = [];
        await getDocs(q).then(r => {
            r.forEach(doc => {
                const temp = doc.data();
                arr.push(temp);
            });
            setDoctors(arr);
        });
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctor !== undefined && (symptoms.filter(r => r === "").length === 5 - symptomsCount) && description.trim().length > 0)
            setValid(true);
        else
            setValid(false);
    }, [selectedDoctor,refreshState,description, symptoms,symptomsCount]);

    const fetchAndDecrypt = async (data) => {
        const snap = await getDoc(doc(db, "locker", auth.currentUser.uid, "owned", data.id));
        let fileData = snap.data();
        const decryptedKey = cryptico.decrypt(fileData.aes, keys.privateKey);
        let aesKey = decryptedKey.plaintext;
        const decryptedContent = CryptoJS.AES.decrypt(fileData.content, aesKey);

        // Generate new AES key and encrypt again;
        aesKey = Math.random().toString().slice(2, 11);
        for (let i = 0; i < 10; i++)
            aesKey += Math.random().toString().slice(2, 11);
        fileData.content = CryptoJS.AES.encrypt(decryptedContent, aesKey).toString();
        fileData.aes = aesKey;
        return fileData;
    };

    const handleShare = async (file) => {
        try {
            const encryptedKey = cryptico.encrypt(file.aes, selectedDoctor.publicKey);
            await updateDoc(doc(db,"locker",auth.currentUser.uid,"list",attached.id), {deletable: false});
            await setDoc(doc(db, "locker", selectedDoctor.uid, "recieved", attached.id), {
                name: file.name,
                mimeType: file.mimeType,
                size: file.size,
                content: file.content,
                aes: encryptedKey.cipher,
                uploader: auth.currentUser.email,
            });
            await setDoc(doc(db, "locker", selectedDoctor.uid, "list", attached.id), {
                name: file.name,
                id: attached.id,
                shared: true,
                deletable : false,
                size: file.size,
            });
            ;
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmit = async e => {
        e.target.disabled = true;
        try {
            let aesKey;
            const k = await getDoc(doc(db,"history",auth.currentUser.uid));
            if (k.exists()) {
                const eData = cryptico.decrypt(k.data().aesKey,keys.privateKey);
                aesKey = eData.plaintext;
            } else {
                aesKey = Math.random().toString().slice(2, 11);
                for (let i = 0; i < 10; i++)
                    aesKey += Math.random().toString().slice(2, 11);
            }

            //AES Keys
            const patientKey = cryptico.encrypt(aesKey, user.publickey);
            const doctorKey = cryptico.encrypt(aesKey, selectedDoctor.publicKey);

            //Current Date
            const currentDate = new Date();
            const options = { day: 'numeric', month: 'numeric', year: '2-digit' };
            const formattedDate = currentDate.toLocaleDateString('en-IN', options);

            //Encrypted Number
            const eNumber = cryptico.encrypt(user.number, selectedDoctor.publicKey);

            //Encrypted Description
            const eDescription = CryptoJS.AES.encrypt(description, aesKey).toString();

            //Encrypted symptoms
            const eSymptoms = CryptoJS.AES.encrypt(symptoms.toString(), aesKey).toString();

            //Decryption code
            // CryptoJS.AES.decrypt(encrypted, "1321231313").toString(CryptoJS.enc.Utf8)


            // Prediction from AI
            // const res = await getAIresult(symptoms);
            // const prediction = await res.json();
            const ePrediction = CryptoJS.AES.encrypt("[AI was removed]", aesKey).toString();

            await setDoc(doc(db,"history",user.uid), {
                aesKey: patientKey.cipher,
            });

            await setDoc(doc(db, "symptosis", user.uid), {
                pId: user.uid,
                pName: user.name,
                pAge: user.age,
                pBlood: user.blood,
                pGender: user.gender,
                pNumber: eNumber.cipher,
                pEmail: user.email,
                pKey: patientKey.cipher,

                dId: selectedDoctor.uid,
                dName: selectedDoctor.name,
                dAge: selectedDoctor.age,
                dEmail: selectedDoctor.email,
                dNumber: selectedDoctor.number,
                dKey: doctorKey.cipher,

                date: formattedDate,
                severity: severity,
                comments: [""],
                attachedName: attached === undefined ? "na" : attached.name,
                attached: attached === undefined ? "na" : attached.id,
                description: eDescription,
                symptoms: eSymptoms,
                prediction: ePrediction,
            });

            await setDoc(doc(db, "symptosis", selectedDoctor.uid, "list", user.uid), {
                pId: user.uid,
                pName: user.name,
                dKey: doctorKey.cipher,

                date: formattedDate,
                severity: severity,
                description: eDescription,
                prediction: ePrediction,
            });

            if (attached !== undefined) {
                const file = await fetchAndDecrypt(attached);
                await handleShare(file);
            }
        } catch (e) {
            console.log(e);
        }
        e.target.disabled = false;
    };

    return (
        <>
            {open && <AttachFile files={files} setAttached={setAttached} setOpen={setOpen}/>}
            <div className={s["symptosis-patient"]}>
                <div className={s["sp-title"]}>
                    Open a new Symptosis case
                </div>
                <p>Select the doctor you want to contact and the serverity of your case.</p>
                <div className={s["symptosis-select-doc"]} >
                    <Doctors doctors={doctors} setSelectedDoctor={setSelectedDoctor} selectedDoctor={selectedDoctor}/>
                    <Severity severity={severity} setSeverity={setSeverity} />
                </div>
                <p>Enter a proper description of your medical issue and when it started and details you feel are necessary or
                    viable.</p>
                <textarea placeholder={"Enter a brief description about your issues here."} value={description}
                          onChange={r => setDescription(r.target.value)}></textarea>
                <p>Add <b>symptoms</b> that you have been experiencing <i>(Max 5)</i></p>
                <div className={s["symptosis-symptoms"]}>
                    {
                        Array.apply(0, Array(symptomsCount)).map(function (x, i) {
                            return <Symptom symptoms={symptoms} index={i} setRefreshState={setRefreshState}/>;
                        })
                    }
                </div>
                {/*<Symptom symptoms={symptoms}/>*/}
                <div className={s["sp-buttons"]}>
                    <div className={s["sp-left-buttons"]}>
                        <button onClick={() => setSymptomsCount(symptomsCount + 1)} disabled={symptomsCount === 5}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                        <button onClick={() => {
                            symptoms[symptomsCount - 1] = ""
                            setSymptomsCount(symptomsCount - 1);
                        }}
                                disabled={symptomsCount === 1}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                    </div>
                    <button data-attached={attached !== undefined} onClick={() => {
                        setOpen(true);
                    }}>
                        {
                            attached === undefined ?
                                (<>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
                                    </svg>
                                    <p>
                                        Attach from <b>inocLocker</b>
                                    </p>
                                </>) :
                                (<>
                                   <span>
                                        {attached.name.split(".")[0]}
                                   </span>
                                    <span>
                                        .{attached.name.split(".")[1]}
                                   </span>
                                </>)
                        }
                    </button>
                </div>
                <button onClick={handleSubmit} className={s["symptosis-submit"]} data-valid={valid}>
                    SUBMIT
                </button>
            </div>
        </>
    )
}