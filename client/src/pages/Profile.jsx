import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase.js'

export default function Profile() {

    const fileRef = useRef(null);
    const { currentUser } = useSelector(state => state.user)
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: ''
    });

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file); // to see the percentage of upload

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setFormData((prevData) => ({ ...prevData, avatar: downloadUrl }));
                });
            }
        );
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };



    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profileImg" className='rounded-full h-24 w-24 cursor-pointer object-cover self-center mt-2' />
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>
                            Error Image upload (image must be less than 2 mb.)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>Uploading {filePerc}%</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>
                            Image successfully uploaded!
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' value={formData.username} onChange={handleInputChange} />
                <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' value={formData.email} onChange={handleInputChange} />
                <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' value={formData.password} onChange={handleInputChange} />
                <button type="submit" className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}
