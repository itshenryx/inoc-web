import {useKeyContext} from "@/context/keys";
import {cryptico} from "@veikkos/cryptico";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import s from "@/app/dash/page.module.css";
import {useState} from "react";
import {CircularProgress} from "@mui/material";
import CryptoJS from 'crypto-js';
import {auth, db} from '@/app/firebase-config';
import {query, where, getDocs, collection, addDoc, setDoc, doc} from 'firebase/firestore';

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0B'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function Upload({uploader, setUploader, fetchData}) {
    const [keys, _] = useKeyContext();
    const [validEmail, setEmail] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(undefined);
    const [reciever, setReciever] = useState(undefined);

    const handleEmail = async e => {
        if (e.target.validity.valid) {
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

    const handleFile = e => {
        const file = e.target.files[0];

        if (file.size > 1097152)
            return;

        const type = file.type;
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            let aesKey = Math.random().toString().slice(2, 11);
            for (let i = 0; i < 10; i++)
                aesKey += Math.random().toString().slice(2, 11);

            const wordArray = CryptoJS.lib.WordArray.create(reader.result);
            const encrypted = CryptoJS.AES.encrypt(wordArray, aesKey).toString();

            setUploadedFile({
                name: file.name,
                mimeType: type,
                size: formatBytes(file.size),
                content: encrypted,
                aes: aesKey,
            });
        };
    };

    const handleUpload = async e => {
        e.target.disabled = true;
        if (keys.patient) {
            try {
                const encryptedKey = cryptico.encrypt(uploadedFile.aes, keys.publicKey);
                const data = await addDoc(collection(db, "locker", auth.currentUser.uid, "owned"),
                    {
                        name: uploadedFile.name,
                        mimeType: uploadedFile.mimeType,
                        size: uploadedFile.size,
                        content: uploadedFile.content,
                        aes: encryptedKey.cipher,
                        uploader: auth.currentUser.email,
                    }
                );
                await setDoc(doc(db, "locker", auth.currentUser.uid, "list",data.id), {
                    name: uploadedFile.name,
                    id: data.id,
                    shared: false,
                    size: uploadedFile.size,
                });
                fetchData();
                setUploadedFile(undefined);
                setUploader(false);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const encryptedKey = cryptico.encrypt(uploadedFile.aes, reciever.publickey);
                const doc = await addDoc(collection(db, "locker", reciever.uid, "recieved"), {
                    name: uploadedFile.name,
                    mimeType: uploadedFile.mimeType,
                    size: uploadedFile.size,
                    content: uploadedFile.content,
                    aes: encryptedKey.cipher,
                    uploader: auth.currentUser.email,
                });
                await addDoc(collection(db, "locker", reciever.uid, "list"), {
                    name: uploadedFile.name,
                    id: doc.id,
                    shared: true,
                    size: uploadedFile.size,
                });
                setUploadedFile(undefined);
                setUploader(false);
            } catch (e) {
                console.log(e);
            }
        }
        e.target.disabled = false;
    };

    return (
        <AlertDialog.Root open={uploader}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Upload Files</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <p>The files you upload will be only accessible to you. They are encrypted end-to-end.</p>
                        {/*<input type="file" onChange={handleFileChange}/>*/}
                    </AlertDialog.Description>
                    {!keys.patient &&
                        <div className={s["upload-input"]}>
                            <input type="email" placeholder={"Patient email address"} onChange={handleEmail} required/>
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
                    }
                    {uploadedFile === undefined ?
                        <label className={s["upload-file"]}>
                            <input type="file" onChange={handleFile}/>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="w-6 h-6">
                                <path fillRule="evenodd"
                                      d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                      clipRule="evenodd"/>
                            </svg>
                            <br/> Drag & Drop <br/> or <b>Browse</b>
                            <br/> <span>Max File size: 1MB</span>
                        </label> : <div className={s["file"]}>
                            <div>
                                <p>{uploadedFile.name.split(".")[0]}</p>
                                <span>{uploadedFile.name.split(".")[1]}</span>
                            </div>
                            <span>{uploadedFile.size}</span>
                            <button onClick={() => setUploadedFile(undefined)}>
                                DELETE
                            </button>
                        </div>
                    }
                    <div className={s["upload-actions"]}>
                        <button className={s["upload-cancel-button"]} onClick={
                            () => {
                                setUploadedFile(undefined);
                                setUploader(false);
                            }}>
                            Cancel
                        </button>
                        <button className={s["upload-confirm-button"]}
                                disabled={keys.patient ? uploadedFile === undefined
                                    : (uploadedFile === undefined || !validEmail)}
                                onClick={handleUpload}
                        >
                            Upload File
                        </button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}