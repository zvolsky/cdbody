// TODO: setTimeout rekurzivni, momentalne vypnut
// TODO: <br> chybí nefungují?


'use strict';

let mapaUrlBase = 'https://mapy.cz/turisticka';   // https://mapy.cz/turisticka?q=Lhota
let pocasiUrlBase = 'https://www.yr.no';          // https://www.yr.no/soek/soek.aspx?sted=Lhota
let googleUrlBase = 'https://www.google.com/search?q=';
let airbnbUrlBase = 'https://www.airbnb.com';
let bookingUrlBase = 'https://www.booking.com';
let mhdUrlBase1 = 'https://jizdnirady.idnes.cz/';
let mhdUrlBase2 = '/spojeni/';
let mapaQ = '';
let pocasiQ = '';
let tit2 = "není zjištěn cíl cesty";

let mhdMap = new Map([
['adamov',''],
['aš','as'],
['benešov','benesov'],
['beroun',''],
['bílina','bilina'],
['blansko',''],
['brandýs n.l.-st.bol.','pid'],  // nebo: brandys
['brandýs nad labem-stará boleslav','pid'],
['brandýs n.l. - st.bol.','pid'],
['brandýs nad labem - stará boleslav','pid'],
['stará boleslav','pid'],
['brno',''],
['bruntál','bruntal'],
['břeclav','breclav'],
['bystřice nad pernštejnem','bystrice'],
['čáslav','caslav'],
['česká lípa','ceskalipa'],
['české budějovice','ceskebudejovice'],
['český krumlov','ceskykrumlov'],
['český těšín','ceskytesin'],
['dačice','dacice'],
['děčín','decin'],
['domažlice','domazlice'],
['duchcov',''],
['dvůr králové','dvurkralove'],
['dvůr králové n.l.','dvurkralove'],
['dvůr králové n. l.','dvurkralove'],
['frýdek-místek','frydekmistek'],
['frýdek - místek','frydekmistek'],
['havířov','havirov'],
['havlíčkův brod','havlickuvbrod'],
['hodonín','hodonin'],
['hradec králové','hradeckralove'],
['hranice',''],
['hranice na morave','hranice'],
['hustopeče','hustopece'],
['cheb',''],
['chomutov',''],
['chrudim',''],
['jablonec nad nisou','jablonec'],
['jáchymov','jachymov'],
['jičín','jicin'],
['jihlava',''],
['jindřichův hradec','jindrichuvhradec'],
['kadaň','kadan'],
['karlovy vary','karlovyvary'],
['karviná','karvina'],
['kladno','pid'],
['klášterec nad ohří','klasterecnadohri'],
['klatovy',''],
['kolín','kolin'],
['kostelec nad orlicí','kostelecnadorlici'],
['kralupy nad vltavou','pid'],
['krnov',''],
['kroměříž','kromeriz'],
['kutná Hora','kutnahora'],
['kyjov',''],
['liberec',''],
['litoměřice','litomerice'],
['litomyšl','litomysl'],
['louny',''],
['lovosice',''],
['mariánské lázně','marianskelazne'],
['milevsko',''],
['mladá boleslav','mladaboleslav'],
['mníšek pod brdy','pid'],
['moravská třebová','moravskatrebova'],
['most',''],
['litvínov','most'],
['náchod','nachod'],
['nové město na moravě','novemestonamorave'],
['nový jičín','novyjicin'],
['olomouc',''],
['opava',''],
['orlová','orlova'],
['ostrava',''],
['ostrov',''],
['ostrov nad ohří','ostrov'],
['pardubice',''],
['pelhřimov','pelhrimov'],
['písek','pisek'],
['plzeň','plzen'],
['polička','policka'],
['praha','pid'],
['prostějov','prostejov'],
['přelouč','prelouc'],
['přerov','prerov'],
['přeštice','prestice'],
['příbram','pid'],
['rokycany',''],
['roudnice nad labem','roudnice'],
['rychnov nad Kněžnou','rychnov'],
['říčany','ricany'],
['slaný','slany'],
['sokolov',''],
['strakonice',''],
['stříbro','stribro'],
['studénka','studenka'],
['spindlerův mlýn','spindleruvmlyn'],
['štětí','steti'],
['šumperk','sumperk'],
['tábor','tabor'],
['tachov',''],
['teplice',''],
['trutnov',''],
['třebíč','trebic'],
['třinec','trinec'],
['turnov',''],
['týniště nad orlicí','tynistenadorlici'],
['uherské hradiště','uherskehradiste'],
['ústí nad labem','ustinadlabem'],
['ústí nad orlicí','ustinadorlici'],
['valašské meziříčí','valasskemezirici'],
['varnsdorf',''],
['velké meziříčí','velkemezirici'],
['vimperk',''],
['vlašim','vlasim'],
['vrchlabí','vrchlabi'],
['vsetín','vsetin'],
['vyškov','vyskov'],
['zábřeh','zabreh'],
['zlín',''],
['otrokovice','zlin'],
['znojmo',''],
['žamberk','zamberk'],
['žatec','zatec'],
['žďár nad sázavou','zdarnadsazavou']
]);

