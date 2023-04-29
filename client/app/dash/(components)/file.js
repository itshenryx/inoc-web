'use client'

import s from "@/app/dash/page.module.css";
import * as ContextMenu from '@radix-ui/react-context-menu';
import Share from "@/app/dash/(popups)/share";
import {useState} from "react";
import {doc, getDoc, deleteDoc} from "firebase/firestore";
import {auth, db} from "@/app/firebase-config";
import {cryptico} from "@veikkos/cryptico";
import CryptoJS from "crypto-js";
import {useKeyContext} from "@/context/keys";

function convertWordArrayToUint8Array(wordArray) {
    let arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    let length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    let uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

export default function File({data, fetchData}) {
    const [sharing, setSharing] = useState(false);
    const [keys, _] = useKeyContext();

    const handleDownload = async () => {
        const snap = await getDoc(doc(db, "locker", auth.currentUser.uid, data.shared ? "recieved" : "owned", data.id));
        const fileData = snap.data();
        const decryptedKey = cryptico.decrypt(fileData.aes, keys.privateKey);
        let aesKey = decryptedKey.plaintext;
        const decryptedContent = CryptoJS.AES.decrypt(fileData.content, aesKey);

        const typedArray = convertWordArrayToUint8Array(decryptedContent);
        const blob = new Blob([typedArray], {type: fileData.mimeType});
        const href = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), {href, style: "display:none", download: fileData.name});
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(href);
        a.remove();
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db,"locker",auth.currentUser.uid, data.shared ? "recieved" : "owned", data.id));
            await deleteDoc(doc(db,"locker",auth.currentUser.uid, "list" , data.selfid));
            fetchData();
        } catch (e) {
            console.log(e);
        }
    };

    return (<>
        <ContextMenu.Root>
            <ContextMenu.Trigger className={s.ContextMenuTrigger}>
                {sharing && <Share data={data} sharing={sharing} setSharing={setSharing}/>}
                <div className={s.ContextMenuDot}></div>
                <div className={s.ContextMenuDot}></div>
                <div className={s.ContextMenuDot}></div>
                <div className={s.ContextMenuDot}></div>
                <div className={s.DetailContainer}>
                    <span className={s.FileType}>{data.name.split(".")[1]}</span>
                </div>
                <div className={s.DetailContainer}>
                    <span className={s.FileName}>{data.name.split(".")[0]}</span>
                </div>
                <div className={s.DetailContainer}>
                    <span className={s.FileSize}>{data.size}</span>
                </div>
                <span className={s.FileOwner}>{data.shared ? "shared" : "owned"}</span>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Content className={s.ContextMenuContent} sideOffset={5} align="end">
                    <ContextMenu.Item className={s.ContextMenuItem} disabled={data.shared} onSelect={() => setSharing(true)}>
                        Share
                        <div className={s.RightSlot}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
                            </svg>
                        </div>
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={s.ContextMenuSeparator}/>
                    <ContextMenu.Item className={s.ContextMenuItem} onSelect={handleDownload}>
                        Download
                        <div className={s.RightSlot}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                        </div>
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={s.ContextMenuSeparator}/>
                    <ContextMenu.Item className={s.ContextMenuItem} onSelect={handleDelete}>
                        Delete
                        <div className={s.RightSlot}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                            </svg>
                        </div>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    </>);
}