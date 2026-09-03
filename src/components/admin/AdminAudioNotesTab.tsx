"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Sparkles, 
  Save, 
  Clock, 
  CheckCircle2, 
  FileText, 
  User,
  Volume2
} from "lucide-react";
import { DirectivaAudioNote, Store } from "@/lib/store";

export default function AdminAudioNotesTab() {
  const [notes, setNotes] = useState<DirectivaAudioNote[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTranscript, setNoteTranscript] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Coach Yorleny (Lenny) Monge Soto / Entrenadora");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Audio player state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await Store.getAudioNotes();
    setNotes(data);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBlobUrl(reader.result as string);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("No se pudo acceder al micrófono. Verifique los permisos del navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle) {
      alert("Ingrese un título para la nota de audio.");
      return;
    }

    await Store.addAudioNote({
      title: noteTitle,
      audioUrl: audioBlobUrl,
      duration: recordingSeconds || 30,
      transcript: noteTranscript,
      author: noteAuthor,
    });

    setNoteTitle("");
    setNoteTranscript("");
    setAudioBlobUrl("");
    setRecordingSeconds(0);
    loadNotes();
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm("¿Eliminar esta nota de voz?")) {
      await Store.deleteAudioNote(id);
      loadNotes();
    }
  };

  const handleTogglePlay = (note: DirectivaAudioNote) => {
    if (playingId === note.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = note.audioUrl;
        audioPlayerRef.current.play();
        setPlayingId(note.id);
        audioPlayerRef.current.onended = () => setPlayingId(null);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      <audio ref={audioPlayerRef} className="hidden" />

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
          <Mic className="w-3.5 h-3.5" />
          <span>Dictado & Grabación por Micrófono</span>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
          Notas de Audio & Registro de la Entrenadora (Coach Lenny Monge & Directiva)
        </h2>
        <p className="text-xs text-gray-400">
          Graba ideas de patrocinio comercial, acuerdos de reuniones, minutas y temas pendientes para trabajar en la cancha de Santa Bárbara.
        </p>
      </div>

      {/* Recording Studio Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-800 border-2 border-golden-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-700 pb-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-black text-white uppercase">
              Grabadora de Voz en Directo
            </h3>
            <p className="text-xs text-gray-400">
              Presiona el botón de micrófono para hablar y dejar registrado tu mensaje de voz.
            </p>
          </div>

          {/* Recording Timer Display */}
          <div className="flex items-center gap-3">
            {isRecording && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
            <span className={`text-xl font-black tracking-widest ${isRecording ? "text-red-400 animate-pulse" : "text-gray-400"}`}>
              {formatSeconds(recordingSeconds)}
            </span>
          </div>
        </div>

        {/* Mic Control */}
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-900 flex items-center justify-center shadow-2xl shadow-golden-500/30 hover:scale-105 active:scale-95 transition-all group"
              title="Iniciar Grabación"
            >
              <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-950/60 hover:scale-105 active:scale-95 transition-all animate-pulse"
              title="Detener Grabación"
            >
              <Square className="w-8 h-8 fill-white" />
            </button>
          )}

          <p className="text-xs font-bold text-gray-300">
            {isRecording ? "Grabando audio... Habla ahora" : "Toca el micrófono para comenzar a grabar"}
          </p>
        </div>

        {/* Form to Save Recorded Audio or Note */}
        {(audioBlobUrl || !isRecording) && (
          <form onSubmit={handleSaveNote} className="space-y-4 pt-4 border-t border-gray-700 text-xs">
            {audioBlobUrl && (
              <div className="p-3 bg-dark-900 rounded-2xl border border-emerald-500/40 flex items-center justify-between gap-3">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Audio listo para guardar ({formatSeconds(recordingSeconds)})
                </span>
                <audio controls src={audioBlobUrl} className="h-8 max-w-[200px]" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Título del Tema / Asunto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Propuesta de Patrocinio Comercial / Reunión Comercios Santa Cruz"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Autor / Cargo *
                </label>
                <select
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white focus:border-golden-500"
                >
                  <option value="Coach Yorleny (Lenny) Monge Soto / Entrenadora">Coach Yorleny (Lenny) Monge Soto / Entrenadora</option>
                  <option value="Coach Alberto / Director Técnico">Coach Alberto / Director Técnico</option>
                  <option value="Directiva Golden Sport Santa Cruz">Directiva Golden Sport Santa Cruz</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Anotaciones / Resumen del Audio (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Escribe aquí puntos clave, acuerdos o ideas adicionales..."
                value={noteTranscript}
                onChange={(e) => setNoteTranscript(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:border-golden-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Nota Directiva
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Saved Audio Notes List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-2">
          <Volume2 className="w-4 h-4 text-golden-400" />
          Historial de Notas de Voz Registradas ({notes.length})
        </h3>

        {notes.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No hay notas de voz registradas aún. Graba tu primera nota arriba.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-dark-800 border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{note.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-golden-500/20 text-golden-400">
                      {note.author}
                    </span>
                  </div>
                  {note.transcript && (
                    <p className="text-xs text-gray-300 italic">"{note.transcript}"</p>
                  )}
                  <p className="text-[10px] text-gray-400 flex items-center gap-2">
                    <span>📅 {new Date(note.createdAt).toLocaleDateString("es-CR")}</span>
                    <span>⏱️ {note.duration}s</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {note.audioUrl && (
                    <button
                      onClick={() => handleTogglePlay(note)}
                      className="px-3.5 py-2 rounded-xl bg-dark-700 hover:bg-golden-500 hover:text-dark-900 text-golden-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {playingId === note.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingId === note.id ? "Pausar" : "Escuchar"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
