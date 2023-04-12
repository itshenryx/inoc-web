'use client';

import s from './page.module.css';
import {signOut, onAuthStateChanged} from "firebase/auth";
import {auth} from '@/app/firebase-config';
import {useRouter} from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser == null)
            router.push('/signin');
    });

    const logout = async () => {
        await signOut(auth);
    }

    return (
        auth.currentUser === null ? <></> :
        <main className={s.main}>
            <button onClick={logout}>
                Sign out
            </button>
        </main>
    )
}