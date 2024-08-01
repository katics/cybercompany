import React from "react";
import rootStyles from "../page.module.css";
import { Container, Grid } from "@mui/material";

import ChatBoX from "@/components/chatBox/chatBox";
import UserShortcuts from "@/components/userScortcuts/userShortcuts";

import Tools from "@/components/tools/tools";
import { mockedCardDataRename } from "@/consts/cardDataMockConst";
import { mockedCardData } from "@/consts/cardShortcutsDataMockConst";
import { toolsMockedDataConst } from "@/consts/toolsMockedDataConst";
import SupportMenu from "@/components/supportMenu/supportMenu";
import TranslationsProvider from "@/lib/TranslationsProvider";
import initTranslations from "@/app/i18n";

const i18nNamespaces = ["common"];

export default async function ChatPage({
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
      <main className={rootStyles.main}>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <UserShortcuts
                title={t("userShortcuts")}
                cardData={mockedCardData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChatBoX locale={locale} />
            </Grid>
            <Grid item xs={12} md={3}>
              <SupportMenu cardData={mockedCardDataRename} />
            </Grid>
            <Grid item xs={12}>
              <Tools title={t("tools")} items={toolsMockedDataConst} />
            </Grid>
          </Grid>
        </Container>
      </main>
    </TranslationsProvider>
  );
}
