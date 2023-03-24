export class LpuCharacteristicsMessenger {
    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic
    ) {
    }

    public async send(
        payload: Uint8Array
    ): Promise<void> {
        console.log('sending', payload.join(' '));
        await this.characteristic.writeValueWithoutResponse(payload);
        console.log('data sent');
    }
}
