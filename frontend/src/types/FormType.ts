import type { Word } from "./WordType";

export type FormState = Pick<Word, "word" | "meaning" | "sentence" | "notes">;
export type FormErrors = Partial<Record<keyof FormState, string>>;