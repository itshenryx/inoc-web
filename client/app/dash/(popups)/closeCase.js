import * as AlertDialog from '@radix-ui/react-alert-dialog';
import s from '../page.module.css';
import {doc, deleteDoc} from 'firebase/firestore';
import {db} from '@/app/firebase-config';

export default function CloseCase({setOpen, fetchSymptosis, userID, docID}) {
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "symptosis", userID));
            await deleteDoc(doc(db, "symptosis", docID, "list", userID));
            fetchSymptosis();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>Close this Case?</AlertDialog.Title>
                    <AlertDialog.Description className={s.AlertDialogDescription}>
                        <div className={s.separator}></div>
                        <p>Performing this action will close this case and completely remove it from the database. Only proceed if
                            you opened this case <b>accidentally</b>.</p>
                    </AlertDialog.Description>
                    <AlertDialog.Action asChild>
                        <div className={s["upload-actions"]}>
                            <button className={s["upload-cancel-button"]} onClick={
                                () => {
                                    setOpen(false);
                                }}>
                                Cancel
                            </button>
                            <button className={s["upload-confirm-button"]}
                                    onClick={handleDelete}>
                                Close Case
                            </button>
                        </div>
                    </AlertDialog.Action>

                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}