function stripSfx(q, sfx) {
    if ((q.indexOf(sfx) + sfx.length) === q.length) {
        return q.substr(0, q.length - sfx.length);
    }
    return q;
}

function fixHref(query) {
    query = query.replace(' - AN', ', autobusové nádraží');  // AN: regiojet
    document.getElementById('mapaBtn').setAttribute('href', mapaUrlBase + (query ? ('?q=' + query) : ''));
    document.getElementById('mapaBtn').setAttribute('title', query ? query : tit2);
    if (query) {
        query = stripSfx(query, ' hl.n.');
        query = stripSfx(query, ' zast.');
        //query = stripSfx(query, ' z.');    // bug ???
        if (query.indexOf(' z.') > 0) {query = query.substr(0, query.length - 3);}
        //if ((query.indexOf(' z.') + ' z.'.length) === query.length) {query = query.substr(0, query.length - 3)}
        query = stripSfx(query, ' město');
        query = stripSfx(query, ' předm.');
        query = stripSfx(query, ', autobusové nádraží');
        //query = stripSfx(query, ', žel. st.');    // bug ???
        if (query.indexOf(', žel. st.') > 0) {query = query.substr(0, query.length - 10);}
    }
console.log(query);
    document.getElementById('pocasiBtn').setAttribute('href', pocasiUrlBase + (query ? ('/soek/soek.aspx?sted=' + query) : ''));
    document.getElementById('pocasiBtn').setAttribute('title', query ? query : tit2);

    let mhd = mhdMap.get(query.toLowerCase())
    if (mhd === '') {  // není potřeba kopírovat v hmdMap identické
        mhd = query;
    }
    if (!mhd) {
        mhd = 'pid';
    }
    document.getElementById('mhdBtn').setAttribute('href', mhdUrlBase1 + mhd + mhdUrlBase2);
    document.getElementById('mhdBtn').setAttribute('title', mhd === 'pid' ? "Pražská integrovaná doprava" : ('MHD: ' + query));
    document.getElementById('taxiBtn').setAttribute('href', googleUrlBase + 'taxi' + (query ? ('+' + query) : ''));
    document.getElementById('taxiBtn').setAttribute('title', query ? 'taxi: ' + query : tit2);

    document.getElementById('ubytovaniBtn').setAttribute('href', googleUrlBase + 'ubytování+accommodation' + (query ? ('+' + query) : ''));
    document.getElementById('ubytovaniBtn').setAttribute('title', query ? 'ubytování: ' + query : tit2);
    document.getElementById('airbnbBtn').setAttribute('href', airbnbUrlBase + (query ? ('/s/' + query) : ''));
    document.getElementById('airbnbBtn').setAttribute('title', query ? 'airbnb: ' + query : tit2);
    document.getElementById('bookingBtn').setAttribute('href', bookingUrlBase + (query ? ('/searchresults.cs.html?ss=' + query) : ''));
    document.getElementById('bookingBtn').setAttribute('title', query ? 'booking: ' + query : tit2);

    document.getElementById('googleBtn').setAttribute('href', googleUrlBase + (query ? query : ''));
    document.getElementById('googleBtn').setAttribute('title', query ? 'najdi na Google: ' + query : tit2);
}
fixHref('');

// ******************************************************************************

let body_title = '<b>' + "Zjištění expirace bodů:" + '</b><br>';

