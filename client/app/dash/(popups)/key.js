'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import s from '../page.module.css';
import OtpInput from 'react-otp-input';
import cryptico from "cryptico";
import {useState, useEffect} from "react";
import {useKeyContext} from "@/context/keys";
import {useUserContext} from "@/context/user";
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "@/app/firebase-config";

export default function Key({setPrivateKey, publicKey, uid, patient}) {
    const [key, setKey] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [wrong, setWrong] = useState("false");

    const [keys, setKeys] = useKeyContext();
    const [user, setUser] = useUserContext();

    const handleFetchData = async (privateKey) => {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
        const data = await getDocs(q);
        data.forEach(d => {
            let temp = d.data();
            const dNumber = cryptico.decrypt(temp.number,privateKey);
            const dAddress = cryptico.decrypt(temp.address,privateKey);
            temp.number = dNumber.plaintext;
            temp.address = dAddress.plaintext;
            setUser(temp);
        });
    };

    useEffect(() => {
        if (key.length === 6) {
            setDisabled(true);
            const passPhrase = key.toString() + uid.toString();
            const privateKey = cryptico.generateRSAKey(passPhrase , 1024);
            const generatedPublicKey = cryptico.publicKeyString(privateKey);
            if (publicKey === generatedPublicKey) {
                setKeys({publicKey: generatedPublicKey, privateKey: privateKey, patient: patient});
                handleFetchData(privateKey).then(() =>
                    setPrivateKey(privateKey)
                );
            }
            else
                setWrong("true");
            setTimeout(() => {
                setWrong("false");
                setKey("");
                setDisabled(false);
            }, 500);
        }
    }, [key]);

    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Enter your security PIN</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <p>The six-digit pin that you entered upon the first login.</p>
                        <OtpInput
                            value={key}
                            inputType={"tel"}
                            onChange={setKey}
                            shouldAutoFocus={true}
                            numInputs={6}
                            containerStyle={s["pin-container"]}
                            inputStyle={s["pin-input"]}
                            renderInput={(props) => <input {...props}
                                                           required
                                                           disabled={disabled}
                                                           wrong-pin={wrong}
                            />
                            }
                        />
                        {/*<input type="file" onChange={handleFileChange}/>*/}
                    </AlertDialog.Description>
                    {/*<AlertDialog.Cancel>*/}
                    {/*<button className={s.Button} onClick={() => {*/}
                    {/*    setGetPin(false);*/}
                    {/*}}>Cancel*/}
                    {/*</button>*/}
                    {/*</AlertDialog.Cancel>*/}
                    {/*<AlertDialog.Action asChild>*/}
                    {/*    <button className={s.Button} disabled={key.length !== 6}>CONFIRM</button>*/}
                    {/*</AlertDialog.Action>*/}
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}