'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import s from './page.module.css';
import OtpInput from 'react-otp-input';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '@/app/firebase-config';
import cryptico from "cryptico";
import {useState} from "react";

export default function Firstsignin({setFirstSignIn, uid}) {
    const [key, setKey] = useState("");
    const [isPatient, setIsPatient] = useState(true);

    const handleSubmit = async () => {
        const pKey = cryptico.generateRSAKey(key + uid, 1024);
        const publicKey = cryptico.publicKeyString(pKey);
        try {
            await addDoc(collection(db, "users"), {
                uid: uid,
                publickey: publicKey,
                patient: isPatient,
            });
            setFirstSignIn(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Choose your account type & PIN</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <div className={s.separator}></div>
                        <p>Choose your account type. Note that this will limit your account features in some way or other. This
                            feature is not meant for production.</p>

                        <RadioGroup.Root className={s.RadioGroupRoot}
                                         defaultValue={"patient"}
                                         onValueChange={() => {
                                             setIsPatient(!isPatient);
                                         }}>
                            <RadioGroup.Item value={"patient"} className={s.RadioGroupItem}>
                                <RadioGroup.Indicator className={s.RadioGroupIndicator}/>
                                <label>Patient</label>
                            </RadioGroup.Item>
                            <RadioGroup.Item value={"doctor"} className={s.RadioGroupItem}>
                                <RadioGroup.Indicator className={s.RadioGroupIndicator}/>
                                <label>Doctor</label>
                            </RadioGroup.Item>
                        </RadioGroup.Root>

                        <div className={s.separator}></div>
                        <p>Choose a six-digit pin that will be used to encrypt and decrypt all your data end-to-end.</p>

                        <OtpInput
                            value={key}
                            inputType={"tel"}
                            onChange={setKey}
                            shouldAutoFocus={true}
                            numInputs={6}
                            containerStyle={s["pin-container"]}
                            inputStyle={s["pin-input"]}
                            renderInput={(props) => <input {...props} required/>}
                        />
                    </AlertDialog.Description>

                    <AlertDialog.Action asChild>
                        <button className={s.Button} onClick={handleSubmit} disabled={key.length !== 6}>CONFIRM</button>
                    </AlertDialog.Action>

                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}