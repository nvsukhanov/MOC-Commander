import { MotorUseProfile } from 'rxpoweredup';

export function mapUseProfile({
  useAccelerationProfile,
  useDecelerationProfile,
}: {
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
}): MotorUseProfile {
  if (useAccelerationProfile && useDecelerationProfile) {
    return MotorUseProfile.useAccelerationAndDecelerationProfiles;
  }
  if (useAccelerationProfile) {
    return MotorUseProfile.useAccelerationProfile;
  }
  if (useDecelerationProfile) {
    return MotorUseProfile.useDecelerationProfile;
  }
  return MotorUseProfile.dontUseProfiles;
}
