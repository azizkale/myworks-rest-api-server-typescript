import { Request, Response } from 'express';
import * as admin from "firebase-admin";
import { Pir } from '../../../models/Pir';
import { Chapter } from '../../../models/Chapter';
const { v1: uuidv1, v4: uuidv4 } = require('uuid');

const pirInstance = new Pir(null, null, null, null)
const createPir = async (req: Request, res: Response) => {
    let newPir: Pir = req.body.pir;
    newPir.pirId = await uuidv1();
    newPir.chapters[0].chapterId = await uuidv1(); // first chapter
    newPir.chapters[0].pirId = await uuidv1();
    const token = req.body.token;
    await admin.auth().verifyIdToken(token).then(async (response) => {
        try {
            await pirInstance.createPir(newPir).then(() => {
                res.status(200).send(newPir);
            }).catch((err) => {
                return res.status(409).send(
                    { error: err.message }
                );
            })
        } catch (err) {
            return res.status(409).send(
                { error: err.message }
            );
        }
    }).catch((err) => {
        return res.status(401).send(
            { error: err.message }
        );
    })
}

const retrievePirs = async (req: Request, res: Response) => {

    pirInstance.retrievePirs().then((pirs) => {
        return res.status(200).send(pirs)
    })
}

const createChapter = async (req: Request, res: Response) => {
    const chapter: Chapter = req.body.chapter;
    chapter.chapterId = uuidv1();
    const token = req.body.token;
    await admin.auth().verifyIdToken(token).then(async (response) => {
        try {
            pirInstance.addChapterToPir(chapter).then(() => {
                res.status(200).send(chapter);
            }).catch((err) => {
                return res.status(409).send(
                    { error: err.message }
                );
            })
        } catch (err) {
            return res.status(409).send(
                { error: err.message }
            );
        }
    }).catch((err) => {
        return res.status(401).send(
            { error: err.message }
        );
    })
}

const retrieveChaptersByEditorId = async (req: Request, res: Response) => {
    const editorId: any = req.query.editorId;
    const pirId: any = req.query.pirId;
    pirInstance.retrievePirs().then((pirs) => {
        const selectedPir: Pir | any = (Object.values(pirs.val()).filter((pir: Pir) => pir.pirId === pirId))[0]

        const chapters = Object.values(
            selectedPir.chapters).filter((chapter: Chapter) =>
                chapter.editorId === editorId
            )
        return res.status(200).send(chapters)

    })
}

const updateChapter = async (req: Request, res: Response) => {
    const chapter: Chapter = req.body.chapter;
    const token = req.body.token;
    console.log(chapter)
    await admin.auth().verifyIdToken(token).then(async (response) => {
        const db = admin.database();
        pirInstance.updateChapter(chapter).then((updatedChapter) => {
            return res.status(200).send(updatedChapter)
        })

    }).catch((err) => {
        console.log(err)
    })
}
export default { createPir, createChapter, retrievePirs, retrieveChaptersByEditorId, updateChapter }