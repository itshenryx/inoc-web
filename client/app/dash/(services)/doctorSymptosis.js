import s from "@/app/dash/page.module.css";
import {cryptico} from "@veikkos/cryptico";
import {useKeyContext} from "@/context/keys";
import CryptoJS from "crypto-js";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/firebase-config";

export default function DoctorSymptosis({sCase, setSelectedCase}) {
    const [keys, _] = useKeyContext();

    return (
        <div className={s["il-container"]}>
            <div className={s["il-header"]}>
                <p>
                    <h1>Symptosis</h1>
                    <span>Provide Consultation and Prescription to Patients</span>
                </p>
            </div>
            <div className={s["symptom-body"]}>
                {
                    sCase.map((data) => {
                        const docAES = cryptico.decrypt(data.dKey, keys.privateKey);
                        const dDescription = CryptoJS.AES.decrypt(data.description, docAES.plaintext).toString(CryptoJS.enc.Utf8);
                        let dPrediction = CryptoJS.AES.decrypt(data.prediction, docAES.plaintext).toString(CryptoJS.enc.Utf8);
                        dPrediction = dPrediction.replaceAll(",", ", ");
                        return (
                            <div className={s["symptom-list"]} onClick={async () => {
                                const c = await getDoc(doc(db,"symptosis",data.pId));
                                setSelectedCase(c.data());
                            }}>
                                <p>
                                    <span className={s["symptom-date"]}>{data.date}</span>
                                    <span className={s["symptom-patient"]}>{data.pName}</span>
                                    <span className={s["symptom-desc"]}>{dDescription}</span>
                                </p>
                                <p>
                                    <span className={s["symptom-ai"]}>
                                        <svg id="eLtG5EpaNv91" xmlns="http://www.w3.org/2000/svg"
                                                 xlink="http://www.w3.org/1999/xlink"
                                                 viewBox="0 0 300 300" shapeRendering="geometricPrecision"
                                                 textRendering="geometricPrecision">
                                        <ellipse rx="103.316954" ry="103.316954" transform="matrix(1.451843 0 0 1.451843 150.000004 150.000004)" fill="#2b3954"/><g transform="matrix(.868831 0 0 0.868831 15.600084 10.338749)"><rect width="68.058964" height="125.798526" rx="34.03" ry="34.03"
                                  transform="matrix(.851156 0 0 0.851156 67.350096 96.462915)" fill="#fff" strokeWidth="0"/><rect width="68.058964" height="125.798526" rx="34.03" ry="34.03"
                                  transform="matrix(.851156 0 0 0.851156 184.102137 96.462915)" fill="#fff" strokeWidth="0"/></g>
                                        </svg>
                                        {dPrediction}</span>
                                    <span
                                        className={s["symptom-severity"]}>{data.severity === 0 ? "LOW" : data.severity === 1 ? "MEDIUM" : "HIGH"}</span>
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}