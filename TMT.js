const puppy = require('puppeteer');
const fs = require('fs');
const username ; //enter your twitter username
const password ; //enter your twitter password
const id ;//enter your email id 

//this is for generating JSON File
let PeopleContacted = [];
//this is for generating chehcker File.
let messageSent = [];
let str = '(';
//add your hashtags here for better results . you can leave it empty too;
let hashtags = ['#teachmetodance'];
//this is for avoiding messaging same people more than once.
let olderData = '';
//change this message as you desire
let message = "hey there!! i saw from your tweet that you might be interested in dance lessons and i actually provide online lessons so if you are interested ,let me know . Thanks"
async function relatedWords() {
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    })
    let tabs = await browser.pages();
    let tab = tabs[0];
    //website for getting keywords simislar to the business field;
    await tab.goto('https://relatedwords.org');
    await tab.waitForSelector('input');
    //enter your business field here.enter only the main Keyword(only one word);
    await tab.type('input', 'dance');
    await tab.waitForSelector('#search-button');
    await tab.click('#search-button');
    await tab.waitForSelector('.item', { visible: true });
    let words = await tab.$$('.item');
    //you can change the number of keywords you want here but twitter gives an error if they are too many. it works perfectly for 20;
    for (let i = 0; i < 20; i++) {
        let keyword = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, words[i]);
        let finalKeywords = keyword.split(' ');
        //becoz of this we get just the keywords that are single worded because space between words also gives an error
        if (finalKeywords.length == 1) {
            if (i == 19) {
                str += finalKeywords[0] + ')';
            }
            else str += finalKeywords[0] + ' OR ';
        }
    }
    if (hashtags.length > 0) {
        str += '(';
        for (let j = 0; j < hashtags.length; j++) {
            if (j == hashtags.length - 1) {
                str += hashtags[j] + ")";
            }
            else str += hashtags[j] + ' OR ';
        }
    }
    //this timeout is so that the website is visible to the user as well
    await tab.waitForTimeout(1000);
    // console.log(str);
    //keywords are converted into a String format understood by the twitter search mechanism; 
    olderData = fs.readFileSync('ContactedPeople.json', 'utf-8');
    let OlderPeople = fs.readFileSync('checker.txt', 'utf-8');
    if (OlderPeople != '') messageSent = OlderPeople.split('\n');
    login(str, tab)
}

async function login(str, tab) {
    await tab.goto('https://twitter.com/login?lang=en-gb');
    await tab.waitForSelector('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu');
    let details = await tab.$$(".r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu");
    await details[0].type(username);
    await details[1].type(password);
    await tab.click('.css-18t94o4.css-1dbjc4n.r-urgr8i.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-1w2pmg.r-1fz3rvf.r-usiww2.r-1pl7oy7.r-snto4y.r-1ny4l3l.r-1dye5f7.r-o7ynqc.r-6416eg.r-lrvibr');
    await tab.waitForSelector('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-xyw6el.r-ny71av.r-1dz5y72.r-fdjqy7.r-13qz1uu');
    await tab.type('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-xyw6el.r-ny71av.r-1dz5y72.r-fdjqy7.r-13qz1uu', str);
    await tab.keyboard.press('Enter');
    await tab.waitForSelector('.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1awozwy.r-oucylx.r-rull8r.r-wgabs5.r-1loqt21.r-6koalj.r-eqz5dr.r-16y2uox.r-1h3ijdo.r-1777fci.r-1ny4l3l.r-xyw6el.r-o7ynqc.r-6416eg');
    let fields = await tab.$$('.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1awozwy.r-oucylx.r-rull8r.r-wgabs5.r-1loqt21.r-6koalj.r-eqz5dr.r-16y2uox.r-1h3ijdo.r-1777fci.r-1ny4l3l.r-xyw6el.r-o7ynqc.r-6416eg');
    await fields[0].click();
    await tab.waitForTimeout(5000);
    await tab.waitForSelector('.css-901oao.r-1awozwy.r-m0bqgq.r-6koalj.r-1qd0xha.r-a023e6.r-16dba41.r-1h0z5md.r-rjixqe.r-bcqeeo.r-o7ynqc.r-clp7b1.r-3s2u2q.r-qvutc0');
    let people = await tab.$$('.css-901oao.r-1awozwy.r-m0bqgq.r-6koalj.r-1qd0xha.r-a023e6.r-16dba41.r-1h0z5md.r-rjixqe.r-bcqeeo.r-o7ynqc.r-clp7b1.r-3s2u2q.r-qvutc0');
    //multiply the number of people you want to message by 5 and enter that  number in this loop's condition;
    for (let i = 1; i < 30; i += 5) {
        await people[i].click();
        await tab.waitForSelector('.css-1dbjc4n.r-14lw9ot.r-1pp923h.r-1moyyf3.r-oyd9sg');
        await tab.waitForSelector('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', { visible: true });
        let details = await tab.$$('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
        let name = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, details[4]);
        let ProfileTag = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, details[5]);
        if (messageSent.includes(ProfileTag)) {
            //if a person is messaged before you get this output;
            console.log(ProfileTag + ' ALREADY MESSAGED BEFORE');
            await tab.waitForSelector('.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-1w2pmg.r-ero68b.r-vkv6oe.r-1ny4l3l.r-mk0yit.r-o7ynqc.r-6416eg.r-lrvibr', { visible: true });
            let backButton = await tab.$$('.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-1w2pmg.r-ero68b.r-vkv6oe.r-1ny4l3l.r-mk0yit.r-o7ynqc.r-6416eg.r-lrvibr');
            await backButton[0].click();
        }
        else {
            await tab.waitForSelector('.DraftEditor-editorContainer');
            await tab.click('.DraftEditor-editorContainer');
            await tab.type('.DraftEditor-editorContainer', message);
            messageSent.push(ProfileTag);
            PeopleContacted.push({
                "name": name,
                'ProfileTag': ProfileTag
            });
            await tab.waitForSelector('.css-901oao.r-1awozwy.r-jwli3a.r-6koalj.r-18u37iz.r-16y2uox.r-1qd0xha.r-a023e6.r-b88u0q.r-1777fci.r-rjixqe.r-dnmrzs.r-bcqeeo.r-q4m81j.r-qvutc0')
            let reply = await tab.$$('.css-901oao.r-1awozwy.r-jwli3a.r-6koalj.r-18u37iz.r-16y2uox.r-1qd0xha.r-a023e6.r-b88u0q.r-1777fci.r-rjixqe.r-dnmrzs.r-bcqeeo.r-q4m81j.r-qvutc0');
            await reply[0].click();
        }
        await tab.waitForTimeout(2000);
    }
    fs.writeFileSync('ContactedPeople.json', olderData + "\n" + JSON.stringify(PeopleContacted));
    let pct = messageSent.join('\n');
    fs.writeFileSync('checker.txt', pct);
    
//JSON file stores the information of people you have contacted so that you are able to contact them again if you wish to;
//checker file stores the tags of people contacted so that they are not messaged again.

}
relatedWords();