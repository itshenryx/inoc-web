'use client';

import s from './page.module.css';
import {signOut, onAuthStateChanged} from "firebase/auth";
import {auth} from '@/app/firebase-config';
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function Dashboard() {
    const [user, setUser] = useState({});
    const router = useRouter();

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser == null)
            router.push('/signin');
        else
           setUser(currentUser);
    });

    const logout = async () => {
        await signOut(auth);
    }

    return (
        user === {} ? <></> :
        <main className={s.main}>
            <button onClick={logout}>
                Sign out
            </button>
        </main>
    )
}