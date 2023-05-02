'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';
import s from '../page.module.css';
import OtpInput from 'react-otp-input';
import {collection, addDoc, doc, setDoc} from 'firebase/firestore';
import {auth, db} from '@/app/firebase-config';
import {cryptico} from "@veikkos/cryptico";
import {useEffect, useState} from "react";

export default function Firstsignin({setFirstSignIn, uid}) {
    const [key, setKey] = useState("");
    const [isPatient, setIsPatient] = useState(true);
    const [name, setName] = useState(undefined);
    const [number, setNumber] = useState(undefined);
    const [age, setAge] = useState(undefined);
    const [gender, setGender] = useState(undefined);
    const [blood, setBlood] = useState(undefined);
    const [address, setAddress] = useState(undefined);
    const [valid, setValid] = useState(false);

    const handleSubmit = async () => {
        const pKey = cryptico.generateRSAKey(key + uid, 1024);
        const publicKey = cryptico.publicKeyString(pKey);
        const eNumber = cryptico.encrypt(number, publicKey);
        const eAddress = cryptico.encrypt(address, publicKey);
        const formattedName = name.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');

        try {
            await setDoc(doc(db, "users",uid), {
                uid: uid,
                publickey: publicKey,
                patient: isPatient,
                email: auth.currentUser.email,
                name: formattedName,
                number: eNumber.cipher,
                age: age,
                gender: gender,
                blood: blood,
                address: eAddress.cipher,
            });
            if (!isPatient)
                await setDoc(doc(db, "doctors", uid), {
                    uid: uid,
                    name: formattedName,
                    age: age,
                    gender: gender,
                    email: auth.currentUser.email,
                    publicKey: publicKey,
                    number: number,
                });
            setFirstSignIn(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (name !== undefined &&
            (number !== undefined && number.length === 10) &&
            age !== undefined &&
            gender !== undefined &&
            blood !== undefined &&
            address !== undefined
        ) setValid(true);
    }, [name, number, age, gender, blood, address, valid]);

    const handleName = e => {
        const fixed = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        e.target.value = fixed;
        setName(fixed);
    };

    const handleNumber = e => {
        let fixed = e.target.value.replace(/\D/g, "");
        if (fixed.startsWith("0"))
            fixed = fixed.slice(1);
        e.target.value = fixed;
        setNumber(fixed);
    };

    const handleAge = e => {
        let fixed = e.target.value.replace(/\D/g, "");
        if (fixed.startsWith("0"))
            fixed = fixed.slice(1);
        e.target.value = fixed;
        setAge(fixed);
    };

    const handleBlood = e => {
        setBlood(e);
    };

    const handleGender = e => {
        setGender(e);
    };

    const handleAddress = e => {
        setAddress(e.target.value);
    };

    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Set Personal Details & PIN</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <div className={s.separator}></div>
                        <p>Enter important personal details and Choose your account type. These details will be stored securely
                            using your PIN.</p>

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

                        <div className={s["detail-box"]}>
                            <div className={s["detail-input"]}>
                                <input type="text" placeholder={"Full Name"} onChange={handleName} maxLength="25" required/>
                            </div>
                            <div className={s["detail-input"]} data-value={"number"}>
                                <span>+91</span>
                                <input type="tel" placeholder={"Number"} onChange={handleNumber} maxLength="10" required/>
                            </div>
                        </div>

                        <div className={s["detail-grid"]}>
                            <div className={s["detail-input"]} data-value={"age"}>
                                <input type="tel" placeholder={"Age"} maxLength="2" onChange={handleAge} required/>
                            </div>
                            <Select.Root value={blood} onValueChange={handleBlood}>
                                <Select.Trigger className={s.SelectTrigger}>
                                    <Select.Value placeholder={"Blood Type"}/>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className={s.SelectContent}>
                                        <Select.Viewport className={s.SelectViewport}>
                                            {/*<Select.Group>*/}
                                            <Select.Item value={"A+"} className={s.SelectItem}>
                                                <Select.ItemText>A+ </Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"A-"} className={s.SelectItem}>
                                                <Select.ItemText>A-</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"B+"} className={s.SelectItem}>
                                                <Select.ItemText>B+</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"B-"} className={s.SelectItem}>
                                                <Select.ItemText>B-</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"O+"} className={s.SelectItem}>
                                                <Select.ItemText>O+</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"O-"} className={s.SelectItem}>
                                                <Select.ItemText>O-</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"AB+"} className={s.SelectItem}>
                                                <Select.ItemText>AB+</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"AB-"} className={s.SelectItem}>
                                                <Select.ItemText>AB-</Select.ItemText>
                                            </Select.Item>
                                            {/*</Select.Group>*/}
                                        </Select.Viewport>
                                        <Select.Arrow/>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                            <Select.Root value={gender} onValueChange={handleGender}>
                                <Select.Trigger className={s.SelectTrigger}>
                                    <Select.Value placeholder={"Gender"}/>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className={s.SelectContent}>
                                        <Select.Viewport className={s.SelectViewport}>
                                            <Select.Item value={"Male"} className={s.SelectItem}>
                                                <Select.ItemText>Female</Select.ItemText>
                                            </Select.Item>
                                            <Select.Item value={"Female"} className={s.SelectItem}>
                                                <Select.ItemText>Male</Select.ItemText>
                                            </Select.Item>
                                        </Select.Viewport>
                                        <Select.Arrow/>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>
                        <div className={s["detail-input"]}>
                            <input type="text" maxLength="40" placeholder={"Address"} onChange={handleAddress} required/>
                        </div>

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
                        <button className={s.Button} onClick={handleSubmit} disabled={!valid || key.length !== 6}>CONFIRM</button>
                    </AlertDialog.Action>

                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}