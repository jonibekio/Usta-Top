"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, MessageSquare, Loader2, User, RefreshCw } from "lucide-react";
import { getConversations, getConversationMessages, sendMessage } from "@/lib/api/conversations";
import { useAuth } from "@/lib/auth/AuthContext";
import { Conversation, ChatMessage } from "@/types";
import EmptyState from "@/components/ui/EmptyState";

export default function MessagesPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial load of conversations
  const loadConversations = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingConvs(true);
    try {
      const data = await getConversations();
      setConversations(data);
      if (!activeConvId && data.length > 0) {
        setActiveConvId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      if (!silent) setIsLoadingConvs(false);
    }
  }, [activeConvId]);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      setIsLoadingConvs(false);
      return;
    }
    loadConversations();
  }, [isAuthenticated, isAuthLoading, loadConversations]);

  // Periodic poll of conversation list (every 8 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      loadConversations(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadConversations]);

  // Load active conversation messages
  const loadMessages = useCallback(async (convId: string, silent = false) => {
    if (!silent) setIsLoadingMsgs(true);
    try {
      const msgs = await getConversationMessages(convId);
      setMessages((prev) => {
        // If message count or IDs changed, update and scroll
        if (msgs.length !== prev.length || msgs[msgs.length - 1]?.id !== prev[prev.length - 1]?.id) {
          setTimeout(scrollToBottom, 60);
          return msgs;
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      if (!silent) setIsLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    loadMessages(activeConvId, false);
  }, [activeConvId, loadMessages]);

  // Auto-polling messages for active chat (every 3 seconds for real-time experience)
  useEffect(() => {
    if (!activeConvId) return;
    const msgInterval = setInterval(() => {
      loadMessages(activeConvId, true);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, [activeConvId, loadMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const newMsg = await sendMessage(activeConvId, text);
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(scrollToBottom, 50);
      loadConversations(true);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  if (isAuthLoading || isLoadingConvs) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-12 px-4 flex items-center justify-center">
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 text-center max-w-sm w-full flex flex-col items-center gap-3 shadow-sm">
          <MessageSquare className="w-10 h-10 text-primary" />
          <h2 className="text-lg font-bold text-on-surface">Xabarlarni ko‘rish uchun kiring</h2>
          <p className="text-xs text-on-surface-variant">
            Usta yoki mijoz bilan real-vaqt muloqot qilish uchun hisobingizga kiring.
          </p>
          <Link
            href="/auth/login?redirect=/xabarlar"
            className="w-full mt-2 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-sm hover:bg-primary-container transition-colors"
          >
            Tizimga kirish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-surface py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex-1 flex flex-col">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm flex-1 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
          {/* Left: Conversations List */}
          <div className="w-full md:w-80 border-r border-outline-variant/20 flex flex-col bg-surface-container-low">
            <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-on-surface">Xabarlar</h2>
                <p className="text-xs text-on-surface-variant">Muloqotlar ro‘yxati</p>
              </div>
              <button
                type="button"
                onClick={() => loadConversations(false)}
                title="Yangilash"
                className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-on-surface-variant">
                  Hozircha xabarlar yo‘q
                </div>
              ) : (
                conversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveConvId(c.id)}
                      className={`p-3.5 flex items-start gap-3 transition-colors text-left border-b border-outline-variant/10 cursor-pointer ${
                        isActive
                          ? "bg-surface-container-lowest border-l-4 border-primary"
                          : "hover:bg-surface-container"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0">
                        {c.peerAvatar ? (
                          <Image
                            src={c.peerAvatar}
                            alt={c.peerName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          c.peerName?.charAt(0) || "U"
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold text-on-surface truncate">{c.peerName}</h4>
                          <span className="text-[10px] text-on-surface-variant">{c.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">
                          {c.lastMessage || "Muloqot boshlandi"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Chat Window */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-3.5 px-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0">
                      {activeConv.peerAvatar ? (
                        <Image
                          src={activeConv.peerAvatar}
                          alt={activeConv.peerName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        activeConv.peerName?.charAt(0) || "U"
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">{activeConv.peerName}</h3>
                      <p className="text-xs text-on-surface-variant capitalize">
                        {activeConv.peerRole === "PROVIDER" ? "Mutaxassis usta" : "Mijoz"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 bg-surface/50">
                  {isLoadingMsgs ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-xs text-on-surface-variant">
                      Hozircha xabar yo‘q. Birinchi xabarni yuboring.
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[80%] ${
                          m.isMe ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            m.isMe
                              ? "bg-primary text-on-primary rounded-br-none"
                              : "bg-surface-container text-on-surface rounded-bl-none border border-outline-variant/30"
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-on-surface-variant/70 mt-1 px-1">
                          {m.timestamp}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-outline-variant/20 flex items-center gap-2 bg-surface-container-lowest"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Xabaringizni yozing..."
                    className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  />

                  <button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="h-10 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
                <MessageSquare className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm font-bold text-on-surface">Muloqot tanlanmagan</p>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  Chap tarafdagi ro‘yxatdan suhbatni tanlang yoki usta profilidan yangi muloqot boshlang.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
