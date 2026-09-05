/* ==========================================================
   SŁOWA DO GRY  —  wszystkie mają dokładnie 5 liter.
   Chcesz dodać własne? Dopisz je do listy poniżej,
   w cudzysłowie, oddzielone przecinkiem. Muszą mieć 5 liter!
   ========================================================== */

window.WORDS = [
  // zwierzęta
  "kotek", "kotka", "kotki", "rybka", "zebra", "konik", "kurka", "krowa",
  "kózka", "lisek", "misie", "kogut", "zając", "małpa", "rekin", "żabka",
  "motyl", "pająk", "mucha", "komar", "robak", "jeżyk", "sarna", "wrona",
  "gołąb", "gąska", "indyk", "osioł", "baran", "rybak", "ptaki", "łapka",
  "pióro", "dziób", "futro", "budka", "smycz",

  // jedzenie
  "mleko", "masło", "chleb", "banan", "jajko", "jajka", "kakao", "lizak",
  "kasza", "serek", "owoce", "arbuz", "bułka", "rogal", "pizza", "babka",
  "wafel", "gofry", "zupka", "obiad",

  // dom i rzeczy
  "lampa", "szafa", "łóżko", "drzwi", "łyżka", "nożyk", "kubek", "miska",
  "wanna", "mydło", "kocyk", "zegar", "klucz", "torba", "guzik", "pasek",
  "bluza", "radio", "domek", "domki", "zamek", "wieża", "pokój", "ogród",

  // przyroda
  "kwiat", "trawa", "lasek", "sosna", "rzeka", "morze", "plaża", "kamyk",
  "śnieg", "burza", "wiatr", "tęcza", "niebo", "iskra", "sopel", "górka",
  "skała", "perła", "wędka", "świat", "krzak", "błoto",

  // zabawa i szkoła
  "lalka", "lalki", "piłka", "bajka", "farby", "kreda", "pisak", "gumka",
  "ławka", "kulka", "sanki", "narty", "medal", "basen", "dzwon", "kółko",
  "słowo", "cyfra", "kolor", "bańka",

  // pojazdy i miejsca
  "rower", "autko", "łódka", "droga", "ulica", "sklep",

  // ciało i ludzie
  "głowa", "włosy", "buzia", "serce", "plecy", "palec", "wujek", "ranek",

  // inne proste słowa
  "biały", "żółty", "ogień", "płacz", "bęben", "pasta", "sześć", "gałąź"
];

/* Bezpiecznik: zostawiamy tylko unikalne słowa o długości 5 liter,
   żeby literówka w liście nigdy nie zepsuła gry. */
window.WORDS = [...new Set(window.WORDS)].filter(w => [...w].length === 5);
