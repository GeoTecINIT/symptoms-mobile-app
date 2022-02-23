import { NativeScriptConfig } from "@nativescript/core";

export default {
    appPath: "src",
    appResourcesPath: "App_Resources",
    android: {
        id: "es.uji.geotec.alert.symptomsapp",
        v8Flags: "--expose_gc",
        markingMode: "none",
    },
    ios: {
        id: "es.uji.geotec.symptomsapp",
    },
} as NativeScriptConfig;
