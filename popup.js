'use strict';

let mapaUrlBase = 'https://mapy.cz/turisticka';   // https://mapy.cz/turisticka?q=Lhota
let pocasiUrlBase = 'https://www.yr.no';          // https://www.yr.no/soek/soek.aspx?sted=Lhota
let mapaQ = '';
let pocasiQ = '';

function stripSuffix(query, suffix) {
    if (query.indexOf(suffix) + suffix.length === query.length) {
        return query.substr(0, query.length - suffix.length);
    }
    return query;
}

function fixHref(query) {
    query = query.replace(' - AN', ', autobusové nádraží');  // AN: regiojet
    document.getElementById('mapaBtn').setAttribute('href', mapaUrlBase + (query ? ('?q=' + query) : ''));
    if (query) {
        query = stripSuffix(query, ' hl.n.');
        query = stripSuffix(query, ' zast.');
        query = stripSuffix(query, ' z.');
        query = stripSuffix(query, ' město');
        query = stripSuffix(query, ' předm.');
        query = stripSuffix(query, ', žel. st.');    // regiojet
        query = stripSuffix(query, ', autobusové nádraží');
    }
    document.getElementById('pocasiBtn').setAttribute('href', pocasiUrlBase + (query ? ('/soek/soek.aspx?sted=' + query) : ''));
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
    function cdB_getQ() {
        if (cdB_retArr.url.hostname === "www.cd.cz") {
            if (cdB_retArr.url.pathname === '/default.htm') {
                cdB_retArr.q = document.getElementById('connectionsearchbox-hp-o').getElementsByTagName('input')[3].value;
            } else if (cdB_retArr.url.pathname.indexOf('/spojeni') >= 0) {  // /eshop/spojeni- i /spojeni-a-jizdenka
                cdB_retArr.q = document.getElementById('connectionlistanchor').getElementsByClassName('res-cityname')[3].getElementsByTagName('a')[0].text
            } else if (cdB_retArr.url.pathname.indexOf('/eshop') === 0) {
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

    function step() {
        if (resultsEl.innerHTML && resultsEl.innerHTML !== pleaseWait) {
            return;   // vždy je naplánován další krok; poslední (už po předání výsledku) proto nebude dělat nic
        }
        let hledejBody = true;
        setTimeout(function() {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: initCode + code},
                function(retArr) {
                    if (retArr[0]) {  // z nerozpoznaného důvodu toto někdy běží i když retArr[0] není definováno
                        if (retArr[0].host === 'www.cd.cz') {
                            if (retArr[0].done) {
                                if (!retArr[0].res) {
                                    body2res(retArr[0]);
                                }
                                resultsEl.innerHTML = retArr[0].res;
                            } else {
                                resultsEl.innerHTML = pleaseWait;
                            }
                        } else {
                            hledejBody = false;
                        }

                        // *******************************************************
                        if (retArr[0].q) {
                            fixHref(retArr[0].q);
                        }
                        // *******************************************************
                    }
                }
            );
            initCode = '';   // nesmí být vně, jinak se initCode neprovede !
            if (hledejBody) {
                step();
            }
        }, timeout);
    }
    step();

    timeout = 2000;
});
