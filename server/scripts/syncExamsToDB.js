import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import ListeningModel from '../src/models/listening.model.js';
import ReadingModel from '../src/models/reading.model.js';
import WritingModel from '../src/models/writing.model.js';
import SpeakingModel from '../src/models/speaking.model.js';

const MONGO_URL = process.env.MONGO_URL_PRO;

const EXAMS_DIR = path.resolve(__dirname, '../../aptisUI/public/data/exams');

const SKILL_MODELS = {
    listening: ListeningModel,
    reading: ReadingModel,
    writing: WritingModel,
    speaking: SpeakingModel,
};

const isDryRun = process.argv.includes('--dry-run');

async function sync() {
    if (!MONGO_URL) {
        console.error("No MONGO_URL_PRO found in .env");
        process.exit(1);
    }
    console.log(`Connecting to MongoDB... ${isDryRun ? '[DRY RUN MODE]' : '[REAL MODE]'}`);
    await mongoose.connect(MONGO_URL);
    console.log('Connected!');

    const files = fs.readdirSync(EXAMS_DIR).filter(f => f.endsWith('.json'));

    const validIdsBySkill = {
        listening: [],
        reading: [],
        writing: [],
        speaking: []
    };

    let totalUpserted = 0;
    let totalDeleted = 0;

    const partMap = {
        'part1': 'ONE',
        'part2': 'TWO',
        'part3': 'THREE',
        'part4': 'FOUR',
        'part5': 'FIVE'
    };

    for (const file of files) {
        const [skill, partWithExt] = file.split('-');
        if (!SKILL_MODELS[skill]) continue;
        
        let mappedPart = null;
        if (partWithExt) {
            const match = partWithExt.match(/(part\d)/);
            if (match && partMap[match[1]]) {
                mappedPart = partMap[match[1]];
            }
        }
        
        const filePath = path.join(EXAMS_DIR, file);
        const dataStr = fs.readFileSync(filePath, 'utf-8');
        if (!dataStr.trim()) continue;

        let docs = [];
        try {
            docs = JSON.parse(dataStr);
        } catch (e) {
            console.error(`Error parsing ${file}:`, e.message);
            continue;
        }

        const Model = SKILL_MODELS[skill];
        let upsertCountForFile = 0;
        
        for (let doc of docs) {
            const id = doc._id;
            if (!id) continue;

            validIdsBySkill[skill].push(id);
            
            if (!isDryRun) {
                // Update MongoDB
                // Xóa _id để Mongoose không báo lỗi immutable
                const docToUpdate = { ...doc };
                delete docToUpdate._id;
                
                // Add questionPart from filename if missing, necessary for UI filters
                if (!docToUpdate.questionPart && mappedPart) {
                    docToUpdate.questionPart = mappedPart;
                }
                
                await Model.findByIdAndUpdate(id, docToUpdate, { upsert: true, new: true, runValidators: false });
            }
            
            upsertCountForFile++;
            totalUpserted++;
        }

        console.log(`[${file}] Found ${upsertCountForFile} items ${isDryRun ? 'to upsert' : 'upserted successfully'}.`);
    }

    // Delete items in DB that are not in local files
    for (const skill of Object.keys(validIdsBySkill)) {
        const Model = SKILL_MODELS[skill];
        const validIds = validIdsBySkill[skill];
        
        if (validIds.length === 0) continue; // If we didn't process any file for this skill, don't delete everything!

        // Tìm các documents trong DB có _id không nằm trong validIds
        const docsToDelete = await Model.find({ _id: { $nin: validIds } }, '_id');
        
        if (docsToDelete.length > 0) {
            console.log(`[${skill}] Found ${docsToDelete.length} items in DB that are NOT in local JSON files.`);
            if (!isDryRun) {
                const idsToDelete = docsToDelete.map(d => d._id);
                await Model.deleteMany({ _id: { $in: idsToDelete } });
                console.log(`[${skill}] Deleted ${docsToDelete.length} items from DB.`);
            }
            totalDeleted += docsToDelete.length;
        } else {
            console.log(`[${skill}] No extra items found to delete.`);
        }
    }

    console.log('---');
    console.log(`[SUMMARY] Total items ${isDryRun ? 'to upsert' : 'upserted'}: ${totalUpserted}`);
    console.log(`[SUMMARY] Total items ${isDryRun ? 'to delete' : 'deleted'}: ${totalDeleted}`);
    
    await mongoose.disconnect();
    console.log('Disconnected!');
}

sync().catch(console.error);
