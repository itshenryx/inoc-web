'use client';
import styles from './page.module.css'
// import s from "@/app/dash/page.module.css";
import {CircularProgress} from "@mui/material";
import {useRouter} from "next/navigation";
import {useEffect} from "react";


export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push('/signin');
    }, []);

    return (
        <main>
            <div className={styles.loadingBox}><CircularProgress className={styles.loading}/></div>
        </main>
    )
}
