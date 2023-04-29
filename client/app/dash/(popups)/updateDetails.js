'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';
import s from '../page.module.css';
import OtpInput from 'react-otp-input';
import {collection, setDoc, getDocs, where, query, doc} from 'firebase/firestore';
import {auth, db} from '@/app/firebase-config';
import {cryptico} from "@veikkos/cryptico";
import {useEffect, useState} from "react";
import {useUserContext} from "@/context/user";
import {useKeyContext} from "@/context/keys";
import {useRouter} from "next/navigation";

export default function UpdateDetails({changeDetails, setChangeDetails}) {
    const [key, setKey] = useState("");
    const [user, _] = useUserContext();
    const [keys, __] = useKeyContext();
    const [name, setName] = useState(user.name);
    const [number, setNumber] = useState(user.number);
    const [age, setAge] = useState(user.age);
    const [gender, setGender] = useState(user.gender);
    const [blood, setBlood] = useState(user.blood);
    const [address, setAddress] = useState(user.address);

    const [valid, setValid] = useState(false);
    const [validKey, setValidKey] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        const pKey = cryptico.generateRSAKey(key + user.uid, 1024);
        const publicKey = cryptico.publicKeyString(pKey);
        const eNumber = cryptico.encrypt(number, publicKey);
        const eAddress = cryptico.encrypt(address, publicKey);
        try {
            const q = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
            let id;
            q.forEach((doc) => {
                id = doc.id;
            });
            await setDoc(doc(db, "users", id), {
                uid: user.uid,
                publickey: publicKey,
                patient: user.patient,
                email: auth.currentUser.email,
                name: name,
                number: eNumber.cipher,
                age: age,
                gender: gender,
                blood: blood,
                address: eAddress.cipher,
            });
            window.location.reload();
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

    useEffect(() => {
        if (key.length === 6) {
            const passPhrase = key.toString() + user.uid.toString();
            const privateKey = cryptico.generateRSAKey(passPhrase, 1024);
            const publicKey = cryptico.publicKeyString(privateKey);
            if (publicKey === keys.publicKey) setValidKey(true);
            else setKey("");
        } else {
            setValidKey(false);
        }
    }, [key]);

    const handleName = e => {
        const fixed = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        e.target.value = fixed;
        setName(fixed);
    };

    const handleNumber = e => {
        const fixed = e.target.value.replace(/\D/g, "");
        e.target.value = fixed;
        setNumber(fixed);
    };

    const handleAge = e => {
        const fixed = e.target.value.replace(/\D/g, "");
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
                    <AlertDialog.Title className={s.AlertDialogTitle}>Update Personal Details</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <div className={s.separator}></div>
                        <p>Change and update the personal details you would like to update.<br/><br/></p>
                        <div className={s["detail-box"]}>
                            <div className={s["detail-input"]}>
                                <input type="text" placeholder={"Full Name"} defaultValue={name} onChange={handleName} required/>
                            </div>
                            <div className={s["detail-input"]} data-value={"number"}>
                                <span>+91</span>
                                <input type="tel" placeholder={"Number"} defaultValue={number} onChange={handleNumber}
                                       maxLength="10" required/>
                            </div>
                        </div>

                        <div className={s["detail-grid"]}>
                            <div className={s["detail-input"]} data-value={"age"}>
                                <input type="tel" placeholder={"Age"} maxLength="2" defaultValue={age} onChange={handleAge}
                                       required/>
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
                            <input type="text" placeholder={"Address"} defaultValue={address} onChange={handleAddress} required/>
                        </div>

                        <div className={s.separator}></div>
                        <p>Please enter your security PIN.</p>

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
                        <div className={s["upload-actions"]}>
                            <button className={s["upload-cancel-button"]} onClick={
                                () => {
                                    setChangeDetails(false);
                                }}>
                                Cancel
                            </button>
                            <button className={s["upload-confirm-button"]}
                                    disabled={!valid || !validKey}
                                    onClick={handleSubmit}
                            >
                                Upload File
                            </button>
                        </div>
                    </AlertDialog.Action>

                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}