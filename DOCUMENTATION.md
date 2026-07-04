# Guia Suprema de Personalització i Disseny de l'Aplicació 🗺️💍

Aquesta guia s'ha creat especialment perquè puguis modificar qualsevol detall estètic, visual o funcional de l'aplicació al teu gust de forma molt fàcil. Totes les instruccions indiquen on has d'anar en el codi font i quins valors has de tocar.

---

## 1. El Sistema de Zoom del Mapa (Zoom) 🔍

El simulador utilitza un sistema de càmera intel·ligent que s'auto-ajusta per centrar-se en el viatger o en les fites.

### A. Limitar el Zoom màxim i mínim (Zoom Limits)
Si vols que l'usuari pugui fer més o menys zoom lliurement usant la roda del ratolí o els gestos tàctils:
* **On es troba:** `/src/components/ComposeAppSimulator.tsx` (a la funció `handleZoom` a prop de la línia 675).
* **Què has de canviar:** Modifica els valors de `Math.max` (mínim zoom) i `Math.min` (màxim zoom).
  ```typescript
  // Codi original:
  const nextScale = Math.max(0.5, Math.min(12.0, prev + factor));
  
  // Si vols permetre un zoom encara més proper (fins a 16x) i allunyar-te més (fins a 0.2x):
  const nextScale = Math.max(0.2, Math.min(16.0, prev + factor));
  ```

