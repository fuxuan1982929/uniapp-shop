import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    build: {
      // 开发阶段启用源码映射：https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#需主动开启-sourcemap
      sourcemap: process.env.NODE_ENV === "development"
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    plugins: [uni()]
  }
});
