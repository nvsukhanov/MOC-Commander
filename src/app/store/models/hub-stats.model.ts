export type HubStatsModel = {
    hubId: string;
    rssi: number | null;
    isButtonPressed: boolean;
    batteryLevel: number | null;
    hasCommunication: boolean;
};
