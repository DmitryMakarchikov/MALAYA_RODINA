'use strict';
/* Авторы и лицензии снимков (сгенерировано из метаданных Wikimedia Commons).
   a — автор (пусто, если не указан), l — лицензия, u — страница файла. */
const CREDITS = {
 "images/places/dremlevo-cover.jpg": {"a": "", "l": "BrestCITY (brestcity.com)", "u": "https://brestcity.com/blog/memorialnyj-kompleks-dremlevo-v-zhabinkovskom-rajone"},
 "images/places/dremlevo-tour-1.jpg": {"a": "", "l": "СБ. Беларусь сегодня (sb.by)", "u": "https://www.sb.by/articles/v-memorialnom-komplekse-dremlevo-pod-zhabinkoy-proshla-aktsiya-po-navedeniyu-poryadka-.html"},
 "images/places/dremlevo-tour-2.jpg": {"a": "", "l": "СБ. Беларусь сегодня (sb.by)", "u": "https://www.sb.by/articles/v-memorialnom-komplekse-dremlevo-pod-zhabinkoy-proshla-aktsiya-po-navedeniyu-poryadka-.html"},
 "images/places/rylenki-cover.jpg": {"a": "", "l": "savehistory.by", "u": "https://www.savehistory.by/karta/memorialnyy-kompleks-rylenki/"},
 "images/places/rylenki-tour-1.jpg": {"a": "", "l": "БЕЛТА (belta.by)", "u": "https://belta.by/regions/view/v-memorialnom-komplekse-rylenki-otkryli-novuju-plitu-s-41-familiej-pogibshih-voinov-412438-2020/"},
 "images/places/rylenki-tour-2.jpg": {"a": "", "l": "sport.vitobl.by", "u": "http://sport.vitobl.by/object/memorialnyy-kompleks-rylenki"},
 "images/places/krinichka-cover.jpg": {"a": "", "l": "museums.by", "u": "https://museums.by/dostoprimechatelnosti/memorialnyy-kompleks-partizanskaya-krinichka/"},
 "images/places/krinichka-tour-1.jpg": {"a": "", "l": "gomelraton.com", "u": "https://www.gomelraton.com/press-center/articles/poseshchenie-memorialnogo-kompleksa-partizanskaya-krinichka/"},
 "images/places/shaulichi-cover.jpg": {"a": "", "l": "СБ. Беларусь сегодня (sb.by)", "u": "https://www.sb.by/articles/memorial-na-meste-derevni-shaulichi-ognennoy-sestry-khatyni.html"},
 "images/places/shaulichi-tour-1.jpg": {"a": "", "l": "TravelAgency.by (travelagency.by)", "u": "https://travelagency.by/mesta/memorialnyy-kompleks-shaulichi.html"},
 "images/places/grodnokurgan-cover.jpg": {"a": "", "l": "СБ. Беларусь сегодня (sb.by)", "u": "https://www.sb.by/articles/obeliski-velikogo-podviga-kurgan-slavy-v-grodno.html"},
 "images/places/grodnokurgan-tour-1.jpg": {"a": "", "l": "Вечерний Гродно (vgr.by)", "u": "https://vgr.by/2022/05/08/gorod-na-ladoni-kak-sozdavali-kurgan-slavyi-v-grodno/"},
 "images/places/grodnokurgan-tour-2.jpg": {"a": "", "l": "Вечерний Гродно (vgr.by)", "u": "https://vgr.by/2020/07/04/den-nezavisimosti-v-grodno-zavershilsya-prazdnichnyim-salyutom-na-kurgane-slavyi/"},
 "images/places/zyslov-cover.jpg": {"a": "", "l": "fotobel.by", "u": "https://www.fotobel.by/memorialy-belarusi/memorial-ostrov-zyslov/"},
 "images/places/zyslov-tour-1.jpg": {"a": "", "l": "fotobel.by", "u": "https://www.fotobel.by/memorialy-belarusi/memorial-ostrov-zyslov/"},
 "images/places/borki-cover.jpg": {"a": "", "l": "СБ. Беларусь сегодня (sb.by)", "u": "https://www.sb.by/articles/nikogda-ne-zabudem58642.html"},
 "images/places/borki-tour-1.jpg": {"a": "", "l": "СБ. Беларусь сегодня (sb.by)", "u": "https://www.sb.by/articles/borki-nikogda-ne-zabudem.html"},
 "images/places/usakino-cover.jpg": {"a": "", "l": "probelarus.by", "u": "https://probelarus.by/belarus/sight/voennaya-istoriya/1496928730.html"},
 "images/places/usakino-tour-1.jpg": {"a": "", "l": "strada.by", "u": "https://strada.by/story/memorialnyi-kompleks-usakino"},
 "images/archive/bagration-1944-preparation.jpg": {
  "a": "",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%BA%D0%B0_%D0%91%D0%B5%D0%BB%D0%BE%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B9_%D0%BD%D0%B0%D1%81%D1%82%D1%83%D0%BF%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9_%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.jpg"
 },
 "images/archive/grodno-1944-liberation.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:19440717_creation_city_command_grodno.jpg"
 },
 "images/archive/lenino-1943-battle.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:LWP_003_Lenino.JPG"
 },
 "images/archive/lenino-1943-division.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Polish_1st_Infantry_Division_(1943).jpg"
 },
 "images/archive/ozarichi-1944-brothers.jpg": {
  "a": "Евгений Подшивалов",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D1%80%D0%B0%D1%82%D1%8C%D1%8F-%D1%81%D0%B8%D1%80%D0%BE%D1%82%D1%8B_%D0%9C%D0%BE%D0%B8%D1%81%D0%B5%D0%B9_11_%D0%BB%D0%B5%D1%82_%D0%B8_%D0%93%D1%80%D0%B8%D1%88%D0%B0_9_%D0%BB%D0%B5%D1%82_%D0%91%D0%B5%D0%BB%D1%8F%D0%BA%D0%BE%D0%B2%D1%8B.jpg"
 },
 "images/archive/ozarichi-1944-sick.jpg": {
  "a": "Semyon Vladimirovich Alperin",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5_%D0%B2_%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B8_%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D1%8B_%D0%B4%D0%BB%D1%8F_%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8_%D0%B2_%D0%B3%D0%BE%D1%81%D0%BF%D0%B8%D1%82%D0%B0%D0%BB%D1%8C._%D0%9A%D0%BE%D0%BD%D1%86%D0%BB%D0%B0%D0%B3%D0%B5%D1%80%D1%8C_%D0%9E%D0%B7%D0%B0%D1%80%D0%B8%D1%87%D0%B8.jpg"
 },
 "images/archive/ozarichi-1944-vera.jpg": {
  "a": "Semyon Vladimirovich Alperin",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B5%D1%80%D0%B0_%D0%9A%D1%83%D1%80%D1%8C%D1%8F%D0%BD._%D0%A4%D0%BE%D1%82%D0%BE_%D0%A1%D0%B5%D0%BC%D0%B5%D0%BD_%D0%90%D0%BB%D1%8C%D0%BF%D0%B5%D1%80%D0%B8%D0%BD.jpg"
 },
 "images/archive/proryv-1944-map.jpg": {
  "a": "История Белоруссии - материалы в широком доступе",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B1%D0%B0%D1%80%D0%BE%D0%BD%D0%B0_%D0%9F%D0%BE%D0%BB%D0%B0%D1%86%D0%BA%D0%BE-%D0%9B%D0%B5%D0%BF%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D0%B9_%D0%BF%D0%B0%D1%80%D1%82%D1%8B%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%BE%D0%B9_%D0%B7%D0%BE%D0%BD%D1%8B.jpg"
 },
 "images/archive/shmyrev-headquarters-painting.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%BB%D1%8F%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%9C%D0%B0%D0%B7%D0%B0%D0%BB%D1%91%D1%9E._%D0%A3_%D1%88%D1%82%D0%B0%D0%B1%D0%B5_%D0%B1%D0%B0%D1%86%D1%8C%D0%BA%D1%96_%D0%9C%D1%96%D0%BD%D0%B0%D1%8F_(1953).jpg"
 },
 "images/archive/vitebsk-1944-capitulation.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:1944_kapitulation_witebsk_vasilevsky_chernyakovski_gollwitzer.jpg"
 },
 "images/places/brest-cover.jpg": {
  "a": "Alexxx Malev",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Brest_Fortress_Monument_Courage_(250373281).jpeg"
 },
 "images/places/brest-tour-1.jpg": {
  "a": "Mike1979 Russia",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Brest_Fortress_Monument_of_Courage_2023-02-18_2760.jpg"
 },
 "images/places/brest-tour-2.jpg": {
  "a": "tiger rus",
  "l": "CC BY 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D1%80%D0%B5%D1%81%D1%82%D1%81%D0%BA%D0%B0%D1%8F_%D0%BA%D1%80%D0%B5%D0%BF%D0%BE%D1%81%D1%82%D1%8C_-_%D1%81%D0%BA%D1%83%D0%BB%D1%8C%D0%BF%D1%82%D1%83%D1%80%D0%B0_%22%D0%96%D0%B0%D0%B6%D0%B4%D0%B0%22_-_panoramio.jpg"
 },
 "images/places/brest-tour-3.jpg": {
  "a": "Nakonana",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Eternal_flame_of_the_Monument_of_Courage_in_Brest_Fortress.jpg"
 },
 "images/places/brest-tour-4.jpg": {
  "a": "Adam Jones from Kelowna, BC, Canada",
  "l": "CC BY-SA 2.0",
  "u": "https://commons.wikimedia.org/wiki/File:Rear_View_of_Courage_Monument_-_Brest_Fortress_-_Brest_-_Belarus_-_02_(27145713590).jpg"
 },
 "images/places/brest-tour-5.jpg": {
  "a": "Mike1979 Russia",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Brest_Fortress_Che%C5%82m_Gate_2023-02-18_2797.jpg"
 },
 "images/places/brest-tour-6.jpg": {
  "a": "Mike1979 Russia",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Brest_Fortress_Terespol_Gate_2024-09-19_3777.jpg"
 },
 "images/places/bronnaya-cover.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Bronnaya_Gora_monument_to_about_50000_Jews_1b.jpg"
 },
 "images/places/buynichi-cover.jpg": {
  "a": "Yuriy Tim",
  "l": "CC BY 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%BE%D1%80%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%22%D0%91%D1%83%D0%B9%D0%BD%D0%B8%D1%87%D1%81%D0%BA%D0%BE%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5%22_%D0%BC%D0%B5%D1%81%D1%82%D0%BE_%D0%B1%D0%BE%D0%B5%D0%B2_1941_%D0%B3._-_panoramio_-_Yuriy_Tim_(7).jpg"
 },
 "images/places/buynichi-tour-1.jpg": {
  "a": "Андрей Перцев 1967",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D1%83%D0%B9%D0%BD%D0%B8%D1%87%D1%81%D0%BA%D0%BE%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5.jpg"
 },
 "images/places/buynichi-tour-2.jpg": {
  "a": "Сугакевіч А.Г.",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D1%83%D0%B9%D0%BD%D0%B8%D1%87%D1%81%D0%BA%D0%BE%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5_%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA.JPG"
 },
 "images/places/buynichi-tour-3.jpg": {
  "a": "Yuriy Tim",
  "l": "CC BY 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%BE%D1%80%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%22%D0%91%D1%83%D0%B9%D0%BD%D0%B8%D1%87%D1%81%D0%BA%D0%BE%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5%22_%D0%BC%D0%B5%D1%81%D1%82%D0%BE_%D0%B1%D0%BE%D0%B5%D0%B2_1941_%D0%B3._-_panoramio.jpg"
 },
 "images/places/buynichi-tour-4.jpg": {
  "a": "Yuriy Tim",
  "l": "CC BY 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%BE%D1%80%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%22%D0%91%D1%83%D0%B9%D0%BD%D0%B8%D1%87%D1%81%D0%BA%D0%BE%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5%22_%D0%BC%D0%B5%D1%81%D1%82%D0%BE_%D0%B1%D0%BE%D0%B5%D0%B2_1941_%D0%B3._-_panoramio_-_Yuriy_Tim_(2).jpg"
 },
 "images/places/dalva-cover.jpg": {
  "a": "Aschroet",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Memorial_Complex_Dalva_13.jpg"
 },
 "images/places/dalva-tour-1.jpg": {
  "a": "Aschroet",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Memorial_Complex_Dalva_14.jpg"
 },
 "images/places/dalva-tour-2.jpg": {
  "a": "Aschroet",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Memorial_Complex_Dalva_6.jpg"
 },
 "images/places/dalva-tour-3.jpg": {
  "a": "Aschroet",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Memorial_Complex_Dalva_11.jpg"
 },
 "images/places/dalva-tour-4.jpg": {
  "a": "Aschroet",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Memorial_Complex_Dalva.jpg"
 },
 "images/places/fort2-cover.jpg": {
  "a": "Raviaka Ruslan",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Horadnia-_fort_2_1.JPG"
 },
 "images/places/fort2-tour-1.jpg": {
  "a": "Vit Koz",
  "l": "CC BY 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Fortifications_of_Grodno_fortress_88.jpg"
 },
 "images/heroes/bagramyan.jpg": {
  "a": "",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D0%B0%D0%B3%D1%80%D0%B0%D0%BC%D1%8F%D0%BD_%D0%98%D0%B2%D0%B0%D0%BD_%D0%A5%D1%80%D0%B8%D1%81%D1%82%D0%BE%D1%84%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D1%87.jpg"
 },
 "images/heroes/batov.jpg": {
  "a": "Министерство обороны Российской Федерации",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Pavel_Batov_1.jpg"
 },
 "images/heroes/berling.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Zygmunt_Berling.jpg"
 },
 "images/heroes/bielski.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Tuvia_Bielski.jpg"
 },
 "images/heroes/chernyakhovsky.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%98%D0%B2%D0%B0%D0%BD_%D0%A7%D0%B5%D1%80%D0%BD%D1%8F%D1%85%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_1943-01.jpg"
 },
 "images/heroes/flerov.jpg": {
  "a": "Министерство обороны Российской Федерации",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ivan_Andreyevich_Flyorov.jpg"
 },
 "images/heroes/fomin.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Fomin_Efim.jpg"
 },
 "images/heroes/gavrilov.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Gavrilov_Piotr.jpg"
 },
 "images/heroes/khoruzhaya.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Vera_Kharuzhaya_(1903_-1942).jpg"
 },
 "images/heroes/kizhevatov.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Kizhevatov_Andrei.jpg"
 },
 "images/heroes/masherov.jpg": {
  "a": "Communist Party of Belarus (BSSR)",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Masherov_Central_Committee_of_KPB.jpg"
 },
 "images/heroes/portnova.jpg": {
  "a": "Семенов А., Скотников В. / Издание министерства связи СССР",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Stamped_envelope_Zina_Portnova_1970.jpg"
 },
 "images/heroes/rokossovsky.jpg": {
  "a": "",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B0%D1%80%D1%88%D0%B0%D0%BB_%D0%A1%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%A1%D0%BE%D1%8E%D0%B7%D0%B0_%D0%B4%D0%B2%D0%B0%D0%B6%D0%B4%D1%8B_%D0%93%D0%B5%D1%80%D0%BE%D0%B9_%D0%A1%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%A1%D0%BE%D1%8E%D0%B7%D0%B0_%D0%9A%D0%BE%D0%BD%D1%81%D1%82%D0%B0%D0%BD%D1%82%D0%B8%D0%BD_%D0%9A%D0%BE%D0%BD%D1%81%D1%82%D0%B0%D0%BD%D1%82%D0%B8%D0%BD%D0%BE%D0%B2%D0%B8%D1%87_%D0%A0%D0%BE%D0%BA%D0%BE%D1%81%D1%81%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9.jpg"
 },
 "images/heroes/romanov.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Romanov_Mihail.jpg"
 },
 "images/heroes/shmyrev.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:1967_CPA_3487.jpg"
 },
 "images/heroes/simonov.jpg": {
  "a": "Григорий Михайлович Вайль",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%BE%D0%BD%D1%81%D1%82%D0%B0%D0%BD%D1%82%D0%B8%D0%BD_%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%B8%D1%87_%D0%A1%D0%B8%D0%BC%D0%BE%D0%BD%D0%BE%D0%B2.jpg"
 },
 "images/heroes/zakharov.jpg": {
  "a": "",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Georgy_Zakharov.jpg"
 },
 "images/heroes/zaslonov.jpg": {
  "a": "Uladzimir Chrustalioŭ",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B0%D0%BD%D1%81%D1%82%D0%B0%D0%BD%D1%86%D1%96%D0%BD_%D0%97%D0%B0%D1%81%D0%BB%D0%BE%D0%BD%D0%B0%D1%9E_%D0%B4%D0%B0%D0%B5_%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D0%B5.jpg"
 },
 "images/heroes/zubachev.jpg": {
  "a": "",
  "l": "Public domain",
  "u": "https://commons.wikimedia.org/wiki/File:Zubachev.jpg"
 },
 "images/places/katyusha-cover.jpg": {
  "a": "Mikra72",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Katyusha_in_Orsha_-_002.jpg"
 },
 "images/places/katyusha-tour-1.jpg": {
  "a": "Mikra72",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Katyusha_in_Orsha_-_001.jpg"
 },
 "images/places/katyusha-tour-2.jpg": {
  "a": "Mikra72",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Katyusha_in_Orsha_-_006.jpg"
 },
 "images/places/katyusha-tour-3.jpg": {
  "a": "Mikra72",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Katyusha_in_Orsha_-_024.jpg"
 },
 "images/places/khatyn-cover.jpg": {
  "a": "Aschroet",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Khatyn,_Belarus_5.jpg"
 },
 "images/places/khatyn-tour-1.jpg": {
  "a": "Joakim Berndes",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Khatyn_Memorial_in_Belarus-2228.jpg"
 },
 "images/places/khatyn-tour-2.jpg": {
  "a": "Dave Proffer",
  "l": "CC BY 2.0",
  "u": "https://commons.wikimedia.org/wiki/File:Belarus,_Khatyn_(3942250099).jpg"
 },
 "images/places/khatyn-tour-3.jpg": {
  "a": "Joakim Berndes",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Khatyn_Memorial_in_Belarus-2254.jpg"
 },
 "images/places/khatyn-tour-4.jpg": {
  "a": "Joakim Berndes",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Khatyn_Memorial_in_Belarus-2246.jpg"
 },
 "images/places/khatyn-tour-5.jpg": {
  "a": "Joakim Berndes",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Khatyn_Memorial_in_Belarus-2261.jpg"
 },
 "images/places/khatyn-tour-6.jpg": {
  "a": "Joakim Berndes",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Khatyn_Memorial_in_Belarus-2264.jpg"
 },
 "images/places/koldychevo-cover.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Holocaust_in_Koldychevo_1d.jpg"
 },
 "images/places/koldychevo-tour-1.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Holocaust_in_Koldychevo_1a.jpg"
 },
 "images/places/koldychevo-tour-2.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Holocaust_in_Koldychevo_1b.jpg"
 },
 "images/places/krbereg-cover.jpg": {
  "a": "Стельмах Александр Николаевич (Алекс Сталь)",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9_%D0%91%D0%B5%D1%80%D0%B5%D0%B3._%D0%9C%D0%B5%D0%BC%D0%BE%D1%80%D0%B8%D0%B0%D0%BB_%D0%B4%D0%B5%D1%82%D1%8F%D0%BC.jpg"
 },
 "images/places/krbereg-tour-1.jpg": {
  "a": "ChronoFact",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Maxim-Piatrul-krasnyi-bereg-2007.jpg"
 },
 "images/places/krbereg-tour-2.jpg": {
  "a": "ChronoFact",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Maxim-Piatrul-kotik-krasnyi-bereg-2007.jpg"
 },
 "images/places/krbereg-tour-3.jpg": {
  "a": "Andrey Kukharenko",
  "l": "CC BY 2.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%B4%D0%B5%D1%82%D1%8F%D0%BC_%E2%80%94_%D0%B6%D0%B5%D1%80%D1%82%D0%B2%D0%B0%D0%BC_%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B9_%D0%9E%D1%82%D0%B5%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9_%D0%B2%D0%BE%D0%B9%D0%BD%D1%8B_%D0%B2_%D0%B4%D0%B5%D1%80._%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9_%D0%91%D0%B5%D1%80%D0%B5%D0%B3._%D0%92%D0%B8%D0%B4_%D1%81_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%85%D0%B0_DJI_2042-HDR_(51323144024).jpg"
 },
 "images/places/kurgan-cover.jpg": {
  "a": "Совет Федерации",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Meropriiatiia_kulturno-obrazovatelnogo_proekta_11.jpg"
 },
 "images/places/kurgan-tour-1.jpg": {
  "a": "Andrej Kuźniečyk",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Glory_Mound_-_panoramio_-_Andrej_Ku%C5%BAnie%C4%8Dyk.jpg"
 },
 "images/places/kurgan-tour-2.jpg": {
  "a": "Adam Jones from Kelowna, BC, Canada",
  "l": "CC BY-SA 2.0",
  "u": "https://commons.wikimedia.org/wiki/File:Detail_of_Mount_of_Glory_-_World_War_Two_Memorial_-_Near_Minsk_-_Belarus_(27305232380).jpg"
 },
 "images/places/kurgan-tour-3.jpg": {
  "a": "Anastasiya Lvova",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:IS-2_at_Mound_of_Glory.JPG"
 },
 "images/places/lenino-cover.jpg": {
  "a": "Валацуга",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9B%D0%B5%D0%BD%D1%96%D0%BD%D0%B0._%D0%9C%D1%83%D0%B7%D0%B5%D0%B9_%D1%81%D0%B0%D0%B2%D0%B5%D1%86%D0%BA%D0%B0-%D0%BF%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D0%B9_%D0%B1%D0%B0%D1%8F%D0%B2%D0%BE%D0%B9_%D1%81%D0%B0%D0%B4%D1%80%D1%83%D0%B6%D0%BD%D0%B0%D1%81%D1%86%D1%96_(3).jpg"
 },
 "images/places/lenino-tour-1.jpg": {
  "a": "Валацуга",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9B%D0%B5%D0%BD%D1%96%D0%BD%D0%B0._%D0%9C%D1%83%D0%B7%D0%B5%D0%B9_%D1%81%D0%B0%D0%B2%D0%B5%D1%86%D0%BA%D0%B0-%D0%BF%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D0%B9_%D0%B1%D0%B0%D1%8F%D0%B2%D0%BE%D0%B9_%D1%81%D0%B0%D0%B4%D1%80%D1%83%D0%B6%D0%BD%D0%B0%D1%81%D1%86%D1%96_(2).jpg"
 },
 "images/places/lenino-tour-2.jpg": {
  "a": "Валацуга",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9B%D0%B5%D0%BD%D1%96%D0%BD%D0%B0._%D0%9C%D1%83%D0%B7%D0%B5%D0%B9_%D1%81%D0%B0%D0%B2%D0%B5%D1%86%D0%BA%D0%B0-%D0%BF%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D0%B9_%D0%B1%D0%B0%D1%8F%D0%B2%D0%BE%D0%B9_%D1%81%D0%B0%D0%B4%D1%80%D1%83%D0%B6%D0%BD%D0%B0%D1%81%D1%86%D1%96_(1).jpg"
 },
 "images/places/lenino-tour-3.jpg": {
  "a": "Frotto",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Plyta1.jpg"
 },
 "images/places/litavets-cover.jpg": {
  "a": "Aneuko",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Litaviec_bas-relief.jpg"
 },
 "images/places/litavets-tour-1.jpg": {
  "a": "Etažy",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Bas-relief_in_Litaviec.jpg"
 },
 "images/places/litavets-tour-2.jpg": {
  "a": "Etažy",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Litaviec_(3).jpg"
 },
 "images/places/litavets-tour-3.jpg": {
  "a": "Etažy",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Litaviec.jpg"
 },
 "images/places/ludchitsy-cover.jpg": {
  "a": "AlexVinnichenko",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D0%B0%D1%80%D0%B5%D0%BB%D1%8C%D0%B5%D1%84_%D0%9F%D0%B5%D1%82%D1%80%D0%B0_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87%D0%B0_%D0%92%D0%B8%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%BA%D0%BE.jpg"
 },
 "images/places/ludchitsy-tour-1.jpg": {
  "a": "Валацуга",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9B%D1%83%D0%B4%D1%87%D1%8B%D1%86%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_%D0%92%D0%BE%D1%96%D0%BD%D1%81%D0%BA%D0%B0%D0%B9_%D0%A1%D0%BB%D0%B0%D0%B2%D1%8B_(1).jpg"
 },
 "images/places/ludchitsy-tour-2.jpg": {
  "a": "Валацуга",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9B%D1%83%D0%B4%D1%87%D1%8B%D1%86%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_%D0%92%D0%BE%D1%96%D0%BD%D1%81%D0%BA%D0%B0%D0%B9_%D0%A1%D0%BB%D0%B0%D0%B2%D1%8B_(2).jpg"
 },
 "images/places/novogrudok-cover.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Navahrudak_Ghetto_2c.jpg"
 },
 "images/places/novogrudok-tour-1.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Navahrudak_Ghetto_1a.jpg"
 },
 "images/places/novogrudok-tour-2.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Navahrudak_Ghetto_5c.jpg"
 },
 "images/places/novogrudok-tour-3.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Navahrudak_Ghetto_4a.jpg"
 },
 "images/places/novogrudok-tour-4.jpg": {
  "a": "Avner",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Navahrudak_Ghetto_3a.jpg"
 },
 "images/places/ola-cover.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ala,_Svietlahorsk_District_(1).jpg"
 },
 "images/places/ola-tour-1.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ala,_Svietlahorsk_District_(2).jpg"
 },
 "images/places/ola-tour-2.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ala,_Svietlahorsk_District_(3).jpg"
 },
 "images/places/ola-tour-3.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ala,_Svietlahorsk_District_(5).jpg"
 },
 "images/places/ola-tour-4.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ala,_Svietlahorsk_District_(6).jpg"
 },
 "images/places/ola-tour-5.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ala,_Svietlahorsk_District_(7).jpg"
 },
 "images/places/ozarichi-cover.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B7%D0%B0%D1%80%D1%8B%D1%87%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_(03).jpg"
 },
 "images/places/ozarichi-tour-1.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B7%D0%B0%D1%80%D1%8B%D1%87%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_(05).jpg"
 },
 "images/places/ozarichi-tour-2.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B7%D0%B0%D1%80%D1%8B%D1%87%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_(02).jpg"
 },
 "images/places/ozarichi-tour-3.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B7%D0%B0%D1%80%D1%8B%D1%87%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_(07).jpg"
 },
 "images/places/ozarichi-tour-4.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B7%D0%B0%D1%80%D1%8B%D1%87%D1%8B._%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB_(09).jpg"
 },
 "images/places/proryv-cover.jpg": {
  "a": "Dr.mabuse",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:%22%D0%9F%D1%80%D0%BE%D1%80%D1%8B%D0%B2%22.jpg"
 },
 "images/places/proryv-tour-1.jpg": {
  "a": "Dzianis Niadbajla",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%9F%D1%80%D0%B0%D1%80%D1%8B%D1%9E.jpg"
 },
 "images/places/proryv-tour-2.jpg": {
  "a": "Иван Бай",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ushachy_District,_Belarus_-_panoramio.jpg"
 },
 "images/places/proryv-tour-3.jpg": {
  "a": "Иван Бай",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ushachy_District,_Belarus_-_panoramio_(2).jpg"
 },
 "images/places/proryv-tour-4.jpg": {
  "a": "Иван Бай",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Ushachy_District,_Belarus_-_panoramio_(3).jpg"
 },
 "images/places/shunevka-cover.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%C5%A0unie%C5%ADka_memorial_(01).jpg"
 },
 "images/places/shunevka-tour-1.jpg": {
  "a": "Zelyoniy.anton",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%C5%A0unie%C5%ADka_map.jpg"
 },
 "images/places/shunevka-tour-2.jpg": {
  "a": "Globustut",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:026-074_%D0%A8%D1%83%D0%BD%D0%B5%D0%B2%D0%BA%D0%B0,_02-11-2004.jpg"
 },
 "images/places/shunevka-tour-3.jpg": {
  "a": "Globustut",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:026-072_%D0%A8%D1%83%D0%BD%D0%B5%D0%B2%D0%BA%D0%B0,_02-11-2004.jpg"
 },
 "images/places/shunevka-tour-4.jpg": {
  "a": "Andrej Kuźniečyk",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:WW2_Memorial_%C2%AB%C5%A0unie%C5%ADka%C2%BB_at_the_place_of_scorched_village_-_panoramio_-_Andrej_Ku%C5%BAnie%C4%8Dyk_(7).jpg"
 },
 "images/places/vitebsk3-cover.jpg": {
  "a": "Fr0nt",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:Monument_-_panoramio.jpg"
 },
 "images/places/vitebsk3-tour-1.jpg": {
  "a": "Globustut",
  "l": "CC BY 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:060-0805_%D0%92%D0%B8%D1%82%D0%B5%D0%B1%D1%81%D0%BA,_%D0%BC%D0%B5%D0%BC%D0%BE%D1%80%D0%B8%D0%B0%D0%BB_%D0%92%D0%9E%D0%B2_(%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9),_%D1%81%D0%BD%D1%8F%D1%82%D0%BE_25_%D0%B8%D1%8E%D0%BD%D1%8F_2005.jpg"
 },
 "images/places/vitebsk3-tour-2.jpg": {
  "a": "Sowbew",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Denkmal_der_Helden_des_Gro%C3%9Fen_Vaterl%C3%A4ndischen_Krieges_in_Witebsk,_Belarus_-_1.jpg"
 },
 "images/places/vitebsk3-tour-3.jpg": {
  "a": "Sowbew",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:Denkmal_der_Helden_des_Gro%C3%9Fen_Vaterl%C3%A4ndischen_Krieges_in_Witebsk,_Belarus_-_2.jpg"
 },
 "images/places/vitebsk3-tour-4.jpg": {
  "a": "Mikra72",
  "l": "CC0",
  "u": "https://commons.wikimedia.org/wiki/File:Memorial_complex_on_Victory_Square_in_Vitebsk_-_001.jpg"
 },
 "images/places/zditovo-cover.jpg": {
  "a": "Савіцкая Т.В. zditovo_sav",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB%D1%8C%D0%BD%D1%8B_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%97%D0%B4%D0%B7%D1%96%D1%82%D0%B0%D1%9E%D1%81%D0%BA%D0%B0%D1%8F_%D0%B0%D0%B1%D0%B0%D1%80%D0%BE%D0%BD%D0%B0.jpg"
 },
 "images/places/zditovo-tour-1.jpg": {
  "a": "Савіцкая Т.В. zditovo_sav",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB%D1%8C%D0%BD%D1%8B_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%97%D0%B4%D0%B7%D1%96%D1%82%D0%B0%D1%9E%D1%81%D0%BA%D0%B0%D1%8F_%D0%B0%D0%B1%D0%B0%D1%80%D0%BE%D0%BD%D0%B0_3.jpg"
 },
 "images/places/zditovo-tour-2.jpg": {
  "a": "Савіцкая Т.В. zditovo_sav",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B5%D0%BC%D0%B0%D1%80%D1%8B%D1%8F%D0%BB%D1%8C%D0%BD%D1%8B_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%97%D0%B4%D0%B7%D1%96%D1%82%D0%B0%D1%9E%D1%81%D0%BA%D0%B0%D1%8F_%D0%B0%D0%B1%D0%B0%D1%80%D0%BE%D0%BD%D0%B0_2.jpg"
 },
 "images/places/zhiliber-cover.jpg": {
  "a": "Samotny Wędrowiec",
  "l": "CC BY-SA 4.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D1%81%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%BC_%D0%B2%D0%BE%D0%B8%D0%BD%D0%B0%D0%BC_%D0%B8_%D0%BF%D0%B0%D1%80%D1%82%D0%B8%D0%B7%D0%B0%D0%BD%D0%B0%D0%BC_%D0%B2_%D0%93%D1%80%D0%BE%D0%B4%D0%BD%D0%BE.jpg"
 },
 "images/places/zhiliber-tour-1.jpg": {
  "a": "Шатилло Г.В.",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D1%80%D0%B0%D1%82%D1%81%D0%BA%D0%B0%D1%8F_%D0%BC%D0%BE%D0%B3%D0%B8%D0%BB%D0%B0_%D0%93%D1%80%D0%BE%D0%B4%D0%BD%D0%BE_01.JPG"
 },
 "images/places/zhiliber-tour-2.jpg": {
  "a": "Шатилло Г.В.",
  "l": "CC BY-SA 3.0",
  "u": "https://commons.wikimedia.org/wiki/File:%D0%91%D1%80%D0%B0%D1%82%D1%81%D0%BA%D0%B0%D1%8F_%D0%BC%D0%BE%D0%B3%D0%B8%D0%BB%D0%B0_%D0%93%D1%80%D0%BE%D0%B4%D0%BD%D0%BE_02.JPG"
 }
};
