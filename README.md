# Castle Wars
Castle Wars ist ein Multiplayer und mit dem Smartphone steuerbares Kartenspiel.
Du bist anstrebender König und dein Ziel ist es, die größte Burg des Königsreichs zu besitzen.
Ein ebenso wirkungsvoller Plan ist, die Burg deines Konkurrenten komplett zu zerstören.

## Anleitung
**Wann gewinnst du?**
* Deine Burg ist 100 Steine hoch ***oder***
* Du hast die gegnerische Burg zerstört

**Wie gewinnst du?**
* Benutze deine Karten um deine Burg zu erhöhen oder die Gegnerische zu schwächen
* Deine Karten kosten Rohstoffe: Steine, Waffen und Kristalle
* Baumeister, Soldaten und Magier liefern dir jede Runde die entsprechenden Rohstoffe
* Beispiel: 5 Baumeister = 5 neue Steine pro Runde

## Installation
1. git-Repository herunterladen
2. `start.bat` Datei im Hauptverzeichnis ausführen
3. `localhost` im Browser eingeben
4. QR-Code scannen *oder* IP (z.B. 192.168.1.1/control) manuell in Smartphone Browser eingeben

## Anforderungen
Um die Verbindung zwischen PC und Smartphone sicherzustellen müssen sich alle Geräte im selben
(Wifi) Netzwerk befinden.

Software
* Node.js 8.11.4 (oder höher)

Hardware
* 1 PC zur Spielfeld-Anzeige
* 1 Smartphone je Spieler

Browser
* Google Chrome 68.0 (oder höher)
* Mozilla Firefox 62.0 (oder höher)

## Bugs
### QR-Code wird nicht angezeigt
Sollte der QR-Code nicht richtig angezeigt werden, kann man die IP des Servers manuell in der URL-Leiste
des Browsers eingeben. Die IP des Servers wird in der Konsole, die durch die `start.bat` Datei geöffnet wird, geloggt.



