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
var box_exports = {};
__export(box_exports, {
  default: () => box_default
});
module.exports = __toCommonJS(box_exports);
var box_default = {
  "busId": {
    de: "Bus ID",
    en: "Bus ID",
    ru: "ID \u0448\u0438\u043D\u044B",
    pt: "ID do barramento",
    nl: "Bus ID",
    fr: "ID du bus",
    it: "ID bus",
    es: "ID de bus",
    pl: "ID magistrali",
    uk: "ID \u0448\u0438\u043D\u0438",
    "zh-cn": "\u603B\u7EBF ID"
  },
  "chgStat": {
    de: "Ladestatus",
    en: "Charging State",
    ru: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0437\u0430\u0440\u044F\u0434\u043A\u0438",
    pt: "Estado de carregamento",
    nl: "Oplaadstatus",
    fr: "\xC9tat de charge",
    it: "Stato di carica",
    es: "Estado de carga",
    pl: "Stan \u0142adowania",
    uk: "\u0421\u0442\u0430\u043D \u0437\u0430\u0440\u044F\u0434\u0436\u0430\u043D\u043D\u044F",
    "zh-cn": "\u5145\u7535\u72B6\u6001"
  },
  "currFs": {
    de: "FailSafe Stromkonfiguration (bei Verlust der Modbus-Kommunikation)",
    en: "FailSafe Current configuration (in case loss of Modbus communication)",
    ru: "\u041E\u0442\u043A\u0430\u0437\u043E\u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u0430\u044F \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F \u0442\u043E\u043A\u0430 (\u043F\u0440\u0438 \u043F\u043E\u0442\u0435\u0440\u0435 \u0441\u0432\u044F\u0437\u0438 Modbus)",
    pt: "Configura\xE7\xE3o de corrente \xE0 prova de falhas (em caso de perda de comunica\xE7\xE3o Modbus)",
    nl: "FailSafe stroomconfiguratie (bij verlies van Modbus-communicatie)",
    fr: "Configuration de courant FailSafe (en cas de perte de communication Modbus)",
    it: "Configurazione corrente FailSafe (in caso di perdita della comunicazione Modbus)",
    es: "Configuraci\xF3n de corriente a prueba de fallos (en caso de p\xE9rdida de comunicaci\xF3n Modbus)",
    pl: "Konfiguracja pr\u0105du FailSafe (w przypadku utraty komunikacji Modbus)",
    uk: "\u0412\u0456\u0434\u043C\u043E\u0432\u043E\u0441\u0442\u0456\u0439\u043A\u0430 \u043A\u043E\u043D\u0444\u0456\u0433\u0443\u0440\u0430\u0446\u0456\u044F \u0441\u0442\u0440\u0443\u043C\u0443 (\u0443 \u0440\u0430\u0437\u0456 \u0432\u0442\u0440\u0430\u0442\u0438 \u0437\u0432'\u044F\u0437\u043A\u0443 Modbus)",
    "zh-cn": "\u6545\u969C\u5B89\u5168\u7535\u6D41\u914D\u7F6E\uFF08\u5728 Modbus \u901A\u4FE1\u4E22\u5931\u7684\u60C5\u51B5\u4E0B\uFF09"
  },
  "currL1": {
    de: "Strom Phase 1",
    en: "Current Phase 1",
    ru: "\u0422\u043E\u043A \u0444\u0430\u0437\u044B 1",
    pt: "Corrente Fase 1",
    nl: "Stroom Fase 1",
    fr: "Courant Phase 1",
    it: "Corrente Fase 1",
    es: "Corriente Fase 1",
    pl: "Pr\u0105d Faza 1",
    uk: "\u0421\u0442\u0440\u0443\u043C \u0424\u0430\u0437\u0430 1",
    "zh-cn": "\u7535\u6D41\u76F8\u4F4D 1"
  },
  "currL2": {
    de: "Strom Phase 2",
    en: "Current Phase 2",
    ru: "\u0422\u043E\u043A \u0444\u0430\u0437\u044B 2",
    pt: "Corrente Fase 2",
    nl: "Stroom Fase 2",
    fr: "Courant Phase 2",
    it: "Corrente Fase 2",
    es: "Corriente Fase 2",
    pl: "Pr\u0105d Faza 2",
    uk: "\u0421\u0442\u0440\u0443\u043C \u0424\u0430\u0437\u0430 2",
    "zh-cn": "\u7535\u6D41\u76F8\u4F4D 2"
  },
  "currL3": {
    de: "Strom Phase 3",
    en: "Current Phase 3",
    ru: "\u0422\u043E\u043A \u0444\u0430\u0437\u044B 3",
    pt: "Corrente Fase 3",
    nl: "Stroom Fase 3",
    fr: "Courant Phase 3",
    it: "Corrente Fase 3",
    es: "Corriente Fase 3",
    pl: "Pr\u0105d Faza 3",
    uk: "\u0421\u0442\u0440\u0443\u043C \u0424\u0430\u0437\u0430 3",
    "zh-cn": "\u7535\u6D41\u76F8\u4F4D 3"
  },
  "currLim": {
    de: "Aktuelles Strom Limit",
    en: "Current Limit",
    ru: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B \u0442\u043E\u043A\u0430",
    pt: "Limite de corrente atual",
    nl: "Huidige stroomlimiet",
    fr: "Limite de courant actuelle",
    it: "Limite di corrente attuale",
    es: "L\xEDmite de corriente actual",
    pl: "Aktualne ograniczenie pr\u0105du",
    uk: "\u041F\u043E\u0442\u043E\u0447\u043D\u0435 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u043D\u044F \u0441\u0442\u0440\u0443\u043C\u0443",
    "zh-cn": "\u5F53\u524D\u7535\u6D41\u9650\u5236"
  },
  "currMax": {
    de: "Hardware-Konfiguration maximaler Strom",
    en: "Hardware configuration maximal current",
    ru: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u043E\u043A \u0430\u043F\u043F\u0430\u0440\u0430\u0442\u043D\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438",
    pt: "Configura\xE7\xE3o de hardware corrente m\xE1xima",
    nl: "Hardware configuratie maximale stroom",
    fr: "Configuration mat\xE9rielle courant maximal",
    it: "Configurazione hardware corrente massima",
    es: "Configuraci\xF3n de hardware corriente m\xE1xima",
    pl: "Konfiguracja sprz\u0119towa maksymalnego pr\u0105du",
    uk: "\u0410\u043F\u0430\u0440\u0430\u0442\u043D\u0430 \u043A\u043E\u043D\u0444\u0456\u0433\u0443\u0440\u0430\u0446\u0456\u044F \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0443\u043C\u0443",
    "zh-cn": "\u786C\u4EF6\u914D\u7F6E\u6700\u5927\u7535\u6D41"
  },
  "currMin": {
    de: "Hardware-Konfiguration minimaler Strom",
    en: "Hardware configuration minimal current",
    ru: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u043E\u043A \u0430\u043F\u043F\u0430\u0440\u0430\u0442\u043D\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438",
    pt: "Configura\xE7\xE3o de hardware corrente m\xEDnima",
    nl: "Hardware configuratie minimale stroom",
    fr: "Configuration mat\xE9rielle courant minimal",
    it: "Configurazione hardware corrente minima",
    es: "Configuraci\xF3n de hardware corriente m\xEDnima",
    pl: "Konfiguracja sprz\u0119towa minimalnego pr\u0105du",
    uk: "\u0410\u043F\u0430\u0440\u0430\u0442\u043D\u0430 \u043A\u043E\u043D\u0444\u0456\u0433\u0443\u0440\u0430\u0446\u0456\u044F \u043C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0443\u043C\u0443",
    "zh-cn": "\u786C\u4EF6\u914D\u7F6E\u6700\u5C0F\u7535\u6D41"
  },
  "energyC": {
    de: "Energie Ladevorgang",
    en: "Energy Charging Process",
    ru: "\u042D\u043D\u0435\u0440\u0433\u0438\u044F \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0430 \u0437\u0430\u0440\u044F\u0434\u043A\u0438",
    pt: "Processo de carregamento de energia",
    nl: "Energie laadproces",
    fr: "Processus de charge d'\xE9nergie",
    it: "Processo di carica energia",
    es: "Proceso de carga de energ\xEDa",
    pl: "Proces \u0142adowania energii",
    uk: "\u0415\u043D\u0435\u0440\u0433\u0456\u044F \u043F\u0440\u043E\u0446\u0435\u0441\u0443 \u0437\u0430\u0440\u044F\u0434\u0436\u0430\u043D\u043D\u044F",
    "zh-cn": "\u80FD\u6E90\u5145\u7535\u8FC7\u7A0B"
  },
  "energyI": {
    de: "Energie seit Installation",
    en: "Energy since Installation",
    ru: "\u042D\u043D\u0435\u0440\u0433\u0438\u044F \u0441 \u043C\u043E\u043C\u0435\u043D\u0442\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438",
    pt: "Energia desde a instala\xE7\xE3o",
    nl: "Energie sinds installatie",
    fr: "\xC9nergie depuis l'installation",
    it: "Energia dall'installazione",
    es: "Energ\xEDa desde la instalaci\xF3n",
    pl: "Energia od instalacji",
    uk: "\u0415\u043D\u0435\u0440\u0433\u0456\u044F \u0437 \u043C\u043E\u043C\u0435\u043D\u0442\u0443 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F",
    "zh-cn": "\u5B89\u88C5\u4EE5\u6765\u7684\u80FD\u6E90"
  },
  "energyP": {
    de: "Energie seit Einschalten",
    en: "Energy since PowerOn",
    ru: "\u042D\u043D\u0435\u0440\u0433\u0438\u044F \u0441 \u043C\u043E\u043C\u0435\u043D\u0442\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F",
    pt: "Energia desde liga\xE7\xE3o",
    nl: "Energie sinds inschakelen",
    fr: "\xC9nergie depuis la mise sous tension",
    it: "Energia dall'accensione",
    es: "Energ\xEDa desde el encendido",
    pl: "Energia od w\u0142\u0105czenia",
    uk: "\u0415\u043D\u0435\u0440\u0433\u0456\u044F \u0437 \u043C\u043E\u043C\u0435\u043D\u0442\u0443 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044F",
    "zh-cn": "\u5F00\u673A\u4EE5\u6765\u7684\u80FD\u6E90"
  },
  "extLock": {
    de: "Externer Sperrstatus",
    en: "External lock state",
    ru: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0432\u043D\u0435\u0448\u043D\u0435\u0439 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438",
    pt: "Estado de bloqueio externo",
    nl: "Externe vergrendelingsstatus",
    fr: "\xC9tat de verrouillage externe",
    it: "Stato blocco esterno",
    es: "Estado de bloqueo externo",
    pl: "Stan blokady zewn\u0119trznej",
    uk: "\u0421\u0442\u0430\u043D \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u044C\u043E\u0433\u043E \u0431\u043B\u043E\u043A\u0443\u0432\u0430\u043D\u043D\u044F",
    "zh-cn": "\u5916\u90E8\u9501\u5B9A\u72B6\u6001"
  },
  "failCnt": {
    de: "Fehlerz\xE4hler",
    en: "Error Counter",
    ru: "\u0421\u0447\u0435\u0442\u0447\u0438\u043A \u043E\u0448\u0438\u0431\u043E\u043A",
    pt: "Contador de erros",
    nl: "Foutenteller",
    fr: "Compteur d'erreurs",
    it: "Contatore errori",
    es: "Contador de errores",
    pl: "Licznik b\u0142\u0119d\xF3w",
    uk: "\u041B\u0456\u0447\u0438\u043B\u044C\u043D\u0438\u043A \u043F\u043E\u043C\u0438\u043B\u043E\u043A",
    "zh-cn": "\u9519\u8BEF\u8BA1\u6570\u5668"
  },
  "lmLim": {
    de: "Stromlimit, das in der Wallbox sein soll",
    en: "Current limit which shall be in the wallbox",
    ru: "\u041F\u0440\u0435\u0434\u0435\u043B \u0442\u043E\u043A\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u043D\u0430\u0441\u0442\u0435\u043D\u043D\u043E\u0439 \u0437\u0430\u0440\u044F\u0434\u043D\u043E\u0439 \u0441\u0442\u0430\u043D\u0446\u0438\u0438",
    pt: "Limite de corrente que deve estar na wallbox",
    nl: "Stroomlimiet die in de wallbox moet zijn",
    fr: "Limite de courant qui doit \xEAtre dans la wallbox",
    it: "Limite di corrente che deve essere nella wallbox",
    es: "L\xEDmite de corriente que debe estar en la wallbox",
    pl: "Limit pr\u0105du, kt\xF3ry powinien by\u0107 w wallboxie",
    uk: "\u041E\u0431\u043C\u0435\u0436\u0435\u043D\u043D\u044F \u0441\u0442\u0440\u0443\u043C\u0443, \u044F\u043A\u0435 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0432 \u043D\u0430\u0441\u0442\u0456\u043D\u043D\u0456\u0439 \u0437\u0430\u0440\u044F\u0434\u043D\u0456\u0439 \u0441\u0442\u0430\u043D\u0446\u0456\u0457",
    "zh-cn": "\u58C1\u6302\u5F0F\u5145\u7535\u76D2\u4E2D\u5E94\u6709\u7684\u7535\u6D41\u9650\u5236"
  },
  "lmReq": {
    de: "Zuletzt angefordertes Stromlimit von einer der Anwendungen auf h\xF6herer Ebene",
    en: "Last requested current limit from any of the applications on higher level",
    ru: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u0435\u0434\u0435\u043B \u0442\u043E\u043A\u0430 \u043E\u0442 \u043B\u044E\u0431\u043E\u0433\u043E \u0438\u0437 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u0431\u043E\u043B\u0435\u0435 \u0432\u044B\u0441\u043E\u043A\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F",
    pt: "\xDAltimo limite de corrente solicitado de qualquer um dos aplicativos em n\xEDvel superior",
    nl: "Laatst aangevraagde stroomlimiet van een van de toepassingen op hoger niveau",
    fr: "Derni\xE8re limite de courant demand\xE9e par l'une des applications de niveau sup\xE9rieur",
    it: "Ultimo limite di corrente richiesto da una delle applicazioni di livello superiore",
    es: "\xDAltimo l\xEDmite de corriente solicitado por cualquiera de las aplicaciones de nivel superior",
    pl: "Ostatnio \u017C\u0105dany limit pr\u0105du z dowolnej aplikacji wy\u017Cszego poziomu",
    uk: "\u041E\u0441\u0442\u0430\u043D\u043D\u0454 \u0437\u0430\u043F\u0438\u0442\u0430\u043D\u0435 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u043D\u044F \u0441\u0442\u0440\u0443\u043C\u0443 \u0432\u0456\u0434 \u0431\u0443\u0434\u044C-\u044F\u043A\u043E\u0457 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438 \u0432\u0438\u0449\u043E\u0433\u043E \u0440\u0456\u0432\u043D\u044F",
    "zh-cn": "\u6765\u81EA\u66F4\u9AD8\u7EA7\u522B\u7684\u4EFB\u4F55\u5E94\u7528\u7A0B\u5E8F\u7684\u6700\u540E\u8BF7\u6C42\u7684\u7535\u6D41\u9650\u5236"
  },
  "logStr": {
    de: "Log-Zeichenfolge",
    en: "Log String",
    ru: "\u0421\u0442\u0440\u043E\u043A\u0430 \u0436\u0443\u0440\u043D\u0430\u043B\u0430",
    pt: "String de registro",
    nl: "Logboekstring",
    fr: "Cha\xEEne de journal",
    it: "Stringa di registro",
    es: "Cadena de registro",
    pl: "Ci\u0105g dziennika",
    uk: "\u0420\u044F\u0434\u043E\u043A \u0436\u0443\u0440\u043D\u0430\u043B\u0443",
    "zh-cn": "\u65E5\u5FD7\u5B57\u7B26\u4E32"
  },
  "pcbTemp": {
    de: "Controller Temperatur",
    en: "Controller Temperature",
    ru: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u043B\u0435\u0440\u0430",
    pt: "Temperatura do controlador",
    nl: "Controller temperatuur",
    fr: "Temp\xE9rature du contr\xF4leur",
    it: "Temperatura controller",
    es: "Temperatura del controlador",
    pl: "Temperatura kontrolera",
    uk: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435\u0440\u0430",
    "zh-cn": "\u63A7\u5236\u5668\u6E29\u5EA6"
  },
  "phases": {
    de: "Phasen in Verwendung",
    en: "Phases in use",
    ru: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0435 \u0444\u0430\u0437\u044B",
    pt: "Fases em uso",
    nl: "Fasen in gebruik",
    fr: "Phases en cours d'utilisation",
    it: "Fasi in uso",
    es: "Fases en uso",
    pl: "Fazy w u\u017Cyciu",
    uk: "\u0424\u0430\u0437\u0438 \u0443 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u043D\u043D\u0456",
    "zh-cn": "\u4F7F\u7528\u4E2D\u7684\u76F8\u4F4D"
  },
  "phasesAvailable": {
    de: "Phasen verf\xFCgbar",
    en: "Phases available",
    ru: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0444\u0430\u0437\u044B",
    pt: "Fases dispon\xEDveis",
    nl: "Fasen beschikbaar",
    fr: "Phases disponibles",
    it: "Fasi disponibili",
    es: "Fases disponibles",
    pl: "Dost\u0119pne fazy",
    uk: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u0444\u0430\u0437\u0438",
    "zh-cn": "\u53EF\u7528\u76F8\u4F4D"
  },
  "power": {
    de: "Leistung",
    en: "Power",
    ru: "\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C",
    pt: "Pot\xEAncia",
    nl: "Vermogen",
    fr: "Puissance",
    it: "Potenza",
    es: "Potencia",
    pl: "Moc",
    uk: "\u041F\u043E\u0442\u0443\u0436\u043D\u0456\u0441\u0442\u044C",
    "zh-cn": "\u529F\u7387"
  },
  "powerTarget": {
    de: "Zielleistung",
    en: "Target Power",
    ru: "\u0426\u0435\u043B\u0435\u0432\u0430\u044F \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u044C",
    pt: "Pot\xEAncia alvo",
    nl: "Doelvermogen",
    fr: "Puissance cible",
    it: "Potenza target",
    es: "Potencia objetivo",
    pl: "Moc docelowa",
    uk: "\u0426\u0456\u043B\u044C\u043E\u0432\u0430 \u043F\u043E\u0442\u0443\u0436\u043D\u0456\u0441\u0442\u044C",
    "zh-cn": "\u76EE\u6807\u529F\u7387"
  },
  "remLock": {
    de: "Fernsperre (nur wenn externe Sperre entsperrt ist)",
    en: "Remote lock (only if extern lock unlocked)",
    ru: "\u0423\u0434\u0430\u043B\u0435\u043D\u043D\u0430\u044F \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430 (\u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432\u043D\u0435\u0448\u043D\u044F\u044F \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430 \u0440\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430)",
    pt: "Bloqueio remoto (somente se o bloqueio externo estiver desbloqueado)",
    nl: "Vergrendeling op afstand (alleen als externe vergrendeling ontgrendeld is)",
    fr: "Verrouillage \xE0 distance (uniquement si le verrouillage externe est d\xE9verrouill\xE9)",
    it: "Blocco remoto (solo se il blocco esterno \xE8 sbloccato)",
    es: "Bloqueo remoto (solo si el bloqueo externo est\xE1 desbloqueado)",
    pl: "Blokada zdalna (tylko je\u015Bli blokada zewn\u0119trzna jest odblokowana)",
    uk: "\u0412\u0456\u0434\u0434\u0430\u043B\u0435\u043D\u0435 \u0431\u043B\u043E\u043A\u0443\u0432\u0430\u043D\u043D\u044F (\u0442\u0456\u043B\u044C\u043A\u0438 \u044F\u043A\u0449\u043E \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u0454 \u0431\u043B\u043E\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0440\u043E\u0437\u0431\u043B\u043E\u043A\u043E\u0432\u0430\u043D\u043E)",
    "zh-cn": "\u8FDC\u7A0B\u9501\u5B9A\uFF08\u4EC5\u5F53\u5916\u90E8\u9501\u89E3\u9501\u65F6\uFF09"
  },
  "resCode": {
    de: "Antwort-Code (0: Kein Fehler)",
    en: "Response Code (0: No Error)",
    ru: "\u041A\u043E\u0434 \u043E\u0442\u0432\u0435\u0442\u0430 (0: \u041D\u0435\u0442 \u043E\u0448\u0438\u0431\u043A\u0438)",
    pt: "C\xF3digo de resposta (0: Sem erro)",
    nl: "Responscode (0: Geen fout)",
    fr: "Code de r\xE9ponse (0: Pas d'erreur)",
    it: "Codice di risposta (0: Nessun errore)",
    es: "C\xF3digo de respuesta (0: Sin error)",
    pl: "Kod odpowiedzi (0: Brak b\u0142\u0119du)",
    uk: "\u041A\u043E\u0434 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 (0: \u041D\u0435\u043C\u0430\u0454 \u043F\u043E\u043C\u0438\u043B\u043A\u0438)",
    "zh-cn": "\u54CD\u5E94\u4EE3\u7801\uFF080\uFF1A\u65E0\u9519\u8BEF\uFF09"
  },
  "standby": {
    de: "Standby-Funktionssteuerung (Energiesparen, wenn kein Fahrzeug angeschlossen)",
    en: "Standby Function Control (Power Saving if no car plugged)",
    ru: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0435\u0439 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F (\u044D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0435, \u0435\u0441\u043B\u0438 \u043D\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C)",
    pt: "Controle de fun\xE7\xE3o de espera (economia de energia se nenhum carro estiver conectado)",
    nl: "Standby-functiebesturing (energiebesparing als er geen auto is aangesloten)",
    fr: "Contr\xF4le de la fonction de veille (\xE9conomie d'\xE9nergie si aucune voiture n'est branch\xE9e)",
    it: "Controllo funzione standby (risparmio energetico se nessuna auto collegata)",
    es: "Control de funci\xF3n de espera (ahorro de energ\xEDa si no hay coche enchufado)",
    pl: "Sterowanie funkcj\u0105 czuwania (oszcz\u0119dzanie energii, je\u015Bli nie pod\u0142\u0105czono samochodu)",
    uk: "\u041A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0444\u0443\u043D\u043A\u0446\u0456\u0454\u044E \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F (\u0435\u043D\u0435\u0440\u0433\u043E\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F, \u044F\u043A\u0449\u043E \u043D\u0435 \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u044C)",
    "zh-cn": "\u5F85\u673A\u529F\u80FD\u63A7\u5236\uFF08\u5982\u679C\u6CA1\u6709\u6C7D\u8F66\u63D2\u5165\u5219\u7701\u7535\uFF09"
  },
  "version": {
    de: "Modbus Register-Layouts Version (0x100 -> V1.0.0)",
    en: "Modbus Register-Layouts Version (0x100 -> V1.0.0)",
    ru: "\u0412\u0435\u0440\u0441\u0438\u044F \u043C\u0430\u043A\u0435\u0442\u043E\u0432 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u043E\u0432 Modbus (0x100 -> V1.0.0)",
    pt: "Vers\xE3o de layouts de registro Modbus (0x100 -> V1.0.0)",
    nl: "Modbus Register-Layouts Versie (0x100 -> V1.0.0)",
    fr: "Version des layouts de registre Modbus (0x100 -> V1.0.0)",
    it: "Versione layout registri Modbus (0x100 -> V1.0.0)",
    es: "Versi\xF3n de dise\xF1os de registro Modbus (0x100 -> V1.0.0)",
    pl: "Wersja uk\u0142ad\xF3w rejestr\xF3w Modbus (0x100 -> V1.0.0)",
    uk: "\u0412\u0435\u0440\u0441\u0456\u044F \u043C\u0430\u043A\u0435\u0442\u0456\u0432 \u0440\u0435\u0433\u0456\u0441\u0442\u0440\u0456\u0432 Modbus (0x100 -> V1.0.0)",
    "zh-cn": "Modbus \u5BC4\u5B58\u5668\u5E03\u5C40\u7248\u672C (0x100 -> V1.0.0)"
  },
  "voltL1": {
    de: "Spannung Phase 1",
    en: "Voltage Phase 1",
    ru: "\u041D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0444\u0430\u0437\u044B 1",
    pt: "Tens\xE3o Fase 1",
    nl: "Spanning Fase 1",
    fr: "Tension Phase 1",
    it: "Tensione Fase 1",
    es: "Voltaje Fase 1",
    pl: "Napi\u0119cie Faza 1",
    uk: "\u041D\u0430\u043F\u0440\u0443\u0433\u0430 \u0424\u0430\u0437\u0430 1",
    "zh-cn": "\u7535\u538B\u76F8\u4F4D 1"
  },
  "voltL2": {
    de: "Spannung Phase 2",
    en: "Voltage Phase 2",
    ru: "\u041D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0444\u0430\u0437\u044B 2",
    pt: "Tens\xE3o Fase 2",
    nl: "Spanning Fase 2",
    fr: "Tension Phase 2",
    it: "Tensione Fase 2",
    es: "Voltaje Fase 2",
    pl: "Napi\u0119cie Faza 2",
    uk: "\u041D\u0430\u043F\u0440\u0443\u0433\u0430 \u0424\u0430\u0437\u0430 2",
    "zh-cn": "\u7535\u538B\u76F8\u4F4D 2"
  },
  "voltL3": {
    de: "Spannung Phase 3",
    en: "Voltage Phase 3",
    ru: "\u041D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0444\u0430\u0437\u044B 3",
    pt: "Tens\xE3o Fase 3",
    nl: "Spanning Fase 3",
    fr: "Tension Phase 3",
    it: "Tensione Fase 3",
    es: "Voltaje Fase 3",
    pl: "Napi\u0119cie Faza 3",
    uk: "\u041D\u0430\u043F\u0440\u0443\u0433\u0430 \u0424\u0430\u0437\u0430 3",
    "zh-cn": "\u7535\u538B\u76F8\u4F4D 3"
  },
  "wdTmOut": {
    de: "ModBus-Master WatchDog Timeout in ms",
    en: "ModBus-Master WatchDog Timeout in ms",
    ru: "\u0422\u0430\u0439\u043C\u0430\u0443\u0442 \u0441\u0442\u043E\u0440\u043E\u0436\u0435\u0432\u043E\u0433\u043E \u0442\u0430\u0439\u043C\u0435\u0440\u0430 ModBus-Master \u0432 \u043C\u0441",
    pt: "Tempo limite de WatchDog do ModBus-Master em ms",
    nl: "ModBus-Master WatchDog Timeout in ms",
    fr: "D\xE9lai d'attente WatchDog ModBus-Master en ms",
    it: "Timeout WatchDog ModBus-Master in ms",
    es: "Tiempo de espera WatchDog ModBus-Master en ms",
    pl: "Limit czasu WatchDog ModBus-Master w ms",
    uk: "\u0427\u0430\u0441 \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F WatchDog ModBus-Master \u0443 \u043C\u0441",
    "zh-cn": "ModBus-Master \u770B\u95E8\u72D7\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09"
  }
};
//# sourceMappingURL=box.js.map