// var: nelze let.., protože kód běží znova po opakovaném vyvolání rozšíření bez restartu stránky (a let.. nelze uzavřít do if(){...} )
let initCode = `
    var cdB_title = "` + body_title + `";
    var cdB_initMe = true;
    var cdB_url = 'cd.cz/profil-uzivatele/cdbody/detail';
    var cdB_retArr = {res: cdB_title + 'Je potřeba být přihlášen a přejít na první stránku seznamu bodů'
        + '<br><i>' + '(proklikem jména, Spravovat mé služby, Můj věrnostní program, Detail)' + '</i>.', done: true};

    // **************************************************************************
    cdB_retArr.url = new URL(window.location.href);
    cdB_retArr.host = cdB_retArr.url.hostname;
    cdB_retArr.q = '';
    cdB_retArr.razeni = [];
    function cdB_getQ() {
        if (cdB_retArr.url.hostname === "www.cd.cz") {
            if (cdB_retArr.url.pathname === '/default.htm') {
                cdB_retArr.q = document.getElementById('connectionsearchbox-hp-o').getElementsByTagName('input')[3].value;
            } else if (cdB_retArr.url.pathname.indexOf('/spojeni') >= 0) {  // /eshop/spojeni- i /spojeni-a-jizdenka
                let cdB_tmp = document.getElementById('connectionlistanchor');
                if (cdB_tmp) {
                    cdB_retArr.q = cdB_tmp.getElementsByClassName('res-cityname')[3].getElementsByTagName('a')[0].text;
                    // ************************************************************** řazení
                    cdB_tmp = cdB_tmp.getElementsByClassName('result-col1');
                    for (let cdB_i = 0; cdB_i < cdB_tmp.length; cdB_i++) {
                        let cdB_tmp2 = cdB_tmp[cdB_i].getElementsByClassName('rc2');
                        let cdB_prvni = true;
                        for (let cdB_j = 0; cdB_j < cdB_tmp2.length; cdB_j++) {
                            let cdB_tmp3 = cdB_tmp2[cdB_j].getElementsByClassName('res-infextra');
                            if (cdB_tmp3.length > 0) {    // poslední (příjezdový) řádek totiž číslo vlaku nemá
                                let cdB_time = cdB_tmp2[cdB_j].getElementsByClassName('res-time');
                                if (cdB_time.length > 0) {   // hlavní odjezd
                                    cdB_time = cdB_time[0].innerText;
                                } else {                     // odjezd na přestupu
                                    cdB_time = cdB_tmp2[cdB_j].getElementsByClassName('res-smalltimecommon')[0].getElementsByTagName('span')[1].childNodes[6].textContent;
                                }
                                cdB_retArr.razeni.push([cdB_prvni, cdB_time, cdB_tmp3[0].innerText]);
                                cdB_prvni = false;
                            };
                        }
                    }
                } else {  // /spojeni-a-jizdenka před vyhledáním -- stejné jako v eshopu  // TODO: optimizovat if/else?
                    cdB_retArr.q = document.getElementById('fromto').getElementsByTagName('input')[2].value;
                }
            } else if (cdB_retArr.url.pathname.indexOf('/eshop') === 0) {  // eshop před vyhledáním (po vyhledání obsahuje url i /spojeni..)
                cdB_retArr.q = document.getElementById('fromto').getElementsByTagName('input')[2].value;
            }
        } else if (cdB_retArr.url.hostname === "www.regiojet.cz") {
            cdB_retArr.q = document.getElementById('destination_to').value;
        } else if (cdB_retArr.url.hostname === "shop.regiojet.cz") {
            if (cdB_retArr.url.pathname.indexOf('/tickets') === 0) {       // seznam rezervací
                cdB_retArr.q = document.getElementById('page').getElementsByClassName('white-space-normal')[0].childNodes[2].textContent
            } else {                                                       // vyhledávání
                cdB_retArr.q = document.getElementById('connections-list').getElementsByClassName('cities')[0].childNodes[3].textContent;
            }
        } else if (cdB_retArr.url.hostname === "jizdenky.regiojet.cz") {
            if (cdB_retArr.url.pathname.indexOf('/Tickets') === 0) {       // seznam rezervací
                let cdB_tmp = document.getElementById('tickets').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                for (let cdB_i = cdB_tmp.length - 1; cdB_i >= 0; cdB_i--) {
                    if (cdB_tmp[cdB_i].textContent.indexOf('Platná') >= 0) {
                        cdB_tmp = cdB_tmp[cdB_i].getElementsByTagName('td')[4].innerText
                        cdB_retArr.q = cdB_tmp.substr(cdB_tmp.indexOf('→') + 2);
                        break;
                    }
                }
            } else {                                                      // vyhledávání
                cdB_retArr.q = document.getElementById('destination_to').value;
            }
        } else if (cdB_retArr.url.hostname === "jizdnirady.idnes.cz") {
            let cdB_tmp = document.getElementById('main-res-inner');
            if (cdB_tmp) {         // výsledky vyhledávání ?
                cdB_tmp = cdB_tmp.getElementsByTagName('h1');
                if (cdB_tmp.length >= 1) {
                    cdB_tmp = cdB_tmp[0].textContent;
                    cdB_retArr.q = cdB_tmp.substr(cdB_tmp.indexOf('» ') + 2);
                    // ********************************************************** řazení
                    cdB_tmp = document.getElementById('main-res-inner');
                    cdB_tmp = cdB_tmp.getElementsByTagName('tbody');
                    for (let cdB_i = 0; cdB_i < cdB_tmp.length; cdB_i++) {
                        let cdB_tmp2 = cdB_tmp[cdB_i].getElementsByClassName('datarow');
                        let cdB_prvni = true;
                        for (let cdB_j = 0; cdB_j < cdB_tmp2.length - 1; cdB_j++) {   // -1 : poslední řádek je příjezd
                            let cdB_tmp3 = cdB_tmp2[cdB_j].getElementsByTagName('td');
                            cdB_retArr.razeni.push([cdB_prvni, cdB_tmp3[4].innerText, cdB_tmp3[cdB_tmp3.length - 1].getElementsByTagName('a')[0].innerText]);
                                // .length-1 : číslo vlaku; před ním totiž je poznámka a v ní mohou být vnořená <td>, tj. poslední je např. [6] nebo [8]
                            cdB_prvni = false;
                        }
                    }
                }
            }
            if (!cdB_retArr.q) {   // s předchozím jsme se nechytli; tak snad jsme na zadávání (url se neliší)
                cdB_tmp = document.getElementById('main-form-inner');
                if (cdB_tmp) {
                    cdB_tmp = cdB_tmp.getElementsByClassName('inp-text');
                    if (cdB_tmp.length >= 2) {
                        cdB_retArr.q = cdB_tmp[1].value;
                    }
                }
            }
        }
    }
    try {
        cdB_getQ();
    } catch (err) {}
    // **************************************************************************
`;

