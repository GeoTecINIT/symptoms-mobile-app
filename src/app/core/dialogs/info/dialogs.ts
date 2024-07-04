import { InfoDialogOptions } from "./options";

export const infoOnPermissionsNeed: InfoDialogOptions = {
    title: "La aplicación no puede funcionar sin estos permisos",
    body: "Los permisos que te hemos solicitado son necesarios para que la aplicación funcione, sin ellos no podrás utilizar esta aplicación durante el tratamiento. Si tienes dudas, revisa nuestra política de privacidad o consulta a tu terapeuta.",
    confirmText: "De acuerdo",
};

export const infoOnWatchPermissionsNeed: InfoDialogOptions = {
    title: "Acepta los permisos en tu reloj",
    body: "Los permisos de recolección de datos cardíacos del reloj que te hemos solicitado son necesarios para usar la aplicación durante el tratamiento. Revisa la bandeja de notificaciones de tu reloj. Si tienes dudas, revisa nuestra política de privacidad o consulta a tu terapeuta.",
    confirmText: "De acuerdo",
};
