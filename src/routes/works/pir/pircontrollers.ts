import { Request, Response } from 'express';
import * as admin from "firebase-admin";
import { Pir } from '../../../models/Pir';
import { Chapter } from '../../../models/Chapter';
import { WordPair } from '../../../models/WordPair';
import { from, of } from 'rxjs';
const { v1: uuidv1, v4: uuidv4 } = require('uuid');

const pirInstance = new Pir(null, null, null, null, null)
const wordPairInstance = new WordPair(null, null, null, null, null)

const createPir = async (req: Request, res: Response) => {
    let newPir: Pir = req.body.pir;
    newPir.pirId = await uuidv1();
    const token = req.headers['authorization'].split(' ')[1];
    console.log(newPir)
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
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        pirInstance.retrievePirs().then((pirs) => {
            return res.status(200).send(pirs)
        })
    }).catch((err) => {
        return res.status(401).send(err.message);
    })
    // pirInstance.retrievePirs().then(async (dataSnapshot) => {
    //     const dataArray = Object.values(dataSnapshot.val());

    //     const newDataArray = await dataArray.map((data: Pir) => {
    //         return {
    //             pirId: data.pirId,
    //             name: data.name
    //         };
    //     });
    //     return res.status(200).send(newDataArray)
    // }).catch((error) => {
    //     return res.status(401).send(error.message);

    // });
}

const createChapter = async (req: Request, res: Response) => {
    const chapter: Chapter = req.body.chapter;
    chapter.chapterId = uuidv1();
    const token = req.headers['authorization'].split(' ')[1];

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
            selectedPir?.chapters).filter((chapter: Chapter) =>
                chapter.editorId === editorId
            )
        return res.status(200).send(chapters)

    }).catch((error) => {
        return res.status(401).send(error.message);
    })
}

const updateChapter = async (req: Request, res: Response) => {
    const chapter: Chapter = req.body.chapter;
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        const db = admin.database();
        pirInstance.updateChapter(chapter).then((updatedChapter) => {
            return res.status(200).send(updatedChapter)
        })

    }).catch((err) => {
        console.log(err)
    })
}

const updatePir = async (req: Request, res: Response) => {
    const pir: Pir = req.body.pir;
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        pirInstance.updatePir(pir).then((updatedPir) => {
            return res.status(200).send(updatedPir)
        })
    }).catch((err) => {
        console.log(err)
    })
}

const createWordPair = async (req: Request, res: Response) => {
    const wordpair: WordPair = req.body.wordpair;
    wordpair.wordPairId = uuidv1();
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        await wordPairInstance.createWordPair(wordpair)
        return res.status(200).send(wordpair)
    }).catch((err) => {
        return res.status(401).send(
            { error: err.message }
        );
    })
}

const updateWordPair = async (req: Request, res: Response) => {
    const wordPair: WordPair = req.body.wordPair;
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        wordPairInstance.updateWordPair(wordPair).then((updatedWordPair) => {
            return res.status(200).send(updatedWordPair)
        })
    }).catch((err) => {
        console.log(err)
    })
}

const deletePir = async (req: Request, res: Response) => {
    const pirId = req.body.pirId;
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        pirInstance.deletePir(pirId).then(() => {
            return res.status(200).send(
                { info: 'the book at' + pirId + 'id! deleted' }
            );
        })

    }).catch((err) => {
        console.log(err)
    })
}

const retrieveAllWordPairsOfSinglePir = async (req: Request, res: Response) => {
    const pirId = req.query.pirId;
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        const nodeRef = admin.database().ref('pir/' + pirId + '/chapters');
        // Read the data at the node once
        await nodeRef.once('value', async (snapshot) => {
            if (snapshot.exists()) {
                const chapters = snapshot.val();
                let wordpairs: any[] = []
                await Object.values(chapters).map((data: any) => {
                    if (data.wordPairs) {
                        Object.values(data.wordPairs).map((wp: WordPair) => {
                            wordpairs.push(wp)
                        })
                    }
                })
                await res.send(wordpairs)
            } else {
                return null
            }
        }, (error) => {
            return { error: error }
        });

    }).catch((err) => {
        console.log(err)
    })
}

const deleteChapter = async (req: Request, res: Response) => {
    const pirId = req.body.pirId;
    const chapterId = req.body.chapterId;
    console.log(pirId, chapterId)
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        pirInstance.deleteChapter(pirId, chapterId).then(() => {
            return res.status(200).send(
                { info: 'the chapter at' + pirId + 'id! deleted' }
            );
        })

    }).catch((err) => {
        console.log(err)
    })
}

const deleteWordPair = async (req: Request, res: Response) => {
    const wordPair = req.body.wordPair;
    console.log(wordPair)
    const token = req.headers['authorization'].split(' ')[1];
    await admin.auth().verifyIdToken(token).then(async (response) => {
        wordPairInstance.deleteWordPair(wordPair).then((ress) => {
            return res.status(200).send(
                { info: wordPair.word + ' deleted' }
            );
        })

    }).catch((err) => {
        console.log(err)
    })
}

export default { createPir, createChapter, retrievePirs, retrieveChaptersByEditorId, updateChapter, updatePir, createWordPair, updateWordPair, deletePir, retrieveAllWordPairsOfSinglePir, deleteChapter, deleteWordPair }