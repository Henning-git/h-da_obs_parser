# h-da_obs_parser
Splitet den OBS (Online BelegungsSystem) Kalender der Hochschule Darmstadt in neue Kalender.
Dieses Programm fragt beim OBS deinen Kalender an und liefert dir nur die Einträge, die du festgelegt hast.

Dieses Projekt startet einen HTTP Server welcher auf / einen GET request erwartet.
Als query Parameter für diese GET Anfrage ist folgendes vorgeschrieben:
    - obs_key: string
    - mode: "white_list" | "black_list"
    - prefix: string

obs_key:
    - Logge dich im OBS ein
    - Navigiere zu https://obs.fbi.h-da.de/obs/index.php?action=OBSmobile
    - kopiere den Link unter "Abonnierbarer Internet-Kalender"
    - z.B. https://obs.fbi.h-da.de/obs/service.php?action=getPersPlanAbo&lfkey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    - die lange Zeichenfolge hinter "lfkey=" verwendest du als obs_key

mode:
    - hiermit bestimmst du, ob bestimmte (durch den präfix bestimmte) Kalendereinträge im neuen Kalender aufgenommen (white_list) oder ausgeschlossen werden sollen (black_list)

prefix:
    - kann mehrfach vorkommen
    - enthält den Text mit dem die Kalendereinträge starten, die in deinem neuen Kalender enthalten/ausgeschlossen sind


Beispiele:
    In deinem OBS Kalender sind folgende Kalender Einträge:
        - P: Programmieren 1 # 1
        - V: Programmieren 1
        - VÜ: Mathematik 1
        - LN: Mathematik 1
    
    Der lange obs_key wird hier mit xx abgekürzt.
    Die folgenden URLs kannst du in deinem Kalender einbinden.

    Beispiel 1:
        GET /?obs_key=xx&mode=black_list&prefix=P: &prefix=LN: 
        Diese URL wird einen Kalender mit allen Einträgen außer Praktika und Klausuren zurück geben.
    Beispiel 2:
        GET /?obs_key=xx&mode=white_list&prefix=P: &prefix=LN: 
        Diese URL wird einen Kalender mit allen Praktika und Klausuren zurück geben.

    Es sollte immer mindestens ein Kalender mit einer black_list verwendet werden, so kann es nicht passieren, dass ein Ereignis nicht in einem Kalender auftaucht.


Anleitung zum selbst hosten:
    - npm install
    - kopiere .env-example zu .env
    - node server.js