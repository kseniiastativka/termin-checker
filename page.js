const puppeteer = require('puppeteer');
const axios = require('axios');

const url = 'https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&anliegen[]=327537&dienstleisterlist=122210,122217,122219,122227,122231,122238,122243,122252,122260,122262,122254,122271,122273,122277,122284,122291,122285,122286,122296,327262,325657,150230,122301,122297,122294,122312,122314,122304,122311,122309,317869,324434,122281,324414,122283,122279,122276,122274,122267,122246,122251,122257,122208,122226&herkunft=http%3A%2F%2Fservice.berlin.de%2Fdienstleistung%2F327537%2F';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    async function checkIfTerminAvailable() {
        const availableTermin = await page.$(".calendar-month-table .buchbar");

        if (availableTermin !== null) {
            await sendNotification(`You can book a termin 😈 ${url}`, true);
            return;
        }

        const nextMonthBtn = await page.$(".calendar-month-table .next a");

        if (nextMonthBtn !== null) {
            await page.click(".next");
            await checkIfTerminAvailable();
            return;
        }

        await sendNotification("You CAN'T book a termin 😭", false)
    }

    await checkIfTerminAvailable();
    await browser.close();
})();


 function sendNotification(message, isNotificationEnabled) {
    return axios.get(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage?chat_id=${process.env.CHATID}&text=${encodeURIComponent(message)}&disable_notification=${!isNotificationEnabled}`);
}
