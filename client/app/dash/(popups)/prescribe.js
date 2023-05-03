import * as AlertDialog from '@radix-ui/react-alert-dialog';
import s from '../page.module.css';
import {doc, deleteDoc, setDoc, collection, updateDoc, addDoc} from 'firebase/firestore';
import {auth, db} from '@/app/firebase-config';
import {useState} from "react";
import * as Select from "@radix-ui/react-select";
import CryptoJS from "crypto-js";

function Dosage({dosage, index}) {
    return (
        <Select.Root defaultValue={"1-0-0"} onValueChange={r => {
            dosage[index] = r;
        }}>
            <Select.Trigger className={s.DosageTrigger}>
                <Select.Value placeholder={"Dosage"}/>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className={s.SymptomContent} data-align={"center"} align={"center"}>
                    <Select.ScrollUpButton className={s.SelectScrollButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
                        </svg>
                    </Select.ScrollUpButton>
                    <Select.Viewport className={s.SymptomViewport}>
                        <Select.Group>
                            {/*<Select.Label className={s.SelectLabel}>Dosage</Select.Label>*/}
                            <Select.Item value={"1-0-0"} className={s.DosageItem}>
                                <Select.ItemText>1-0-0</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"0-1-0"} className={s.DosageItem}>
                                <Select.ItemText>0-1-0</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"0-0-1"} className={s.DosageItem}>
                                <Select.ItemText>0-0-1</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"1-1-0"} className={s.DosageItem}>
                                <Select.ItemText>1-1-0</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"1-0-1"} className={s.DosageItem}>
                                <Select.ItemText>1-0-1</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"0-1-1"} className={s.DosageItem}>
                                <Select.ItemText>0-1-1</Select.ItemText>
                            </Select.Item>
                            <Select.Item value={"1-1-1"} className={s.DosageItem}>
                                <Select.ItemText>1-1-1</Select.ItemText>
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

