import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import SpeakingModel from '../src/models/speaking.model.js';
import ReadingModel from '../src/models/reading.model.js';
import ListeningModel from '../src/models/listening.model.js';
import WritingModel from '../src/models/writing.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
const EXAMS_DIR = path.join(__dirname, '../aptisUI/public/data/exams');
const EXPORT_DIR = path.join(__dirname, 'exported_exams');
const REPORT_FILE = path.join(__dirname, 'comparison-report.md');

const SKILLS = ['speaking', 'reading', 'listening', 'writing'];
const PARTS = ['ONE', 'TWO', 'THREE', 'FOUR'];
const PART_NUMBERS = { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4 };

async function connectDB() {
    const uri = process.env.MONGO_URL_PRO;
    if (!uri) throw new Error("MONGO_URL_PRO not found in .env");
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
}

function getJsonPath(dir, skill, partIndex) {
    return path.join(dir, `${skill}-part${partIndex}.json`);
}

function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.warn(`Could not read/parse JSON file: ${filePath}`);
        return null;
    }
}

async function fetchDbData() {
    console.log("Fetching DB data...");
    const speakings = await SpeakingModel.find().lean();
    const readings = await ReadingModel.find().lean();
    const listenings = await ListeningModel.find().lean();
    const writings = await WritingModel.find().lean();

    return {
        speaking: speakings,
        reading: readings,
        listening: listenings,
        writing: writings
    };
}

function filterByPart(dataArray, skill, part) {
    return dataArray.filter(item => {
        if (skill === 'reading') {
            return item.data?.questions?.questionPart === part;
        } else {
            return item.questionPart === part;
        }
    });
}

function compareObjects(obj1, obj2, path = '') {
    const diffs = [];
    if (obj1 === obj2) return diffs;
    if (typeof obj1 !== typeof obj2) {
        diffs.push(`Type mismatch at ${path}: DB type ${typeof obj1} vs JSON type ${typeof obj2}`);
        return diffs;
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            diffs.push(`Array length mismatch at ${path}: DB len ${obj1.length} vs JSON len ${obj2.length}`);
        }
        const minLen = Math.min(obj1.length, obj2.length);
        for (let i = 0; i < minLen; i++) {
            diffs.push(...compareObjects(obj1[i], obj2[i], `${path}[${i}]`));
        }
        return diffs;
    }
    if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
        // Ignored fields for comparison
        const ignored = ['_id', 'id', 'createdAt', 'updatedAt', '__v'];
        const keys1 = Object.keys(obj1).filter(k => !ignored.includes(k));
        const keys2 = Object.keys(obj2).filter(k => !ignored.includes(k));

        for (const k of keys1) {
            diffs.push(...compareObjects(obj1[k], obj2[k], path ? `${path}.${k}` : k));
        }
        for (const k of keys2) {
            if (!keys1.includes(k)) {
                diffs.push(`Key present in JSON but not DB at ${path ? `${path}.${k}` : k}`);
            }
        }
        return diffs;
    }

    if (obj1 !== obj2) {
        diffs.push(`Value mismatch at ${path}: DB '${obj1}' vs JSON '${obj2}'`);
    }
    return diffs;
}

