"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styles from "./chatBox.module.css";
import useChatEventSource from "@/hooks/useChatEventSource";
import { ChatMessage, sendMessage } from "@/services/chatService";
import { roles } from "@/consts/rolesConsts";
import { useTranslation } from "react-i18next";

const Chat = ({ locale }: { locale: string }) => {
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>("");
  const [suggestQuestions, setSuggestQuestions] = useState<boolean>(false);
  const { t } = useTranslation();

  const { messages, setMessages, getEventSource } = useChatEventSource(
    sessionId,
    locale
  );

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      sessionStorage.setItem(sessionId, newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    if (input.trim()) {
      setMessages([...messages, { role: roles.user, content: input.trim() }]);
    }
    setInput("");
    const newMessage: ChatMessage = {
      role: roles.user,
      content: input.trim(),
    };

    await sendMessage(newMessage, sessionId, suggestQuestions, locale);
    getEventSource();
  };

  return (
    <Container className={styles.chatContainer}>
      <Paper className={styles.chatPaper}>
        <Box className={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <Box
              sx={{ margin: "1rem 0 1rem 0" }}
              key={index}
              className={
                msg.role === roles.assistant
                  ? styles.botMessage
                  : styles.userMessage
              }
            >
              <Box
                className={
                  msg.role === roles.assistant
                    ? styles.botMessageContent
                    : styles.userMessageContent
                }
              >
                <Typography
                  color={"white"}
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </Box>
            </Box>
          ))}
          <Box ref={messagesEndRef} />
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              inputProps={{
                sx: {
                  "&::placeholder": {
                    color: "white",
                  },
                  color: "white",
                  borderRadius: 0,
                },
              }}
              sx={{
                borderRadius: "0.5rem",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.5rem",
                },
              }}
              className={styles.textField}
              fullWidth
              variant="outlined"
              placeholder={t("chatInputPlaceHolder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </Grid>
          <Grid item xs={4}>
            {/* TODO send button should be disabled while we are receiving message
            from BE */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<SendIcon />}
              onClick={(e) => handleSubmit(e)}
            >
              {t("send")}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Chat;
