import Image from "next/image";
import styles from "./page.module.css";
import Welcome from "@/components/footer";
import initTranslations from "../i18n";
import TranslationsProvider from "../../lib/TranslationsProvider";
import Footer from "@/components/footer";

const i18nNamespaces = ["common"];

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <main className={styles.main}>
        <h1>{t("welcome")}</h1>
        <Footer />
      </main>
    </TranslationsProvider>
  );
}
