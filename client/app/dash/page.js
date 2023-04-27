'use client';

import {auth, db} from '@/app/firebase-config';
import Nav from "@/app/dash/nav";
import Content from "./content.js"
import {collection, getDocs, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";

export default function Dashboard() {
    const [files,setFiles] = useState(undefined);
    const [content,setContent] = useState(-1);

    const fetchData = async () => {
        const q = query(collection(db, "locker", auth.currentUser.uid, "list"));
        let arr = [];
        await getDocs(q).then(r => {
            r.forEach(doc => {
                const temp = doc.data();
                temp.selfid = doc.id;
                arr.push(temp);
            });
            setFiles(arr);
        });
    };

    useEffect(() => {
        fetchData();
    },[]);

    return (
        <>
            <Nav fileCount={files === undefined ? 0 : files.length} content={content} setContent={setContent}/>
            <Content files={files} fetchData={fetchData} content={content}/>
        </>
    )
}