const express = require('express')
const puppeteer=require("puppeteer")
const app = express()

const port = process.env.PORT || 6699
const BASE_URL=`https://leetcode.com/`

app.get('/', async(req, res) => {
  res.send('i am leetcodeing')
})

app.get('/leetcode/:username',async(req,res)=>{
  const browser = await puppeteer.launch({args: ["--no-sandbox"]});
  const page = await browser.newPage();

  await page.goto(`${BASE_URL}${req.params.username}`,{
    waitUntil: 'networkidle0',
  })
  let leetcode=await page.evaluate(()=>{
      const problemSolved=document.getElementsByClassName('difficulty-ac-count__jhZm')
      const totalProblems=document.getElementsByClassName('difficulty-total-count__y_em')
      const acceptance_rate=document.getElementsByClassName('css-139q828-PercentContent e5i1odf6')[0].innerText.split('\n')[0]
      const contest_rating=document.getElementsByClassName('css-57pydk')[0].innerText
      return {
        acceptance_rate,
        total_easy:totalProblems[0].innerText,
        solved_easy:problemSolved[0].innerText,
        total_medium:totalProblems[1].innerText,
        solved_medium:problemSolved[1].innerText,
        total_hard:totalProblems[2].innerText,
        solved_hard:problemSolved[2].innerText,
        contest_rating
      }
  })
  await browser.close();
  res.json(leetcode)
})

app.listen(port, () => {
  console.log(`Leetcode scraper listening at http://localhost:${port}`)
})