let code = `

    if (typeof cdB_initMe !== "undefined" && cdB_initMe) {

        /* reference na button s atributem page=<pgAttr> */
        function cdB_getPgButton(pgAttr) {
            let pager = document.getElementById('loyaltyPager');
            if (pager) {
                let buttons = pager.getElementsByTagName('button')
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].getAttribute('page') === pgAttr) {
                        return buttons[i];
                    }
                }
            }
            return null;
        }

        function cdB_zpracuj_1(body) {
            let rows = document.getElementById('ltransactions').getElementsByTagName('tr');
            for (let i = 1; i < rows.length; i++) {    // i=1 .. jako první <tr> mají ČD totiž hlavičku
                let cells = rows[i].getElementsByTagName('td');
                let bd = parseInt(cells[3].innerHTML, 10);
                if (bd < 0 && cells[2].innerHTML.indexOf("Reklamace - ") === 0) {
                    continue;   // reklamace neprodlužuje platnost
                }
                body.push([cells[0].innerHTML, bd]);
            }
        }

        if (window.location.href.indexOf(cdB_url) > 0) {
            if (cdB_getPgButton('1')) {
                cdB_retArr = {res: '', pgNo: 2, body: [], host: 'www.cd.cz', done: false};
            } else {
                cdB_retArr = {res: cdB_title + 'Prosím, restartuj stránku (klikni do ní, pak F5), a opakuj.', host: 'www.cd.cz', done: true};
            }
        }

        cdB_initMe = false;
    }

    if (!cdB_retArr.done) {
        cdB_zpracuj_1(cdB_retArr.body);

        let dalsi = cdB_getPgButton('' + cdB_retArr.pgNo);
        if (dalsi) {
            dalsi.click();
            cdB_retArr.pgNo += 1;
        } else {
            cdB_retArr.done = true;
        }
    }

    cdB_retArr;  // poslední vyčíslenou hodnotu injektovaný skript vrací
`;

let cdB_platnostLet = 2;
let pleaseWait = "Zjišťují se body ...";
let resultsEl = document.getElementById('results');
resultsEl.innerHTML = '';

