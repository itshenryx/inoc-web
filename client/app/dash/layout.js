"use client"

import {useState, useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/navigation";
import {auth, db} from '@/app/firebase-config';
import s from './page.module.css';
import {query, where, getDocs, collection} from 'firebase/firestore';
import {LinearProgress} from "@mui/material";
import Key from "@/app/dash/(popups)/key";
import Firstsignin from "@/app/dash/(popups)/firstsignin";
import {KeyProvider} from "@/context/keys";
import {UserProvider} from "@/context/user";

async function fetchPublicKey(uid, setFirstSignIn) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    return await getDocs(q);
}

export default function DashLayout({children}) {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [publicKey, setPublicKey] = useState();
    const [privateKey, setPrivateKey] = useState();
    const [firstSignIn, setFirstSignIn] = useState(false);
    const [patient, setPatient] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser == null)
                router.push('/signin');
            else {
                setUser(currentUser);
                fetchPublicKey(auth.currentUser.uid, setPublicKey)
                    .then((r) => {
                        if (r.empty) {
                            setFirstSignIn(true);
                        } else {
                            r.forEach((doc) => {
                                setPublicKey(doc.data().publickey);
                                setPatient(doc.data().patient);
                            });
                        }
                    });
            }
        });
    }, [firstSignIn]);

    return (
        Object.keys(user).length === 0 ? <LinearProgress/> :
            <KeyProvider>
                <UserProvider>
                <main className={s.main}>
                    {children}
                    {privateKey === undefined && <Key
                        setPrivateKey={setPrivateKey}
                        publicKey={publicKey}
                        uid={auth.currentUser.uid}
                        patient={patient}
                    />}
                    {firstSignIn && <Firstsignin setFirstSignIn={setFirstSignIn} uid={auth.currentUser.uid}/>}
                </main>
                </UserProvider>
            </KeyProvider>
    )
}
