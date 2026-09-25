"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  Fan,
  PowerOff,
  RefreshCw,
  Camera,
  UploadCloud,
  Play,
  Mic,
  MapPin,
  Crosshair,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  Users,
  Pause,
  Loader2,
} from "lucide-react";
import { createServiceRequest } from "@/lib/api/requests";

export default function ProblemDiagnosisPage() {
  const router = useRouter();

  // Diagnostic form state
  const [q1, setQ1] = useState("Bugun to‘satdan to‘xtadi");
  const [q2, setQ2] = useState("Ha, pultdan yoqiladi lekin sovuq bermayapti");
  const [symptoms, setSymptoms] = useState<string[]>(["Ichki blokdan suv oqmoqda"]);
  const [brand, setBrand] = useState("Artel");
  const [urgency, setUrgency] = useState("⚡ Shoshilinch (1-2 soat)");
  const [address, setAddress] = useState("Toshkent, Chilonzor tumani, 9-mavze, 14-uy");
  const [hasPhoto, setHasPhoto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSymptom = (item: string) => {
    if (symptoms.includes(item)) {
      setSymptoms(symptoms.filter((s) => s !== item));
    } else {
      setSymptoms([...symptoms, item]);
    }
  };

  const handleProceed = async () => {
    setIsSubmitting(true);
    try {
      await createServiceRequest({
        categoryId: "konditsioner",
        categoryName: "Konditsioner ta'miri",
        problemDescription: `Konditsioner (${brand}) muammosi. Alomatlar: ${symptoms.join(", ")}. Vaqt: ${urgency}. Manzil: ${address}`,
        detectedIssues: symptoms.length > 0 ? symptoms : ["Freon oqishi yoki yetishmovchiligi"],
        answers: {
          timeframe: q1,
          condition: q2,
          additionalSymptoms: symptoms,
          brand,
        },
        location: {
          city: "Toshkent",
          district: "Chilonzor",
          address,
        },
      });
    } catch (e) {
      console.warn("Failed to create request, proceeding to providers:", e);
    } finally {
      setIsSubmitting(false);
      router.push("/ustalar");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Search Query Header Bar */}
      <div className="w-full bg-surface-container-low py-4 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm">
            <Search className="w-5 h-5 text-primary" />
            <span className="text-on-surface-variant">Qidiruv so‘rovi:</span>
            <span className="font-bold text-on-surface bg-surface px-3 py-1 rounded-lg shadow-sm border border-outline-variant/30">
              “Konditsionerim ishlamayapti va sovutmayapti”
            </span>
          </div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse" />
            <span>AI tahlil yakunlandi • 98% aniqlik</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8">
        {/* 3-Stage Progress Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-8">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-primary-container text-on-primary shadow-sm">
            <div className="w-8 h-8 rounded-full bg-surface text-primary font-bold flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-on-primary-container font-semibold">
                1-bosqich
              </p>
              <p className="text-sm font-bold truncate">Muammo tahlili (Faol)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container text-on-surface-variant">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant font-bold flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-outline font-semibold">
                2-bosqich
              </p>
              <p className="text-sm font-bold truncate text-on-surface">Mos ustalar</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container text-on-surface-variant">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant font-bold flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-outline font-semibold">
                3-bosqich
              </p>
              <p className="text-sm font-bold truncate text-on-surface">Buyurtma va Takliflar</p>
            </div>
          </div>
        </div>

        {/* Main Content: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Diagnostic Wizard Questions */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Header info card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 self-start px-3.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Aniqlangan xizmat: Konditsioner ustasi (Ta‘mirlash va profilaktika)</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-on-surface">
                Usta aniq narx va tez yetib kelishi uchun bir necha savolga javob bering
              </h1>
              <p className="text-sm text-on-surface-variant">
                Bu 1 daqiqadan kam vaqt oladi va sizga hududingizdagi eng maqbul ustalarni avtomatik tavsiya qiladi.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low text-primary text-xs leading-relaxed border border-outline-variant/20">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <span className="text-on-surface">
                  Sun‘iy intellekt siz kiritgan ma‘lumotlar asosida ehtimoliy nosozlikni (freon yetishmovchiligi yoki filtr tiqilishi) aniqlamoqda.
                </span>
              </div>
            </div>

            {/* Diagnostic Form Block */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
              {/* Question 1 */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-center text-xs leading-5">
                      1
                    </span>
                    Qachondan beri ishlamayapti?
                  </label>
                  <span className="text-xs text-secondary uppercase font-bold">Zarur</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Bugun to‘satdan to‘xtadi",
                    "1-2 kundan beri",
                    "Mavsum boshidan beri",
                    "Bilmayman",
                  ].map((val) => {
                    const isSelected = q1 === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setQ1(val)}
                        className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        <span>{val}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2 */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-center text-xs leading-5">
                      2
                    </span>
                    Qurilma yoqiladimi?
                  </label>
                  <span className="text-xs text-secondary uppercase font-bold">Zarur</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: "Ha, pultdan yoqiladi lekin sovuq bermayapti",
                      icon: <Fan className="w-4 h-4" />,
                    },
                    {
                      label: "Umuman yonmayapti",
                      icon: <PowerOff className="w-4 h-4" />,
                    },
                    {
                      label: "Yonadi va o‘chib qoladi",
                      icon: <RefreshCw className="w-4 h-4" />,
                    },
                  ].map((item) => {
                    const isSelected = q2 === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setQ2(item.label)}
                        className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Checkboxes */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-center text-xs leading-5">
                      3
                    </span>
                    G‘alati ovoz yoki suv oqishi bormi?
                  </label>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Bir nechtasini tanlash mumkin
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Ichki blokdan suv oqmoqda",
                    "Tashqi blok shovqin qilyapti",
                    "Yoqimsiz hid kelyapti",
                    "Boshqa g‘alati holat yo‘q",
                  ].map((symptom) => {
                    const checked = symptoms.includes(symptom);
                    return (
                      <label
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors ${
                          checked
                            ? "bg-surface-container-high text-on-surface font-semibold"
                            : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                        <span className="text-sm">{symptom}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Brand */}
              <div className="flex flex-col gap-2.5">
                <label className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-center text-xs leading-5">
                    4
                  </span>
                  Konditsioner brendi yoki turi:
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Artel", "Samsung", "LG", "Midea", "Gree", "Boshqa brend"].map((b) => {
                    const isSelected = brand === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBrand(b)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Media Upload & Audio Section */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
              {/* Photo Upload Zone */}
              <div className="flex flex-col gap-2.5">
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <Camera className="w-5 h-5 text-secondary" />
                  Muammo fotosurati yoki video qo‘shish{" "}
                  <span className="text-xs text-on-surface-variant font-normal">
                    (ixtiyoriy, tavsiya etiladi)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setHasPhoto(true)}
                    className="md:col-span-2 p-6 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors min-h-[140px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-on-surface">
                      Rasm yuklash yoki bu yerga tashlang
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      PNG, JPG yoki MP4 (Maksimal 25MB)
                    </p>
                  </div>

                  {hasPhoto && (
                    <div className="relative rounded-2xl overflow-hidden shadow-sm bg-surface-container border border-outline-variant/30 aspect-square md:aspect-auto">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaSYEf7wd2MICzJZuaPGSbfrEvJVYxe0OcpCk-ovheiyqxupIlTHYRlkI2FVeLz8py66zIVkmG7_nzMGsVhG8wz7KG8eHk5ztvTwd3LOscIh6iuVqIMcMsLkaoKqjRcpp_Nt2ve_89TtVlDAdFGqlCWb-mSEF-c1lyy4_BcwopSjppYtjmrDe-gs5v1HMG-KFlvSW6_ieLFWIsi-dGnUPzN637UXXvpMU5fp9u9Ep0kO08SadDO28kww"
                        alt="Konditsioner nosozlik fotosurati"
                        width={240}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setHasPhoto(false)}
                        className="absolute top-2 right-2 bg-surface/90 rounded-full p-1 text-error hover:bg-surface transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-inverse-surface/80 text-inverse-on-surface px-2 py-0.5 rounded text-[11px]">
                        konditsioner_nosozlik.jpg
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Note Recorder */}
              <div className="flex flex-col gap-2.5">
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <Mic className="w-5 h-5 text-secondary" />
                  Ovozli xabar bilan tushuntirish:
                </h2>
                <div className="p-4 rounded-2xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 border border-outline-variant/20">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlayingAudio(!isPlayingAudio);
                        setToastMessage(isPlayingAudio ? "Ovozli xabar to‘xtatildi" : "Ovozli xabar tinglanmoqda...");
                      }}
                      className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div className="flex flex-col gap-1 w-full sm:w-56">
                      <div className="flex items-center justify-between text-on-surface-variant text-xs font-medium">
                        <span>{isPlayingAudio ? "Ijro etilmoqda (0:09)" : isRecordingAudio ? "Yozilmoqda..." : "0:18 yozib olindi"}</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full bg-primary rounded-full ${isPlayingAudio ? "w-1/2 animate-pulse" : "w-2/3"}`} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecordingAudio(true);
                      setToastMessage("Yangi ovozli xabar yozish boshlandi (0:01)...");
                      setTimeout(() => {
                        setIsRecordingAudio(false);
                        setToastMessage("Ovozli xabar muvaffaqiyatli yozildi (0:12)");
                      }, 2500);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface text-xs font-semibold transition-colors w-full sm:w-auto justify-center cursor-pointer"
                  >
                    <Mic className={`w-4 h-4 text-secondary ${isRecordingAudio ? "animate-ping text-error" : ""}`} />
                    <span>{isRecordingAudio ? "Yozilmoqda..." : "Qayta yozish"}</span>
                  </button>
                </div>
              </div>

              {/* Location & Time Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  Manzil va yetib borish vaqti:
                </h2>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-surface-container rounded-xl">
                    <MapPin className="w-5 h-5 text-secondary shrink-0" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-on-surface w-full"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={geoLocating}
                    onClick={() => {
                      setGeoLocating(true);
                      setTimeout(() => {
                        setAddress("Toshkent shahri, Chilonzor tumani, 9-mavze");
                        setGeoLocating(false);
                        setToastMessage("Geolokatsiya muvaffaqiyatli belgilandi!");
                      }, 800);
                    }}
                    className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-dim text-on-surface rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {geoLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                    <span>{geoLocating ? "Aniqlanmoqda..." : "Xaritada aniqlash"}</span>
                  </button>
                </div>

                {/* Urgency selection buttons */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface-variant font-semibold">
                    Usta qachon yetib kelishi kerak?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        title: "Shoshilinch",
                        sub: "1-2 soat ichida",
                        icon: true,
                        val: "⚡ Shoshilinch (1-2 soat)",
                      },
                      {
                        title: "Bugun kechqurun",
                        sub: "18:00 dan keyin",
                        icon: false,
                        val: "Bugun kechqurun",
                      },
                      {
                        title: "Ertaga",
                        sub: "Kun davomida",
                        icon: false,
                        val: "Ertaga",
                      },
                    ].map((btn) => {
                      const isSelected = urgency.startsWith(btn.title) || urgency === btn.val;
                      return (
                        <button
                          key={btn.title}
                          type="button"
                          onClick={() => setUrgency(btn.val)}
                          className={`p-3 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-secondary text-on-secondary shadow-sm"
                              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          <span className="font-bold text-sm flex items-center gap-1">
                            {btn.icon && <Zap className="w-3.5 h-3.5" />}
                            {btn.title}
                          </span>
                          <span
                            className={`text-xs ${
                              isSelected ? "text-on-secondary/80" : "text-on-surface-variant"
                            }`}
                          >
                            {btn.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Request Draft Summary Card */}
          <aside className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Sizning so‘rovingiz:
                </h3>
                <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
                  Qoralama
                </span>
              </div>

              {/* Reactive Draft Lines */}
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-on-surface-variant">Muammo:</span>
                  <span className="font-bold text-on-surface text-sm mt-0.5">{q1}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-on-surface-variant">Holat:</span>
                  <span className="font-bold text-on-surface text-sm mt-0.5">{q2}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-on-surface-variant">Qo‘shimcha belgilar:</span>
                  <span className="font-bold text-on-surface text-sm mt-0.5">
                    {symptoms.length > 0 ? symptoms.join(", ") : "Belgilanmagan"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-on-surface-variant">Brend & Muddat:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-primary text-sm">{brand}</span>
                    <span className="font-bold text-secondary text-sm">{urgency}</span>
                  </div>
                </div>
              </div>

              {/* Online Masters Counter Pill */}
              <div className="p-3.5 rounded-xl bg-tertiary-container/10 flex items-center gap-3 border border-tertiary-fixed">
                <div className="relative w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0 font-bold">
                  <Users className="w-5 h-5 text-tertiary-container" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tertiary text-on-tertiary text-[10px] flex items-center justify-center font-bold">
                    42
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold text-on-surface leading-tight">
                    Toshkent bo‘yicha 42 ta usta online
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Chilonzorda hozir 8 ta usta buyurtma qabul qilishga tayyor
                  </p>
                </div>
              </div>

              {/* Market Price Estimate */}
              <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Bozor bo‘yicha tahlil:</span>
                  <span className="text-xs text-secondary font-bold">O‘rtacha narx</span>
                </div>
                <p className="text-xl font-extrabold text-on-surface tnum">
                  80 000 – 250 000 so‘m
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Diagnostika xizmati va mayda ta‘mir uchun standart narxlar diapazoni.
                </p>
              </div>

              {/* Big CTA Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleProceed}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Ustalarga so‘rov yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>Mos ustalarni topish (42 ta usta)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-on-surface-variant text-xs">
                <ShieldCheck className="w-4 h-4 text-tertiary-container" />
                <span>Usta Top Kafolat va Xavfsiz to‘lov tizimi bilan</span>
              </div>
            </div>

            {/* Toast notice banner */}
            {toastMessage && (
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow text-xs font-semibold text-primary flex items-center justify-between">
                <span>{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-on-surface-variant hover:text-on-surface cursor-pointer ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Nearest Master Callout Snippet */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdDdgLE-j75Q1fU3e_6TMLsWqfySmX-mWawubC1PLL83Qc5Ay6kZy7-a2ah7uVa0QZ0xCX1FseSL7Gqm2BDi_9d2_P9nn-9aPXr1HPyf9591W-C_Onbi8Nd7lGGYQKiSMNbUzr2uxI2ZYdd7hs7DH3quj_XWsE_P0Um6CGUaFF99uFdl1iyfu1_ZlAl6rulRn0eXqqIrFrCIDh0tL2l8Hc0EG3F4Gh712FJAV5kg5WjeaCnz360-Oqew"
                  alt="Akmal Usta"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-on-surface truncate">Akmal Usta</span>
                  <Check className="w-3.5 h-3.5 text-tertiary-container stroke-[3]" />
                </div>
                <span className="text-xs text-on-surface-variant truncate">
                  Sizdan 2.4 km uzoqlikda • ★ 4.98
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
