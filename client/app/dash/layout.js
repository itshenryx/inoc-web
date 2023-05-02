"use client"

import {useState, useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/navigation";
import {auth, db} from '@/app/firebase-config';
import s from './page.module.css';
import {query, where, getDocs, collection, getDoc, doc} from 'firebase/firestore';
import {CircularProgress, LinearProgress} from "@mui/material";
import Key from "@/app/dash/(popups)/key";
import Firstsignin from "@/app/dash/(popups)/firstsignin";
import {KeyProvider} from "@/context/keys";
import {UserProvider} from "@/context/user";

async function fetchPublicKey(uid, setFirstSignIn) {
    return await getDoc(doc(db,"users",uid));
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
                        if (r.data() === undefined) {
                            setFirstSignIn(true);
                        } else {
                            setPublicKey(r.data().publickey);
                            setPatient(r.data().patient);
                        }
                    });
            }
        });
    }, [firstSignIn]);

    return (
        Object.keys(user).length === 0 ?
            <div className={s.loadingBox}> <CircularProgress className={s.loading}/> </div> :
            <KeyProvider>
                <UserProvider>
                <main className={s.main}>
                    {(privateKey !== undefined) && children}
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
