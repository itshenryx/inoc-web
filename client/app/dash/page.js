'use client';

import {auth, db} from '@/app/firebase-config';
import Nav from "@/app/dash/nav";
import Content from "./content.js"
import {collection, getDocs, getDoc, doc, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useUserContext} from "@/context/user";

export default function Dashboard() {
    const [files,setFiles] = useState(undefined);
    const [content,setContent] = useState(0);
    const [sCase,setScase] = useState(undefined);
    const [user,_] = useUserContext();

    const fetchSymptosis = async () => {
        if (user.patient) {
            const data=await getDoc(doc(db,"symptosis",user.uid));
            setScase(data.data() !== undefined ? data.data() : []);
        } else {
            const data= await getDocs(collection(db,"symptosis",user.uid, "list"));
            let arr = [];
            data.forEach(doc => {
                arr.push(doc.data());
            })
            setScase(arr);
        }
    }

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
        fetchSymptosis();
        fetchData();
    },[]);

    return (
        <>
            <Nav fileCount={files === undefined ? 0 : files.length} content={content} setContent={setContent}/>
            <Content files={files}
                     sCase={sCase}
                     fetchData={fetchData}
                     fetchSymptosis={fetchSymptosis}
                     content={content}
                     setContent={setContent}/>
        </>
    );
}