### B. Canviar l'Auto-Zoom de Centrat del Viatger (Auto-Focus Zoom)
Quan l'aplicació carrega per primer cop, o quan fas clic al botó de la Brúixola per "Trobar el Portador", s'aplica un zoom predefinit automàtic:
* **On es troba:** `/src/components/ComposeAppSimulator.tsx` (a l'estat inicial i al botó de centrar, a prop de línies 90 i 1340).
* **Què has de canviar:**
  1. **Zoom inicial per defecte:** Modifica el valor de l'estat `mapScale`:
     ```typescript
     const [mapScale, setMapScale] = useState(5.5); // Canvia 5.5 pel número que vulguis
     ```
  2. **Zoom del botó de la Brúixola:** Cerca el bloc on es defineix el centrat per a pantalles mòbils i d'escriptori:
     ```typescript
     // Per mòbils (< 640px d'amplada) s'usa 3.0 de zoom, i per ordinadors s'usa 5.5
     const targetScale = viewportSize.width < 640 ? 3.0 : 5.5;
     ```

---

## 2. Fites Principals i Secundàries (Major & Minor Milestones) 🌋📍

L'aplicació permet distingir entre dues mides de fites:
1. **Fites Principals (Major)**: Grans punts clau del viatge, com *Bree*, *Rivendell*, *Mines de Mòria*, *Mont del Destí*. Es mostren amb un anell daurat gran i brillant amb efecte de batec.
2. **Fites Secundàries (Minor)**: Petits punts d'interès històrics col·locats entre les grans ciutats (com el *Pont de Brandiví*, el *Bosc dels Trolls*, el *Pas del Corn Roig*, etc.). Es mostren amb una petita i elegant joia daurada per no recarregar visualment el mapa.

* **On es troben:** `/src/data/milestones.ts`

### Com definir una fita com a Principal o Secundària:
Al fitxer `/src/data/milestones.ts`, cada fita és un objecte. Per fer-la **secundària (més petita)**, només has d'afegir el camp `isMinor: true`. Si no té aquest camp, es tractarà automàticament com una fita **principal (gran)**.

* **Exemple de Fita Secundària (Minor):**
```typescript
{
  id: "brandywine_bridge",
  name: "Pont de Brandiví",
  distance: 18,
  isMinor: true, // <--- S'especifica que és un punt secundari/petit!
  description: "La clàssica estructura de pedra de tres arcs que marca el límit oriental de la Comarca.",
  bookText: "Van arribar al Pont de Brandiví...",
  audioNarrative: "Creues el riu Baranduin...",
  coordinates: { x: 30, y: 30 },
  image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop",
  audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
}
```

* **Exemple de Fita Principal (Major):**
```typescript
{
  id: "rivendell",
  name: "Rivendell (Imladris)",
  distance: 390,
  // NO té el camp isMinor (o està a false), per tant és gran i brillant!
  description: "L'Última Casa Acollidora a l'est del Mar...",
  bookText: "En Frodo es va despertar...",
  audioNarrative: "Benvingut a Rivendell...",
  coordinates: { x: 50, y: 28 },
  image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop",
  audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
}
```

### Com calcular les coordenades `{ x, y }` exactes:
* El mapa té una graella que va de **0%** a **100%**.
* `x: 0` és l'extrem esquerre, `x: 100` és l'extrem dret.
* `y: 0` és la part superior, `y: 100` és la part inferior.
* Per exemple, `{ x: 50, y: 50 }` col·locarà la fita exactament al centre del mapa de la Terra Mitjana. Pots afegir decimals per a una precisió mil·limètrica (ex: `{ x: 27.4, y: 29.1 }`).

---

## 3. Canviar la Mida Visual dels Elements del Mapa 📏🎭

Com que el mapa és interactiu i s'allunya o apropa amb el zoom, les mides visuals dels elements es recalculen perquè no es vegin ni gegants quan t'apropes, ni invisibles quan t'allunyes.

### A. Mida de les Fites (Milestone Markers)
Si vols canviar com es redimensionen les fites Principals i Secundàries:
* **On es troba:** `/src/components/ComposeAppSimulator.tsx` (a prop de la línia 1290).
* **Què has de canviar:** Busca l'atribut `transform` de la fita:
  ```typescript
  // Codi:
  transform: `translate(-50%, -50%) scale(${isMinor ? 1.4 / mapScale : 2.4 / mapScale})`,
  ```
  * Pots canviar el factor `1.4` per fer les fites secundàries més grans o petites.
  * Pots canviar el factor `2.4` per regular les fites principals grans.

* **Classes de disseny CSS de les Fites:**
  * Les fites secundàries usen una petita caixa `w-3 h-3` (12px) de color ambre.
  * Les fites principals usen una caixa amb efecte d'expansió `w-5 h-5` (20px) amb un cercle polsant blanc/taronja de fons.

### B. Mida de la Fitxa del Viatger (Avatar Token)
L'anell daurat amb l'emoji o foto de l'avatar que es mou pel camí també té una mida regulada de forma adaptativa.
* **On es troba:** `/src/components/ComposeAppSimulator.tsx` (a prop de la línia 1330, al `style` del contenidor de l'avatar).
* **Què has de canviar:** Ajusta el factor de divisió de l'escala d'ajustament de zoom (el valor `2.8` per defecte):
  ```typescript
  // Codi original:
  transform: `translate(-50%, -50%) scale(${2.8 / mapScale})`,
  
  // Si vols que l'avatar es vegi més gran (ex: factor de 4.0):
  transform: `translate(-50%, -50%) scale(${4.0 / mapScale})`,
  ```

* **Ajustar les mides de l'anell daurat** (a la línia 1335):
  * Trobaràs la classe `w-12 h-12` (48px de diàmetre) per a l'anell daurat exterior que fa l'animació de batec. Canvia-ho per `w-16 h-16` si el vols més imponent.
  * Trobaràs la classe `w-9.5 h-9.5` (38px de diàmetre) per a la rodona interior de l'emoji/imatge. Canvia-ho en proporció.

---

## 4. Personalització Estètica de la Interfície (Colors, Ombres i Disseny) 🎨✨

La interfície té un estil immersiu i d'alta fantasia d'acord amb la Terra Mitjana, utilitzant tons foscos com el barda, l'or antic i el vermell fosc. Tot es controla mitjançant classes de **Tailwind CSS**.

### A. Els Colors del Tema Principal
Tots els colors estan definits en codis Hexadecimals directament sobre els contenidors de React. Els més utilitzats que pots modificar són:
* `#1b110f`: El color de fons fosc i càlid de les caixes de diàleg i panells principals.
* `#2c1b18`: El color de fons de la barra superior de l'aplicació i de les capçaleres.
* `#e6c280`: El to daurat / or antic utilitzat per als títols importants.
* `#b09893`: El color de text secundari llegible però suau.
* `#df5a3e`: El color de vermell intens dels botons de crida a l'acció (com registrar km).

### B. Mida de les Imatges d'Avatar (Selector de Personatges)
Quan estàs creant el teu viatger, o quan es mostra l'avatar de perfil:
* **On es troba:** `/src/components/ComposeAppSimulator.tsx` (al voltant de les línies 1011 a 1030).
* **Què has de canviar:** Cerca els contenidors de les caixes de personatges i modifica les mides per fer les opcions de selecció de l'avatar més espaioses si vols. Per exemple, pots canviar la mida de l'emoji canviant `text-xl` per `text-2xl` o `text-3xl`.

### C. Personalitzar la Targeta d'Informació de la Fita (Pop-up de Detalls)
Quan un viatger fa clic sobre una fita desbloquejada o l'acaba de descobrir, s'obre un full d'informació des de sota.
* **On es troba:** `/src/components/ComposeAppSimulator.tsx` (a partir de la línia 1780).
* **Què es pot personalitzar de forma estètica:**
  1. **La proporció de la imatge de la fita:** Està definida amb la classe `aspect-video` (proporció 16:9 de cinema). Si prefereixes que sigui més quadrada o vertical, pots canviar-ho per:
     * `aspect-square` (proporció 1:1, totalment quadrada).
     * `h-48 md:h-64` (alçada fixa per a mòbil i escriptori, adaptant l'amplada).
  2. **La intensitat de l'ombra del pop-up:** Cerca la classe `shadow-md` o `shadow-2xl` a la targeta i canvia-la per donar-li més o menys relleu en 3D sobre el mapa.
  3. **L'arrodoniment de les cantonades:** Cerca la classe `rounded-xl` o `rounded-2xl` a les imatges o a la caixa i augmenta-ho a `rounded-3xl` per a un aspecte més modern i suau.

---

## 5. Taula d'Ajustos Estètics Ràpids ⚡

| Efecte Desitjat | Classe a buscar al codi | Substitut recomanat | Què fa exactament? |
| :--- | :--- | :--- | :--- |
| **Ombra més forta i èpica** | `shadow-md` o `shadow-lg` | `shadow-[0_0_25px_rgba(0,0,0,0.85)]` | Li dóna un contrast 3D impressionant |
| **Cantonades molt arrodonides** | `rounded-xl` | `rounded-[24px]` | Estil més "mòbil modern" per a les caixes |
| **Tipografia més èpica** | `font-serif` | `font-serif tracking-wider` | Espaia les lletres per a títols amb aire històric |
| **Botons més grans de polsar** | `py-2 px-4` | `py-3 px-6 text-sm` | Ideal per a pantalles tàctils o dits grans |

---

## 6. Servir Imatges i Àudios de Forma Local (Arxius Propis) 📁🎶

Per evitar dependre de servidors externs o d'Internet (evitant que l'aplicació falli si una web cau o canvia les seves adreces), **és molt recomanable desar els fitxers d'àudio i imatge directament dins del projecte**.

### A. On s'han de col·locar els fitxers locals?
En una aplicació feta amb **Vite**, qualsevol fitxer que vulguis utilitzar de forma estàtica sense haver-lo d'importar amb codi complex s'ha de desar a la carpeta `public` (a l'arrel del projecte). 
Si no existeix, pots demanar al sistema que la creï o afegir-la tu mateix. Per exemple:
* `/public/audio/meu-audio.mp3`
* `/public/images/meva-fita.jpg`

### B. Com es criden des de `milestones.ts`?
Tots els arxius de la carpeta `public` es serveixen directament des de l'arrel `/` de l'aplicació. Per tant, els pots enllaçar de forma directa i neta sense posar `public/`:

```typescript
{
  id: "el_meu_bosc",
  name: "Bosc Màgic",
  distance: 300,
  // RUTA LOCAL (S'apunta directament a l'arrel com si la carpeta public fos la base):
  image: "/images/meva-fita.jpg",
  audio: "/audio/meu-audio.mp3",
  coordinates: { x: 45, y: 35 }
}
```

### C. Què passa si uses imatges/àudios d'una web externa i aquesta cau?
**Sí, efectivament. Si enllaces un recurs extern (com ara Unsplash o SoundHelix) i la web canvia el contingut, es borra o té una caiguda de servidor, les imatges o l'àudio deixaran de carregar-se dins la teva aplicació.** 
Per aquest motiu, per a una versió final, **sempre és millor utilitzar el mètode local (carpeta `public`)** descrit a sobre. Així el contingut queda permanentment lligat al codi de l'aplicació i mai fallarà!

