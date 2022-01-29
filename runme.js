const puppet = require('puppeteer')
const chart2score = require('./chart2score.js').default


;(async () => { // main
    doit()
    // setInterval(doit, 10000)
})()




async function doit() {
    const browser = await puppet.launch({headless: true})
    
    let pagesarr = []
    for(let i=0;i<25;i++) {
        pagesarr.push(i+1)
    }

    let results = []

    for(const pagenumber of pagesarr) {
    // await Promise.all(pagesarr.map(async pagenumber => {
        const page = await browser.newPage()
        // page.on('console', (msg) => console.log('PAGE LOG:', msg.text())); // debugging

        await page.goto(`https://steamcharts.com/top/p.${pagenumber}`)

        await page.waitForSelector('#top-games')

        const infos = await page.$$eval('#top-games tbody tr', $trs => {
            const infos = []
            for(const $tr of $trs) {
                const rank = +($tr.querySelector('td:nth-child(1)').textContent)
                const name = $tr.querySelector('td:nth-child(2)').textContent.trim()
                const href = $tr.querySelector('td:nth-child(2) a').getAttribute('href')
                const appid = href.substr(href.lastIndexOf('/') + 1)
                const current = +($tr.querySelector('td:nth-child(3)').textContent.replaceAll(',', ''))
                
                const $rects = $tr.querySelector('td:nth-child(4)').querySelectorAll('rect')
                const historyarr = []
                $rects.forEach($rect => {
                    historyarr.push(+$rect.getAttribute('height'))
                })

                while(historyarr.length < 31) historyarr.unshift(0)

                const info = {rank, name, current, historyarr, appid}
                infos.push(info)
            }
            return infos
        })


        // console.log(infos)
        // console.log('winners:')
        for(const info of infos) {
            info.historyscore = chart2score(info.historyarr)

            if(info.historyscore > .1) {
                console.log(info.rank, info.name, info.historyscore)
                results.push(info)
            }
        }


        await page.close()
    // }))
    }

    browser.close()

    console.log('done')
    console.log('new popular steam games:')
    for(const result of results) {
        console.log(`${result.rank}\thttps://store.steampowered.com/app/${result.appid}\t${result.name}`)
    }
}
