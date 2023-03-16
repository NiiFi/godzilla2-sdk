export {}

declare global {
  interface Window {
    __RUNTIME_CONFIG__: any // 👈️ turn off type checking
  }
}
