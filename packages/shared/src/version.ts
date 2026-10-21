// Versión del contrato compartido. Tiene que coincidir con el "version" de package.json
// (lo verifica test/version.test.ts). No se importa el package.json directamente porque
// quedaría fuera de `rootDir` y web y mobile lo tendrían que empaquetar entero.
export const CONTRACT_VERSION = '0.1.0';