function body2res(r) {
    let cbd = 0;
    let res = [];
    for (let i = r.body.length - 1; i >= 0; i--) {
        let radek = r.body[i];
        let bd = radek[1];
        cbd += bd;
        if (cbd <= 0) {
            cbd = 0;
            res = [];
        } else if (bd > 0) {
            let datum = radek[0].split('.');

            let rok = parseInt(datum[2], 10)
            if (rok > new Date().getFullYear()) {  // honzabalak reportuje, že se vypíše datum +6 let ?? (proto i přejmenována: platnostLet)
                r.res = "Nalezena problematická položka:" + '<br>' + datum[0] + '.' + datum[1] + '.' + rok + ': ' + bd
                return;
            }

            let propadne = datum[0] + '.' + datum[1] + '.' + (rok + cdB_platnostLet);
            res.push([propadne, bd]);
        } else {
            bd = -bd;
            while (res.length > 0 && bd > 0) {
                let nejstarsi = res[0];
                if (nejstarsi[1] > bd) {
                    nejstarsi[1] -= bd;
                    bd = 0;
                } else {
                    bd -= nejstarsi[1];
                    res.shift();
                }
            }
        }
    }
    let sRes = '';
    for (let i = 0; i < Math.min(10, res.length); i++) {
        sRes += res[i][0] + ' - ' + res[i][1] + '<br>';
    }
    if (sRes) {
        r.res = '<b>' + "Expirace bodů (bez záruky)" + '</b><br><br>' + sRes;
    } else {
        r.res = "Nemáte body (zjištěno součtem výpisu: pokud to není v souladu se skutečností, kontaktujte autora)";
    }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let timeout = 100;  // první stránku rychle, potom zvětšíme
    let razeniUrl = "https://www.zelpage.cz/razeni/" + new Date().getFullYear().toString().substr(2) + "/vlaky/cd-";

    let cdCz = tabs[0].url.indexOf('//www.cd.cz') > 0;

    function cisloVlaku(oznaceni) {
        if (!oznaceni) {
            return '';
        }
        let max4 = false;
        if ('0123456789'.indexOf(oznaceni[0]) >= 0) {
            max4 = true;   // kvůli IC, EC,.., které značí netextově: ikonou
        }
        let cislo = '';
        for (let i = 0; i < oznaceni.length; i++) {
            if ('0123456789'.indexOf(oznaceni[i]) >= 0) {
                cislo += oznaceni[i]
            } else if (cislo) {
                break;
            }
        }
        if (cislo.length >= 2 && (!max4 || cislo.length <= 4)) {
            return cislo;
        } else {
            return '';
        }
    }

    function nejakyVlak(razeni) {
        return razeni.indexOf('</a>') > 0;
    }

    function step() {
        if (resultsEl.innerHTML && resultsEl.innerHTML !== pleaseWait) {
            return;   // vždy je naplánován další krok; poslední (už po předání výsledku) proto nebude dělat nic
        }

        setTimeout(function() {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: initCode + code},
                function(retArr) {
                    if (retArr[0]) {  // z nerozpoznaného důvodu toto někdy běží i když retArr[0] není definováno
                        if (cdCz) {
                            if (retArr[0].done) {
                                if (!retArr[0].res) {
                                    body2res(retArr[0]);
                                }
                                resultsEl.innerHTML = retArr[0].res;
                            } else {
                                resultsEl.innerHTML = pleaseWait;
                            }
                        }

                        // *******************************************************
                        if (retArr[0].q) {
                            fixHref(retArr[0].q);
                        }
                        // *******************************************************
                        if (retArr[0].razeni && retArr[0].razeni.length > 0) {
                            let htmlRazeni = '';
                            let razeni1 = '';
                            for (let i = 0; i < retArr[0].razeni.length; i++) {
                                let vlak = cisloVlaku(retArr[0].razeni[i][2]);
                                if (vlak) {
                                    htmlRazeni += (retArr[0].razeni[i][0] ? '<b>' : '')
                                            + '<a target="_blank" href="' + razeniUrl + vlak + '" title="' +retArr[0].razeni[i][2] + '">'
                                            + retArr[0].razeni[i][1] + '</a>'
                                            + (retArr[0].razeni[i][0] ? '</b>' : '') + ' ';
                                } else if (retArr[0].razeni[i][0]) {   // první čas i tehdy, když to není vlak
                                    if (nejakyVlak(razeni1)) {
                                        htmlRazeni += '<div>' + razeni1 + '</div>';  // <div>,<br>,<p> - vše ignorováno ??
                                    }
                                    razeni1 = '<b>' + retArr[0].razeni[i][1] + '</b>';
                                }
                            }
                            if (nejakyVlak(razeni1)) {
                                htmlRazeni += '<div>' + razeni1 + '</div>';
                            }
                            razeniEl.innerHTML = htmlRazeni;
                        } else {
                            razeniEl.innerHTML = '';
                        }
                    }
                }
            );
            initCode = '';   // nesmí být vně, jinak se initCode neprovede !
            if (cdCz) {
                step();
            }
        }, timeout);
    }
    step();

    timeout = 2000;
});
