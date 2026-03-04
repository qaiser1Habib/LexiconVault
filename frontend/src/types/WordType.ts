import type { AiData } from "./AiDataType";

export interface Word {
    id: string;
    word: string;
    meaning: string;
    sentence: string;
    notes: string;
    aiData: AiData | null;
}