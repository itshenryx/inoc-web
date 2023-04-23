'use client';

import s from './page.module.css';
import {signOut} from "firebase/auth";
import {auth} from '@/app/firebase-config';

export default function Dashboard() {
    const logout = async () => {
        await signOut(auth);
    }

    return (
        <main className={s.main}>
            <button onClick={logout}>
                Sign out
            </button>
        </main>
    )
}