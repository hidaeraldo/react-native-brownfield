import { useCallback, useState } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const biometricTypes: string[] = [
    BiometryTypes.FaceID,
    BiometryTypes.TouchID,
    BiometryTypes.Biometrics,
];

const DEFAULT_MESSAGE_BIOMETRIC = 'Please authenticate to continue';

export default function useBiometricLogic() {
    const [isFaceIDEnabled, setFaceIDEnabled] = useState<boolean>(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false);

    const verifyBiometric = useCallback(
        async (onSuccess?: () => void, onFailure?: () => void) => {
            const rnBiometrics = new ReactNativeBiometrics({
                allowDeviceCredentials: true,
            });

            const { available, biometryType } = await rnBiometrics.isSensorAvailable();

            if (!available) {
                onFailure?.();
                return;
            }

            if (biometryType && biometricTypes.includes(biometryType)) {
                const { keysExist } = await rnBiometrics.biometricKeysExist();

                if (keysExist) {
                    const { success } = await rnBiometrics.simplePrompt({
                        promptMessage: DEFAULT_MESSAGE_BIOMETRIC,
                    });

                    if (success) {
                        onSuccess?.();
                    } else {
                        onFailure?.();
                    }
                } else {
                    onFailure?.();
                }
            }
        },
        []
    );

    const setupBiometric = async (onSuccess?: () => void, onFailure?: () => void) => {
        const rnBiometrics = new ReactNativeBiometrics({
            allowDeviceCredentials: true,
        });

        const { available, biometryType } = await rnBiometrics.isSensorAvailable();

        if (available && biometryType) {
            try {
                await rnBiometrics.createKeys();
                setIsBiometricEnabled(true);
                setFaceIDEnabled(true);
                onSuccess?.();
            } catch (error) {
                setIsBiometricEnabled(false);
                setFaceIDEnabled(false);
                onFailure?.();
            }
        } else {
            setIsBiometricEnabled(false);
            setFaceIDEnabled(false);
            onFailure?.();
        }
    };

    return {
        verifyBiometric,
        setupBiometric,
        isFaceIDEnabled,
        setFaceIDEnabled,
        isBiometricEnabled,
    };
} 