# Castle Wars

Castle Wars ist ein Multiplayer und mit dem Smartphone steuerbares Kartenspiel.
Du bist anstrebender König und Dein Ziel ist es, die größte Burg des Königsreichs zu besitzen.
Ein ebenso wirkungsvoller Plan ist, die Burg deines Konkurrenten komplett zu zerstören.

![image](./static/images/readme/main.png)

## Anleitung
**Wann gewinnst du?**
* Deine Burg ist 100 Steine hoch ***oder***
* Du hast die gegnerische Burg zerstört

**Wie gewinnst du?**
* Benutze deine Karten um deine Burg zu erhöhen oder die Gegnerische zu schwächen
* Deine Karten kosten Rohstoffe: Steine, Waffen und Kristalle
* Baumeister, Soldaten und Magier liefern Dir jede Runde die entsprechenden Rohstoffe
* Beispiel: 5 Baumeister = 5 neue Steine pro Runde

**Wie wird gespielt?**
* Das Spiel ist rundenbasiert 
* Jede Runde darfst Du eine Karte, sofern Du sie Dir leisten kannst, spielen
* Kannst Du Dir keine einzige Karte auf deiner Hand leisten oder möchtest eine Karte loswerden kannst Du sie
mit längerem Drücken abwerfen
<br/>*Damit ist Dein Zug jedoch verbraucht*

## Installation
1. git-Repository herunterladen
2. `install.bat` im Hauptverzeichnis zur Installation ausführen 
2. `start.bat` zum Starten des Spiels ausführen
3. `localhost` im Browser öffnen (*passiert automatisch*)
4. QR-Code scannen *oder* IP (z.B. 192.168.1.1/control) manuell in Smartphone Browser eingeben

![image](./static/images/readme/login.png)

## Anforderungen
Um die Verbindung zwischen PC und Smartphone sicherzustellen müssen sich alle Geräte im selben
(Wifi) Netzwerk befinden.

Software
* Node.js 8.11.4 (oder höher)

Hardware
* 1 PC zur Spielfeld-Anzeige
* 1 Smartphone je Spieler<br/>
*bevorzugt Android, bei iOS Geräten können Probleme auftreten*

Browser
* Google Chrome 68.0 (oder höher)
* Mozilla Firefox 62.0 (oder höher)

## Bugs

### Verbindungsprobleme
Solltest Du während dem Spiel die Verbindung verlieren, Neuladen oder versehentlich die Seite schließen,
 wird das Spiel im Normalfall automatisch fortgesetzt, sobald Du dich wieder auf der Seite befindest.
Wenn Du jedoch im "Join"-Screen hängen bleibst solltest Du einfach noch einmal neuladen. 

### Millionen Vögel...
Lässt Du den Browser im Hintergrund offen, kommt es schonmal vor, dass in der Zwischenzeit einige Vögel 
spawnen und den Browser stark verlangsamen. In diesem Fall musst Du einfach die Seite neuladen.

## Third party content

### Images

* Icons made by https://www.flaticon.com/authors/freepik from www.flaticon.com
* Icons made by https://www.flaticon.com/authors/prosymbols from www.flaticon.com 
* Icons made by https://www.flaticon.com/authors/nikita-golubev from www.flaticon.com 
* Icons made by https://www.flaticon.com/authors/vectors-market from www.flaticon.com 
* Icons made by https://www.flaticon.com/authors/roundicons from www.flaticon.com 
* Icons made by https://www.flaticon.com/authors/becris from www.flaticon.com 
* Icons made by https://www.flaticon.com/authors/pixel-perfect from www.flaticon.com
* Icons made by https://www.flaticon.com/authors/gregor-cresnar from www.flaticon.com
* Icons made by https://www.flaticon.com/authors/google from www.flaticon.com
* Icons made by https://www.flaticon.com/authors/smashicons from www.flaticon.com
* Icons made by https://www.flaticon.com/authors/srip from www.flaticon.com

### Fonts

**MedievalSharp**

Copyright (c) 2011, wmk69 (wmk69@o2.pl),
with Reserved Font Name MedievalSharp.

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is available with a FAQ at:
http://scripts.sil.org/OFL


### Music

**Celtic Impuls**

Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 3.0
http://creativecommons.org/licenses/by/3.0/

### Sounds

Sound effects obtained from https://www.zapsplat.com<br/>
Sound effects obtained from https://www.BlastwaveFx.com 

***

**Autoren**<br/>
Daniel Schmitz<br/>
Martin Rempel

**Erstelldatum**<br/>
28.06.018

**Version**<br/>
1.0

****

**Aufgabenverteilung**

Martin Rempel
* Smartphone Steuerung

Daniel Schmitz
* Canvas / Host-Anzeige
* Backend / Game-Logik