async function runComparisonAndExport() {
    await connectDB();
    const dbDataAll = await fetchDbData();

    // Ensure export directory exists
    if (!fs.existsSync(EXPORT_DIR)) {
        fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    let reportContent = `# Database vs JSON Files Comparison Report\n\nGenerated at: ${new Date().toISOString()}\n\n`;
    reportContent += `## 1. Count Comparison\n\n| Skill | Part | DB Count | JSON Count | Match? |\n|---|---|---|---|---|\n`;

    const detailedDiffs = [];

    // For listing-summary.json
    const summaryData = [
        { skillType: "LISTENING", skillLabel: "Listening - Nghe", parts: [] },
        { skillType: "READING", skillLabel: "Reading - Đọc", parts: [] },
        { skillType: "SPEAKING", skillLabel: "Speaking - Nói", parts: [] },
        { skillType: "WRITING", skillLabel: "Writing - Viết", parts: [] }
    ];

    for (const skill of SKILLS) {
        const summarySkillIndex = summaryData.findIndex(s => s.skillType === skill.toUpperCase());

        for (const part of PARTS) {
            const partNum = PART_NUMBERS[part];
            const dbData = filterByPart(dbDataAll[skill], skill, part);

            // 1. Export Data to JSON
            const exportPath = getJsonPath(EXPORT_DIR, skill, partNum);
            fs.writeFileSync(exportPath, JSON.stringify(dbData, null, 2), 'utf8');

            // Add to summary data
            summaryData[summarySkillIndex].parts.push({
                partNumber: partNum,
                partLabel: `Part ${partNum}`,
                totalQuestions: dbData.length,
                freeQuestions: 3 // Default business logic
            });

            // 2. Compare with existing JSON
            const jsonPath = getJsonPath(EXAMS_DIR, skill, partNum);
            const jsonData = readJsonFile(jsonPath) || [];

            const dbCount = dbData.length;
            const jsonCount = jsonData.length;
            const match = dbCount === jsonCount ? '✅' : '❌';

            reportContent += `| ${skill.toUpperCase()} | ${partNum} | ${dbCount} | ${jsonCount} | ${match} |\n`;

            const dbMap = new Map(dbData.map(item => [item._id.toString(), item]));
            const jsonMap = new Map(jsonData.map(item => [item._id.toString(), item]));

            const dbOnlyIds = [];
            const jsonOnlyIds = [];
            const matchedIds = [];

            for (const id of dbMap.keys()) {
                if (jsonMap.has(id)) matchedIds.push(id);
                else dbOnlyIds.push(id);
            }
            for (const id of jsonMap.keys()) {
                if (!dbMap.has(id)) jsonOnlyIds.push(id);
            }

            let partDetail = `\n### ${skill.toUpperCase()} Part ${partNum}\n\n`;
            partDetail += `- ✅ Matched IDs: ${matchedIds.length}\n`;
            if (dbOnlyIds.length > 0) partDetail += `- ❌ Only in DB (${dbOnlyIds.length}): ${dbOnlyIds.join(', ')}\n`;
            if (jsonOnlyIds.length > 0) partDetail += `- ❌ Only in JSON (${jsonOnlyIds.length}): ${jsonOnlyIds.join(', ')}\n`;

            const itemDiffs = [];
            for (const id of matchedIds) {
                const dbObj = dbMap.get(id);
                const jsonObj = jsonMap.get(id);
                const diffs = compareObjects(dbObj, jsonObj);
                if (diffs.length > 0) {
                    itemDiffs.push(`#### Document ${id}\n${diffs.map(d => `- ${d}`).join('\n')}`);
                }
            }

            if (itemDiffs.length > 0) {
                partDetail += `\n**Content Differences:**\n\n${itemDiffs.join('\n\n')}\n`;
            } else if (matchedIds.length > 0) {
                partDetail += `\n**Content Differences:** None ✅\n`;
            }

            detailedDiffs.push(partDetail);
        }
    }

    // Write listing-summary.json to export dir
    fs.writeFileSync(path.join(EXPORT_DIR, 'listing-summary.json'), JSON.stringify(summaryData, null, 2), 'utf8');
    console.log(`Successfully exported JSON files to ${EXPORT_DIR}`);

    reportContent += `\n## 2. Detailed Comparison\n\n`;
    reportContent += detailedDiffs.join('\n');

    fs.writeFileSync(REPORT_FILE, reportContent);
    console.log(`Report generated successfully at: ${REPORT_FILE}`);

    mongoose.disconnect();
}

runComparisonAndExport().catch(err => {
    console.error("Error during comparison/export:", err);
    process.exit(1);
});
