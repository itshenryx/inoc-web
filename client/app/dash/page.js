'use client';

import s from './page.module.css';
import {signOut} from "firebase/auth";
import {auth} from '@/app/firebase-config';
import Nav from "@/app/dash/nav";
import Content from "./content.js"

export default function Dashboard() {
    const logout = async () => {
        await signOut(auth);
    }

    return (
        <>
            <Nav/>
            <Content/>
        </>
    )
}