import { getDatabase, ref, set } from "firebase/database";
import { Request, Response } from 'express';

export const addTheUserToDB = async (req: Request, res: Response) => {
    (userId, name, email, imageUrl) => {
        const db = getDatabase();
        set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
            profile_picture: imageUrl
        });
    }
}