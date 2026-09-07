/* ==========================================================
   SŁOWA DO GRY

   Słowa są pogrupowane w kategorie — kategoria jest pokazywana
   dziecku jako podpowiedź nad planszą.

   Zasady listy:
   • tylko słowa, które zna pięciolatek,
   • tylko podstawowe formy — bez zdrobnień
     (jest "koza", nie ma "kózki"; jest "kot", nie ma "kotka"),
   • żadnych słów wieloznacznych, przy których kategoria myli
     (dlatego nie ma np. "zamku" ani "babki"),
   • słowo musi oczywiście pasować do swojej kategorii,
   • każde słowo ma 3, 4 albo 5 liter — krótkie słowa są dla
     dziecka najłatwiejsze.

   Chcesz dodać swoje? Dopisz je w cudzysłowie, po przecinku,
   w pasującej kategorii. Możesz też dodać nową kategorię —
   wystarczy linijka w formie   "emoji Nazwa": ["słowo", "słowo"],
   ========================================================== */

window.SLOWA = {

  "🐾 Zwierzę": [
    "kot", "lis", "wąż", "osa", "koń", "lew", "jeż", "byk", "łoś", "gęś",
    "paw", "rak", "ćma", "wół",
    "pies", "ryba", "koza", "owca", "żaba", "sowa", "mysz", "ptak", "kura",
    "wilk", "słoń", "żółw", "foka", "kret", "dzik", "kruk", "krab", "bóbr",
    "lama", "żubr", "karp",
    "zebra", "krowa", "kogut", "zając", "małpa", "rekin", "motyl", "pająk",
    "mucha", "komar", "robak", "sarna", "wrona", "gołąb", "indyk", "osioł",
    "baran", "orzeł", "jeleń", "koala", "panda", "struś", "sroka"
  ],

  "🍎 Jedzenie": [
    "sok", "ser", "ryż", "lód", "sól", "sos",
    "zupa", "lody", "miód", "woda", "mąka", "tost", "kawa", "tort", "guma",
    "dżem", "beza", "kiwi", "owoc",
    "mleko", "masło", "chleb", "banan", "jajko", "jajka", "kakao", "lizak",
    "kasza", "owoce", "arbuz", "bułka", "rogal", "pizza", "wafel", "gofry",
    "obiad", "budyń", "groch", "burak", "dynia", "napój", "deser", "melon",
    "mango", "żelki"
  ],

  "🏠 W domu": [
    "dom", "koc", "nóż", "but", "mop",
    "okno", "stół", "sofa", "kran", "dach", "buty", "kosz", "piec", "szal",
    "zlew",
    "drzwi", "łóżko", "lampa", "szafa", "miska", "kubek", "łyżka", "klucz",
    "mydło", "zegar", "torba", "guzik", "pasek", "wanna", "pokój", "półka",
    "wazon", "bluza", "radio", "dywan", "obraz", "fotel", "sufit", "gąbka",
    "winda"
  ],

  "🌳 Przyroda": [
    "las", "dąb", "dym",
    "góra", "róża", "liść", "mgła", "staw", "fala", "grad", "łąka", "pole",
    "zima", "lato", "mróz", "klon", "cień",
    "kwiat", "trawa", "sosna", "rzeka", "morze", "plaża", "śnieg", "burza",
    "wiatr", "tęcza", "niebo", "sopel", "skała", "krzak", "błoto", "gałąź",
    "ogród", "ogień", "ocean", "wyspa", "grzyb"
  ],

  "🧸 Zabawka": [
    "gra", "miś",
    "flet", "jojo",
    "lalka", "piłka", "farby", "kreda", "pisak", "sanki", "narty", "balon",
    "bęben", "bańka", "łyżwy", "rolki", "robot", "karty"
  ],

  "🚗 Pojazd": [
    "wóz", "bus",
    "auto", "łódź", "prom",
    "rower", "kajak", "motor", "wagon", "dźwig", "metro"
  ],

  "🏙️ Miejsce": [
    "zoo",
    "park", "plac", "most", "wieś", "kino", "cyrk", "targ", "port",
    "sklep", "basen", "ulica", "droga", "teatr", "rynek", "farma", "wieża",
    "hotel"
  ],

  "🧍 Ciało człowieka": [
    "oko", "nos", "ząb", "łza", "udo",
    "ucho", "ręka", "ręce", "noga", "nogi", "usta", "oczy", "zęby", "uszy",
    "dłoń", "brew", "krew", "kość",
    "głowa", "włosy", "serce", "plecy", "palec", "ciało", "twarz", "broda",
    "czoło", "szyja", "stopa", "pięta", "kciuk", "język", "skóra"
  ],

  "👪 Rodzina": [
    "syn",
    "mama", "tata", "brat", "żona", "wnuk",
    "wujek", "córka", "matka"
  ],

  /* Kolorów jest mało, bo prawie wszystkie polskie nazwy kolorów
     mają 6 liter albo więcej ("czarny", "zielony", "czerwony",
     "niebieski"). Zostają tylko te poniżej — lepiej mieć krótką
     uczciwą listę niż dopisywać słowa, których dziecko nie zna. */
  "🌈 Kolor": [
    "rudy", "siwy",
    "biały", "żółty", "szary", "złoty"
  ]
};

/* ----------------------------------------------------------
   Bezpiecznik: budujemy płaską listę { słowo, kategoria }
   i wyrzucamy wszystko, co nie ma 3–5 liter albo się powtarza.
   Dzięki temu literówka w liście nigdy nie zepsuje gry.
   ---------------------------------------------------------- */
window.WORDS = (function () {
  var lista = [];
  var widziane = {};

  Object.keys(window.SLOWA).forEach(function (kategoria) {
    window.SLOWA[kategoria].forEach(function (slowo) {
      var dlugosc = slowo.length;
      if (dlugosc < 3 || dlugosc > 5) return;
      if (widziane[slowo]) return;
      widziane[slowo] = true;
      lista.push({ slowo: slowo, kategoria: kategoria });
    });
  });

  return lista;
})();
