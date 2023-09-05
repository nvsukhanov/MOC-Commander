export type HubStatsModel = {
    hubId: string;
    rssi: number | null;
    isButtonPressed: boolean;
    batteryLevel: number | null;
    hasCommunication: boolean;
    valueRequestPortIds: number[]; // port that are currently being polled for their value
};
