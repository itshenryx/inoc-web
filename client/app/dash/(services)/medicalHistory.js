import s from '../page.module.css';
import {CircularProgress} from "@mui/material";
import * as Accordion from '@radix-ui/react-accordion';
import CryptoJS from "crypto-js";

export default function MedicalHistory({history, historyKey}) {
    return (
        <div className={s["il-container"]}>
            <div className={s["il-header"]}>
                <p>
                    <h1>Prescription History </h1>
                    <span>View details of prescriptions issued to you</span>
                </p>
            </div>
            <div className={s["mh-body"]}>
                {
                    history === undefined ? <CircularProgress className={s.loading}/> :
                        history.length === 0 ? <></> :
                            (
                                <div className={s["mh-container"]}>
                                    <Accordion.Root className={s.AccordionRoot} type="single" defaultValue="1" collapsible>
                                        {
                                            history.map((data, index) => {
                                                const dDescrition = CryptoJS.AES.decrypt(data.description, historyKey).toString(CryptoJS.enc.Utf8);
                                                const dSymptoms = CryptoJS.AES.decrypt(data.symptoms, historyKey).toString(CryptoJS.enc.Utf8);
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
                                                let dPrediction = CryptoJS.AES.decrypt(data.prediction, historyKey).toString(CryptoJS.enc.Utf8);
                                                dPrediction = dPrediction.replaceAll(",", ", ");


                                                const dPTitle = CryptoJS.AES.decrypt(data.pTitle, historyKey).toString(CryptoJS.enc.Utf8);
                                                const dPdesc = CryptoJS.AES.decrypt(data.pDescription, historyKey).toString(CryptoJS.enc.Utf8);
                                                const medication = CryptoJS.AES.decrypt(data.medication, historyKey).toString(CryptoJS.enc.Utf8);
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
                                                                    <label><span>opened</span><p>{data.opened}</p></label>
                                                                    <label><span>disease</span><p>{dPTitle}</p></label>
                                                                    <label><span>description</span><p>{dDescrition}</p></label>
                                                                    <label><span>prescription</span><p>{dPdesc}</p></label>
                                                                    <label><span>symptoms</span><p>{stringSymptoms}</p></label>
                                                                    <label><span>prediction</span><p>{dPrediction}</p></label>
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
        </div>
    );
}