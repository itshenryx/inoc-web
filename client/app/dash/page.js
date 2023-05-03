'use client';

import {auth, db} from '@/app/firebase-config';
import Nav from "@/app/dash/nav";
import Content from "./content.js"
import {collection, getDocs, getDoc, doc, query, where, onSnapshot} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useUserContext} from "@/context/user";
import {cryptico} from "@veikkos/cryptico";
import {useKeyContext} from "@/context/keys";

export default function Dashboard() {
    const [files, setFiles] = useState(undefined);
    const [content, setContent] = useState(0);
    const [history, setHistory] = useState(undefined);
    const [historyKey, setHistoryKey] = useState(undefined);
    const [sCase, setScase] = useState(undefined);
    const [user, _] = useUserContext();
    const [keys, __] = useKeyContext();

    const fetchSymptosis = async () => {
        if (user.patient) {
            const data = await onSnapshot(doc(db, "symptosis", user.uid), (d) => {
                if (d.exists()) {
                    setScase(d.data());
                } else {
                    setScase([]);
                }
            });
        } else {
            const data = await onSnapshot(collection(db, "symptosis", user.uid, "list"), (d) => {
                let arr = [];
                d.forEach(doc => {
                    arr.push(doc.data());
                })
                setScase(arr);
            });
        }
    }

    const fetchHistory = async () => {
        if (user.patient) {
            const fetchedDoc = await getDoc(doc(db, "history", user.uid));
            if (fetchedDoc.exists()) {
                const patientAES = cryptico.decrypt(fetchedDoc.data().aesKey, keys.privateKey);
                setHistoryKey(patientAES.plaintext);
                const data = await onSnapshot(collection(db, "history", user.uid, "cases"), (d) => {
                    let arr = [];
                    d.forEach(doc => {
                        arr.push(doc.data());
                    })
                    setHistory(arr);
                });
            }
        }
    }

    const fetchData = async () => {
        const q = await onSnapshot(collection(db, "locker", auth.currentUser.uid, "list"),
            (d) => {
                let arr = [];
                d.forEach(doc => {
                    const temp = doc.data();
                    temp.selfid = doc.id;
                    arr.push(temp);
                });
                setFiles(arr);
            });
    };

    useEffect(() => {
        fetchSymptosis();
        fetchData();
        fetchHistory();
    }, []);

    return (
        <>
            <Nav fileCount={files === undefined ? 0 : files.length} content={content} setContent={setContent}/>
            <Content files={files}
                     sCase={sCase}
                     history={history}
                     historyKey={historyKey}
                     content={content}
                     setContent={setContent}/>
        </>
    );
}