"use client"
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import axios from "axios";
import { useState } from "react"

export function UploadImage({ onImageAdded, image }: {
    onImageAdded: (image: string) => void;
    image?: string;
}) {
    const [uploading, setUploading] = useState(false);

    async function onFileSelect(e: any) {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (file.type !== "image/png") {
            alert("Only PNG files are allowed!");
            return;
        }

        setUploading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
                headers: {
                    "Authorization": localStorage.getItem("token") || ""
                }
            });
            const presignedUrl = response.data.preSignedUrl;
            const fields = response.data.fields;

            const formData = new FormData();
            Object.keys(fields).forEach(key => {
                formData.append(key, fields[key]);
            });
            formData.append("file", file);

            await axios.post(presignedUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            onImageAdded(`${CLOUDFRONT_URL}/${fields["key"]}`);
        } catch (e) {
            console.log(e);
        }
        setUploading(false);
    }

    if (image) {
        return <img className="p-2 w-96 rounded" src={image} alt="Uploaded" />;
    }

    return (
        <div>
            <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
                <div className="h-full flex justify-center flex-col relative w-full">
                    <div className="h-full flex justify-center w-full pt-16 text-4xl">
                        {uploading ? <div className="text-sm">Loading...</div> : <>
                            +
                            <input
                                className="w-full h-full"
                                type="file"
                                accept="image/png"
                                style={{ position: "absolute", opacity: 0, top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%" }}
                                onChange={onFileSelect}
                            />
                        </>}
                    </div>
                </div>
            </div>
        </div>
    );
}
