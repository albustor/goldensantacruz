# 🏀 Golden Sport Academy Santa Cruz - Web App & PWA

Aplicación web oficial y progresiva (PWA) de alto rendimiento para el equipo y academia de baloncesto **Golden Sport Academy Santa Cruz** (Guanacaste, Costa Rica).

Desarrollada con **Next.js 14 (App Router)**, **Tailwind CSS**, **Supabase (PostgreSQL / Storage)**, **Lucide Icons** y **Framer Motion**, 100% optimizada para dispositivos móviles (iOS / iPhone Safari, Android y Huawei) y escritorio.

---

## 🚀 Características Principales

1. **🏀 Home & Pase Informativo Institucional**:
   - Hero dinámico con logo oficial y cuenta regresiva al próximo partido.
   - Pase informativo: filosofía de la academia, técnica individual, valores y disciplina.
   - Categorías formativas: Mini-Básquetbol (U8-U10), Infantil (U12-U14), Juvenil (U16-U18), Mayor/Open y Rama Femenina.
   - Horarios y sedes en Santa Cruz con enlaces directos a **Waze** y **Google Maps**.
   - Formulario interactivo de pre-inscripción online con confirmación instantánea por WhatsApp.

2. **📅 Calendario de Partidos & Resultados (`/calendario`)**:
   - Filtros por categoría y estado (Próximos / Finalizados).
   - Tarjetas de partido con rival, condición (Local/Visita), sedes con mapa y marcadores finales con crónicas.
   - Botón de compartir convocatoria deportiva por WhatsApp a grupos de padres.

3. **📷 Álbum Compartido & Historias por Fecha (`/galeria`)**:
   - Subida directa de fotos desde celulares para padres de familia y cuerpo técnico.
   - Selección de **Día, Mes y Año** y título del evento/partido para registro histórico.
   - Visor Lightbox a pantalla completa con zoom, contador de "Me gusta" ❤️ y botón para compartir en redes.

4. **🏆 Patrocinadores & Golden Studio (`/patrocinadores`)**:
   - Vitrina de marcas aliadas (Nivel Oro, Plata y Bronce).
   - "Golden Studio": Servicio fotográfico profesional propio con marcas de agua de patrocinadores para monetización.
   - Planes de patrocinio con contacto directo a WhatsApp comercial.

5. **🛡️ Panel de Administración (`/admin`)**:
   - **Acceso Directiva (PIN: `2026`)**.
   - **Base de Datos de Jugadores**: Expedientes deportivos, categorías, números de dorsal, tutores y notas médicas.
   - **Módulo de Cobranzas y Mensajería a Padres**:
     - Generación automática de mensualidades de todos los atletas activos para cualquier mes/año.
     - Semáforo de estados: `Al día / Pagado` (verde), `Pendiente` (amarillo), `Vencido` (rojo).
     - **Botón Inteligente "Cobrar por WhatsApp"**: Envía un mensaje formal estructurado con el nombre del atleta, mes, monto en colones, Sinpe Móvil institucional y cuenta IBAN.
     - Registro de comprobantes y métodos de pago.
   - **Gestión de Partidos**: Crear partidos, horarios, sedes y actualizar marcadores.
   - **Moderación de Galería**: Aprobar o eliminar fotos subidas por la comunidad.
   - **Gestión de Patrocinadores**: Añadir logos y descripciones comerciales.
   - **Asistente IA para Redacción**: Generador inteligente de comunicados oficiales para padres y notas de prensa deportivas con cascada multi-proveedor (Gemini -> Groq -> OpenRouter).

---

## 🛠️ Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🗄️ Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** y ejecuta el script completo que se encuentra en `supabase_schema.sql`.
3. Crea un archivo `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
   ```
4. *(Opcional)* Crea los buckets de almacenamiento en Supabase Storage: `gallery-photos`, `sponsor-logos`, `receipts`.
