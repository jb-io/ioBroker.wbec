"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var json_exports = {};
__export(json_exports, {
  default: () => json_default
});
module.exports = __toCommonJS(json_exports);
var json_default = {
  "modbus.state.lastTm": {
    en: "Last transmission time",
    de: "Letzte \xDCbertragungszeit",
    ru: "\u0412\u0440\u0435\u043C\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438",
    pt: "\xDAltima hora de transmiss\xE3o",
    nl: "Laatste transmissietijd",
    fr: "Derni\xE8re heure de transmission",
    it: "Ultimo tempo di trasmissione",
    es: "\xDAltimo tiempo de transmisi\xF3n",
    pl: "Ostatni czas transmisji",
    uk: "\u0427\u0430\u0441 \u043E\u0441\u0442\u0430\u043D\u043D\u044C\u043E\u0457 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0456",
    "zh-cn": "\u6700\u540E\u4F20\u8F93\u65F6\u95F4"
  },
  "modbus.state.millis": {
    en: "Runtime in ms",
    de: "Laufzeit in ms",
    ru: "\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0432 \u043C\u0441",
    pt: "Tempo de execu\xE7\xE3o em ms",
    nl: "Looptijd in ms",
    fr: "Temps d'ex\xE9cution en ms",
    it: "Tempo di esecuzione in ms",
    es: "Tiempo de ejecuci\xF3n en ms",
    pl: "Czas dzia\u0142ania w ms",
    uk: "\u0427\u0430\u0441 \u0440\u043E\u0431\u043E\u0442\u0438 \u0432 \u043C\u0441",
    "zh-cn": "\u8FD0\u884C\u65F6\u95F4\uFF08\u6BEB\u79D2\uFF09"
  },
  "pv.mode": {
    en: "Operating mode PV control",
    de: "Betriebsmodus PV-Regelung",
    ru: "\u0420\u0435\u0436\u0438\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u0440\u0435\u0433\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0424\u042D",
    pt: "Modo de opera\xE7\xE3o controle PV",
    nl: "Bedrijfsmodus PV-regeling",
    fr: "Mode de fonctionnement r\xE9gulation PV",
    it: "Modalit\xE0 operativa controllo FV",
    es: "Modo de operaci\xF3n control FV",
    pl: "Tryb pracy regulacji PV",
    uk: "\u0420\u0435\u0436\u0438\u043C \u0440\u043E\u0431\u043E\u0442\u0438 \u0440\u0435\u0433\u0443\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0424\u0415",
    "zh-cn": "\u5149\u4F0F\u63A7\u5236\u8FD0\u884C\u6A21\u5F0F"
  },
  "pv.watt": {
    en: "Current PV surplus power",
    de: "Aktuelle PV-\xDCberschussleistung",
    ru: "\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0438\u0437\u0431\u044B\u0442\u043E\u0447\u043D\u0430\u044F \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u044C \u0424\u042D",
    pt: "Pot\xEAncia excedente PV atual",
    nl: "Actueel PV-overschotvermogen",
    fr: "Puissance exc\xE9dentaire PV actuelle",
    it: "Potenza in eccesso FV attuale",
    es: "Potencia excedente FV actual",
    pl: "Aktualna nadwy\u017Cka mocy PV",
    uk: "\u041F\u043E\u0442\u043E\u0447\u043D\u0430 \u043D\u0430\u0434\u043B\u0438\u0448\u043A\u043E\u0432\u0430 \u043F\u043E\u0442\u0443\u0436\u043D\u0456\u0441\u0442\u044C \u0424\u0415",
    "zh-cn": "\u5F53\u524D\u5149\u4F0F\u5269\u4F59\u529F\u7387"
  },
  "pv.wbId": {
    en: "Active wallbox number",
    de: "Aktive Wallbox-Nummer",
    ru: "\u041D\u043E\u043C\u0435\u0440 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0437\u0430\u0440\u044F\u0434\u043D\u043E\u0439 \u0441\u0442\u0430\u043D\u0446\u0438\u0438",
    pt: "N\xFAmero da wallbox ativa",
    nl: "Actief wallbox-nummer",
    fr: "Num\xE9ro de wallbox active",
    it: "Numero wallbox attiva",
    es: "N\xFAmero de wallbox activa",
    pl: "Numer aktywnej stacji \u0142adowania",
    uk: "\u041D\u043E\u043C\u0435\u0440 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0457 \u0437\u0430\u0440\u044F\u0434\u043D\u043E\u0457 \u0441\u0442\u0430\u043D\u0446\u0456\u0457",
    "zh-cn": "\u6D3B\u8DC3\u58C1\u6302\u5F0F\u5145\u7535\u76D2\u7F16\u53F7"
  },
  "rfid.enabled": {
    en: "RFID function enabled",
    de: "RFID-Funktion aktiviert",
    ru: "\u0424\u0443\u043D\u043A\u0446\u0438\u044F RFID \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430",
    pt: "Fun\xE7\xE3o RFID ativada",
    nl: "RFID-functie geactiveerd",
    fr: "Fonction RFID activ\xE9e",
    it: "Funzione RFID attivata",
    es: "Funci\xF3n RFID activada",
    pl: "Funkcja RFID aktywowana",
    uk: "\u0424\u0443\u043D\u043A\u0446\u0456\u044F RFID \u0430\u043A\u0442\u0438\u0432\u043E\u0432\u0430\u043D\u0430",
    "zh-cn": "RFID\u529F\u80FD\u5DF2\u542F\u7528"
  },
  "rfid.lastId": {
    en: "Last detected RFID tag ID",
    de: "Zuletzt erkannte RFID-Tag ID",
    ru: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0439 ID RFID-\u043C\u0435\u0442\u043A\u0438",
    pt: "\xDAltimo ID de tag RFID detectado",
    nl: "Laatst gedetecteerde RFID-tag ID",
    fr: "Derni\xE8re ID de badge RFID d\xE9tect\xE9e",
    it: "Ultimo ID tag RFID rilevato",
    es: "\xDAltimo ID de etiqueta RFID detectado",
    pl: "Ostatnio wykryty identyfikator tagu RFID",
    uk: "\u041E\u0441\u0442\u0430\u043D\u043D\u0456\u0439 \u0432\u0438\u044F\u0432\u043B\u0435\u043D\u0438\u0439 ID RFID-\u043C\u0456\u0442\u043A\u0438",
    "zh-cn": "\u6700\u540E\u68C0\u6D4B\u5230\u7684RFID\u6807\u7B7EID"
  },
  "rfid.release": {
    en: "Charging release active",
    de: "Ladefreigabe aktiv",
    ru: "\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u043D\u0430 \u0437\u0430\u0440\u044F\u0434\u043A\u0443 \u0430\u043A\u0442\u0438\u0432\u043D\u043E",
    pt: "Libera\xE7\xE3o de carregamento ativa",
    nl: "Laadvrijgave actief",
    fr: "Autorisation de charge active",
    it: "Rilascio carica attivo",
    es: "Liberaci\xF3n de carga activa",
    pl: "Aktywne zezwolenie na \u0142adowanie",
    uk: "\u0414\u043E\u0437\u0432\u0456\u043B \u043D\u0430 \u0437\u0430\u0440\u044F\u0434\u0436\u0430\u043D\u043D\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0438\u0439",
    "zh-cn": "\u5145\u7535\u91CA\u653E\u5DF2\u6FC0\u6D3B"
  },
  "wbec.bldDate": {
    en: "Firmware build date",
    de: "Firmware-Erstellungsdatum",
    ru: "\u0414\u0430\u0442\u0430 \u0441\u0431\u043E\u0440\u043A\u0438 \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
    pt: "Data de cria\xE7\xE3o do firmware",
    nl: "Firmware-creatiedatum",
    fr: "Date de cr\xE9ation du firmware",
    it: "Data di creazione firmware",
    es: "Fecha de creaci\xF3n del firmware",
    pl: "Data utworzenia oprogramowania",
    uk: "\u0414\u0430\u0442\u0430 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
    "zh-cn": "\u56FA\u4EF6\u6784\u5EFA\u65E5\u671F"
  },
  "wbec.timeNow": {
    en: "Wallbox system time",
    de: "Systemzeit der Wallbox",
    ru: "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0437\u0430\u0440\u044F\u0434\u043D\u043E\u0439 \u0441\u0442\u0430\u043D\u0446\u0438\u0438",
    pt: "Hora do sistema da wallbox",
    nl: "Systeemtijd van de wallbox",
    fr: "Heure syst\xE8me de la wallbox",
    it: "Ora di sistema della wallbox",
    es: "Hora del sistema de la wallbox",
    pl: "Czas systemowy stacji \u0142adowania",
    uk: "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u0438\u0439 \u0447\u0430\u0441 \u0437\u0430\u0440\u044F\u0434\u043D\u043E\u0457 \u0441\u0442\u0430\u043D\u0446\u0456\u0457",
    "zh-cn": "\u58C1\u6302\u5F0F\u5145\u7535\u76D2\u7CFB\u7EDF\u65F6\u95F4"
  },
  "wbec.version": {
    en: "Firmware version",
    de: "Firmware-Version",
    ru: "\u0412\u0435\u0440\u0441\u0438\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
    pt: "Vers\xE3o do firmware",
    nl: "Firmware-versie",
    fr: "Version du firmware",
    it: "Versione firmware",
    es: "Versi\xF3n de firmware",
    pl: "Wersja oprogramowania",
    uk: "\u0412\u0435\u0440\u0441\u0456\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
    "zh-cn": "\u56FA\u4EF6\u7248\u672C"
  },
  "wbec.enwg14a": {
    en: "Status of \xA714a EnWG throttling",
    de: "Status der \xA714a EnWG-Drosselung",
    ru: "\u0421\u0442\u0430\u0442\u0443\u0441 \u0434\u0440\u043E\u0441\u0441\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \xA714a EnWG",
    pt: "Estado da limita\xE7\xE3o \xA714a EnWG",
    nl: "Status van \xA714a EnWG-beperking",
    fr: "Statut de la limitation \xA714a EnWG",
    it: "Stato della limitazione \xA714a EnWG",
    es: "Estado de la limitaci\xF3n \xA714a EnWG",
    pl: "Status ograniczenia \xA714a EnWG",
    uk: "\u0421\u0442\u0430\u0442\u0443\u0441 \u0434\u0440\u043E\u0441\u0435\u043B\u044E\u0432\u0430\u043D\u043D\u044F \xA714a EnWG",
    "zh-cn": "\xA714a EnWG\u8282\u6D41\u72B6\u6001"
  },
  "wbec.enwgErr": {
    en: "Error with \xA714a EnWG functionality",
    de: "Fehler bei \xA714a EnWG-Funktionalit\xE4t",
    ru: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \xA714a EnWG",
    pt: "Erro na funcionalidade \xA714a EnWG",
    nl: "Fout bij \xA714a EnWG-functionaliteit",
    fr: "Erreur avec la fonctionnalit\xE9 \xA714a EnWG",
    it: "Errore con la funzionalit\xE0 \xA714a EnWG",
    es: "Error en la funcionalidad \xA714a EnWG",
    pl: "B\u0142\u0105d funkcjonalno\u015Bci \xA714a EnWG",
    uk: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0444\u0443\u043D\u043A\u0446\u0456\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0456 \xA714a EnWG",
    "zh-cn": "\xA714a EnWG\u529F\u80FD\u9519\u8BEF"
  },
  "wifi.channel": {
    en: "WLAN channel used",
    de: "Verwendeter WLAN-Kanal",
    ru: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0439 \u043A\u0430\u043D\u0430\u043B WLAN",
    pt: "Canal WLAN utilizado",
    nl: "Gebruikte WLAN-kanaal",
    fr: "Canal WLAN utilis\xE9",
    it: "Canale WLAN utilizzato",
    es: "Canal WLAN utilizado",
    pl: "U\u017Cywany kana\u0142 WLAN",
    uk: "\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u043D\u0438\u0439 \u043A\u0430\u043D\u0430\u043B WLAN",
    "zh-cn": "\u4F7F\u7528\u7684WLAN\u901A\u9053"
  },
  "wifi.mac": {
    en: "WLAN MAC address",
    de: "WLAN-MAC-Adresse",
    ru: "MAC-\u0430\u0434\u0440\u0435\u0441 WLAN",
    pt: "Endere\xE7o MAC WLAN",
    nl: "WLAN MAC-adres",
    fr: "Adresse MAC WLAN",
    it: "Indirizzo MAC WLAN",
    es: "Direcci\xF3n MAC WLAN",
    pl: "Adres MAC WLAN",
    uk: "MAC-\u0430\u0434\u0440\u0435\u0441\u0430 WLAN",
    "zh-cn": "WLAN MAC\u5730\u5740"
  },
  "wifi.rssi": {
    en: "WLAN signal strength in dBm",
    de: "WLAN-Signalst\xE4rke in dBm",
    ru: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0441\u0438\u0433\u043D\u0430\u043B\u0430 WLAN \u0432 \u0434\u0411\u043C",
    pt: "For\xE7a do sinal WLAN em dBm",
    nl: "WLAN-signaalsterkte in dBm",
    fr: "Force du signal WLAN en dBm",
    it: "Potenza del segnale WLAN in dBm",
    es: "Intensidad de se\xF1al WLAN en dBm",
    pl: "Si\u0142a sygna\u0142u WLAN w dBm",
    uk: "\u0420\u0456\u0432\u0435\u043D\u044C \u0441\u0438\u0433\u043D\u0430\u043B\u0443 WLAN \u0432 \u0434\u0411\u043C",
    "zh-cn": "WLAN\u4FE1\u53F7\u5F3A\u5EA6\uFF08dBm\uFF09"
  },
  "wifi.signal": {
    en: "WLAN signal quality in %",
    de: "WLAN-Signalqualit\xE4t in %",
    ru: "\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u0438\u0433\u043D\u0430\u043B\u0430 WLAN \u0432 %",
    pt: "Qualidade do sinal WLAN em %",
    nl: "WLAN-signaalkwaliteit in %",
    fr: "Qualit\xE9 du signal WLAN en %",
    it: "Qualit\xE0 del segnale WLAN in %",
    es: "Calidad de se\xF1al WLAN en %",
    pl: "Jako\u015B\u0107 sygna\u0142u WLAN w %",
    uk: "\u042F\u043A\u0456\u0441\u0442\u044C \u0441\u0438\u0433\u043D\u0430\u043B\u0443 WLAN \u0443 %",
    "zh-cn": "WLAN\u4FE1\u53F7\u8D28\u91CF\uFF08%\uFF09"
  }
};
//# sourceMappingURL=json.js.map
