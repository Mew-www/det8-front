class Ticket {
  constructor(name_fi, travelzones, duration_min, price_eur, agency, options) {
    this.name_fi = name_fi;
    this.zones = travelzones;
    this.duration_min = duration_min;
    this.price_eur = price_eur;
    this.agency = agency;
    this.options = options;
  }
}

const HSL_HELSINKI = ["0101"];
const HSL_ESPOO_KAUNIAINEN = ["0202"];
const HSL_VANTAA = ["0404"];
const HSL_KIRKKONUMMI_SIUNTIO = ["0606"];
const HSL_TUUSULA_KERAVA_SIPOO = ["0909"];
const HSL_SEUTU = HSL_HELSINKI.concat(["0102", "0104"])
          .concat(HSL_ESPOO_KAUNIAINEN).concat(["0204"])
          .concat(HSL_VANTAA);
const HSL_LAHISEUTU_2 = HSL_ESPOO_KAUNIAINEN.concat(["0204", "0206", "0209"])
                .concat(HSL_VANTAA).concat(["0406", "0409"])
                .concat(HSL_KIRKKONUMMI_SIUNTIO).concat(["0609"])
                .concat(HSL_TUUSULA_KERAVA_SIPOO);
const HSL_LAHISEUTU_3 = HSL_HELSINKI.concat(["0102", "0104", "0106", "0109"])
                .concat(HSL_ESPOO_KAUNIAINEN).concat(["0204", "0206", "0209"])
                .concat(HSL_VANTAA).concat(["0406", "0409"])
                .concat(HSL_KIRKKONUMMI_SIUNTIO).concat(["0609"])
                .concat(HSL_TUUSULA_KERAVA_SIPOO);

export default [
  new Ticket("Kertalippu Helsinki", HSL_HELSINKI, 80, 2.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "helsinki"}}),
  new Ticket("Kertalippu Espoo-Kauniainen", HSL_ESPOO_KAUNIAINEN, 80, 2.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "espooKauniainen"}}),
  new Ticket("Kertalippu Vantaa", HSL_VANTAA, 80, 2.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "vantaa"}}),
  new Ticket("Kertalippu Kirkkonummi-Siuntio", HSL_KIRKKONUMMI_SIUNTIO, 80, 2.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "kirkkonummiSiuntio"}}),
  new Ticket("Kertalippu Tuusula-Kerava-Sipoo", HSL_TUUSULA_KERAVA_SIPOO, 80, 2.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "keravaSipooTuusula"}}),
  new Ticket("Kertalippu Lähiseutu 1 (PKS)", HSL_SEUTU, 80, 4.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "regional"}}),
  new Ticket("Kertalippu Lähiseutu 2 (Ei Helsingin kautta)", HSL_LAHISEUTU_2, 80, 4.20, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "bizoneRegion"}}),
  new Ticket("Kertalippu Lähiseutu 3 (Koko HSL alue)", HSL_LAHISEUTU_3, 80, 6.30, "HSL", (phone_num) => {return {phoneNumber: phone_num, ticketTypeId: "single", customerTypeId: "adult", regionId: "trizoneRegion"}})
  // Missing "day" and "season" tickets -- day tickets have "validity time" of 1..7 and season ones have userId; Check documentation for more info.
];