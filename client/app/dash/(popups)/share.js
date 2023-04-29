import {useKeyContext} from "@/context/keys";
import {cryptico} from "@veikkos/cryptico";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import s from "@/app/dash/page.module.css";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import CryptoJS from 'crypto-js';
import {auth, db} from '@/app/firebase-config';
import {addDoc, collection, doc, getDoc, getDocs, query, where} from 'firebase/firestore';


export default function Share({data, sharing, setSharing}) {
    const [keys, _] = useKeyContext();
    const [validEmail, setEmail] = useState(false);
    const [reciever, setReciever] = useState(undefined);
    const [file, setFile] = useState(undefined);

    const fetchAndDecrypt = async () => {
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
        setFile(fileData);
    };

    useEffect(() => {
        fetchAndDecrypt();
    }, []);

    const handleEmail = async e => {
        if (e.target.validity.valid && e.target.value !== auth.currentUser.email) {
            const q = query(collection(db, "users"), where("email", "==", e.target.value));
            await getDocs(q).then((r) => {
                if (!r.empty) {
                    r.forEach(doc => setReciever(doc.data()));
                    setEmail(true);
                } else {
                    setEmail(false);
                }
            });
        } else if (validEmail)
            setEmail(false)
    };

    // const handleFile = e => {
    //     const file = e.target.files[0];
    //
    //     if (file.size > 1097152)
    //         return;
    //
    //     const type = file.type;
    //     const reader = new FileReader();
    //     reader.readAsArrayBuffer(file);
    //     reader.onload = () => {
    //         let aesKey = Math.random().toString().slice(2, 11);
    //         for (let i = 0; i < 10; i++)
    //             aesKey += Math.random().toString().slice(2, 11);
    //
    //         const wordArray = CryptoJS.lib.WordArray.create(reader.result);
    //         const encrypted = CryptoJS.AES.encrypt(wordArray, aesKey).toString();
    //         const encryptedKey = cryptico.encrypt(aesKey, keys.publicKey);
    //
    //         setUploadedFile({
    //             name: file.name,
    //             mimeType: type,
    //             size: formatBytes(file.size),
    //             content: encrypted,
    //             aes: encryptedKey.cipher,
    //         });
    // const decrypted = CryptoJS.AES.decrypt(encrypted,aesKey);
    // let typedArray = convertWordArrayToUint8Array(decrypted);
    //
    // const blob = new Blob([typedArray], {type:type});
    // const href = URL.createObjectURL(blob);
    //
    // const a = Object.assign(document.createElement('a'), {href, style: "display:none", download: "test"});
    // document.body.appendChild(a);
    // a.click();
    // URL.revokeObjectURL(href);
    // a.remove();
    // };
    // };

    const handleShare = async e => {
        e.target.disabled = true;
        try {
            const encryptedKey = cryptico.encrypt(file.aes, reciever.publickey);
            const doc = await addDoc(collection(db, "locker", reciever.uid, "recieved"), {
                name: file.name,
                mimeType: file.mimeType,
                size: file.size,
                content: file.content,
                aes: encryptedKey.cipher,
                uploader: auth.currentUser.email,
            });
            await addDoc(collection(db, "locker", reciever.uid, "list"), {
                name: file.name,
                id: doc.id,
                shared: true,
                size: file.size,
            });
            setSharing(false);
        } catch (e) {
            console.log(e);
        }
        e.target.disabled = false;
    };

    return (
        <AlertDialog.Root open={sharing}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Share File</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <p>Enter the email of the person you want to share this document with.</p>
                        {/*<input type="file" onChange={handleFileChange}/>*/}
                    </AlertDialog.Description>
                    <div className={s["upload-input"]}>
                        <input type="email" placeholder={"Email address"} onChange={handleEmail} required/>
                        {!validEmail ?
                            <CircularProgress size={20}/>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        }
                    </div>
                    <div className={s["upload-actions"]}>
                        <button className={s["upload-cancel-button"]} onClick={
                            () => {
                                setSharing(false);
                            }}>
                            Cancel
                        </button>
                        <button className={s["upload-confirm-button"]}
                                disabled={!validEmail}
                                onClick={handleShare}
                        >
                            Share File
                        </button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}