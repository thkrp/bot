export interface HistoryManager {
    uploadFromFile: (filename: string) => Promise<void>;
}
