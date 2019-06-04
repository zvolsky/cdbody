'use strict';

let initCode = `
    let cdB_initMe = true;
    let cdB_retArr = {res: 'Je potřeba být přihlášen a přejít na první stránku seznamu bodů.', done: true};
    const cdB_url = 'cd.cz/profil-uzivatele/cdbody/detail';
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
            for (let i = 1; i < rows.length; i++) {    // i=1 .. jako první <tr> mají totiž hlavičku
                let cells = rows[i].getElementsByTagName('td');
                body.push([cells[0].innerHTML, cells[3].innerHTML])
            }
        }

        if (window.location.href.indexOf(cdB_url) > 0) {
            if (cdB_getPgButton('1')) {
                cdB_retArr = {res: '', pgNo: 2, body: [], done: false};
            } else {
                cdB_retArr = {res: 'Prosím, restartuj stránku (klikni do ní, pak F5), a opakuj.', done: true};
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

let platnostLet = 2;
let pleaseWait1 = "Inicializace ...";
let pleaseWait2 = "Zjišťují se body ...";
let resultsEl = document.getElementById('results');
resultsEl.innerHTML = pleaseWait1;

function body2res(r) {
    let cbd = 0;
    let res = [];
    for (let i = r.body.length - 1; i >= 0; i--) {
        let radek = r.body[i];
        let bd = parseInt(radek[1], 10);
        cbd += bd;
        if (cbd <= 0) {
            cbd = 0;
            res = [];
        } else if (bd > 0) {
            let datum = radek[0].split('.');
            let propadne = datum[0] + '.' + datum[1] + '.' + (parseInt(datum[2], 10) + platnostLet);
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
        r.res = sRes;
    } else {
        r.res = "Nemáte body (zjištěno součtem výpisu: pokud to není v souladu se skutečností, kontaktujte autora)";
    }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    function step() {
        if (resultsEl.innerHTML !== pleaseWait1 && resultsEl.innerHTML !== pleaseWait2) {
            return;   // vždy je naplánován další krok; poslední (už po předání výsledku) proto nebude dělat nic
        }
        setTimeout(function() {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: initCode + code},
                function(retArr) {
                    if (retArr[0] && retArr[0].done) {
                        if (!retArr[0].res) {
                            body2res(retArr[0]);
                        }
                        resultsEl.innerHTML = retArr[0].res;
                    } else {
                        resultsEl.innerHTML = pleaseWait2;
                    }
                }
            );
            step();
            initCode = '';
        }, 2000);
    }
    step();
});
