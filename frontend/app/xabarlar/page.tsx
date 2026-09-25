"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Phone, Paperclip, CheckCheck, Car } from "lucide-react";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data/conversations";
import { ChatMessage } from "@/types";

export default function MessagesPage() {
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CONVERSATIONS[0].messages);
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user-sardor",
      senderName: "Sardor A.",
      senderRole: "CUSTOMER",
      text: `📎 Biriktirilgan fayl: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user-sardor",
      senderName: "Sardor A.",
      senderRole: "CUSTOMER",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulated auto-reply after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: "ali-karimov",
        senderName: "Ali Karimov",
        senderRole: "PROVIDER",
        text: "Qabul qildim, tez orada yetib boraman!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-140px)] bg-surface">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1 flex flex-col">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col md:flex-row overflow-hidden min-h-[580px]">
          {/* Left Conversations List (1/3) */}
          <div className="w-full md:w-80 border-r border-outline-variant/20 flex flex-col bg-surface-container-low">
            <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest">
              <h2 className="text-lg font-bold text-on-surface">Xabarlar</h2>
              <p className="text-xs text-on-surface-variant">Ustalar bilan to‘g‘ridan-to‘g‘ri muloqot</p>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              {conversations.map((c) => {
                const isActive = c.id === activeConvId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveConvId(c.id);
                      setMessages(c.messages);
                    }}
                    className={`p-4 flex items-start gap-3 transition-colors text-left border-b border-outline-variant/10 cursor-pointer ${
                      isActive ? "bg-surface-container-lowest border-l-4 border-primary" : "hover:bg-surface-container"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                        <Image
                          src={c.peerAvatar}
                          alt={c.peerName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-tertiary-container ring-2 ring-surface-container-lowest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-on-surface truncate">{c.peerName}</h4>
                        <span className="text-[10px] text-on-surface-variant">{c.lastMessageTime}</span>
                      </div>
                      <span className="text-[11px] text-secondary font-semibold">{c.peerRole}</span>
                      <p className="text-xs text-on-surface-variant truncate mt-1">{c.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Chat Box (2/3) */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest">
            {/* Chat Header */}
            <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container shrink-0">
                  <Image
                    src={activeConv.peerAvatar}
                    alt={activeConv.peerName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{activeConv.peerName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-tertiary-container font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                    <span>Onlayn • Buyurtma #UT-8942</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:+998901234567"
                  className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                  title="Qo‘ng‘iroq qilish"
                >
                  <Phone className="w-4 h-4 text-primary" />
                </a>
              </div>
            </div>

            {/* Chat Order Quick Tracking Ribbon */}
            <div className="px-4 py-2 bg-primary-fixed/30 border-b border-primary-fixed/40 flex items-center justify-between text-xs text-on-primary-fixed-variant">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                <span className="font-semibold">Usta yo‘lda: Cobalt oq (01 A 777 BA) ~10 daqiqa</span>
              </div>
              <Link href="/buyurtmalar/UT-8942" className="underline font-bold text-primary">
                Buyurtmaga o‘tish
              </Link>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => {
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] ${msg.isMe ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                        msg.isMe
                          ? "bg-primary text-on-primary rounded-br-none"
                          : "bg-surface-container text-on-surface rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-on-surface-variant px-1">
                      <span>{msg.timestamp}</span>
                      {msg.isMe && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-outline-variant/20 flex items-center gap-2 bg-surface-container-low">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
                title="Rasm yoki fayl yuklash"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Xabaringizni yozing..."
                className="flex-1 h-11 px-4 rounded-xl bg-surface-container-lowest text-sm outline-none border border-outline-variant/30 focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Yuborish</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