export default function Prescribe({setOpen, setSelectedCase, sCase, doctorKey}) {
    const [medication, setMedication] = useState(["", "", "", "", ""]);
    const [days, setDays] = useState(["", "", "", "", ""]);
    const [dosage, setDosage] = useState(["1-0-0", "", "", "", ""]);
    const [medicationCount, setMedicationCount] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handlePrescribe = async e => {
        e.target.disabled = true;
        try {
            //Current Date
            const currentDate = new Date();
            const options = {day: 'numeric', month: 'numeric', year: '2-digit'};
            const formattedDate = currentDate.toLocaleDateString('en-IN', options);

            //Encrypted Title
            const eTitle = CryptoJS.AES.encrypt(title.trim(), doctorKey).toString();

            //Encrypted Description
            const eDescription = CryptoJS.AES.encrypt(description.trim(), doctorKey).toString();

            //Encrypted Medication
            let medicationString = "";
            for (let i = 0; i < 5; i++) {
                if (i !== 0 && medication[i] !== "") medicationString = medicationString.concat(";");
                let temp = "";
                if (medication[i] !== "") {
                    temp = temp.concat(medication[i].trim() + ",");
                    temp = temp.concat((days[i] === "" ? "-" : days[i]) + ",");
                    temp = temp.concat(dosage[i]);
                }
                if (temp !== "")
                    medicationString = medicationString.concat(temp);
            }
            if (medicationString === "") medicationString = "na";

            const eMedication = CryptoJS.AES.encrypt(medicationString, doctorKey).toString();

            await addDoc(collection(db, "history", sCase.pId, "cases"), {
                opened: sCase.date,
                description: sCase.description,
                symptoms: sCase.symptoms,
                prediction: sCase.prediction,

                dName: sCase.dName,
                dEmail: sCase.dEmail,
                pTitle: eTitle,
                pDescription: eDescription,
                medication: eMedication,
                closed: formattedDate,
            });


            if (sCase.attached !== "na") {
                await updateDoc(doc(db, "locker", sCase.pId, "list", sCase.attached), {
                    deletable: true,
                })
                await deleteDoc(doc(db, "locker", sCase.dId, "recieved", sCase.attached));
                await deleteDoc(doc(db, "locker", sCase.dId, "list", sCase.attached));
            }
            await deleteDoc(doc(db, "symptosis", sCase.pId));
            await deleteDoc(doc(db, "symptosis", sCase.dId, "list", sCase.pId));
            setSelectedCase(undefined);
        } catch (e) {
            console.log(e);
        }
        e.target.disabled = false;
    };

    const handleTitle = e => {
        const fixed = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        e.target.value = fixed;
        setTitle(fixed);
    };

    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.PrescribeDialongContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Prescribe & Close Case
                        <button className={s.DosageButton} onClick={() => setOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path
                                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                            </svg>
                        </button>
                    </AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <div className={s.separator}></div>
                        <p>Please name the disease/issue faced by the patient. This data will be stored in the patient's medical
                            history.</p>
                        <div className={s["prescribe-input"]}>
                            <input type="text" placeholder={"Disease Name"} maxLength={50} defaultValue={title}
                                   onChange={handleTitle} required/>
                        </div>
                        <p>Describe the Issue faced by the patient in detail, feel free to add any other information you feel is
                            necessary.</p>
                        <textarea className={s["prescribe-textarea"]} placeholder={"Enter a brief description about the" +
                            " patient's issues here."} value={description}
                                  onChange={r => setDescription(r.target.value)}></textarea>
                        {medicationCount > 0 &&
                            (<>
                                    <div className={s["medication-table"]}>
                                        <div className={s["medication-title"]}>
                                            <h4>Issue Medication</h4>
                                            <p>Days</p>
                                            <span>Dosage</span>
                                        </div>
                                        {
                                            Array.apply(0, Array(medicationCount)).map(function (x, i) {
                                                return (
                                                    <div className={s["medication-item"]}>
                                                        <input type="text" className={s["medication-name"]}
                                                               placeholder={"Drug Name"}
                                                               maxLength={30} onChange={e => {
                                                            let fixed = e.target.value.replace(/[^a-zA-Z0-9\s.-]/g, "");
                                                            e.target.value = fixed;
                                                            medication[i] = fixed;
                                                        }}/>
                                                        <input type="text" className={s["medication-day"]} placeholder={"Days"}
                                                               maxLength={2}
                                                               onChange={e => {
                                                                   let fixed = e.target.value.replace(/\D/g, "");
                                                                   if (fixed.startsWith("0"))
                                                                       fixed = fixed.slice(1);
                                                                   e.target.value = fixed;
                                                                   days[i] = e.target.value;
                                                               }}/>
                                                        <Dosage dosage={dosage} index={i}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <p className={s.medicationNote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                             className="w-5 h-5">
                                            <path fillRule="evenodd"
                                                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        Omitted fields will not be added to the prescription.
                                    </p>
                                </>
                            )

                        }

                    </AlertDialog.Description>
                    <AlertDialog.Action asChild>
                        <div className={s["prescribe-buttons"]}>
                            <div className={s["sp-left-buttons"]}>
                                <button onClick={() => {
                                    dosage[medicationCount] = "1-0-0";
                                    setMedicationCount(medicationCount + 1)
                                }
                                } disabled={medicationCount === 5}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </button>
                                <button onClick={() => {
                                    medication[medicationCount - 1] = ""
                                    days[medicationCount - 1] = ""
                                    dosage[medicationCount - 1] = ""
                                    setMedicationCount(medicationCount - 1);
                                }}
                                        disabled={medicationCount === 0}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </button>
                            </div>
                            <button className={s.prescribeButton} onClick={handlePrescribe}
                                    disabled={(title.trim() === "") || (description.trim() === "")}
                            >
                                Prescribe
                            </button>
                        </div>

                    </AlertDialog.Action>

                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
