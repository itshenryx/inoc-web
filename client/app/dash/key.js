'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import s from './page.module.css';
import OtpInput from 'react-otp-input';
import cryptico from "cryptico";
import {useState, useEffect} from "react";
import {useKeyContext} from "@/context/keys";

// const handleFileChange = e => {
//     const pKey = cryptico.generateRSAKey('2134l', 512);
//     const publicKey = cryptico.publicKeyString(pKey);
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.readAsArrayBuffer(file);
//     reader.onload = () => {
//         // const data = reader.result;
//         let key = "1234567887654321";
//         let wordArray = CryptoJS.lib.WordArray.create(reader.result);
//         let encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
//
//         let decrypted = CryptoJS.AES.decrypt(encrypted, key);
//         let typedArray = convertWordArrayToUint8Array(decrypted);
//
//         const blob = new Blob([typedArray], {type: "application/pdf"});
//         const href = URL.createObjectURL(blob);
//
//         const a = Object.assign(document.createElement('a'), {href, style: "display:none", download: "test"});
//         document.body.appendChild(a);
//         a.click();
//         URL.revokeObjectURL(href);
//         a.remove();
//     };
// };

export default function Key({setPrivateKey, publicKey, uid, patient}) {
    const [key, setKey] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [wrong, setWrong] = useState("false");

    const [keys, setKeys] = useKeyContext();

    useEffect(() => {
        if (key.length === 6) {

            setDisabled(true);
            const passPhrase = key.toString() + uid.toString();
            const privateKey = cryptico.generateRSAKey(passPhrase , 1024);
            const generatedPublicKey = cryptico.publicKeyString(privateKey);
            if (publicKey === generatedPublicKey) {
                setKeys({publicKey: generatedPublicKey, privateKey: privateKey, patient: patient});
                setPrivateKey(privateKey);
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