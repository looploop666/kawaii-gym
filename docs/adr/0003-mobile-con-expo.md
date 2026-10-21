# 0003 — Mobile con Expo

**Estado:** Aceptado · **Fecha:** 2026-10-21

## Contexto

La app mobile es React Native, Android en el MVP y compatible con iOS después (STD-21). Necesita módulos nativos: login con Google (AUTH-M4), almacenamiento seguro (AUTH-M1), notificaciones locales (SES-M8), háptico (SES-M5) y almacenamiento persistente para la cola offline (07-offline). La máquina de desarrollo hoy no tiene Android SDK y tiene JDK 8 (React Native pide JDK 17).

## Opciones

- **A. React Native CLI ("bare").** Control total del proyecto nativo. Requiere Android Studio y JDK 17 desde el día uno, y mantener a mano las carpetas `android/` e `ios/`.
- **B. Expo.** Es el framework que recomienda la documentación oficial de React Native. Tiene módulos para todo lo de arriba (`expo-secure-store`, `expo-notifications`, `expo-haptics`), arranca en Expo Go sin SDK local, y los development builds y EAS Build resuelven lo nativo (incluido iOS más adelante sin una Mac).

## Decisión

**B.** Saca la instalación de Android del camino crítico del skeleton y deja más fácil sumar iOS.

## Consecuencias

- Skeleton y primeras pantallas en Expo Go, sobre un Android físico.
- Con 01-auth hace falta un **development build**, porque el login nativo de Google no corre en Expo Go. Se genera con EAS Build (cuenta gratuita de Expo) o localmente instalando Android Studio + JDK 17.
- Metro necesita configuración para el monorepo de pnpm.
- La cola offline se decide en 07-offline entre MMKV (`react-native-mmkv`) y SQLite (`expo-sqlite`). Las dos funcionan con development builds.
