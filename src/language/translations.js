/**
 * Flat translation dictionaries, one per supported language.
 * Same shape as store.js — start minimal, add keys feature by feature
 * as each screen is built, rather than trying to translate the whole
 * app up front.
 *
 * NOTE: Amharic and Afaan Oromoo strings below are a working first pass.
 * Since these are both languages you speak, treat them as drafts to
 * correct, not final copy.
 */
export const translations = {
  eng: {
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.cart": "Cart",
    "nav.favorites": "Favorites",
    "nav.orders": "Orders",
    // in en:
    "nav.orders": "Orders",
    "nav.checkout": "Checkout",

    "home.tagline": "Comfort and balanced food delivered warm.",
    "home.exploreMenu": "Explore the menu",
    "home.todaysSpecials": "Today's specials",
    "home.viewMenu": "View menu",
    "home.headline": "Taste of Addis, delivered warm.",

    "categories.ethiopian": "Ethiopian Food",
    "categories.pizza": "Pizza",
    "categories.burgers": "Burgers",
    "categories.drinks": "Drinks",

    "dish.add": "Add to cart",

    "common.loading": "Loading...",
    "common.error": "Something went wrong.",
    "common.tryAgain": "Try again",
  },

  amh: {
    "nav.home": "መነሻ",
    "nav.menu": "የምግብ ዝርዝር",
    "nav.cart": "ካርት",
    "nav.favorites": "ተወዳጆች",
    "nav.orders": "ትዕዛዞች",
    "nav.checkout": "ትዕዛዝ ያጠናቅቁ",

    "home.tagline": "ምቹ እና ተመጣጣኝ ምግብ፣ በትኩሱ ይደርስዎታል።",
    "home.exploreMenu": "ምግቦችን ይመልከቱ",
    "home.todaysSpecials": "የዛሬ ልዩ ምግቦች",
    "home.viewMenu": "ሁሉንም ይመልከቱ",
    "home.headline": "የአዲስ ጣዕም፣ ሙቅ ሆኖ ይደርስዎታል።",

    "categories.ethiopian": "ሃገራዊ ምግቦች",
    "categories.pizza": "ፒዛ",
    "categories.burgers": "በርገር",
    "categories.drinks": "መጠጦች",

    "dish.add": "ወደ ካርት ይጨምሩ",

    "common.loading": "በመጫን ላይ...",
    "common.error": "ስህተት ተፈጥሯል።",
    "common.tryAgain": "እንደገና ይሞክሩ",
  },

  oro: {
    "nav.home": "Fuula Jalqabaa",
    "nav.menu": "Baafata nyaataa",
    "nav.cart": "Kaartii",
    "nav.favorites": "Filannoo",
    "nav.orders": "Ajajawwan",
    "nav.checkout": "Ajaja Xumuraa",

    "home.tagline": "Nyaata gaggaarii madaalawaa fi ho'aa ta'e balbala keessanitti.",
    "home.exploreMenu": "Baafata nyaataa ilaali",
    "home.todaysSpecials": "Nyaata filatamoo Har'aa",
    "home.viewMenu": "Hunda ilaalaa",
    "home.headline": "Dhandhamni nyaata Addis, ho'aa ta'ee isin qaqqaba.",

    "categories.ethiopian": "Nyaata Biyya Keenyaa",
    "categories.pizza": "Piizaa",
    "categories.burgers": "Bargarii",
    "categories.drinks": "Dhugaatii",

    "dish.add": "Kaartiitti dabalaa",

    "common.loading": "Fidaa jira...",
    "common.error": "Dogoggorri uumameera.",
    "common.tryAgain": "Irra deebi'aa yaalaa",
  },
};

export const SUPPORTED_LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "amh", label: "አማርኛ" },
  { code: "oro", label: "Afaan Oromoo" },
];
