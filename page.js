const puppeteer = require('puppeteer');
const axios = require('axios');

// apostille termin
const url = 'https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&dienstleister=324291&anliegen[]=320315&herkunft=1';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    async function checkIfTerminAvailable() {
        const availableTermin = await page.$(".calendar-month-table:first-child .buchbar");

        if (availableTermin !== null) {
            await sendNotification(`You can book a termin 😈 ${url}`, true);
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
