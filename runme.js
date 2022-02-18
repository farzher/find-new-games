const puppet = require('puppeteer')
const chart2score = require('./chart2score.js').default

let browser // global headless browser instance

// main
;(async () => {
  browser = await puppet.launch({headless: true})

  await Promise.all([steam(), twitch('watched'), twitch('streamed')])

  browser.close()
})()





// scrapes sullygnome.com, returns nothing, logs results
async function twitch(watched_or_streamed) {
  const page = await browser.newPage()

  // headless mode doesn't load all the content without this
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

  await page.goto(`https://sullygnome.com/games/3/${watched_or_streamed}`)
  await page.waitForSelector('#tblControl > tbody > tr')

  const infos = await page.$$eval('#tblControl tbody tr', $trs => {
    const infos = []
    for(const $tr of $trs) {
      const rank = +($tr.querySelector('td:nth-child(1)').textContent)
      const name = $tr.querySelector('td:nth-child(3)').textContent.trim()
      const hours_watched_text = $tr.querySelector('td:nth-child(4)').textContent.trim()
      const hours_streamed_text = $tr.querySelector('td:nth-child(5)').textContent.trim()
      infos.push({rank, name, hours_watched_text, hours_streamed_text})
    }
    return infos
  })


  let longest_name_len = Math.max(...infos.map(info => info.name.length))

  console.log(cmdred(`Twitch Most ${watched_or_streamed} Past 3 Days:`))
  for(const info of infos) {

    info.watched = hours_text_to_number(info.hours_watched_text)
    info.streamed = hours_text_to_number(info.hours_streamed_text)

    if(info.rank > 10) continue
    // if(watched_or_streamed == 'watched') {
    //   if(info.watched < 1000000) continue
    // } else {
    //   if(info.streamed < 100000) continue
    // }

    const display_name = info.name.padEnd(longest_name_len, ' ')
    console.log(info.rank.toString().padEnd(3, ' '), display_name, `https://www.twitch.tv/directory/game/${encodeURIComponent(info.name)}`)
    // console.log(info.rank, info.name, `${info.watched} hours watched`, `${info.streamed} hours streamed`)
  }

  await page.close()

  function hours_text_to_number(hours_text) {
    return +hours_text.split(' ')[0].replace(/,/g, '')
  }
}



// scrapes steamcharts.com, returns nothing, logs results
async function steam() {
  let pagesarr = []
  for(let i=0;i<25;i++) pagesarr.push(i+1)

  let results = []

  for(const pagenumber of pagesarr) {
  // await Promise.all(pagesarr.map(async pagenumber => {
    const page = await browser.newPage()

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

    for(const info of infos) {
      info.historyscore = chart2score(info.historyarr)

      if(info.historyscore > .1) {
        // console.log(info.rank, info.name, info.historyscore)
        results.push(info)
      }
    }

    await page.close()
  }

  console.log(cmdred('Trending & Popular Steam Games:'))
  for(const result of results) {
    console.log(`${result.rank}\thttps://store.steampowered.com/app/${result.appid}\t${result.name}`)
  }
}


function cmdred(x) { return `${'\u001b[91m'}${x}${'\u001b[0m'}` }
