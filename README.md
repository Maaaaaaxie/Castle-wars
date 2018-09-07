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
2. `install.bat` im Hauptverzeichnis zur Installation ausführen 
2. `start.bat` zum Starten des Spiels ausführen
3. `localhost` im Browser öffnen (*passiert automatisch*)
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

### Verbindungsprobleme
Solltest Du während dem Spiel die Verbindung verlieren, Neuladen oder versehentlich die Seite schließen,
könnten unvorhersehbare Fehler auftreten.
Im Normalfall wird das Spiel jedoch automatisch fortgesetzt, sobald du dich wieder auf der Seite befindest.

* Wenn du während dem laufenden Spiel (nach einem Verbindungsabbruch) 
im "Join"-Screen hängen bleibst solltest du neuladen 

* Wenn ein Spieler keine Aktionen mehr ausführen kann
oder der Rundentimer total verkürzt ist, sollte das Spiel neustarten werden


***


**Autoren**<br/>
Daniel Schmitz<br/>
Martin Rempel

**Erstelldatum**<br/>
28.06.018

**Version**<br/>
0.9