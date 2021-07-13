import {
    Account,
    PatientProfile,
    PatientProfileController,
} from "~/app/core/account";

interface UploadMetadata {
    deviceId: string;
    patientId: string;
    studyId: string;
}

export async function getUploadMetadata(
    account: Account
): Promise<UploadMetadata> {
    const deviceProfile = account.deviceProfile;
    if (!deviceProfile.linked) {
        throw new Error("Current app install is not linked!");
    }

    const patientProfile = await getPatientProfile(account.patientProfile);

    return {
        deviceId: deviceProfile.deviceId,
        patientId: patientProfile.id,
        studyId: patientProfile.study.id,
    };
}

async function getPatientProfile(
    patientProfile: PatientProfileController
): Promise<PatientProfile> {
    if (patientProfile.info) {
        return patientProfile.info;
    }

    await patientProfile.reloadInfo();

    if (patientProfile.info) {
        return patientProfile.info;
    }
    throw new Error("Patient profile has not been loaded!");
}
