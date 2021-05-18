import { InfoDialogOptions } from "./options";

export const infoOnPermissionsNeed: InfoDialogOptions = {
    title: "La aplicación no puede funcionar sin estos permisos",
    body:
        "Los permisos que te hemos solicitado son necesarios para que la aplicación funcione, sin ellos no podrás utilizar esta aplicación durante el tratamiento. Si tienes dudas, revisa nuestra política de privacidad o consulta a tu terapeuta.",
    confirmText: "De acuerdo",
};

export const dangersOfEarlyLeave: InfoDialogOptions = {
    title: "¿Por qué no debería irme?",
    body: `Consulta el contenido "C" para revisar el papel de la evitación`,
    confirmText: "Vale",
};
