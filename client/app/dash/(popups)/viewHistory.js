import * as AlertDialog from '@radix-ui/react-alert-dialog';
import s from '../page.module.css';
import {CircularProgress} from "@mui/material";
import * as Accordion from '@radix-ui/react-accordion';
import CryptoJS from "crypto-js";


export default function ViewHistory({setOpenHistory, history, doctorKey}) {
    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.HistoryDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}> Patient History
                        <button className={s.DosageButton} onClick={() => setOpenHistory(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path
                                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                            </svg>
                        </button>
                    </AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <div className={s["mh-body"]}>
                            {
                                history === undefined ? <CircularProgress className={s.loading}/> :
                                    history.length === 0 ? <></> :
                                        (
                                            <div className={s["vh-container"]}>
                                                <Accordion.Root className={s.AccordionRoot} type="single" defaultValue="1"
                                                                collapsible>
                                                    {
                                                        history.map((data, index) => {
                                                            const dDescrition = CryptoJS.AES.decrypt(data.description, doctorKey).toString(CryptoJS.enc.Utf8);
                                                            const dSymptoms = CryptoJS.AES.decrypt(data.symptoms, doctorKey).toString(CryptoJS.enc.Utf8);
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
                                                            let dPrediction = CryptoJS.AES.decrypt(data.prediction, doctorKey).toString(CryptoJS.enc.Utf8);
                                                            dPrediction = dPrediction.replaceAll(",", ", ");


                                                            const dPTitle = CryptoJS.AES.decrypt(data.pTitle, doctorKey).toString(CryptoJS.enc.Utf8);
                                                            const dPdesc = CryptoJS.AES.decrypt(data.pDescription, doctorKey).toString(CryptoJS.enc.Utf8);
                                                            const medication = CryptoJS.AES.decrypt(data.medication, doctorKey).toString(CryptoJS.enc.Utf8);
                                                            const medicationArr = medication.split(";");

                                                            return (
                                                                <Accordion.Item className={s.AccordionItem} value={index + 1}>
                                                                    <Accordion.Header className={s.AccordionHeader}>
                                                                        <Accordion.Trigger className={s.AccordionTrigger}>
                                                                            <div className={s.historyTitleLeft}>
                                                                                <span>{data.closed}</span>
                                                                                <p>
                                                                                    {dPTitle}
                                                                                </p>
                                                                            </div>
                                                                            <div className={s.historyTitleRight}>
                                                                                <p>
                                                                                    <span>Dr.</span>
                                                                                    {data.dName}
                                                                                </p>
                                                                                <span>
                                                                        {data.dEmail}
                                                                    </span>
                                                                            </div>
                                                                        </Accordion.Trigger>
                                                                    </Accordion.Header>
                                                                    <Accordion.Content className={s.AccordionContent}>
                                                                        <div className={s.HistoryDetails}>
                                                                            <div className={s.historyData}>
                                                                                <label><span>opened</span><p>{data.opened}</p>
                                                                                </label>
                                                                                <label><span>disease</span><p>{dPTitle}</p>
                                                                                </label>
                                                                                <label><span>description</span>
                                                                                    <p>{dDescrition}</p></label>
                                                                                <label><span>prescription</span><p>{dPdesc}</p>
                                                                                </label>
                                                                                <label><span>symptoms</span>
                                                                                    <p>{stringSymptoms}</p></label>
                                                                                <label><span>prediction</span><p>{dPrediction}</p>
                                                                                </label>
                                                                            </div>
                                                                            <div className={s.historyMedication}>
                                                                                <div className={s.medicationTitle}>
                                                                                    <h4>Issue Medication</h4>
                                                                                    <p>Days</p>
                                                                                    <span>Dosage</span>
                                                                                </div>
                                                                                {
                                                                                    medication === "na" ?
                                                                                        (
                                                                                            <div className={s.medicationData}>
                                                                                                <h4>-</h4>
                                                                                                <p>-</p>
                                                                                                <span>-</span>
                                                                                            </div>
                                                                                        ) : medicationArr.map((data) => {
                                                                                                const detailArr = data.split(",");
                                                                                                return (
                                                                                                    <div className={s.medicationData}>
                                                                                                        <h4>{detailArr[0]}</h4>
                                                                                                        <p>{detailArr[1]}</p>
                                                                                                        <span>{detailArr[2]}</span>
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Accordion.Content>
                                                                </Accordion.Item>
                                                            )
                                                        })
                                                    }
                                                </Accordion.Root>
                                            </div>
                                        )

                            }
                        </div>
                    </AlertDialog.Description>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
