"use client";

import s from '../page.module.css';
import Upload from "@/app/dash/upload";
import {useState} from "react";

export default function InocLocker() {
    const [uploader, setUploader] = useState(false);

    return (
        <div className={s["il-container"]}>
            <div className={s["il-header"]}>
                <p>
                   <h1>inocLocker</h1>
                    <span>Securely store and share your documents</span>
                </p>
                <div className={s["il-buttons"]}>
                    <button onClick={() => setUploader(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        UPLOAD FILES
                    </button>
                </div>
            </div>
            <div className={s["il-body"]}>
                <Upload uploader={uploader} setUploader={setUploader}/>
            </div>
        </div>
    );
}